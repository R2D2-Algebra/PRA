import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useTranslation } from "react-i18next";

const LoginModal = ({ isOpen, onClose, onOpenRegister }) => {
  const { t } = useTranslation();
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
      setErr(e.message || t("auth.loginFailed"));
    }
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
      <div
        className="login-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="loginTitle"
      >
        <button
          className="close-btn"
          onClick={onClose}
          aria-label={t("common.close")}
        >
          ×
        </button>

        <form className="login-form" onSubmit={handleSubmit}>
          <h2 id="loginTitle" className="login-title">
            {t("auth.signInTitle")}
          </h2>

          {err && (
            <div className="alert alert-danger" role="alert">
              {err}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">{t("auth.emailLabel")}</label>
            <input
              id="email"
              type="email"
              placeholder={t("auth.emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              autoFocus
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">{t("auth.passwordLabel")}</label>
            <input
              id="password"
              type="password"
              placeholder={t("auth.passwordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          <div className="form-options" style={{ marginBottom: "0.5rem" }}>
            <label>
              <input type="checkbox" disabled={loading} />{" "}
              {t("auth.rememberMe")}
            </label>
          </div>

          <div
            className="form-links"
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "1rem",
            }}
          >
            <button
              type="button"
              className="btn btn-link p-0"
              onClick={goRegister}
              disabled={loading}
            >
              {t("auth.registerLink")}
            </button>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? t("auth.signingIn") : t("auth.signIn")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
