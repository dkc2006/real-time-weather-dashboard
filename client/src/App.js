import React, { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import ForecastSection from "./components/ForecastSection";
import ErrorMessage from "./components/ErrorMessage";
import SearchHistory from "./components/SearchHistory";
import ThemeToggle from "./components/ThemeToggle";
import "./App.css";

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  // Load search history and theme preference from localStorage on initial render
  useEffect(() => {
    const savedHistory = localStorage.getItem("weatherSearchHistory");
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Error parsing search history", e);
        localStorage.removeItem("weatherSearchHistory");
      }
    }

    const savedTheme = localStorage.getItem("weatherDarkMode");
    if (savedTheme) {
      setDarkMode(savedTheme === "true");
    }
  }, []);

  // Update body class when theme changes
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }

    localStorage.setItem("weatherDarkMode", darkMode);
  }, [darkMode]);

  const handleSearchResult = async (result) => {
    setWeatherData(result);
    setLoading(false);
    setError(null);

    // Add to search history
    if (result && result.city) {
      const cityEntry = {
        city: result.city,
        country: result.country,
        timestamp: new Date().toISOString(),
      };

      // Check if city already exists in history
      const updatedHistory = searchHistory.filter(
        (item) =>
          !(item.city === cityEntry.city && item.country === cityEntry.country)
      );

      // Add to beginning of array
      updatedHistory.unshift(cityEntry);

      // Limit to 5 entries
      const limitedHistory = updatedHistory.slice(0, 5);

      setSearchHistory(limitedHistory);
      localStorage.setItem(
        "weatherSearchHistory",
        JSON.stringify(limitedHistory)
      );
    }

    // Fetch forecast data if coordinates are available
    if (result && result.coordinates) {
      try {
        const forecastResponse = await fetch(
          `http://localhost:5000/api/forecast?lat=${result.coordinates.lat}&lon=${result.coordinates.lon}`
        );
        const forecastJson = await forecastResponse.json();

        if (forecastJson.success) {
          setForecastData(forecastJson.data);
        }
      } catch (err) {
        console.error("Error fetching forecast:", err);
      }
    }
  };

  const handleHistoryItemClick = async (city) => {
    // Set loading state
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/weather?city=${city}`
      );
      const data = await response.json();

      if (data.success) {
        handleSearchResult(data.data);
      } else {
        setError(data.message || "Failed to fetch weather data");
        setLoading(false);
      }
    } catch (err) {
      setError("Error loading weather from history");
      setLoading(false);
    }
  };

  const handleToggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
    setWeatherData(null);
    setForecastData(null);
    setLoading(false);
  };

  const handleLoadingState = (isLoading) => {
    setLoading(isLoading);
    if (isLoading) {
      setError(null);
    }
  };

  return (
    <div className={`app ${darkMode ? "dark-theme" : "light-theme"}`}>
      <header className="app-header">
        <h1>Weather Dashboard</h1>
        <ThemeToggle darkMode={darkMode} onToggle={handleToggleTheme} />
      </header>

      <main className="app-main">
        <div className="search-container">
          <SearchBar
            onSearchResult={handleSearchResult}
            onError={handleError}
            onLoading={handleLoadingState}
          />

          {searchHistory.length > 0 && (
            <SearchHistory
              history={searchHistory}
              onItemClick={handleHistoryItemClick}
            />
          )}
        </div>

        {loading && <div className="loading">Loading weather data...</div>}
        {error && <ErrorMessage message={error} />}

        {weatherData && (
          <div className="weather-container">
            <WeatherCard data={weatherData} />

            {forecastData && (
              <ForecastSection forecast={forecastData.forecast} />
            )}
          </div>
        )}

        {!weatherData && !loading && !error && (
          <div className="initial-message">
            Enter a city name to get the current weather
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Weather Dashboard &copy; 2025</p>
      </footer>
    </div>
  );
}

export default App;
