const crypto = require("crypto");

function buildFingerprint(req) {
  const raw = [
    req.get("user-agent") || "unknown-agent",
    req.ip || "unknown-ip",
    req.get("accept-language") || "unknown-language",
    req.get("sec-ch-ua-platform") || "unknown-platform"
  ].join("|");

  return crypto.createHash("sha256").update(raw).digest("hex");
}

function attachDeviceFingerprint() {
  return (req, res, next) => {
    req.security.deviceFingerprint = buildFingerprint(req);
    next();
  };
}

module.exports = { attachDeviceFingerprint, buildFingerprint };
