// backend/src/server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Always-present routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const symptomRoutes = require("./routes/symptomRoutes");

// Optional routes — SAFE REQUIRE
let triageRoutes = null;
let historyRoutes = null;

try {
  triageRoutes = require("./routes/triageRoutes");
} catch (e) {
  console.warn("triageRoutes missing, skipping");
}

try {
  historyRoutes = require("./routes/historyRoutes");
} catch (e) {
  console.warn("historyRoutes missing, skipping");
}

// Central middleware
const { notFound, errorHandler } = require("./middleware/errorHandler");
const applySanitizers = require("./middleware/inputSanitizer");

const app = express();

// If behind a proxy (Heroku / nginx / cloud) make secure cookies work
app.set("trust proxy", 1);

// ========== SECURITY ==========
app.use(helmet());

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// ========== CORS ==========
app.use((req, res, next) => {
  const origin =
    req.headers.origin ||
    process.env.FRONTEND_ORIGIN ||
    "http://localhost:5173";

  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// Parsers
app.use(express.json());
app.use(cookieParser());

// ========== INPUT SANITIZATION (mongo / xss) ==========
/*
  inputSanitizer should call express-mongo-sanitize and xss-clean on app.
  If you haven't created middleware/inputSanitizer.js yet, see the snippet below.
*/
applySanitizers(app);

// ===== ROUTES =====
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/symptoms", symptomRoutes);

if (triageRoutes) app.use("/triage", triageRoutes);
if (historyRoutes) app.use("/history", historyRoutes);

// Health check
app.get("/health", (req, res) => res.json({ ok: true }));

// 404 + central error handler (must be after routes)
app.use(notFound);
app.use(errorHandler);

// =======================
// Start Server
// =======================
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log("Server running on port", PORT));
  } catch (err) {
    console.error("Failed to start:", err.message);
    process.exit(1);
  }
};

start();

module.exports = app;
