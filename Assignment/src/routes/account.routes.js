const express = require("express");
const { requireAuthenticatedUser, requireOwnership } = require("../middleware/auth");
const { validateRequest } = require("../middleware/validateRequest");
const { profileUpdateSchema } = require("../validators/account.validators");
const { buildAccountService } = require("../services/account.service");

const router = express.Router();
const accountService = buildAccountService();

const accounts = [
  {
    accountId: "acct_1001",
    fullName: "Sachin Customer",
    address: "123 Main Street",
    phone: "9999999999",
    accountNumber: "123456789012",
    routingNumber: "987654321"
  }
];

router.get("/:accountId", requireAuthenticatedUser, requireOwnership("accountId"), (req, res) => {
  const account = accounts.find((item) => item.accountId === req.params.accountId);
  if (!account) {
    return res.status(404).json({ message: "Account not found." });
  }

  return res.status(200).json({
    account: accountService.protectSensitiveAccount(account)
  });
});

router.put(
  "/:accountId/profile",
  requireAuthenticatedUser,
  requireOwnership("accountId"),
  validateRequest(profileUpdateSchema),
  (req, res) => {
    const account = accounts.find((item) => item.accountId === req.params.accountId);
    if (!account) {
      return res.status(404).json({ message: "Account not found." });
    }

    const sanitized = accountService.sanitizeProfileUpdate(req.body);
    Object.assign(account, sanitized);

    return res.status(200).json({
      message: "Profile updated securely.",
      profile: sanitized
    });
  }
);

module.exports = router;
