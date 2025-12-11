// backend/src/middleware/inputSanitizer.js
const xss = require("xss");

/**
 * Recursively sanitize string values in an object (in-place).
 * Only sanitizes strings — preserves non-string types.
 */
function sanitizeObject(obj) {
  if (!obj || typeof obj !== "object") return;
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    // Remove Mongo operator keys like "$gt", "$ne"
    if (key.startsWith("$")) {
      delete obj[key];
      continue;
    }

    if (typeof val === "string") {
      // sanitize string and replace
      obj[key] = xss(val);
    } else if (Array.isArray(val)) {
      for (let i = 0; i < val.length; i++) {
        if (typeof val[i] === "string") val[i] = xss(val[i]);
        else if (typeof val[i] === "object" && val[i] !== null) sanitizeObject(val[i]);
      }
    } else if (typeof val === "object" && val !== null) {
      sanitizeObject(val);
    }
  }
}

module.exports = (app) => {
  // Sanitize body and params only. Do NOT mutate req.query (read-only on Express 5).
  app.use((req, res, next) => {
    try {
      if (req.body && typeof req.body === "object") sanitizeObject(req.body);
      if (req.params && typeof req.params === "object") sanitizeObject(req.params);
    } catch (e) {
      // In case sanitization throws (shouldn't), log and continue — don't crash the request.
      // Use console.error so it surfaces in dev logs. Central error handler will still run for other errors.
      console.error("Sanitizer error:", e && e.message ? e.message : e);
    }
    next();
  });
};
