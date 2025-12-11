// backend/scripts/seedSampleTriageLog.js
/**
 * Optional dev seed: inserts one sample triage log if none exist.
 * Usage: node backend/scripts/seedSampleTriageLog.js
 *
 * NOTE: Use in dev only. It checks for existing logs and will not duplicate.
 */

const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config({ path: path.resolve(process.cwd(), ".env") });

async function main() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error("MONGODB_URI not set in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri, {});
    console.log("Connected to MongoDB for seed.");

    const TriageLog = require("../src/models/triageLog");

    const existing = await TriageLog.countDocuments({});
    if (existing > 0) {
      console.log("TriageLog collection already has documents; skipping seed.");
      await mongoose.disconnect();
      return process.exit(0);
    }

    const sample = {
      userId: null,
      symptomCodes: ["chest_pain"],
      answers: { breathing_difficulty: true },
      calculatedSeverity: "EMERGENCY",
      matchedRuleId: null,
      guideKey: "cardiac_emergency_v1",
      ruleVersion: process.env.DEFAULT_TRIAGE_RULE_VERSION || "v1.0",
      createdBy: null,
      createdAt: new Date(),
    };

    const doc = await TriageLog.create(sample);
    console.log("Inserted sample triageLog id=", doc._id);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(2);
  }
}

main();
