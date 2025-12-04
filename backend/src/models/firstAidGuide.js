const mongoose = require("mongoose");

const firstAidGuideSchema = new mongoose.Schema({
  conditionKey: { type: String, required: true, unique: true }, 
  title: { type: String, required: true },                       
  steps: [{ type: String, required: true }]                      
}, { timestamps: true });

module.exports = mongoose.model("FirstAidGuide", firstAidGuideSchema);
