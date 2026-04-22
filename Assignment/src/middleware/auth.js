function requireAuthenticatedUser(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: "Authentication required." });
  }

  req.user = req.session.user;
  next();
}

function requireOwnership(paramName = "accountId") {
  return (req, res, next) => {
    const requestedOwner = req.params[paramName] || req.body[paramName] || req.query[paramName];
    if (!requestedOwner || requestedOwner !== req.user.accountId) {
      return res.status(403).json({ message: "Forbidden." });
    }

    next();
  };
}

module.exports = { requireAuthenticatedUser, requireOwnership };
