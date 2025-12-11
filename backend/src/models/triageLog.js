// backend/src/models/triageLog.js
const mongoose = require("mongoose");

const triageLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  symptomCodes: [{ type: String }],
  answers: { type: Object }, // { questionKey: value }
  calculatedSeverity: { type: String, enum: ["EMERGENCY", "URGENT", "NON_URGENT"] },
  matchedRuleId: { type: mongoose.Schema.Types.ObjectId, ref: "TriageRule", required: false },
  guideKey: String,

  // Audit / versioning fields (optional, non-breaking)
  ruleVersion: { type: String }, // e.g. "v1.2" or a numeric/sha reference
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },

}, { timestamps: true });

// Indexes: query helpers will frequently filter by userId and sort by createdAt
triageLogSchema.index({ userId: 1, createdAt: -1 });
triageLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model("TriageLog", triageLogSchema);
