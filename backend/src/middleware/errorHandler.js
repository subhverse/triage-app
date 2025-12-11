// backend/src/middleware/errorHandler.js
class ApiError extends Error {
  constructor(message, status = 500, details = null) {
    super(message);
    this.status = status;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

const notFound = (req, res, next) => {
  res.status(404);
  next(new ApiError(`Not Found - ${req.originalUrl}`, 404));
};

// Generic error handler middleware (last middleware)
const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  const statusCode = err.status && Number.isInteger(err.status) ? err.status : 500;
  const payload = {
    ok: false,
    message: err.message || "Internal Server Error",
  };

  if (process.env.NODE_ENV !== "production") {
    payload.stack = err.stack;
    if (err.details) payload.details = err.details;
  }

  // sanitize typical mongoose/validation errors
  if (err.name === "ValidationError") {
    payload.message = "Validation failed";
    payload.details = Object.keys(err.errors || {}).map(k => ({
      field: k,
      message: err.errors[k].message,
    }));
  }

  if (err.name === "MongoError" && err.code === 11000) {
    payload.message = "Duplicate key error";
    payload.details = err.keyValue || null;
  }

  res.status(statusCode).json(payload);
};

module.exports = {
  ApiError,
  notFound,
  errorHandler,
};
