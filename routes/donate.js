const express = require("express");
const router = express.Router();
const BloodDonation = require("../models/BloodDonation");
const BloodRequest = require("../models/BloodRequest");

// GET route to show the donation page
router.get("/", (req, res) => {
    res.render("donate", { user: req.user });
});

// POST route to submit a blood donation
router.post("/donate", async (req, res) => {
    try {
        if (!req.user) {
            return res.redirect("/home?message=Please log in to continue.");
        }

        // Check if the user already has a pending donation or request
        const hasPendingStatus = await BloodDonation.findOne({ userId: req.user._id, status: "Pending" }) || 
                                 await BloodRequest.findOne({ userId: req.user._id, status: "Pending" });

        if (hasPendingStatus) {
            return res.redirect("/home?message=You already have a pending request. Wait for approval.");
        }

        // If no pending request, create a new donation record
        const donation = new BloodDonation({
            userId: req.user._id,
            name: req.body.name,
            gender: req.body.gender,
            phone: req.body.phone,
            address: req.body.address,
            dob: new Date(req.body.dob),
            bloodType: req.body.bloodType,
            location: req.body.location,
            healthCondition: req.body.healthCondition,
            symptoms: req.body.symptoms,
            donationAmount: req.body.donationAmount,
            message: req.body.message,
            status: "Pending", // Ensure new donations start as pending
        });

        await donation.save();
        res.redirect("/home?message=Your blood donation request has been submitted successfully.");
    } catch (err) {
        console.error("Error in donation:", err);
        res.redirect("/home?message=Something went wrong. Please try again.");
    }
});

// Delete Donation Entry
router.delete("/delete-donation/:id", async (req, res) => {
  try {
      console.log(`Reached delete route in donate for ID: ${req.params.id}`); // Debugging

      const { id } = req.params;
      const deletedDonation = await BloodDonation.findByIdAndDelete(id);

      if (!deletedDonation) {
          return res.status(404).json({ success: false, message: "Donation not found!" });
      }

      res.json({ success: true, message: "Form deleted successfully!" });
  } catch (error) {
      console.error("Error deleting donation:", error);
      res.status(500).json({ success: false, message: "Failed to delete donation." });
  }
});

  

module.exports = router;
