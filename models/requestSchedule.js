const mongoose = require("mongoose");

const scheduleRequestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    scheduleDate: { type: Date, required: true },
    session: { type: String, enum: ["Morning", "Afternoon", "Evening"], required: true },
    timeSlot: { type: String, required: true },
    bloodType: { type: String, required: true },
    bloodAmount: { type: Number, required: true },
    selectedAddress: { type: String, required: true },
    location: { type: String, required: true }, 
    reason: { type: String, required: true },
    prescription: { type: String, enum: ["Yes", "No"], required: true },
    createdAt: { type: Date, default: Date.now },
    
    // ✅ Added lastScheduledDate field
    lastScheduledDate: { type: Date }
});

module.exports = mongoose.model("ScheduleRequest", scheduleRequestSchema);
