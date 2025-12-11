// backend/src/models/symptom.js
const mongoose = require("mongoose");

const followUpQuestionSchema = new mongoose.Schema({
  key: String,
  text: String,
  type: { type: String, default: "boolean" }, // boolean | numeric | text
}, { _id: false });

const symptomSchema = new mongoose.Schema({
  name: { type: String, required: true },        // e.g. "Chest pain"
  code: { type: String, required: true },        // short key e.g. "chest_pain" -> indexed below
  category: { type: String },                    // cardiac, respiratory, trauma, etc.
  description: { type: String },                 // optional longer description
  followUpQuestions: [followUpQuestionSchema],
}, { timestamps: true });

// Index on code (unique)
symptomSchema.index({ code: 1 }, { unique: true, background: true });

module.exports = mongoose.model("Symptom", symptomSchema);
