import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import ThemeToggle from "./ThemeToggle";

const LangSelector = () => (
  <button className="btn btn-secondary" type="button">
    EN
  </button>
);

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/" end>
              Generator
            </NavLink>
          </li>

          {user && (
            <>
              <li>
                <NavLink to="/credentials">Passwords</NavLink>
              </li>
              <li>
                <NavLink to="/cc-info">Card Info</NavLink>
              </li>
              <li>
                <NavLink to="/notes">Notes</NavLink>
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
