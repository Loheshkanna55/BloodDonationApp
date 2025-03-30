<<<<<<< HEAD
const mongoose = require("mongoose");

const ConfirmedScheduleSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["Donation", "Request"], required: true }, // Identify type
    scheduleDate: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ConfirmedSchedule", ConfirmedScheduleSchema);
=======
const mongoose = require("mongoose");

const ConfirmedScheduleSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["Donation", "Request"], required: true }, // Identify type
    scheduleDate: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ConfirmedSchedule", ConfirmedScheduleSchema);
>>>>>>> 4c5af07 (Added Docker File)
