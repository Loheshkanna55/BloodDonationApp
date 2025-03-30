const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const BloodDonation = require('../models/BloodDonation');
const BloodRequest = require('../models/BloodRequest');
const BloodBank = require("../models/BloodBank");
const Schedule = require('../models/schedule')
const ScheduleRequest = require("../models/requestSchedule");
const User = require("../models/User"); 
const ConfirmedSchedule = require("../models/ConfirmedSchedule ");

// View all blood donation requests
router.get('/donations', async (req, res) => {
    try {
        const donations = await BloodDonation.find();
        res.render('admin-donations', { donations });
    } catch (err) {
        res.status(500).send('Error retrieving donations');
    }
});

// View all blood requests
router.get('/requests', async (req, res) => {
    try {
        const requests = await BloodRequest.find();
        res.render('admin-requests', { requests });
    } catch (err) {
        res.status(500).send('Error retrieving requests');
    }
});

router.get("/donate-history", async (req, res) => {
  try {
      const donations = await BloodDonation.find({ status: "Completed" }).sort({ registeredAt: -1 });

      const donationHistory = donations.map(donation => ({
          ...donation.toObject(),
          type: "Blood Donation", // ✅ Adds a heading for donation
          icon: "✔", // ✅ Tick icon for UI
          profilePic: donation.gender === "Male" ? "/images/man.png" : "/images/woman.png",
          age: new Date().getFullYear() - new Date(donation.dob).getFullYear()
      }));

      res.render("adminHistory", { history: donationHistory });
  } catch (error) {
      console.error("Error fetching donation history:", error);
      res.status(500).send("Internal Server Error");
  }
});

// ✅ Route to fetch completed blood requests
router.get("/request-history", async (req, res) => {
  try {
      const requests = await BloodRequest.find({ status: "Completed" }).sort({ requestedAt: -1 });

      const requestHistory = requests.map(request => ({
          ...request.toObject(),
          type: "Blood Request", // ✅ Adds a heading for request
          icon: "✔", // ✅ Tick icon for UI
          profilePic: request.gender === "Male" ? "/images/man.png" : "/images/woman.png",
          age: new Date().getFullYear() - new Date(request.dob).getFullYear()
      }));

      res.render("adminHistory", { history: requestHistory });
  } catch (error) {
      console.error("Error fetching request history:", error);
      res.status(500).send("Internal Server Error");
  }
})

router.post("/add-blood/:scheduleId", async (req, res) => {
  try {
      const { scheduleId } = req.params;

      // Find the scheduled donation
      const schedule = await Schedule.findById(scheduleId);
      if (!schedule) return res.status(404).json({ success: false, message: "Schedule not found" });

      // Fetch donor details from `BloodDonation`
      const donation = await BloodDonation.findOne({ userId: schedule.userId });
      if (!donation) return res.status(404).json({ success: false, message: "Donation record not found" });

      // 🔹 Ensure the donation request is **accepted** before adding to confirmed schedule
      if (donation.status !== "Accepted") {
          return res.status(400).json({ success: false, message: "Donation request is not yet accepted by admin" });
      }

      const { bloodType, donationAmount, location } = donation;

      // 🔹 Ensure location exists in `BloodBank`
      let bloodEntry = await BloodBank.findOne({ location });

      if (!bloodEntry) {
          // If location not found, create a new entry
          bloodEntry = new BloodBank({
              location,
              "A+": 0, "A-": 0, "B+": 0, "B-": 0, "AB+": 0, "AB-": 0, "O+": 0, "O-": 0
          });
      }

      // ✅ Add donated amount to blood stock
      bloodEntry[bloodType] += parseInt(donationAmount);
      await bloodEntry.save();

      // ✅ Mark donation as "Completed"
      donation.status = "Completed";
      await donation.save();

      // ✅ Remove schedule entry after updating blood stock
      await Schedule.findByIdAndDelete(scheduleId);

      // ✅ Add to `ConfirmedSchedule` collection **only if accepted**
      await ConfirmedSchedule.create({
          userId: schedule.userId,
          type: "Donation",
          scheduleDate: schedule.scheduleDate
      });

      res.json({ success: true, message: `Blood added successfully to ${location} and schedule confirmed!` });
  } catch (error) {
      console.error("Error updating blood bank:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});


router.delete("/remove-schedule/:scheduleId", async (req, res) => {
    try {
        const { scheduleId } = req.params;

        // Find the schedule entry
        const schedule = await Schedule.findById(scheduleId);
        if (!schedule) {
            return res.status(404).json({ success: false, message: "Schedule not found" });
        }

        // Update the status of the associated BloodDonation entry
        await BloodDonation.findOneAndUpdate(
            { userId: schedule.userId, status: "Accepted" }, // Only update if it's "Accepted"
            { $set: { status: "Schedule Removed" } },
            { new: true }
        );

        // Delete the schedule entry
        await Schedule.findByIdAndDelete(scheduleId);

        res.json({ success: true, message: "Schedule removed and donation status updated!" });
    } catch (error) {
        console.error("Error removing schedule:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});


// Accept or Reject Blood Donation
router.post('/donations/:id/:status', async (req, res) => {
    try {
        const { id, status } = req.params;
        
       // if (status === "Accepted") status = "Approved";
        if (status !== "Accepted" && status !== "Rejected") {
            
            return res.status(400).json({ success: false, message: "Invalid status" });
        }

        await BloodDonation.findByIdAndUpdate(id, { status });
        console.log('Donation updated successfully');

        res.json({ success: true }); // No redirection
    } catch (err) {
        console.log('Donation update failed');
        res.status(500).json({ success: false, message: 'Error updating status' });
    }
});

// Accept or Reject Blood Request
router.post('/requests/:id/:status', async (req, res) => {
    try {
        const { id, status } = req.params;
        
        if (status !== "Accepted" && status !== "Rejected") {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }

        await BloodRequest.findByIdAndUpdate(id, { status });
        console.log('Request updated successfully');

        res.json({ success: true }); // No redirection
    } catch (err) {
        console.log('Request update failed');
        res.status(500).json({ success: false, message: 'Error updating status' });
    }
});


router.get("/schedule", async (req, res) => {
    try {
        console.log('redirected to schedule');

        // Function to format dates correctly
        const formatDate = (date) => {
            if (!date) return null;
            let dt = new Date(date);
            return dt.getUTCDate().toString().padStart(2, '0') + '-' +
                   (dt.getUTCMonth() + 1).toString().padStart(2, '0') + '-' +
                   dt.getUTCFullYear();
        };

        // Fetch all schedule entries
        const schedules = await Schedule.find().sort({ createdAt: -1 });

        // Fetch corresponding donation details for each scheduled entry
        const scheduleWithDonations = await Promise.all(
            schedules.map(async (schedule) => {
                const donation = await BloodDonation.findOne({ userId: schedule.userId });

                return {
                    ...schedule.toObject(),
                    donationAmount: donation ? donation.donationAmount : "Not Available",
                    name: donation ? donation.name : "Anonymous",
                    gender: donation ? donation.gender : "Unknown",
                    phone: donation ? donation.phone : "Not Provided",
                    location: donation ? donation.location : "Location Not Available",
                    bloodType: donation ? donation.bloodType : "BloodType Not Available",
                    formattedScheduleDate: formatDate(schedule.scheduleDate) // ✅ Correct Date Formatting
                };
            })
        );

        res.render("adminSchedule", { schedules: scheduleWithDonations });
    } catch (error) {
        console.error("Error fetching schedules:", error);
        res.status(500).send("Internal Server Error");
    }
});


router.delete("/remove-schedule/:id", async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ success: false, message: "Schedule not found" });
    }

    // Delete the schedule
    await Schedule.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Schedule cancelled successfully." });
  } catch (error) {
    console.error("Error removing schedule:", error);
    res.status(500).json({ success: false, message: "Failed to cancel schedule." });
  }
});



router.get("/receive-schedule", async (req, res) => {
    try {
      console.log('redirected to receive-schedule');
  
      // Function to format date properly
      const formatDate = (date) => {
          if (!date) return null;
          let dt = new Date(date);
          return dt.getUTCDate().toString().padStart(2, '0') + '-' + 
                 (dt.getUTCMonth() + 1).toString().padStart(2, '0') + '-' + 
                 dt.getUTCFullYear();
      };
  
      // Fetch all scheduled requests
      const schedules = await ScheduleRequest.find().sort({ createdAt: -1 });
  
      // Fetch corresponding request details for each scheduled entry
      const scheduleWithRequests = await Promise.all(
        schedules.map(async (schedule) => {
          const bloodRequest = await BloodRequest.findOne({ userId: schedule.userId });
          const user = await User.findById(schedule.userId);
  
          return {
            ...schedule.toObject(),
            name: bloodRequest ? bloodRequest.name : "Unknown", // ✅ Get name from BloodRequest
            phone: bloodRequest ? bloodRequest.phone : "Not Provided",
            bloodType: bloodRequest ? bloodRequest.bloodType : "Unknown",
            bloodAmount: bloodRequest ? bloodRequest.bloodAmount : "Not Specified",
            location: schedule.selectedAddress,
            gender: bloodRequest ? bloodRequest.gender : "Not Specified",
            formattedScheduleDate: formatDate(schedule.scheduleDate) // ✅ Properly formatted date
          };
        })
      );
  
      res.render("adminReceiveSchedule", { schedules: scheduleWithRequests });
    } catch (error) {
      console.error("Error fetching receive schedules:", error);
      res.status(500).send("Internal Server Error");
    }
  });
  

router.delete("/remove-request/:scheduleId", async (req, res) => {
    try {
        const scheduleId = req.params.scheduleId;
        console.log('Redirected to remove-request for:', scheduleId);
  
        if (!mongoose.Types.ObjectId.isValid(scheduleId)) {
            console.log("Invalid Schedule ID:", scheduleId);
            return res.status(400).json({ success: false, message: "Invalid Schedule ID!" });
        }
  
        const schedule = await ScheduleRequest.findById(scheduleId);
        if (!schedule) {
            console.log("Schedule not found with ID:", scheduleId);
            return res.status(404).json({ success: false, message: "Schedule not found!" });
        }
  
        console.log("Deleting schedule for user:", schedule.userId);
  
        // ✅ Update BloodRequest: Store last scheduled date & change status
        const updateResult = await BloodRequest.updateOne(
            { userId: schedule.userId },
            { 
                $set: { 
                    status: "Schedule Removed" 
                }
            }
        );
  
        console.log("Updated BloodRequest with last scheduled date:", schedule.scheduleDate, "Update result:", updateResult);
  
        // ✅ Delete the schedule
        const deleteResult = await ScheduleRequest.deleteOne({ _id: scheduleId });
  
        if (deleteResult.deletedCount === 0) {
            console.log("Failed to delete schedule:", scheduleId);
            return res.status(500).json({ success: false, message: "Failed to delete schedule!" });
        }
  
        console.log("Schedule deleted successfully!");
        res.json({ success: true, message: "Schedule canceled successfully!" });
  
    } catch (error) {
        console.error("Error canceling schedule:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });
  
  


router.post("/receive-blood/:scheduleId", async (req, res) => {
  try {
      const { scheduleId } = req.params;

      // Find the schedule request
      const schedule = await ScheduleRequest.findById(scheduleId);
      if (!schedule) return res.status(404).json({ success: false, message: "Schedule not found" });

      const { bloodType, bloodAmount, userId, scheduleDate } = schedule;

      // Find the corresponding blood request
      const bloodRequest = await BloodRequest.findOne({ userId });
      if (!bloodRequest) return res.status(404).json({ success: false, message: "Blood request not found" });

      const location = schedule.location;

      // Fetch blood bank details
      const bloodBank = await BloodBank.findOne({ location });

      if (!bloodBank) return res.status(404).json({ success: false, message: "No blood bank found in this location" });

      // Debugging log
      console.log(`🔍 Blood Bank Data for ${location}:`, bloodBank);
      console.log(`⚡ Requested Blood Type: ${bloodType}, Stored Amount:`, bloodBank[bloodType]);

      // Ensure the blood type exists and is a valid number
      const availableBlood = Number(bloodBank[bloodType]) || 0;
      const amountToRemove = parseInt(bloodAmount, 10);

      if (isNaN(amountToRemove) || amountToRemove <= 0) {
          return res.status(400).json({ success: false, message: "Invalid blood amount" });
      }

      // Check available stock
      if (availableBlood < amountToRemove) {
          return res.status(400).json({ 
              success: false, 
              message: `Not enough ${bloodType} blood available. Available: ${availableBlood} mL, Requested: ${amountToRemove} mL` 
          });
      }

      // Deduct blood from stock
      bloodBank[bloodType] -= amountToRemove;
      bloodBank.lastUpdated = new Date();
      await bloodBank.save();

      // Mark request as completed
      await BloodRequest.findOneAndUpdate({ userId }, { status: "Completed" });

      // Confirm schedule
      await ConfirmedSchedule.create({
          userId,
          type: "Request",
          scheduleDate,
          bloodType,
          bloodAmount,
          location
      });

      // Remove schedule
      await ScheduleRequest.findByIdAndDelete(scheduleId);

      res.json({ success: true, message: `✅ Blood allocated successfully from ${location} for type ${bloodType}!` });

  } catch (error) {
      console.error("🚨 Error allocating blood:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});






module.exports = router;
