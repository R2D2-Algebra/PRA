import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import PasswordGenerator from "./components/PasswordGenerator";
import PasswordsList from "./components/PasswordsList";
import CreditCards from "./components/CreditCards";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal";
import SecureNotes from "./components/SecureNotes";

const App = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

  const openRegister = () => setIsRegisterOpen(true);
  const closeRegister = () => setIsRegisterOpen(false);

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
          <Route
              path="/notes"
              element={
                <ProtectedRoute>
                  <SecureNotes />
                </ProtectedRoute>
              }
            />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={closeLogin}
        onOpenRegister={() => {
          closeLogin();
          openRegister();
        }}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={closeRegister}
        onBackToLogin={() => {
          closeRegister();
          openLogin();
        }}
      />
    </div>
  );
};

export default App;
