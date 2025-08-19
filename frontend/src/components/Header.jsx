import React, { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import "../style.css";

const LangSelector = () => <button className="btn btn-secondary">EN</button>;

const Header = ({ isLoggedIn, onLoginClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openLoginAndCloseMenu = () => {
    onLoginClick(); 
    setIsMenuOpen(false); 
  };

  return (
    <header className="header">
      <div className="header-left">
        <img src="../../pass.png" alt="Logo" className="logo" />
        <span className="site-title">PassKeep</span>
      </div>

      <div className="header-right desktop-menu">
        {isLoggedIn ? (
          <button className="btn btn-outline-primary" onClick={onLoginClick}>
            Profile
          </button>
        ) : (
          <button className="btn btn-primary" onClick={onLoginClick}>
            Login
          </button>
        )}
      </div>

      <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
        <button
          className="hamburger-btn"
          onClick={() => setIsMenuOpen(o => !o)}
          aria-expanded={isMenuOpen}
          aria-label="Open menu"
        >
          &#9776;
        </button>

        <div className="app-dropdown">
          <button
            className={isLoggedIn ? "btn btn-outline-primary" : "btn btn-primary"}
            onClick={openLoginAndCloseMenu}
          >
            {isLoggedIn ? "Profile" : "Login"}
          </button>

          <ThemeToggle />
          <LangSelector />
        </div>
      </div>
    </header>
  );
};

export default Header;
