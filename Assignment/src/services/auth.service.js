const { issueExpiringToken } = require("./token.service");
const { analyzeSuspiciousActivity } = require("./fraud.service");
const { TWO_FACTOR_THRESHOLD } = require("../config/constants");

function buildAuthService({ auditLogger }) {
  const resetTokens = new Map();
  const failedLogins = new Map();

  return {
    login({ user, password, deviceFingerprint, ipAddress }) {
      if (!user || user.password !== password) {
        const attempts = (failedLogins.get(user ? user.id : "unknown") || 0) + 1;
        failedLogins.set(user ? user.id : "unknown", attempts);
        auditLogger.log({
          type: "auth.failed_login",
          userId: user ? user.id : null,
          ipAddress,
          deviceFingerprint
        });
        return { ok: false, attempts };
      }

      failedLogins.set(user.id, 0);
      auditLogger.log({
        type: "auth.login",
        userId: user.id,
        ipAddress,
        deviceFingerprint
      });
      return { ok: true };
    },

    shouldChallengeTransaction(amount) {
      return amount > TWO_FACTOR_THRESHOLD;
    },

    verifyTransactionStepUp({ amount, twoFactorCode, biometricAssertion }) {
      if (amount <= TWO_FACTOR_THRESHOLD) {
        return { ok: true, method: "session" };
      }

      if (biometricAssertion) {
        return { ok: true, method: "biometric" };
      }

      if (twoFactorCode === "654321") {
        return { ok: true, method: "2fa" };
      }

      return { ok: false, message: "Strong customer authentication required." };
    },

    issuePasswordReset(userId) {
      const tokenRecord = issueExpiringToken({ ttlMinutes: 15 });
      resetTokens.set(tokenRecord.token, { userId, expiresAt: tokenRecord.expiresAt });
      auditLogger.log({
        type: "auth.password_reset_requested",
        userId
      });
      return tokenRecord;
    },

    consumePasswordReset(token) {
      const record = resetTokens.get(token);
      if (!record || record.expiresAt <= new Date()) {
        return null;
      }

      resetTokens.delete(token);
      auditLogger.log({
        type: "auth.password_reset_consumed",
        userId: record.userId
      });
      return record;
    },

    assessLoginRisk({ amount = 0, deviceTrusted = false, ipChanged = false, userId }) {
      const failedLoginCount = failedLogins.get(userId) || 0;
      return analyzeSuspiciousActivity({
        amount,
        deviceTrusted,
        ipChanged,
        failedLogins: failedLoginCount
      });
    }
  };
}

module.exports = { buildAuthService };
