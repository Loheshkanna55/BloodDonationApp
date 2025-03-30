const express = require("express");
const router = express.Router();
const BloodRequest = require("../models/BloodRequest");
const BloodBank = require("../models/BloodBank");
const ScheduleRequest = require('../models/requestSchedule')
const multer = require("multer");
const upload = multer();

router.get("/:district", async (req, res) => {
    try {
        if (!req.user) {
            return res.redirect("/login");
        }

        const selectedDistrict = req.params.district; // ✅ Get district from URL
       const bloodRequest = await BloodRequest.findOne({ 
        userId: req.user._id, 
        status: { $in: ["Accepted", "Schedule Removed"] } 
        }).sort({ registeredAt: -1 });

        if (!bloodRequest) {
            return res.status(400).send("No blood request found.");
        }

        const userBloodType = bloodRequest.bloodType;
        const recipientBloodAmount = bloodRequest.bloodAmount;
        const requestReason = bloodRequest.reason;

        // Find blood bank for the selected district
        const selectedBloodBank = await BloodBank.findOne({ location: selectedDistrict });

        if (!selectedBloodBank) {
            return res.status(404).send("No blood bank found for this district.");
        }

        res.render("requestSchedule", { 
            userBloodType, 
            recipientBloodAmount, 
            requestReason, 
            selectedDistrict, // ✅ Pass district to EJS
            selectedBloodBank // ✅ Pass blood bank to show correct addresses
        });

    } catch (error) {
        console.error("Error fetching schedule details:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.post("/", upload.none(), async (req, res) => {
    try {
        const userId = req.user?._id || req.session?.userId;

        if (!userId) {
            return res.status(400).json({ error: "User ID is missing" });
        }

        console.log("Request Body:", req.body); // Debugging log

        const formatValue = (val) => Array.isArray(val) ? val[0] : val;

        let bloodAmount = formatValue(req.body.bloodAmount);
        bloodAmount = parseFloat(bloodAmount.replace(/\D/g, '')); // Remove non-numeric characters

        if (isNaN(bloodAmount)) {
            return res.status(400).json({ success: false, message: "Invalid bloodAmount value!" });
        }

        const scheduleDate = formatValue(req.body.scheduleDate);
        if (!scheduleDate) {
            return res.status(400).json({ success: false, message: "Schedule date is required." });
        }

        const newSchedule = new ScheduleRequest({
            userId: req.user._id,
            scheduleDate,
            session: formatValue(req.body.session),
            timeSlot: formatValue(req.body.timeSlot),
            bloodType: formatValue(req.body.bloodType),
            bloodAmount,
            selectedAddress: formatValue(req.body.selectedAddress),
            location: formatValue(req.body.location), // ✅ Storing location
            reason: formatValue(req.body.reason),
            prescription: formatValue(req.body.prescription)
        });

        console.log("Received Request Body:", req.body);
        console.log("Extracted Location:", formatValue(req.body.location));

        await newSchedule.save();

        // ✅ Update lastScheduledDate in BloodRequest collection
        const updateResult = await BloodRequest.updateOne(
            { userId, status: { $in: ["Accepted", "Schedule Removed"] } },
            { $set: { lastScheduledDate: new Date(scheduleDate), status: "Accepted" } } // Ensuring correct Date format
        );

        console.log("BloodRequest lastScheduledDate updated:", updateResult);

        res.json({ success: true, message: "Schedule request submitted successfully!" });

    } catch (error) {
        console.error("Error saving schedule request:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});




module.exports = router;
