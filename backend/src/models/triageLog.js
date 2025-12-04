const mongoose = require("mongoose");

const triageLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  symptomCodes: [{ type: String }],
  answers: { type: Object }, // { questionKey: value }
  calculatedSeverity: { type: String, enum: ["EMERGENCY","URGENT","NON_URGENT"] },
  matchedRuleId: { type: mongoose.Schema.Types.ObjectId, ref: "TriageRule", required: false },
  guideKey: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("TriageLog", triageLogSchema);
