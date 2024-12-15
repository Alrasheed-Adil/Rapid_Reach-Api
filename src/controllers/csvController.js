const CsvUpload = require("../models/CsvUpload");

// Save Parsed CSV Data
const saveCsvData = async (req, res) => {
  const { csvData } = req.body;

  if (!csvData || !Array.isArray(csvData)) {
    return res.status(400).json({ message: "Invalid CSV data provided." });
  }

  try {
    // Clear old CSV data for the user before saving the new one
    await CsvUpload.deleteMany({ user: req.user.id });

    // Save each row of the new CSV data into the database
    const savedData = [];
    for (const row of csvData) {
      if (!row.name || !row.email) {
        return res.status(400).json({ message: "Each row must include 'name' and 'email'." });
      }

      const csvEntry = new CsvUpload({
        user: req.user.id, // Associate with the logged-in user
        name: row.name,
        email: row.email,
        // Add other fields if necessary
      });

      await csvEntry.save();
      savedData.push(csvEntry);
    }

    res.status(201).json({
      message: "CSV data saved successfully.",
      savedData,
    });
  } catch (error) {
    console.error("Error saving CSV data:", error);
    res.status(500).json({ message: "Failed to save CSV data.", error: error.message });
  }
};

// Get Saved CSV Data for the Logged-In User
const getCsvData = async (req, res) => {
  try {
    const csvEntries = await CsvUpload.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(csvEntries);
  } catch (error) {
    console.error("Error fetching CSV data:", error);
    res.status(500).json({ message: "Failed to fetch CSV data.", error: error.message });
  }
};

// Clear all CSV data for the Logged-In User
const clearCsvData = async (req, res) => {
  try {
    await CsvUpload.deleteMany({ user: req.user.id });
    res.status(200).json({ message: "All CSV data cleared successfully for the user." });
  } catch (error) {
    console.error("Error clearing CSV data:", error);
    res.status(500).json({ message: "Failed to clear CSV data.", error: error.message });
  }
};

module.exports = { saveCsvData, getCsvData, clearCsvData };
