const { TWO_FACTOR_THRESHOLD } = require("../config/constants");

function analyzeSuspiciousActivity({ amount, deviceTrusted, ipChanged, failedLogins }) {
  const indicators = [];

  if (amount > TWO_FACTOR_THRESHOLD) {
    indicators.push("high_value_transaction");
  }
  if (!deviceTrusted) {
    indicators.push("untrusted_device");
  }
  if (ipChanged) {
    indicators.push("network_change");
  }
  if (failedLogins >= 3) {
    indicators.push("multiple_failed_logins");
  }

  return {
    indicators,
    isSuspicious: indicators.length > 0
  };
}

module.exports = { analyzeSuspiciousActivity };
