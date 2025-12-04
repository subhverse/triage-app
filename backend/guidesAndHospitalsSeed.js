// guidesAndHospitalsSeed.js
const mongoose = require("mongoose");
require("dotenv").config();

const FirstAidGuide = require("./src/models/firstAidGuide");
const Hospital = require("./src/models/hospital");

const firstAidGuides = [
  // EMERGENCY
  {
    conditionKey: "chest_pain_emergency",
    title: "Emergency First Aid for Chest Pain",
    steps: [
      "Have the person sit down and stay calm.",
      "Loosen tight clothing.",
      "Call emergency services immediately.",
      "Do not give any food or drink.",
      "Monitor breathing and pulse."
    ]
  },
  {
    conditionKey: "severe_bleeding",
    title: "Severe Bleeding Control",
    steps: [
      "Apply firm pressure to the wound with a clean cloth.",
      "Do not remove soaked cloth; add more layers.",
      "Keep the person lying down.",
      "Call emergency services immediately."
    ]
  },
  {
    conditionKey: "unconscious_first_aid",
    title: "Unconscious Person First Aid",
    steps: [
      "Check for breathing.",
      "Place the person in recovery position if breathing.",
      "Do not give water or food.",
      "Call emergency medical services immediately."
    ]
  },
  {
    conditionKey: "seizure_emergency",
    title: "Seizure Emergency First Aid",
    steps: [
      "Clear the area around the person.",
      "Do not restrain the person.",
      "Do not put anything in the mouth.",
      "Time the seizure.",
      "Call emergency services if lasting more than 5 minutes."
    ]
  },
  {
    conditionKey: "severe_burn",
    title: "Severe Burn First Aid",
    steps: [
      "Remove the person from the source of heat.",
      "Do not remove stuck clothing.",
      "Cool the burn with cool water for 10 minutes.",
      "Cover with sterile cloth.",
      "Seek emergency medical care."
    ]
  },
  {
    conditionKey: "anaphylaxis",
    title: "Allergic Reaction (Anaphylaxis) First Aid",
    steps: [
      "Check for swelling of lips/tongue.",
      "Keep the person sitting upright.",
      "If available, use an epinephrine auto-injector.",
      "Call emergency services immediately."
    ]
  },

  // URGENT
  {
    conditionKey: "fever_urgent",
    title: "High Fever First Aid",
    steps: [
      "Give plenty of fluids.",
      "Use a cold compress on forehead.",
      "Do not give aspirin to children.",
      "Seek medical care soon."
    ]
  },
  {
    conditionKey: "vomiting_urgent",
    title: "Vomiting Blood — First Aid",
    steps: [
      "Make the person sit upright.",
      "Give small sips of water only.",
      "Do not give any medication.",
      "Seek urgent medical care."
    ]
  },
  {
    conditionKey: "abdominal_urgent",
    title: "Right-Lower Abdominal Pain First Aid",
    steps: [
      "Avoid eating or drinking.",
      "Do not apply heat.",
      "Seek urgent clinical evaluation."
    ]
  },
  {
    conditionKey: "dizziness_urgent",
    title: "Dizziness with Fainting First Aid",
    steps: [
      "Make the person lie flat.",
      "Raise the legs slightly.",
      "Give water if conscious.",
      "Seek urgent medical care."
    ]
  },

  // NON-URGENT
  {
    conditionKey: "mild_burn",
    title: "Mild Burn First Aid",
    steps: [
      "Run cool water over the burn for 10 minutes.",
      "Do not pop blisters.",
      "Apply aloe vera or burn ointment.",
      "Keep the area clean."
    ]
  },
  {
    conditionKey: "diarrhea_care",
    title: "Diarrhea & Dehydration First Aid",
    steps: [
      "Drink oral rehydration solution (ORS).",
      "Avoid spicy or oily food.",
      "Drink plenty of water.",
      "Seek care if symptoms worsen."
    ]
  }
];

// SAMPLE HOSPITALS (3 recommended)
const hospitals = [
  {
    name: "AIIMS Bhubaneswar",
    address: "Sijua, Patrapada, Bhubaneswar",
    city: "Bhubaneswar",
    phone: "0674-2476789",
    specialties: ["Emergency", "Cardiology", "Trauma", "Neurology"]
  },
  {
    name: "KIMS Hospital (Kalinga Institute of Medical Sciences)",
    address: "KIIT Campus, Patia, Bhubaneswar",
    city: "Bhubaneswar",
    phone: "0674-2725312",
    specialties: ["Emergency", "General Medicine", "Critical Care"]
  },
  {
    name: "AMRI Hospital Bhubaneswar",
    address: "Acharya Vihar, Bhubaneswar",
    city: "Bhubaneswar",
    phone: "0674-6666600",
    specialties: ["Emergency", "Orthopedics", "Cardiology"]
  },
  {
    name: "SUM Hospital",
    address: "Kalinga Nagar, Bhubaneswar",
    city: "Bhubaneswar",
    phone: "0674-2386285",
    specialties: ["Emergency", "Trauma", "Burn Unit"]
  },
  {
    name: "Care Hospitals Bhubaneswar",
    address: "Prachi Enclave, Chandrasekharpur, Bhubaneswar",
    city: "Bhubaneswar",
    phone: "0674-6626666",
    specialties: ["Emergency", "Cardiology", "Pulmonology"]
  },
  {
    name: "Apollo Hospitals Bhubaneswar",
    address: "Sainik School Road, Bhubaneswar",
    city: "Bhubaneswar",
    phone: "0674-6661010",
    specialties: ["Emergency", "Neurosurgery", "Trauma"]
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB Connected!");

    await FirstAidGuide.deleteMany({});
    console.log("Old guides removed");

    await Hospital.deleteMany({});
    console.log("Old hospitals removed");

    await FirstAidGuide.insertMany(firstAidGuides);
    console.log("First-aid guides inserted");

    await Hospital.insertMany(hospitals);
    console.log("Hospitals inserted");

    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
