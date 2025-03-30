const mongoose = require('mongoose');

const BloodDonationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  name: { type: String, required: true }, // Donor's name
  gender: { type: String, required: true }, // Male/Female/Other
  phone: { type: String, required: true }, // Contact number
  address: { type: String, required: true }, // Donor's address
  dob: { type: Date, required: true }, // Date of birth
  bloodType: { type: String, required: true }, // Blood group
  location: { type: String, required: true }, // District
  healthCondition: { type: String, required: true }, // Good/Not Good
  symptoms: { type: String }, // If not good, store symptoms
  donationAmount: { type: String, required: true }, // Blood donation amount (100ml - 500ml)
  message: { type: String }, // Optional message
  registeredAt: { type: Date, default: Date.now }, 
  status: { 
    type: String, 
    enum: ["Pending", "Approved", "Rejected", "Completed", "Schedule Removed"], // ✅ Added "Completed"
    default: "Pending"
  },
  lastScheduledDate: { type: Date }
  
});

module.exports = mongoose.model('BloodDonation', BloodDonationSchema);
