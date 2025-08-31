import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import LangSelector from "./LangSelector";
import { useAuth } from "../context/AuthContext.jsx";
import { useTranslation } from "react-i18next";

const Header = ({ onLoginClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="header">
      <div className="header-left">
        <img src="../../pass.png" alt="Logo" className="logo" />
        <span className="site-title">{t("app.name", "PassKeep")}</span>
      </div>
      <div className="header-right desktop-menu">
        {user ? (
          <button className="btn btn-outline-danger" onClick={logout}>
            {t("nav.logout")}
          </button>
        ) : (
          <button className="btn btn-primary" onClick={onLoginClick}>
            {t("nav.login")}
          </button>
        )}
      </div>
      <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
        <button
          className="hamburger-btn"
          onClick={() => setIsMenuOpen((o) => !o)}
          aria-expanded={isMenuOpen}
          aria-label={t("nav.openMenu", "Open menu")}
        >
          &#9776;
        </button>

        <div className="app-dropdown" onClick={closeMenu}>
          {user ? (
            <>
              <NavLink to="/" className="btn btn-outline-primary">
                {t("nav.generator")}
              </NavLink>
              <NavLink to="/credentials" className="btn btn-outline-primary">
                {t("nav.passwords")}
              </NavLink>
              <NavLink to="/cc-info" className="btn btn-outline-primary">
                {t("nav.cards")}
              </NavLink>
              <NavLink to="/notes" className="btn btn-outline-primary">
                {t("nav.notes")}
              </NavLink>
              <button className="btn btn-outline-danger" onClick={logout}>
                {t("nav.logout")}
              </button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={onLoginClick}>
              {t("nav.login")}
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
