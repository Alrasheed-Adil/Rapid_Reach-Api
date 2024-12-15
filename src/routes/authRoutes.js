const express = require("express");
const oauth2Client = require("../utils/googleOAuth");
const User = require("../models/User"); // Assuming user model exists
const jwt = require("jsonwebtoken");

const router = express.Router();

module.exports = router;
