const app = require("./app");
const connectDB = require("./config/db");

// Load environment variables
require("dotenv").config();

// Connect to the database
connectDB();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
