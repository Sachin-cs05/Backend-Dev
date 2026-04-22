function notFoundHandler(req, res) {
  res.status(404).json({ message: "Resource not found." });
}

function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || 500;

  if (req.security && req.security.logger) {
    req.security.logger.error({
      requestId: req.security.requestId,
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  }

  res.status(statusCode).json({
    message: statusCode >= 500 ? "An unexpected error occurred." : error.publicMessage || error.message
  });
}

module.exports = { errorHandler, notFoundHandler };
