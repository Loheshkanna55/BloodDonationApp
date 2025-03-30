const mongoose = require('mongoose');

const BloodRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  name: { type: String, required: true }, // Requester's name
  gender: { type: String, required: true }, // Requester's gender
  phone: { type: String, required: true }, // Requester's phone number
  address: { type: String, required: true }, // Address
  dob: { type: Date, required: true }, // Date of birth
  bloodType: { type: String, required: true }, // Blood group
  location: { type: String, required: true }, // District
  reason: { type: String, required: true }, // Reason for borrowing blood
  otherReason: { type: String }, // Custom reason if "Other" is selected
  bloodAmount: { type: String, required: true }, // Amount of blood needed
  requestedAt: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ["Pending", "Approved", "Rejected","Completed", "Schedule Removed"], 
    default: "Pending" 
  },
  lastScheduledDate: { type: Date }
});

module.exports = mongoose.model('BloodRequest', BloodRequestSchema);
