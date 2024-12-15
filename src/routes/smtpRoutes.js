const express = require("express");
const {
  saveSmtpSettings,
  getSmtpSettings,
  sendEmail,
  sendBulkEmails,
} = require("../controllers/smtpController");
const nodemailer = require("nodemailer");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/")
  .post(protect, saveSmtpSettings) // Save or update SMTP settings
  .get(protect, getSmtpSettings);  // Retrieve SMTP settings

router.post("/send", protect, sendEmail); // Send email

router.post("/send-bulk", protect, sendBulkEmails); // Send bulk emails


module.exports = router;
