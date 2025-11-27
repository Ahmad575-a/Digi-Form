import React from "react";
import "./Header.css";
import logo from "../assets/digi.svg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Components/AuthContext";

import HinweiseButton from "./HinweiseButton";
import DatenschutzButton from "./DatenschutzButton";

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
        <HinweiseButton />
        <DatenschutzButton />
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
