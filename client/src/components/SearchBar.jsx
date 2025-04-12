import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./SearchBar.css";

const SearchBar = ({ onSearchResult, onError, onLoading }) => {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const suggestionRef = useRef(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch city suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (city.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      setIsTyping(true);

      try {
        const response = await axios.get(
          `http://localhost:5000/api/city-suggestions?query=${city.trim()}`
        );

        if (response.data && response.data.success) {
          setSuggestions(response.data.data);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }

      setIsTyping(false);
    };

    // Use debounce for better performance
    const timeoutId = setTimeout(fetchSuggestions, 300);

    return () => clearTimeout(timeoutId);
  }, [city]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetchWeatherData(city);
  };

  const fetchWeatherData = async (cityQuery) => {
    // Validate input
    if (!cityQuery.trim()) {
      onError("Please enter a city name");
      return;
    }

    // Set loading state
    onLoading(true);
    setShowSuggestions(false);

    try {
      // Make API request to our backend
      const response = await axios.get(
        `http://localhost:5000/api/weather?city=${cityQuery.trim()}`
      );

      if (response.data && response.data.success) {
        onSearchResult(response.data.data);
      } else {
        onError("Failed to fetch weather data");
      }
    } catch (error) {
      console.error("Error fetching weather:", error);

      if (error.response) {
        // Server responded with error
        if (error.response.status === 404) {
          onError(
            `City "${cityQuery}" not found. Please check the spelling and try again.`
          );
        } else {
          onError(
            error.response.data?.message || "Error fetching weather data"
          );
        }
      } else if (error.request) {
        // Request made but no response
        onError("Network error. Please check your connection and try again.");
      } else {
        onError("An unexpected error occurred");
      }
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setCity(suggestion.name);
    setShowSuggestions(false);
    fetchWeatherData(suggestion.fullName);
  };

  const handleInputChange = (e) => {
    setCity(e.target.value);
    setShowSuggestions(true);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <div className="search-bar" ref={suggestionRef}>
      <form onSubmit={handleSubmit}>
        <div className="search-input-container">
          <input
            type="text"
            value={city}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            placeholder="Enter city name..."
            className="search-input"
            autoComplete="off"
          />
          {isTyping && <div className="search-loading-indicator"></div>}

          {showSuggestions && suggestions.length > 0 && (
            <ul className="suggestion-list">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <span className="suggestion-city">{suggestion.name}</span>
                  <span className="suggestion-country">
                    {suggestion.state ? `${suggestion.state}, ` : ""}
                    {suggestion.country}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
