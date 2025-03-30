<<<<<<< HEAD
const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  scheduleDate: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  medications: { type: String, required: true },
  vaccination: { type: String, required: true },
  recentIllness: { type: String, required: true },
  bloodPressure: { type: String, required: true },
  location: { type: String, required: true },
  address: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },

  // ✅ Added lastScheduledDate field
  lastScheduledDate: { type: Date }
});

// Fix: Check if model already exists before defining
const Schedule = mongoose.models.Schedule || mongoose.model("Schedule", scheduleSchema);

module.exports = Schedule;
=======
const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  scheduleDate: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  medications: { type: String, required: true },
  vaccination: { type: String, required: true },
  recentIllness: { type: String, required: true },
  bloodPressure: { type: String, required: true },
  location: { type: String, required: true },
  address: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },

  // ✅ Added lastScheduledDate field
  lastScheduledDate: { type: Date }
});

// Fix: Check if model already exists before defining
const Schedule = mongoose.models.Schedule || mongoose.model("Schedule", scheduleSchema);

module.exports = Schedule;
>>>>>>> 4c5af07 (Added Docker File)
