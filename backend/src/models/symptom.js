const mongoose = require("mongoose");

const symptomSchema = new mongoose.Schema({
  name: { type: String, required: true },        // e.g. "Chest pain"
  code: { type: String, required: true, unique: true }, // short key e.g. "chest_pain"
  category: { type: String },                    // cardiac, respiratory, trauma, etc.
  description: { type: String },                 // optional longer description
  followUpQuestions: [
    {
      key: String,          // question id used in triage_rules answers e.g. "breathing_difficulty"
      text: String,         // question text shown to user
      type: { type: String, default: "boolean" } // boolean | numeric | text (we'll use boolean mostly)
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Symptom", symptomSchema);
