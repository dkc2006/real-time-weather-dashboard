import React from "react";
import "./ForecastSection.css";

const ForecastSection = ({ forecast }) => {
  // Get weather icon URL
  const getWeatherIconUrl = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  // Format date to display as "Mon, Apr 13"
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="forecast-section">
      <h2 className="forecast-heading">5-Day Forecast</h2>
      <div className="forecast-grid">
        {forecast.map((day, index) => (
          <div key={index} className="forecast-card">
            <div className="forecast-date">{formatDate(day.date)}</div>
            <div className="forecast-day">{day.day}</div>
            <img
              src={getWeatherIconUrl(day.icon)}
              alt={day.weather}
              className="forecast-icon"
            />
            <div className="forecast-temp">
              <span className="temp-max">{day.temp_max}°</span>
              <span className="temp-min">{day.temp_min}°</span>
            </div>
            <div className="forecast-weather">{day.weather}</div>
            <div className="forecast-wind">
              <span className="wind-label">Wind:</span> {day.wind_speed} m/s
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForecastSection;
