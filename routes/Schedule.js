<<<<<<< HEAD
const express = require("express");
const router = express.Router();
const BloodBank = require("../models/BloodBank"); // ✅ Add this line
const Schedule = require("../models/schedule");
const BloodDonation = require("../models/BloodDonation"); // Correct import


router.get("/", async (req, res) => {
  try {
      if (!req.user) return res.status(401).send("Unauthorized");

      // Fetch the latest approved donation for the user
      const donation = await BloodDonation.findOne({ 
        userId: req.user._id, 
        status: { $in: ["Accepted", "Schedule Removed"] } 
    }).sort({ registeredAt: -1 });
    
      if (!donation) {
          return res.render("schedule", { donationAmount: "Not Available", location: "", addresses: [] });
      }

      const donationAmount = donation.donationAmount || "Not Available";
      const location = donation.location;

      // Fetch blood bank addresses based on the user's location
      const bloodBank = await BloodBank.findOne({ location });

      res.render("schedule", { 
          donationAmount, 
          location, 
          addresses: bloodBank ? bloodBank.addresses : [] 
      });

  } catch (error) {
      console.error("Error fetching schedule details:", error);
      res.status(500).send("Error loading schedule form.");
  }
});

router.post("/", async (req, res) => {
    try {
        const userId = req.user ? req.user._id : req.session.userId;
  
        if (!userId) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }
  
        const scheduleDate = req.body.scheduleDate;
        if (!scheduleDate) {
            return res.status(400).json({ success: false, message: "Schedule date is required" });
        }
  
        const newSchedule = new Schedule({
            userId,
            scheduleDate,
            timeSlot: req.body.timeSlot,
            medications: req.body.medications,
            vaccination: req.body.vaccination,
            recentIllness: req.body.recentIllness,
            bloodPressure: req.body.bloodPressure,
            location: req.body.location,
            address: req.body.address
        });
  
        console.log('Last Schedule Date:', scheduleDate);
  
        await newSchedule.save();
  
        const updateResult = await BloodDonation.findOneAndUpdate(
            { userId, status: { $in: ["Accepted", "Schedule Removed"] } }, // ✅ Check both statuses
            { $set: { lastScheduledDate: new Date(scheduleDate), status: "Accepted" } }, // ✅ Update status to "Accepted"
            { new: true }
        );
        
  
        console.log("BloodDonation lastScheduledDate updated:", updateResult);
  
        res.json({ success: true, message: "Schedule saved successfully!" });
  
    } catch (error) {
        console.error("Error saving schedule:", error);
        res.status(500).json({ success: false, message: "Failed to save schedule." });
    }
  });
  

module.exports = router;
=======
const express = require("express");
const router = express.Router();
const BloodBank = require("../models/BloodBank"); // ✅ Add this line
const Schedule = require("../models/schedule");
const BloodDonation = require("../models/BloodDonation"); // Correct import


router.get("/", async (req, res) => {
  try {
      if (!req.user) return res.status(401).send("Unauthorized");

      // Fetch the latest approved donation for the user
      const donation = await BloodDonation.findOne({ 
        userId: req.user._id, 
        status: { $in: ["Accepted", "Schedule Removed"] } 
    }).sort({ registeredAt: -1 });
    
      if (!donation) {
          return res.render("schedule", { donationAmount: "Not Available", location: "", addresses: [] });
      }

      const donationAmount = donation.donationAmount || "Not Available";
      const location = donation.location;

      // Fetch blood bank addresses based on the user's location
      const bloodBank = await BloodBank.findOne({ location });

      res.render("schedule", { 
          donationAmount, 
          location, 
          addresses: bloodBank ? bloodBank.addresses : [] 
      });

  } catch (error) {
      console.error("Error fetching schedule details:", error);
      res.status(500).send("Error loading schedule form.");
  }
});

router.post("/", async (req, res) => {
    try {
        const userId = req.user ? req.user._id : req.session.userId;
  
        if (!userId) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }
  
        const scheduleDate = req.body.scheduleDate;
        if (!scheduleDate) {
            return res.status(400).json({ success: false, message: "Schedule date is required" });
        }
  
        const newSchedule = new Schedule({
            userId,
            scheduleDate,
            timeSlot: req.body.timeSlot,
            medications: req.body.medications,
            vaccination: req.body.vaccination,
            recentIllness: req.body.recentIllness,
            bloodPressure: req.body.bloodPressure,
            location: req.body.location,
            address: req.body.address
        });
  
        console.log('Last Schedule Date:', scheduleDate);
  
        await newSchedule.save();
  
        const updateResult = await BloodDonation.findOneAndUpdate(
            { userId, status: { $in: ["Accepted", "Schedule Removed"] } }, // ✅ Check both statuses
            { $set: { lastScheduledDate: new Date(scheduleDate), status: "Accepted" } }, // ✅ Update status to "Accepted"
            { new: true }
        );
        
  
        console.log("BloodDonation lastScheduledDate updated:", updateResult);
  
        res.json({ success: true, message: "Schedule saved successfully!" });
  
    } catch (error) {
        console.error("Error saving schedule:", error);
        res.status(500).json({ success: false, message: "Failed to save schedule." });
    }
  });
  

module.exports = router;
>>>>>>> 4c5af07 (Added Docker File)
