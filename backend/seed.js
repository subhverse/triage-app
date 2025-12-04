const mongoose = require("mongoose");
require("dotenv").config();

const Symptom = require("./src/models/symptom");

const symptoms = [
  {
    name: "Chest Pain",
    code: "chest_pain",
    category: "cardiac",
    description: "Pain or pressure in the chest area.",
    followUpQuestions: [
      { key: "breathing_difficulty", text: "Are you having trouble breathing?", type: "boolean" },
      { key: "radiating_pain", text: "Does the pain spread to your arm or jaw?", type: "boolean" },
      { key: "sweating", text: "Are you sweating unusually?", type: "boolean" }
    ]
  },
  {
    name: "Difficulty Breathing",
    code: "breathing_difficulty",
    category: "respiratory",
    description: "Shortness of breath or unable to breathe normally.",
    followUpQuestions: [
      { key: "wheezing", text: "Are you wheezing?", type: "boolean" },
      { key: "sudden_onset", text: "Did the problem start suddenly?", type: "boolean" }
    ]
  },
  {
    name: "Severe Bleeding",
    code: "severe_bleeding",
    category: "trauma",
    followUpQuestions: [
      { key: "bleeding_uncontrolled", text: "Is the bleeding not stopping with pressure?", type: "boolean" }
    ]
  },
  {
    name: "Unconsciousness",
    code: "unconsciousness",
    category: "critical",
    followUpQuestions: [
      { key: "responsive_voice", text: "Do they respond to voice?", type: "boolean" }
    ]
  },
  {
    name: "Seizure",
    code: "seizure",
    category: "neurological",
    followUpQuestions: [
      { key: "seizure_duration", text: "Did the seizure last more than 5 minutes?", type: "boolean" }
    ]
  },
  {
    name: "Severe Burn",
    code: "severe_burn",
    category: "trauma",
    followUpQuestions: [
      { key: "large_area", text: "Does the burn cover a large area?", type: "boolean" }
    ]
  },
  {
    name: "High Fever",
    code: "high_fever",
    category: "infection",
    followUpQuestions: [
      { key: "temp_over_102", text: "Is the temperature above 102°F?", type: "boolean" }
    ]
  },
  {
    name: "Abdominal Pain",
    code: "abdominal_pain",
    category: "general",
    followUpQuestions: [
      { key: "right_lower_pain", text: "Is the pain on the lower right side?", type: "boolean" }
    ]
  },
  {
    name: "Vomiting",
    code: "vomiting",
    category: "general",
    followUpQuestions: [
      { key: "blood_vomit", text: "Is there blood in the vomit?", type: "boolean" }
    ]
  },
  {
    name: "Dizziness",
    code: "dizziness",
    category: "general",
    followUpQuestions: [
      { key: "fainted", text: "Did you faint?", type: "boolean" }
    ]
  },
  {
    name: "Headache",
    code: "headache",
    category: "neurological",
    followUpQuestions: [
      { key: "stiff_neck", text: "Is there stiffness in the neck?", type: "boolean" }
    ]
  },
  {
    name: "Moderate Bleeding",
    code: "moderate_bleeding",
    category: "trauma",
    followUpQuestions: [
      { key: "stops_with_pressure", text: "Does the bleeding stop with pressure?", type: "boolean" }
    ]
  },
  {
    name: "Mild Burn",
    code: "mild_burn",
    category: "trauma",
    followUpQuestions: [
      { key: "blister", text: "Is there a blister?", type: "boolean" }
    ]
  },
  {
    name: "Diarrhea",
    code: "diarrhea",
    category: "infection",
    followUpQuestions: [
      { key: "dehydration_signs", text: "Are there signs of dehydration?", type: "boolean" }
    ]
  },
  {
    name: "Allergic Reaction",
    code: "allergic_reaction",
    category: "allergy",
    followUpQuestions: [
      { key: "lip_swelling", text: "Is there swelling of lips or tongue?", type: "boolean" }
    ]
  },
  {
    name: "Injury Swelling",
    code: "injury_swelling",
    category: "trauma",
    followUpQuestions: [
      { key: "unable_to_move", text: "Is it impossible to move the injured part?", type: "boolean" }
    ]
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    await Symptom.deleteMany({});
    console.log("Old symptoms removed");

    await Symptom.insertMany(symptoms);
    console.log("16 Symptoms inserted successfully!");

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
