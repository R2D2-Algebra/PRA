import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const LoginModal = ({ isOpen, onClose, onOpenRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await login(email, password);
      onClose();
    } catch (e) {
      setErr(e.message || "Login failed");
    }
  };

  const handleGmailLogin = () => {
    console.log("Login with Gmail clicked");
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) =>
        e.target.classList.contains("modal-overlay") && onClose()
      }
    >
      <div className="login-modal">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <form className="login-form" onSubmit={handleSubmit}>
          <h2 className="login-title">Sign In</h2>

          {err && (
            <div className="alert alert-danger" role="alert">
              {err}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-options" style={{ marginBottom: "0.5rem" }}>
            <label>
              <input type="checkbox" /> Remember me
            </label>
          </div>

          <div
            className="form-links"
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "1rem",
            }}
          >
            <a href="#" className="forgot-link">
              Forgot password?
            </a>
            <button
              type="button"
              className="btn btn-link p-0"
              onClick={onOpenRegister || (() => {})}
            >
              Register
            </button>
          </div>

          <button type="submit" className="btn-submit">
            Sign In
          </button>

          <div className="divider">Or with</div>

          <button
              type="button"
              className="btn-social"
              onClick={handleGmailLogin}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                fontWeight: "600",
                background: "#fff",
                border: "1px solid #d1d5db",
                color: "#000",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#EA4335"
                  d="M24 22.08L9.6 12v24h6v-12.8l8.4 5.6 8.4-5.6V36h6V12z"
                />
                <path
                  fill="#FBBC05"
                  d="M24 22.08L9.6 12v24h6v-12.8l8.4 5.6z"
                  opacity=".6"
                />
                <path
                  fill="#4285F4"
                  d="M24 22.08l14.4-10.08v24h-6V23.2z"
                  opacity=".6"
                />
              </svg>
              Sign in with Gmail
            </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
