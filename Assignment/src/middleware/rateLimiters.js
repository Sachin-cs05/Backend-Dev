const rateLimit = require("express-rate-limit");

function createLimiter({ windowMs, max, message }) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message }
  });
}

const authLimiter = createLimiter({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: "Too many authentication attempts."
});

const passwordResetLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: "Too many password reset requests."
});

const transferLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Transfer rate limit exceeded."
});

const generalApiLimiter = createLimiter({
  windowMs: 60 * 1000,
  max: 100,
  message: "Too many API requests."
});

function registerRateLimiters(app) {
  app.use("/api", generalApiLimiter);
  app.use("/api/auth/login", authLimiter);
  app.use("/api/auth/password-reset/request", passwordResetLimiter);
  app.use("/api/transactions/transfer", transferLimiter);
}

module.exports = {
  authLimiter,
  generalApiLimiter,
  passwordResetLimiter,
  registerRateLimiters,
  transferLimiter
};
