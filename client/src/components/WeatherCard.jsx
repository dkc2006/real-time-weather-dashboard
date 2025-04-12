import React from "react";
import "./WeatherCard.css";

const WeatherCard = ({ data }) => {
  // Format date from timestamp
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get weather icon URL
  const getWeatherIconUrl = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  // Convert wind direction degrees to cardinal direction
  const getWindDirection = (degrees) => {
    const directions = [
      "N",
      "NNE",
      "NE",
      "ENE",
      "E",
      "ESE",
      "SE",
      "SSE",
      "S",
      "SSW",
      "SW",
      "WSW",
      "W",
      "WNW",
      "NW",
      "NNW",
    ];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  return (
    <div className="weather-card">
      <div className="weather-header">
        <h2>
          {data.city}, {data.country}
        </h2>
        <p className="weather-timestamp">
          Last updated: {formatDate(data.timestamp)}
        </p>
      </div>

      <div className="weather-body">
        <div className="weather-main">
          <img
            src={getWeatherIconUrl(data.weather.icon)}
            alt={data.weather.description}
            className="weather-icon"
          />
          <div className="temperature-container">
            <h1 className="temperature">{Math.round(data.temperature)}°C</h1>
            <p className="feels-like">
              Feels like: {Math.round(data.feels_like)}°C
            </p>
          </div>
        </div>

        <div className="weather-description">
          <h3>{data.weather.main}</h3>
          <p>{data.weather.description}</p>
        </div>

        <div className="weather-details">
          <div className="detail-item">
            <span className="detail-label">Humidity:</span>
            <span className="detail-value">{data.humidity}%</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Pressure:</span>
            <span className="detail-value">{data.pressure} hPa</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Wind Speed:</span>
            <span className="detail-value">{data.wind.speed} m/s</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Wind Direction:</span>
            <span className="detail-value">
              {getWindDirection(data.wind.direction)} ({data.wind.direction}°)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
