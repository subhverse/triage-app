// backend/src/server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// routes (only require routes that exist in your project)
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
// If you have triageRoutes file, require it; if not, comment the next line
let triageRoutes;
try {
  triageRoutes = require("./routes/triageRoutes");
} catch (e) {
  triageRoutes = null;
  // console.log("triageRoutes not found — skipping");
}

const app = express();


// ===== CORS =====
// set the origin to the Vite dev server you are using (5173 or 5177).
// If you aren't sure, check the frontend terminal and set that value.
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5177";

app.use(cors({
  origin: FRONTEND_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

// ===== Body parser =====
app.use(express.json());

// ===== Routes =====
app.use("/auth", authRoutes);
if (triageRoutes) app.use("/triage", triageRoutes);

app.use("/user", userRoutes);

// simple health check
app.get("/health", (req, res) => res.json({ ok: true }));

// ===== Start =====
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 4000, () => console.log("Server running on port", process.env.PORT || 4000));
  } catch (err) {
    console.error("Failed to start:", err.message);
    process.exit(1);
  }
};

start();
