import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import ThemeToggle from "./ThemeToggle";
import LangSelector from "./LangSelector";
import { useTranslation } from "react-i18next";

const Sidebar = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/" end>
              {t("nav.generator")}
            </NavLink>
          </li>

          {user && (
            <>
              <li>
                <NavLink to="/credentials">{t("nav.passwords")}</NavLink>
              </li>
              <li>
                <NavLink to="/cc-info">{t("nav.cards")}</NavLink>
              </li>
              <li>
                <NavLink to="/notes">{t("nav.notes")}</NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <ThemeToggle />
        <LangSelector />
      </div>
    </aside>
  );
};

export default Sidebar;
