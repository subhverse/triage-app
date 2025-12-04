const { evaluateTriage } = require("../services/ruleEngine");
const FirstAidGuide = require("../models/firstAidGuide");
const Hospital = require("../models/hospital");
const TriageLog = require("../models/triageLog");

exports.runTriage = async (req, res) => {
  try {
    const userId = req.userId || null; // middleware sets this if user sent token
    const { symptomCodes = [], answers = {}, preferredCity = null, preferredSpecialty = null } = req.body;

    if (!Array.isArray(symptomCodes) || symptomCodes.length === 0) {
      return res.status(400).json({ message: "symptomCodes (array) is required" });
    }

    // Evaluate rules
    const result = await evaluateTriage({ symptomCodes, answers });

    // fetch first-aid guide if available
    let guide = null;
    if (result.guideKey) {
      guide = await FirstAidGuide.findOne({ conditionKey: result.guideKey }).lean();
    }

    // fetch up to 3 hospitals (simple filter: city and specialty)
    const q = {};
    if (preferredCity) q.city = preferredCity;
    if (preferredSpecialty) q.specialties = preferredSpecialty;
    let hospitals;
    if (Object.keys(q).length) {
      hospitals = await Hospital.find(q).limit(3).lean();
    } else {
      hospitals = await Hospital.find().limit(3).lean();
    }

    // save triage log
    const log = await TriageLog.create({
      userId,
      symptomCodes,
      answers,
      calculatedSeverity: result.severity,
      matchedRuleId: result.matchedRuleId,
      guideKey: result.guideKey
    });

    // Build response
    return res.json({
      severity: result.severity,
      reason: result.reason,
      guide: guide ? { title: guide.title, steps: guide.steps } : null,
      hospitals,
      triageLogId: log._id
    });
  } catch (err) {
    console.error("triage error:", err);
    return res.status(500).json({ error: err.message });
  }
};
