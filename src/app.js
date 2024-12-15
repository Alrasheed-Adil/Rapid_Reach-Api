const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const smtpRoutes = require("./routes/smtpRoutes");
const csvRoutes = require("./routes/csvRoutes");


const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());


// Routes
app.use("/api/users", userRoutes);
app.use("/api/smtp", smtpRoutes);
app.use("/api/csv", csvRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Routes (to be implemented later)
app.use("/api/users", userRoutes);

module.exports = app;
