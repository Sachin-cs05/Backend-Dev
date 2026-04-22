const express = require("express");
const { validateRequest } = require("../middleware/validateRequest");
const {
  loginSchema,
  passwordResetConfirmSchema,
  passwordResetRequestSchema
} = require("../validators/auth.validators");
const { createAuditLogger } = require("../services/audit.service");
const { buildAuthService } = require("../services/auth.service");

const router = express.Router();
const auditLogger = createAuditLogger();
const authService = buildAuthService({ auditLogger });

const users = [
  {
    id: "user_1",
    email: "customer@example.com",
    password: "SecurePassword123!",
    accountId: "acct_1001"
  }
];

router.post("/login", validateRequest(loginSchema), (req, res) => {
  const user = users.find((item) => item.email === req.body.email);
  const result = authService.login({
    user,
    password: req.body.password,
    deviceFingerprint: req.security.deviceFingerprint,
    ipAddress: req.ip
  });

  if (!result.ok) {
    return res.status(401).json({
      message: "Invalid credentials.",
      remainingRisk: result.attempts >= 3 ? "Account monitoring elevated." : "normal"
    });
  }

  req.session.user = {
    id: user.id,
    email: user.email,
    accountId: user.accountId
  };

  return res.status(200).json({
    message: "Login successful.",
    session: {
      idleTimeoutMinutes: 15,
      secureCookie: true
    }
  });
});

router.post("/password-reset/request", validateRequest(passwordResetRequestSchema), (req, res) => {
  const user = users.find((item) => item.email === req.body.email);

  if (user) {
    const resetRecord = authService.issuePasswordReset(user.id);
    return res.status(202).json({
      message: "If the account exists, reset instructions have been issued.",
      tokenPreview: `${resetRecord.token.slice(0, 8)}...`,
      expiresAt: resetRecord.expiresAt.toISOString()
    });
  }

  return res.status(202).json({
    message: "If the account exists, reset instructions have been issued."
  });
});

router.post("/password-reset/confirm", validateRequest(passwordResetConfirmSchema), (req, res) => {
  const record = authService.consumePasswordReset(req.body.token);
  if (!record) {
    return res.status(400).json({ message: "Invalid or expired reset token." });
  }

  return res.status(200).json({
    message: "Password reset completed.",
    userId: record.userId
  });
});

router.get("/audit-events", (req, res) => {
  res.status(200).json({ events: auditLogger.events });
});

module.exports = router;
