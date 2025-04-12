const express = require("express");
const axios = require("axios");
const router = express.Router();

// Weather endpoint
router.get("/weather", async (req, res) => {
  try {
    const { city } = req.query;

    // Validate city parameter
    if (!city || city.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "City parameter is required",
      });
    }

    // Make request to OpenWeatherMap API
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    );

    // Structure the response data
    const weatherData = {
      city: response.data.name,
      country: response.data.sys.country,
      temperature: response.data.main.temp,
      feels_like: response.data.main.feels_like,
      humidity: response.data.main.humidity,
      pressure: response.data.main.pressure,
      weather: {
        main: response.data.weather[0].main,
        description: response.data.weather[0].description,
        icon: response.data.weather[0].icon,
      },
      wind: {
        speed: response.data.wind.speed,
        direction: response.data.wind.deg,
      },
      timestamp: new Date(response.data.dt * 1000).toISOString(),
    };

    res.json({ success: true, data: weatherData });
  } catch (error) {
    console.error("Weather API Error:", error.response?.data || error.message);

    // Handle errors from OpenWeatherMap API
    if (error.response?.data?.cod === "404") {
      return res.status(404).json({
        success: false,
        message: "City not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error fetching weather data",
    });
  }
});

module.exports = router;
