import React from "react";
import "./ThemeToggle.css";

const ThemeToggle = ({ darkMode, onToggle }) => {
  return (
    <div className="theme-toggle">
      <label className="switch">
        <input type="checkbox" checked={darkMode} onChange={onToggle} />
        <span className="slider round"></span>
      </label>
      <span className="toggle-label">
        {darkMode ? "Dark Mode" : "Light Mode"}
      </span>
    </div>
  );
};

export default ThemeToggle;
