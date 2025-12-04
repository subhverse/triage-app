// rulesSeed.js
const mongoose = require("mongoose");
require("dotenv").config();

const TriageRule = require("./src/models/triageRule");

const rules = [
  // EMERGENCY (6)
  {
    name: "Chest pain with breathing difficulty",
    symptomCodes: ["chest_pain", "breathing_difficulty"],
    followUpConditions: [{ questionKey: "breathing_difficulty", expectedAnswer: true }],
    severity: "EMERGENCY",
    priority: 20,
    guideKey: "chest_pain_emergency",
    description: "Possible cardiac emergency — urgent transport to hospital."
  },
  {
    name: "Severe uncontrolled bleeding",
    symptomCodes: ["severe_bleeding"],
    followUpConditions: [{ questionKey: "bleeding_uncontrolled", expectedAnswer: true }],
    severity: "EMERGENCY",
    priority: 19,
    guideKey: "severe_bleeding",
    description: "Life-threatening blood loss — immediate pressure and emergency care."
  },
  {
    name: "Unconscious and unresponsive",
    symptomCodes: ["unconsciousness"],
    followUpConditions: [{ questionKey: "responsive_voice", expectedAnswer: false }],
    severity: "EMERGENCY",
    priority: 18,
    guideKey: "unconscious_first_aid",
    description: "Patient not responding to voice — treat as emergency."
  },
  {
    name: "Prolonged seizure (>5 minutes)",
    symptomCodes: ["seizure"],
    followUpConditions: [{ questionKey: "seizure_duration", expectedAnswer: true }],
    severity: "EMERGENCY",
    priority: 17,
    guideKey: "seizure_emergency",
    description: "Prolonged seizure (status epilepticus) — emergency."
  },
  {
    name: "Large or severe burn",
    symptomCodes: ["severe_burn"],
    followUpConditions: [{ questionKey: "large_area", expectedAnswer: true }],
    severity: "EMERGENCY",
    priority: 16,
    guideKey: "severe_burn",
    description: "Large-surface or deep burns — emergency transfer advised."
  },
  {
    name: "Allergic reaction with lip/tongue swelling",
    symptomCodes: ["allergic_reaction"],
    followUpConditions: [{ questionKey: "lip_swelling", expectedAnswer: true }],
    severity: "EMERGENCY",
    priority: 15,
    guideKey: "anaphylaxis",
    description: "Possible anaphylaxis — airway risk; emergency care required."
  },

  // URGENT (4)
  {
    name: "High fever above 102F",
    symptomCodes: ["high_fever"],
    followUpConditions: [{ questionKey: "temp_over_102", expectedAnswer: true }],
    severity: "URGENT",
    priority: 10,
    guideKey: "fever_urgent",
    description: "High fever may indicate serious infection; see clinician."
  },
  {
    name: "Vomiting with blood",
    symptomCodes: ["vomiting"],
    followUpConditions: [{ questionKey: "blood_vomit", expectedAnswer: true }],
    severity: "URGENT",
    priority: 9,
    guideKey: "vomiting_urgent",
    description: "Possible internal bleeding — urgent evaluation needed."
  },
  {
    name: "Right-lower abdominal pain (appendicitis suspect)",
    symptomCodes: ["abdominal_pain"],
    followUpConditions: [{ questionKey: "right_lower_pain", expectedAnswer: true }],
    severity: "URGENT",
    priority: 8,
    guideKey: "abdominal_urgent",
    description: "Localized RLQ pain suggests appendicitis — urgent surgical review."
  },
  {
    name: "Dizziness with fainting",
    symptomCodes: ["dizziness"],
    followUpConditions: [{ questionKey: "fainted", expectedAnswer: true }],
    severity: "URGENT",
    priority: 7,
    guideKey: "dizziness_urgent",
    description: "Fainting with dizziness may indicate syncope or dehydration — urgent check."
  },

  // NON_URGENT (2)
  {
    name: "Mild burn with blister",
    symptomCodes: ["mild_burn"],
    followUpConditions: [{ questionKey: "blister", expectedAnswer: true }],
    severity: "NON_URGENT",
    priority: 3,
    guideKey: "mild_burn",
    description: "Superficial burn with blister — home care usually sufficient."
  },
  {
    name: "Diarrhea with dehydration signs",
    symptomCodes: ["diarrhea"],
    followUpConditions: [{ questionKey: "dehydration_signs", expectedAnswer: true }],
    severity: "NON_URGENT",
    priority: 2,
    guideKey: "diarrhea_care",
    description: "Dehydration with diarrhea — rehydration needed; seek care if severe."
  }
];

async function seedRules() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI is not defined in .env");
    }
    await mongoose.connect(uri);
    console.log("Connected to DB");

    await TriageRule.deleteMany({});
    console.log("Old rules deleted");

    await TriageRule.insertMany(rules);
    console.log("12 Rules inserted successfully!");

    process.exit(0);
  } catch (err) {
    console.error("Failed to seed rules:", err);
    process.exit(1);
  }
}

seedRules();
