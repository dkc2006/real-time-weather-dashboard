import React from "react";
import "./SearchHistory.css";

const SearchHistory = ({ history, onItemClick }) => {
  // Format timestamp to relative time (e.g., "2 minutes ago")
  const formatTimeAgo = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const secondsAgo = Math.floor((now - date) / 1000);

    if (secondsAgo < 60) {
      return "just now";
    } else if (secondsAgo < 3600) {
      const minutes = Math.floor(secondsAgo / 60);
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else if (secondsAgo < 86400) {
      const hours = Math.floor(secondsAgo / 3600);
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(secondsAgo / 86400);
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    }
  };

  return (
    <div className="search-history">
      <h3>Recent Searches</h3>
      <ul className="history-list">
        {history.map((item, index) => (
          <li key={index} className="history-item">
            <button
              onClick={() => onItemClick(`${item.city}, ${item.country}`)}
              className="history-button"
            >
              <span className="history-city">
                {item.city}, {item.country}
              </span>
              <span className="history-time">
                {formatTimeAgo(item.timestamp)}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchHistory;
