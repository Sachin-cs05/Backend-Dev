const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");

const { buildHelmetConfig, contentSecurityPolicyDirectives } = require("./config/helmet");
const { buildSessionMiddleware, enforceHttps } = require("./config/session");
const { attachDeviceFingerprint } = require("./middleware/deviceFingerprint");
const { registerRateLimiters } = require("./middleware/rateLimiters");
const { attachSecurityContext } = require("./middleware/securityContext");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandlers");
const authRoutes = require("./routes/auth.routes");
const accountRoutes = require("./routes/account.routes");
const transactionRoutes = require("./routes/transaction.routes");

function createApp({ sessionStore, logger } = {}) {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", 1);

  app.use(enforceHttps());
  app.use(helmet(buildHelmetConfig()));
  app.use((req, res, next) => {
    res.locals.csp = contentSecurityPolicyDirectives;
    next();
  });
  app.use(express.json({ limit: "100kb" }));
  app.use(express.urlencoded({ extended: false, limit: "50kb" }));
  app.use(cookieParser());
  app.use(mongoSanitize({ replaceWith: "_" }));
  app.use(hpp());
  app.use(buildSessionMiddleware({ store: sessionStore }));
  app.use(attachSecurityContext({ logger }));
  app.use(attachDeviceFingerprint());
  registerRateLimiters(app);

  app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/account", accountRoutes);
  app.use("/api/transactions", transactionRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
