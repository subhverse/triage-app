const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  city: String,
  phone: String,
  specialties: [String],   // e.g. ["Cardiology","Trauma"]
  lat: Number,             // optional for later map integration
  lng: Number
}, { timestamps: true });

module.exports = mongoose.model("Hospital", hospitalSchema);
