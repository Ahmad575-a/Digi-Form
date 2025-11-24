import React from 'react';
import './LoginChoice.css';

const LoginChoice: React.FC = () => {
  return (
    <main className="login-choice">
      <div className="login-card">
        <h1>Anmelden oder registrieren?</h1>

        <div className="login-buttons">
          <button className="login-btn">Ich habe bereits ein Profil</button>
          <button className="login-btn">Ich bin hier neu</button>
        </div>
      </div>
    </main>
  );
};

export default LoginChoice;
