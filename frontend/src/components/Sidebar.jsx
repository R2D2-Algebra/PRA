import React from "react";

const Sidebar = ({ sidebarClosed, toggleSidebar }) => {
  return (
    <div className={`sidebar ${sidebarClosed ? "closed" : ""}`}>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {sidebarClosed ? "➤" : "◀"}
      </button>
      <nav className="sidebar-nav">
        <ul>
          <li><a href="#">Profile</a></li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
