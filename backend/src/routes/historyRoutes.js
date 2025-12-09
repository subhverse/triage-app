// backend/src/routes/historyRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const TriageLog = require("../models/triageLog");

// GET /triage/history
router.get("/history", auth, async (req, res) => {
  try {
    const logs = await TriageLog.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .lean();

    res.json(logs);
  } catch (err) {
    console.error("History error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
