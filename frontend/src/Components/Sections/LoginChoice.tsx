import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import "../Styles/LoginChoice.css";

const LoginChoice: React.FC = () => {
  useEffect(() => {
    document.title = "DigiForm – Anmeldung";
  }, []);

  const navigate = useNavigate();
  return (
    <main className="login-choice">
      <div className="login-card">
        <h1>Anmelden oder registrieren?</h1>

        <div className="login-buttons">
          <button
            type="button"
            className="login-btn"
            onClick={() => {
              navigate("/login");
            }}
          >
            Ich habe bereits ein Profil
          </button>
          <button
            type="button"
            className="login-btn"
            onClick={() => navigate("/register")}
          >
            Ich bin hier neu
          </button>
        </div>
      </div>
    </main>
  );
};

export default LoginChoice;
