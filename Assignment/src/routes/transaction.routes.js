const express = require("express");
const { requireAuthenticatedUser, requireOwnership } = require("../middleware/auth");
const { validateRequest } = require("../middleware/validateRequest");
const { transferSchema } = require("../validators/transaction.validators");
const { createAuditLogger } = require("../services/audit.service");
const { buildAuthService } = require("../services/auth.service");
const { buildTransactionService } = require("../services/transaction.service");

const router = express.Router();
const auditLogger = createAuditLogger();
const authService = buildAuthService({ auditLogger });
const transactionService = buildTransactionService({ auditLogger, authService });

router.post(
  "/transfer",
  requireAuthenticatedUser,
  requireOwnership("accountId"),
  validateRequest(transferSchema),
  (req, res) => {
    const velocity = transactionService.enforceTransferVelocity(req.user.id);
    if (!velocity.ok) {
      return res.status(429).json({ message: velocity.message });
    }

    const queryCheck = transactionService.protectQuery({
      accountId: req.body.accountId,
      beneficiaryAccount: req.body.beneficiaryAccount
    });
    if (!queryCheck.ok) {
      return res.status(400).json({ message: queryCheck.message });
    }

    const validation = transactionService.validateServerSideTransaction({
      amount: req.body.amount,
      accountBalance: 5000,
      dailyTransferred: 300
    });
    if (!validation.ok) {
      return res.status(400).json({ message: validation.message });
    }

    const sanitizedTransfer = transactionService.sanitizeTransferInput(req.body);
    const riskAssessment = authService.assessLoginRisk({
      amount: req.body.amount,
      deviceTrusted: false,
      ipChanged: true,
      userId: req.user.id
    });
    const confirmation = transactionService.confirmAndAuthorizeTransfer({
      user: req.user,
      transferRequest: req.body
    });

    if (!confirmation.ok) {
      return res.status(403).json({ message: confirmation.message });
    }

    if (riskAssessment.isSuspicious) {
      auditLogger.log({
        type: "transaction.suspicious_activity",
        userId: req.user.id,
        indicators: riskAssessment.indicators,
        amount: req.body.amount
      });
    }

    return res.status(201).json({
      message: "Transfer queued for settlement.",
      authorizationMethod: confirmation.method,
      fraudIndicators: riskAssessment.indicators,
      transfer: sanitizedTransfer
    });
  }
);

router.get("/audit-events", (req, res) => {
  res.status(200).json({ events: auditLogger.events });
});

module.exports = router;
