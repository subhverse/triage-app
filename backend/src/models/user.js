// backend/src/models/user.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true }, // index created below
  passwordHash: { type: String, required: true },
  age: Number,
  gender: Number,
  conditions: [String],
  allergies: [String],
  emergencyContactName: String,
  emergencyContactNumber: String,
}, { timestamps: true });

// Ensure a unique index on email (idempotent, background)
userSchema.index({ email: 1 }, { unique: true, background: true });

module.exports = mongoose.model("User", userSchema);
