import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import ThemeToggle from "./ThemeToggle";
import { useTranslation } from "react-i18next";

const LangSelectorMenu = () => {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const current = (i18n.language || "en").toUpperCase();

  const toggle = (e) => {
    e.stopPropagation();
    setOpen((o) => !o);
  };
  const pick = (lng) => (e) => {
    e.stopPropagation();
    i18n.changeLanguage(lng);
    setOpen(false);
  };

  return (
    <div className="lang-selector" style={{ position: "relative" }} onClick={(e)=>e.stopPropagation()}>
      <button type="button" className="btn btn-outline-primary" onClick={toggle}>
        {t("common.language", "Language")}: {current}
      </button>

      {open && (
        <div
          className="lang-menu"
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            boxShadow: "var(--shadow)",
            padding: 6,
            display: "flex",
            gap: 6,
            zIndex: 10,
          }}
        >
          <button type="button" className="btn btn-outline-primary" onClick={pick("en")}>EN</button>
          <button type="button" className="btn btn-outline-primary" onClick={pick("hr")}>HR</button>
          <button type="button" className="btn btn-outline-primary" onClick={pick("de")}>DE</button>
        </div>
      )}
    </div>
  );
};

const Header = ({ onLoginClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const closeMenu = () => setIsMenuOpen(false);

  const NavButton = ({ to, children }) => (
    <NavLink to={to} className="btn btn-outline-primary" onClick={closeMenu}>
      {children}
    </NavLink>
  );

  return (
    <header className="header">
      <div className="header-left">
        <img src="../../pass.png" alt="Logo" className="logo" />
        <span className="site-title">PassKeep</span>
      </div>
      <div className="header-right desktop-menu">
        {user ? (
          <button className="btn btn-outline-danger" onClick={logout}>Logout</button>
        ) : (
          <button className="btn btn-primary" onClick={onLoginClick}>Login</button>
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
        <div className="app-dropdown" onClick={(e)=>e.stopPropagation()}>
          {user ? (
            <>
              <NavButton to="/">Generator</NavButton>
              <NavButton to="/credentials">Passwords</NavButton>
              <NavButton to="/cc-info">Card Info</NavButton>
              <NavButton to="/notes">Notes</NavButton>
              <button className="btn btn-outline-danger" onClick={() => { logout(); closeMenu(); }}>
                Logout
              </button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={() => { onLoginClick(); closeMenu(); }}>
              Login
            </button>
          )}

          <ThemeToggle />
          <LangSelectorMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
