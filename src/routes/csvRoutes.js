const express = require("express");

const { saveCsvData, getCsvData ,clearCsvData} = require("../controllers/csvController");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/save").post(protect,saveCsvData);

router.route("/").get(protect,getCsvData);

router.delete("/clear", protect, clearCsvData);

module.exports = router;