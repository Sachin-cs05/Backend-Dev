const {
  MAX_TRANSACTION_AMOUNT,
  TRANSFER_LIMIT_PER_WINDOW,
  TRANSFER_WINDOW_MS
} = require("../config/constants");
const { sanitizePlainText, maskAccountNumber } = require("../utils/sanitize");

function buildTransactionService({ auditLogger, authService }) {
  const transferHistory = new Map();

  return {
    validateServerSideTransaction({ amount, accountBalance, dailyTransferred = 0 }) {
      if (typeof amount !== "number" || Number.isNaN(amount) || amount <= 0) {
        return { ok: false, message: "Invalid transfer amount." };
      }
      if (amount > MAX_TRANSACTION_AMOUNT) {
        return { ok: false, message: "Transfer amount exceeds maximum limit." };
      }
      if (amount > accountBalance) {
        return { ok: false, message: "Insufficient funds." };
      }
      if (dailyTransferred + amount > MAX_TRANSACTION_AMOUNT) {
        return { ok: false, message: "Daily transfer limit exceeded." };
      }

      return { ok: true };
    },

    enforceTransferVelocity(userId) {
      const now = Date.now();
      const existing = transferHistory.get(userId) || [];
      const active = existing.filter((timestamp) => now - timestamp < TRANSFER_WINDOW_MS);

      if (active.length >= TRANSFER_LIMIT_PER_WINDOW) {
        return { ok: false, message: "Transfer velocity exceeded." };
      }

      active.push(now);
      transferHistory.set(userId, active);
      return { ok: true };
    },

    protectQuery(rawQuery) {
      const serialized = JSON.stringify(rawQuery);
      if (serialized.includes("$") || serialized.includes(".")) {
        return { ok: false, message: "Unsafe query input detected." };
      }

      return { ok: true, query: rawQuery };
    },

    sanitizeTransferInput(payload) {
      return {
        ...payload,
        description: sanitizePlainText(payload.description),
        beneficiaryName: sanitizePlainText(payload.beneficiaryName),
        beneficiaryAccount: maskAccountNumber(payload.beneficiaryAccount)
      };
    },

    confirmAndAuthorizeTransfer({ user, transferRequest }) {
      const challenge = authService.verifyTransactionStepUp({
        amount: transferRequest.amount,
        twoFactorCode: transferRequest.twoFactorCode,
        biometricAssertion: transferRequest.biometricAssertion
      });

      if (!challenge.ok) {
        return challenge;
      }

      auditLogger.log({
        type: "transaction.confirmed",
        userId: user.id,
        accountId: user.accountId,
        amount: transferRequest.amount,
        authorizationMethod: challenge.method
      });

      return { ok: true, method: challenge.method };
    }
  };
}

module.exports = { buildTransactionService };
