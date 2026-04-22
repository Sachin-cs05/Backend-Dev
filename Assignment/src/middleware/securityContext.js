function attachSecurityContext({ logger } = {}) {
  return (req, res, next) => {
    req.security = {
      logger,
      requestId: req.get("x-request-id") || `req_${Date.now()}`,
      suspiciousSignals: []
    };
    next();
  };
}

module.exports = { attachSecurityContext };
