import React from "react";
import ThemeToggle from "./ThemeToggle";

const LangSelector = () => <button className="btn btn-secondary">EN</button>;

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul>
          <li><a href="#">Profile</a></li>
        </ul>

        <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
          <ThemeToggle />
          <LangSelector />
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
