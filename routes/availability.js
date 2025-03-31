const express = require("express");
const router = express.Router();
const BloodBank = require("../models/BloodBank");
const User = require("../models/User");  // Import User model
const BloodRequest = require("../models/BloodRequest"); // Import BloodRequest model

router.get("/availability", async (req, res) => {
    try {
        if (!req.user) {
            return res.redirect("/login"); // Redirect if not logged in
        }

        // Get the latest blood request of the logged-in user
        const bloodRequest = await BloodRequest.findOne({ userId: req.user._id }).sort({ requestedAt: -1 });

        if (!bloodRequest || !bloodRequest.bloodType) {
            return res.status(400).send("User blood type not found.");
        }

        const userBloodType = bloodRequest.bloodType;
        const userLocation = bloodRequest.location;
        const recipientBloodAmount = bloodRequest.bloodAmount; // ✅ Extract blood amount

        // Fetch blood banks with available units of the requested blood type
        let availableBloodBanks = await BloodBank.find({ [userBloodType]: { $gt: 0 } });

        // Sort to prioritize blood banks in the user's location first
        availableBloodBanks.sort((a, b) => (a.location === userLocation ? -1 : 1));

        // ✅ Pass recipientBloodAmount to the EJS file
        res.render("availability", { availableBloodBanks, userBloodType, recipientBloodAmount });

    } catch (error) {
        console.error("Error fetching availability:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
