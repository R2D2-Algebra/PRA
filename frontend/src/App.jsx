import React, { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import LoginModal from "./components/LoginModal";
import PasswordGenerator from "./components/PasswordGenerator";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

  return (
    <div className="app">
    <Header onLoginClick={openLogin} />
    <Sidebar />
    <main className="main-content">
    <PasswordGenerator />
    </main>
    <LoginModal isOpen={isLoginOpen} onClose={closeLogin} />
  </div>
  );
};

export default App;
