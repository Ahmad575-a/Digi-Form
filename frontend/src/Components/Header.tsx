import React from "react";
import "./Header.css";
import logo from "../assets/digi.svg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Components/AuthContext";

const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    // sauberer Redirect, ohne Back ins Dashboard
    navigate("/anmelden", { replace: true });
  };

  return (
    <header className="df-header">
      <div className="df-left">
        <div className="df-logo-pill">
          <img src={logo} alt="Logo" className="df-logo-img" />
        </div>
        <span className="df-brand" onClick={() => navigate("/")}>
          DigiForm
        </span>
      </div>

      <div className="df-right">
        <a
          className="df-link"
          href="/Hinweise.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          Hinweise
        </a>
        <a
          className="df-link"
          href="/Datenschutz.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          Datenschutz
        </a>
        <button
          className="df-login-pill"
          type="button"
          onClick={isAuthenticated ? handleLogout : () => navigate("/anmelden")}
        >
          {isAuthenticated ? "Ausloggen" : "Anmelden"}
        </button>
      </div>
    </header>
  );
};

export default Header;
