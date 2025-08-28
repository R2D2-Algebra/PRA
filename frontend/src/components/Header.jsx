import React, { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const LangSelector = () => <button className="btn btn-secondary">EN</button>;

const Header = ({ onLoginClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="header">
      <div className="header-left">
        <img src="../../pass.png" alt="Logo" className="logo" />
        <span className="site-title">PassKeep</span>
      </div>
      <div className="header-right desktop-menu">
        {user ? (
            <button className="btn btn-outline-danger" onClick={logout}>
              Logout
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
          onClick={() => setIsMenuOpen((o) => !o)}
          aria-expanded={isMenuOpen}
          aria-label="Open menu"
        >
          &#9776;
        </button>

        <div className="app-dropdown" onClick={closeMenu}>
          {user ? (
            <>
              <NavLink to="/passwords" className="btn btn-outline-primary">
                Passwords
              </NavLink>
              <NavLink to="/cc-info" className="btn btn-outline-primary">
                CC Info
              </NavLink>
              <button className="btn btn-outline-danger" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={onLoginClick}>
              Login
            </button>
          )}

          <ThemeToggle />
          <LangSelector />
        </div>
      </div>
    </header>
  );
};

export default Header;
