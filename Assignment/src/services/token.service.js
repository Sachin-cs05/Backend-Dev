const crypto = require("crypto");

function issueExpiringToken({ ttlMinutes = 15 } = {}) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);

  return { token, expiresAt };
}

module.exports = { issueExpiringToken };
