const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const weatherRoutes = require("./routes/weather");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", weatherRoutes);

// Base route
app.get("/", (req, res) => {
  res.send("Weather Dashboard API is running");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
