const express = require("express");
const router = express.Router();
const BloodDonation = require("../models/BloodDonation");
const BloodRequest = require("../models/BloodRequest");
const Schedule = require("../models/schedule"); // ✅ Existing Schedule Model for Donation
const ScheduleRequest = require("../models/requestSchedule"); // ✅ Schedule for Blood Requests

// Middleware to check authentication
function isAuthenticated(req, res, next) {
    if (req.user) {
        return next();
    }
    res.redirect("/");
}

// Status Page Route
router.get("/", isAuthenticated, async (req, res) => {
    try {
        const userId = req.user._id;

        let donation = await BloodDonation.findOne({ userId }).lean();
        let request = await BloodRequest.findOne({ userId }).lean();
        let schedule = await Schedule.findOne({ userId }).sort({ createdAt: -1 }).lean();
        let recipientSchedule = await ScheduleRequest.findOne({ userId }).sort({ scheduleDate: -1 }).lean();

        let donationStatus = "";
        let requestStatus = "";

        let donationScheduleDate = null;
        let donationScheduleTime = null;
        let donationScheduleAddress = null;

        let requestScheduleDate = null;
        let requestScheduleTime = null;
        let requestScheduleAddress = null;

        const formatDate = (date) => {
            if (!date) return null;
            let dt = new Date(date);
            return dt.getUTCDate().toString().padStart(2, '0') + '-' + 
                   (dt.getUTCMonth() + 1).toString().padStart(2, '0') + '-' + 
                   dt.getUTCFullYear();
        };
        

        if (donation) {
            if (donation.status === "Pending") {
                donationStatus = "Pending";
            } else if (donation.status === "Accepted" && !schedule) {
                donationStatus = "Accepted_No_Schedule";
            } else if (donation.status === "Accepted" && schedule) {
                donationStatus = "Accepted_Schedule_Fixed";
                donationScheduleDate = formatDate(schedule.scheduleDate); // Use schedule date
                donationScheduleTime = schedule.timeSlot || null;
                donationScheduleAddress = schedule.address || null;
            } else if (donation.status === "Schedule Removed") {
                donationStatus = "Accepted_Schedule_Cancelled";
                donationScheduleDate = formatDate(donation.lastScheduledDate);
                donationScheduleTime = schedule ? schedule.timeSlot : null;
                donationScheduleAddress = schedule ? schedule.address : null;
            } else if (donation.status === "Rejected") {
                donationStatus = "Rejected";
            } else if (donation.status === "Completed") {
                donationStatus = "Completed";
            }

            donation = {
                ...donation,
                dateSubmitted: donation.registeredAt ? formatDate(donation.registeredAt) : "Date Not Available",
                amount: donation.donationAmount || "Not Specified",
                status: donation.status || "Unknown",
                lastScheduledDate: donationScheduleDate
            };
        } else {
            donation = null;
        }

        if (request) {
            if (request.status === "Pending") {
                requestStatus = "Pending";
            } else if (request.status === "Accepted" && !recipientSchedule) {
                requestStatus = "Accepted_No_Schedule";
            } else if (request.status === "Accepted" && recipientSchedule) {
                requestStatus = "Accepted_Schedule_Fixed";
                requestScheduleDate = formatDate(recipientSchedule.scheduleDate); // Use schedule date
                requestScheduleTime = recipientSchedule.timeSlot || null;
                requestScheduleAddress = recipientSchedule.selectedAddress || null;
            } else if (request.status === "Schedule Removed") {
                requestStatus = "Accepted_Schedule_Cancelled";
                requestScheduleDate = formatDate(request.lastScheduledDate);
                requestScheduleTime = recipientSchedule ? recipientSchedule.timeSlot : null;
                requestScheduleAddress = recipientSchedule ? recipientSchedule.selectedAddress : null;
            } else if (request.status === "Rejected") {
                requestStatus = "Rejected";
            } else if (request.status === "Completed") {
                requestStatus = "Completed";
            }

            request = {
                ...request,
                dateSubmitted: request.requestedAt ? formatDate(request.requestedAt) : "Date Not Available",
                status: request.status || "Unknown",
                lastScheduledDate: requestScheduleDate
            };
        } else {
            request = null;
        }

        if (schedule) {
            schedule.dateFixed = formatDate(schedule.scheduleDate);
        }
        if (recipientSchedule) {
            recipientSchedule.dateFixed = formatDate(recipientSchedule.scheduleDate);
        }

        res.render("status", { 
            user: req.user,
            donation, 
            request, 
            schedule, 
            recipientSchedule,
            donationStatus, 
            requestStatus,
            donationScheduleDate, 
            donationScheduleTime, 
            donationScheduleAddress,
            requestScheduleDate, 
            requestScheduleTime, 
            requestScheduleAddress
        });

    } catch (err) {
        console.error("Error fetching status:", err);
        res.status(500).send("Internal Server Error");
    }
});






module.exports = router;
