import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const LoginModal = ({ isOpen, onClose, onOpenRegister }) => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
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

  const goRegister = () => {
    onClose();
    onOpenRegister?.();
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target.classList.contains("modal-overlay") && onClose()}
    >
      <div className="login-modal" role="dialog" aria-modal="true" aria-labelledby="loginTitle">
        <button className="close-btn" onClick={onClose} aria-label="Close">×</button>

        <form className="login-form" onSubmit={handleSubmit}>
          <h2 id="loginTitle" className="login-title">Sign In</h2>

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
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              autoFocus
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your master password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          <div className="form-options" style={{ marginBottom: "0.5rem" }}>
            <label>
              <input type="checkbox" disabled={loading} /> Remember me
            </label>
          </div>

          <div
            className="form-links"
            style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}
          >
            <button
              type="button"
              className="btn btn-link p-0"
              onClick={goRegister}
              disabled={loading}
            >
              Register
            </button>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </button>

          <div className="divider">Or with</div>

          <button
            type="button"
            className="btn-social"
            onClick={handleGmailLogin}
            aria-label="Sign in with Gmail"
            disabled={loading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                 viewBox="0 0 48 48" aria-hidden="true" style={{ marginRight: 8 }}>
              <path fill="#EA4335" d="M24 22.08L9.6 12v24h6v-12.8l8.4 5.6 8.4-5.6V36h6V12z"/>
              <path fill="#FBBC05" d="M24 22.08L9.6 12v24h6v-12.8l8.4 5.6z" opacity=".6"/>
              <path fill="#4285F4" d="M24 22.08l14.4-10.08v24h-6V23.2z" opacity=".6"/>
            </svg>
            Sign in with Gmail
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
