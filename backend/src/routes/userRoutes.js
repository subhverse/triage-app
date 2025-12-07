// backend/src/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/user");

// GET /user/profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-passwordHash -__v");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /user/profile
router.put("/profile", auth, async (req, res) => {
  try {
    const updates = { ...req.body };
    // protect sensitive fields
    delete updates.passwordHash;
    delete updates.email; // change email via separate flow if you want
    const user = await User.findByIdAndUpdate(req.userId, updates, { new: true }).select("-passwordHash -__v");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
