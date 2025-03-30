<<<<<<< HEAD
const express = require("express");
const router = express.Router();
const BloodRequest = require("../models/BloodRequest");
const BloodDonation = require('../models/BloodDonation'); 

// GET route to show the receive page (No alert message here)
router.get("/", (req, res) => {
    res.render("receive", { user: req.user });
});

// POST route to submit a new blood request
router.post("/receive", async (req, res) => { 
    try {
        if (!req.user) {
            return res.redirect("/home?message=Please log in to continue.");
        }

        // Check if the user already has a pending donation or request
        const hasPendingStatus = await BloodDonation.findOne({ userId: req.user._id, status: "Pending" }) || 
                                 await BloodRequest.findOne({ userId: req.user._id, status: "Pending" });

        if (hasPendingStatus) {
            return res.redirect("/home?message=You already have a pending request. Wait for approval!");
        }

        const { name, gender, phone, address, dob, bloodType, location, reason, otherReason, bloodAmount } = req.body;
        const finalReason = reason === "Other" ? otherReason : reason;

        const newRequest = new BloodRequest({
            userId: req.user._id,
            name,
            gender,
            phone,
            address,
            dob: new Date(dob),
            bloodType,
            location,
            reason: finalReason,
            bloodAmount,
            status: "Pending",
        });

        await newRequest.save();
        res.redirect("/home?message=Your blood request has been submitted successfully!.");
    } catch (error) {
        console.error("Error submitting blood request:", error);
        res.redirect("/home?message=Something went wrong. Please try again.");
    }
});

router.delete("/delete-request/:id", async (req, res) => {
    try {
          console.log('Reached delete route in request')
          const { id } = req.params;
          await BloodRequest.findByIdAndDelete(id);
          res.json({ success: true, message: "Form deleted successfully!" });
        } catch (error) {
          console.error("Error deleting Form:", error);
          res.status(500).json({ success: false, message: "Failed to delete Form." });
        }
});


module.exports = router;
=======
const express = require("express");
const router = express.Router();
const BloodRequest = require("../models/BloodRequest");
const BloodDonation = require('../models/BloodDonation'); 

// GET route to show the receive page (No alert message here)
router.get("/", (req, res) => {
    res.render("receive", { user: req.user });
});

// POST route to submit a new blood request
router.post("/receive", async (req, res) => { 
    try {
        if (!req.user) {
            return res.redirect("/home?message=Please log in to continue.");
        }

        // Check if the user already has a pending donation or request
        const hasPendingStatus = await BloodDonation.findOne({ userId: req.user._id, status: "Pending" }) || 
                                 await BloodRequest.findOne({ userId: req.user._id, status: "Pending" });

        if (hasPendingStatus) {
            return res.redirect("/home?message=You already have a pending request. Wait for approval!");
        }

        const { name, gender, phone, address, dob, bloodType, location, reason, otherReason, bloodAmount } = req.body;
        const finalReason = reason === "Other" ? otherReason : reason;

        const newRequest = new BloodRequest({
            userId: req.user._id,
            name,
            gender,
            phone,
            address,
            dob: new Date(dob),
            bloodType,
            location,
            reason: finalReason,
            bloodAmount,
            status: "Pending",
        });

        await newRequest.save();
        res.redirect("/home?message=Your blood request has been submitted successfully!.");
    } catch (error) {
        console.error("Error submitting blood request:", error);
        res.redirect("/home?message=Something went wrong. Please try again.");
    }
});

router.delete("/delete-request/:id", async (req, res) => {
    try {
          console.log('Reached delete route in request')
          const { id } = req.params;
          await BloodRequest.findByIdAndDelete(id);
          res.json({ success: true, message: "Form deleted successfully!" });
        } catch (error) {
          console.error("Error deleting Form:", error);
          res.status(500).json({ success: false, message: "Failed to delete Form." });
        }
});


module.exports = router;
>>>>>>> 4c5af07 (Added Docker File)
