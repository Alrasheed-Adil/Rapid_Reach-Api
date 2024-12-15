const SMTP = require("../models/SMTP");
const CsvUpload = require("../models/CsvUpload");
const nodemailer = require("nodemailer");

// Save or Update SMTP Settings for the Logged-In User
const saveSmtpSettings = async (req, res) => {
  const { host, port, email, password } = req.body;

  try {
    let smtp = await SMTP.findOne({ user: req.user.id });

    if (smtp) {
      // Update existing SMTP settings
      smtp.host = host;
      smtp.port = port;
      smtp.email = email;
      smtp.password = password;
      await smtp.save();
      return res.status(200).json({ message: "SMTP settings updated successfully." });
    } else {
      // Create new SMTP settings
      smtp = new SMTP({ user: req.user.id, host, port, email, password });
      await smtp.save();
      return res.status(201).json({ message: "SMTP settings saved successfully." });
    }
  } catch (error) {
    console.error("Error saving SMTP settings:", error);
    res.status(500).json({ message: "Failed to save SMTP settings." });
  }
};

// Retrieve SMTP Settings for the Logged-In User
const getSmtpSettings = async (req, res) => {
  try {
    const smtp = await SMTP.findOne({ user: req.user.id });

    if (!smtp) {
      return res.status(404).json({ message: "SMTP settings not found." });
    }

    res.status(200).json({
      host: smtp.host,
      port: smtp.port,
      email: smtp.email,
    });
  } catch (error) {
    console.error("Error retrieving SMTP settings:", error);
    res.status(500).json({ message: "Failed to retrieve SMTP settings." });
  }
};

// Send Email Using User's SMTP Settings
const sendEmail = async (req, res) => {
  const { to, subject, text, html } = req.body;

  // Validate email content input
  if (!to || !subject || (!text && !html)) {
    return res.status(400).json({ message: "Missing required fields for email sending." });
  }

  try {
    // Fetch SMTP credentials from the database
    const smtp = await SMTP.findOne({ user: req.user.id }); // Adjust this query based on your schema
    if (!smtp) {
      return res.status(500).json({ message: "SMTP settings not found in the database." });
    }

    // const { smtpHost, smtpPort, user, pass } = smtp;

    console.log("Fetching SMTP settings:", smtp);


    // Define the transporter using fetched SMTP settings
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.host,
      secure: false, // Use secure only if port is 465
      auth: {
        user: smtp.email,
        pass: smtp.password,
      },
      logger: true, // Enable detailed logs
      debug: true,  // Enable SMTP debug output
      connectionTimeout: 60000, // 60 seconds
    });

    // Define the email options
    const mailOptions = {
      from: smtp.email, // Sender address (default to the SMTP user)
      to,
      subject,
      text,
      html,
    };

    console.log("Sending email with the following options:", mailOptions);
    // console.log(transporter);

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info);

    res.status(200).json({ message: "Email sent successfully", info });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email", error: error.message });
  }
};

const sendBulkEmails = async (req, res) => {
  const { subject, body } = req.body;

  // Validate input
  if (!subject || (!body && !html)) {
    return res.status(400).json({ message: "Missing required fields for email sending." });
  }

  // if (!recipients || !recipients.length) {
  //   return res.status(400).json({ message: "Recipients data is required." });
  // }

  try {
    // Fetch SMTP credentials from the database
    console.log("Fetching SMTP settings:");
    const smtp = await SMTP.findOne({ user: req.user.id });
    const recipients = await CsvUpload.find({ user: req.user.id });
    console.log("recipients: ", recipients);
    if (!recipients.length) {
      return res.status(400).json({ message: "No CSV data found for bulk email sending." });
    }
    if (!smtp) {
      return res.status(500).json({ message: "SMTP settings not found in the database." });
    }
    console.log("got settings! :", smtp);
    // Create the transporter
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.port === 465, // Use secure only if port is 465
      auth: {
        user: smtp.email,
        pass: smtp.password,
      },
      logger: true, // Enable detailed logs
      debug: true,  // Enable SMTP debug output
      connectionTimeout: 60000, // 60 seconds
    });
    console.log("transporter created! :",transporter);
    // Send emails to all recipients
    const results = { success: 0, failed: 0, errors: [] };

    for (const recipient of recipients) {
      try {
        const mailOptions = {
          from: smtp.email,
          to: recipient.email,
          subject,
          text: body.replace("{{name}}", recipient.name),
          html: '',
        };
        
        console.log("Sending email to:", recipient.email);
        await transporter.sendMail(mailOptions);
        results.success++;
      } catch (err) {
        console.error("Error sending email to:", recipient.email, err.message);
        results.failed++;
        results.errors.push({ email: recipient.email, error: err.message });
      }
    }

    // Respond with the results
    res.status(200).json({
      message: "Bulk email sending completed.",
      results,
    });
  } catch (error) {
    console.error("Error sending emails:", error);
    res.status(500).json({ message: "Failed to send emails.", error: error.message });
  }
};


module.exports = { saveSmtpSettings, getSmtpSettings, sendEmail,sendBulkEmails };