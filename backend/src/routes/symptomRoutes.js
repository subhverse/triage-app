// backend/src/routes/symptomRoutes.js
const express = require("express");
const router = express.Router();
const Symptom = require("../models/symptom");

// GET /symptoms - public: returns all symptoms
router.get("/", async (req, res) => {
  try {
    const items = await Symptom.find().sort({ category: 1, name: 1 }).lean();
    res.json(items);
  } catch (err) {
    console.error("GET /symptoms error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
