import React from "react";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className="btn btn-secondary" onClick={toggleTheme} title="Toggle theme">
      {theme === "dark" ? "🌙 Dark" : "🌞 Light"}
    </button>
  );
};

export default ThemeToggle;
