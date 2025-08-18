import React, { useState } from "react";
import "../style.css"; 

const LangSelector = () => <button className="btn btn-secondary">EN</button>;
const ThemeToggle = () => <button className="btn btn-secondary">🌙</button>;
const LoginModal = () => null;

const Header = ({ isLoggedIn, onLoginClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-left">
        <img src="../../pass.png" alt="Logo" className="logo" />
        <span className="site-title">PassKeep</span>
      </div>

      <div className="header-right desktop-menu">
        <LangSelector />
        <ThemeToggle />
        {isLoggedIn ? (
          <button className="btn btn-outline-primary">Profile</button>
        ) : (
          <button className="btn btn-primary" onClick={onLoginClick}>
            Login
          </button>
        )}
      </div>

      <div className="mobile-menu">
        <button
          className="hamburger"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          &#9776;
        </button>
        {isMenuOpen && (
          <div className="dropdown-menu">
            {isLoggedIn ? (
              <button className="btn btn-outline-primary">Profile</button>
            ) : (
              <button className="btn btn-primary" onClick={onLoginClick}>
                Login
              </button>
            )}
            <ThemeToggle />
            <LangSelector />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;