import React, { useState } from "react";
import "../style.css";

const Sidebar = ({ isLoggedIn, onLoginClick }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <button
        className="sidebar-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "«" : "»"}
      </button>

      <nav className="sidebar-nav">
        <ul>
          <li>
            <a href="#">Dashboard</a>
          </li>
          <li>
            <a href="#">Passwords</a>
          </li>
          <li>
            <a href="#">Credit Cards</a>
          </li>
          {isLoggedIn ? (
            <li>
              <a href="#">Profile</a>
            </li>
          ) : (
            <li>
              <button className="btn btn-primary" onClick={onLoginClick}>
                Login
              </button>
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
