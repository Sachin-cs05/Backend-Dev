const session = require("express-session");
const MongoStore = require("connect-mongo");

const defaultCookieConfig = {
  httpOnly: true,
  sameSite: "strict",
  secure: true,
  maxAge: 1000 * 60 * 15
};

function enforceHttps() {
  return (req, res, next) => {
    const forwardedProto = req.get("x-forwarded-proto");
    const isSecure = req.secure || forwardedProto === "https";

    if (process.env.NODE_ENV === "development" || isSecure) {
      return next();
    }

    return res.status(403).json({
      message: "Secure transport required."
    });
  };
}

function buildSessionMiddleware({ store } = {}) {
  const sessionStore =
    store ||
    MongoStore.create({
      mongoUrl: process.env.MONGO_URL || "mongodb://127.0.0.1:27017/security-assignment",
      crypto: {
        secret: process.env.SESSION_STORE_SECRET || "replace-me-session-store-secret"
      },
      ttl: 60 * 15
    });

  return session({
    name: "__Host-fin.sid",
    secret: process.env.SESSION_SECRET || "replace-me-session-secret",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    proxy: true,
    store: sessionStore,
    cookie: defaultCookieConfig
  });
}

module.exports = { buildSessionMiddleware, defaultCookieConfig, enforceHttps };
