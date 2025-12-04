const mongoose = require("mongoose");

const triageRuleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  symptomCodes: [{ type: String, required: true }],
  followUpConditions: [
    {
      questionKey: String,
      expectedAnswer: mongoose.Schema.Types.Mixed
    }
  ],
  severity: { type: String, enum: ["EMERGENCY", "URGENT", "NON_URGENT"], required: true },
  priority: { type: Number, default: 0 },
  guideKey: { type: String },
  description: String,
}, { timestamps: true });

module.exports = mongoose.model("TriageRule", triageRuleSchema);
