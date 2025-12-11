// backend/scripts/migrateTriageLogsAddFields.js
/**
 * Idempotent migration to ensure triage logs have:
 *  - ruleVersion (string) -> default "v1.0" if missing
 *  - createdBy (ObjectId or null) -> set to null if missing
 *  - createdAt -> set to now if missing
 *
 * Usage:
 *   node backend/scripts/migrateTriageLogsAddFields.js
 *
 * The migration logs a concise summary and exits with code 0 on success.
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
    console.log("Connected to MongoDB for triage_logs migration.");

    const TriageLog = require("../src/models/triageLog");

    // 1) Add ruleVersion where missing
    const RULE_VERSION_DEFAULT = process.env.DEFAULT_TRIAGE_RULE_VERSION || "v1.0";
    const res1 = await TriageLog.updateMany(
      { ruleVersion: { $exists: false } },
      { $set: { ruleVersion: RULE_VERSION_DEFAULT } }
    );
    console.log(`ruleVersion: matched=${res1.matchedCount}, modified=${res1.modifiedCount}`);

    // 2) Add createdBy where missing (explicitly set to null)
    const res2 = await TriageLog.updateMany(
      { createdBy: { $exists: false } },
      { $set: { createdBy: null } }
    );
    console.log(`createdBy: matched=${res2.matchedCount}, modified=${res2.modifiedCount}`);

    // 3) Ensure createdAt exists (some older docs might not have it)
    const now = new Date();
    const res3 = await TriageLog.updateMany(
      { createdAt: { $exists: false } },
      { $set: { createdAt: now } }
    );
    console.log(`createdAt: matched=${res3.matchedCount}, modified=${res3.modifiedCount}`);

    console.log("Migration complete. Disconnecting.");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(2);
  }
}

main();
