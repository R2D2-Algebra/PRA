import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import LoginModal from "./components/LoginModal";
import PasswordGenerator from "./components/PasswordGenerator";
import PasswordsList from "./components/PasswordsList";
import CreditCards from "./components/CreditCards";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

  return (
    <div className="app">
      <Header onLoginClick={openLogin} />
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<PasswordGenerator />} />
          <Route
            path="/credentials"
            element={
              <ProtectedRoute>
                <PasswordsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cc-info"
            element={
              <ProtectedRoute>
                <CreditCards />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <LoginModal isOpen={isLoginOpen} onClose={closeLogin} />
    </div>
  );
};

export default App;
