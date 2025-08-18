import React from "react";

const LoginModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="login-modal">
        <button className="close-btn" onClick={onClose}>×</button>

        <form className="login-form">
          <h2 className="login-title">Sign In</h2>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" placeholder="Enter your Email" />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" placeholder="Enter your Password" />
          </div>

          <div className="form-options">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="#" className="forgot-link">Forgot password?</a>
          </div>

          <button type="submit" className="btn-submit">Sign In</button>

          <p className="signup-text">
            Don’t have an account? <a href="#">Sign Up</a>
          </p>

          <div className="divider">Or With</div>

          <div className="social-buttons">
            <button type="button" className="btn-social google">Google</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
