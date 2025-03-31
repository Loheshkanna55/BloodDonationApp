const mongoose = require("mongoose");

const bloodBankSchema = new mongoose.Schema({
  location: { type: String, required: true, unique: true }, // District/City Name
  addresses: { type: [String], required: true }, // ✅ New Address Field
  "A+": { type: Number, required: true, default: 0 },
  "A-": { type: Number, required: true, default: 0 },
  "B+": { type: Number, required: true, default: 0 },
  "B-": { type: Number, required: true, default: 0 },
  "AB+": { type: Number, required: true, default: 0 },
  "AB-": { type: Number, required: true, default: 0 },
  "O+": { type: Number, required: true, default: 0 },
  "O-": { type: Number, required: true, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model("BloodBank", bloodBankSchema);
