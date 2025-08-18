import React, { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import LoginModal from "./components/LoginModal";

const App = () => {
  const [sidebarClosed, setSidebarClosed] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarClosed(!sidebarClosed);
  };

  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

  return (
    <div>
      <Header onLoginClick={openLogin} />

      <Sidebar closed={sidebarClosed} toggleSidebar={toggleSidebar} />

      <div className={`main-content ${sidebarClosed ? "closed" : ""}`}>
        <h2>Main Content Here</h2>
        <p>This area adjusts automatically when the sidebar is collapsed.</p>
      </div>

      <LoginModal isOpen={isLoginOpen} onClose={closeLogin} />
    </div>
  );
};

export default App;
