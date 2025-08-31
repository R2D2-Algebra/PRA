import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const RegisterModal = ({ isOpen, onClose, onBackToLogin }) => {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState("");
  const [okMsg, setOkMsg] = useState("");
  const [busy, setBusy] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    if (!email.trim()) return "Email is required.";
    if (!pw) return "Password is required.";
    if (pw.length < 8) return "Password must be at least 8 characters.";
    if (pw !== pw2) return "Passwords do not match.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setOkMsg("");
    const v = validate();
    if (v) return setErr(v);

    try {
      setBusy(true);
      await register({ email, password: pw });
      setOkMsg("Registration successful. You can now sign in.");
    } catch (e) {
      setErr(e?.message || "Registration failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target.classList.contains("modal-overlay") && onClose()}
    >
      <div className="login-modal">
        <button className="close-btn" onClick={onClose}>×</button>

        <form className="login-form" onSubmit={handleSubmit}>
          <h2 className="login-title">Create account</h2>

          {err && <div className="alert alert-danger" role="alert">{err}</div>}
          {okMsg && <div className="alert alert-success" role="alert">{okMsg}</div>}

          <div className="form-group">
            <label htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
              type="email"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-pw">Password</label>
            <input
              id="reg-pw"
              type={showPw ? "text" : "password"}
              placeholder="Create a Password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-pw2">Confirm password</label>
            <input
              id="reg-pw2"
              type={showPw ? "text" : "password"}
              placeholder="Repeat your Password"
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="form-options" style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
            <label>
              <input
                type="checkbox"
                checked={showPw}
                onChange={(e) => setShowPw(e.target.checked)}
              />{" "}
              Show passwords
            </label>

            <button
              type="button"
              className="btn btn-link p-0"
              onClick={onBackToLogin}
            >
              Back to sign in
            </button>
          </div>

          <button type="submit" className="btn-submit" disabled={busy}>
            {busy ? "Creating…" : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;
