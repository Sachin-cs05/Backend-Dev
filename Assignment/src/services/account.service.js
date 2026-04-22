const { sanitizePlainText, maskAccountNumber } = require("../utils/sanitize");

function buildAccountService() {
  return {
    sanitizeProfileUpdate(payload) {
      return {
        fullName: sanitizePlainText(payload.fullName),
        address: sanitizePlainText(payload.address),
        phone: sanitizePlainText(payload.phone),
        marketingConsent: Boolean(payload.marketingConsent)
      };
    },

    protectSensitiveAccount(account) {
      return {
        ...account,
        accountNumber: maskAccountNumber(account.accountNumber),
        routingNumber: maskAccountNumber(account.routingNumber)
      };
    }
  };
}

module.exports = { buildAccountService };
