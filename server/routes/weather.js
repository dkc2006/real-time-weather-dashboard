const express = require("express");
const axios = require("axios");
const router = express.Router();

// Current weather endpoint
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
      coordinates: {
        lat: response.data.coord.lat,
        lon: response.data.coord.lon,
      },
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

// 5-day forecast endpoint
router.get("/forecast", async (req, res) => {
  try {
    const { lat, lon } = req.query;

    // Validate parameters
    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude parameters are required",
      });
    }

    // Make request to OpenWeatherMap API for 5-day forecast
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    );

    // Process forecast data - group by day
    const forecastData = processForecastData(response.data);

    res.json({ success: true, data: forecastData });
  } catch (error) {
    console.error("Forecast API Error:", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "Error fetching forecast data",
    });
  }
});

// City autocomplete endpoint
router.get("/city-suggestions", async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim().length < 2) {
      return res.json({ success: true, data: [] });
    }

    // Using OpenWeatherMap's Geocoding API for city suggestions
    const response = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${process.env.OPENWEATHER_API_KEY}`
    );

    const suggestions = response.data.map((city) => ({
      name: city.name,
      country: city.country,
      state: city.state,
      fullName: `${city.name}${city.state ? `, ${city.state}` : ""}, ${
        city.country
      }`,
    }));

    res.json({ success: true, data: suggestions });
  } catch (error) {
    console.error("City Suggestions API Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching city suggestions",
    });
  }
});

// Helper function to process forecast data
function processForecastData(rawData) {
  const cityInfo = {
    name: rawData.city.name,
    country: rawData.city.country,
  };

  // Group by day
  const forecastByDay = {};

  rawData.list.forEach((item) => {
    // Get date without time
    const date = new Date(item.dt * 1000).toISOString().split("T")[0];

    if (!forecastByDay[date]) {
      forecastByDay[date] = {
        date,
        day: new Date(date).toLocaleDateString(undefined, { weekday: "long" }),
        temps: [],
        weather: [],
        icons: [],
        wind: [],
      };
    }

    forecastByDay[date].temps.push(item.main.temp);
    forecastByDay[date].weather.push(item.weather[0].main);
    forecastByDay[date].icons.push(item.weather[0].icon);
    forecastByDay[date].wind.push(item.wind.speed);
  });

  // Process each day to get summary data
  const forecastDays = Object.values(forecastByDay).map((day) => {
    // Get most common weather condition and icon
    const weatherFrequency = {};
    const iconFrequency = {};

    day.weather.forEach((w, index) => {
      weatherFrequency[w] = (weatherFrequency[w] || 0) + 1;
      iconFrequency[day.icons[index]] =
        (iconFrequency[day.icons[index]] || 0) + 1;
    });

    const mainWeather = Object.entries(weatherFrequency).sort(
      (a, b) => b[1] - a[1]
    )[0][0];

    const mainIcon = Object.entries(iconFrequency).sort(
      (a, b) => b[1] - a[1]
    )[0][0];

    return {
      date: day.date,
      day: day.day,
      temp_max: Math.round(Math.max(...day.temps)),
      temp_min: Math.round(Math.min(...day.temps)),
      temp_avg: Math.round(
        day.temps.reduce((sum, temp) => sum + temp, 0) / day.temps.length
      ),
      weather: mainWeather,
      icon: mainIcon,
      wind_speed:
        Math.round(
          (day.wind.reduce((sum, speed) => sum + speed, 0) / day.wind.length) *
            10
        ) / 10,
    };
  });

  // Limit to 5 days
  const limitedForecast = forecastDays.slice(0, 5);

  return {
    city: cityInfo,
    forecast: limitedForecast,
  };
}

module.exports = router;
