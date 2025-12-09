// backend/src/server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const symptomRoutes = require("./routes/symptomRoutes");
const historyRoutes = require("./routes/historyRoutes");

let triageRoutes;
try {
  triageRoutes = require("./routes/triageRoutes");
} catch (e) {
  triageRoutes = null;
}

const app = express();

// =======================
// CORS for COOKIE AUTH
// =======================
app.use((req, res, next) => {
  const origin = req.headers.origin;   // Allow ANY frontend port in dev
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// =======================
// Parsers
// =======================
app.use(express.json());
app.use(cookieParser());

// =======================
// Routes
// =======================
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/symptoms", symptomRoutes);
app.use("/triage", historyRoutes);

if (triageRoutes) app.use("/triage", triageRoutes);

// Health check
app.get("/health", (req, res) => res.json({ ok: true }));

// =======================
// Start Server
// =======================
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () =>
      console.log("Server running on port", PORT)
    );
  } catch (err) {
    console.error("Failed to start:", err.message);
    process.exit(1);
  }
};

start();
