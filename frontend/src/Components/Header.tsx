// src/Components/Header.tsx
import React from 'react';
import './Header.css';
import logo from '../assets/digi.png';

const Header: React.FC = () => {
  return (
    <header className="df-header">
      {/* Links: Logo + Titel */}
      <div className="df-left">
        <div className="df-logo-pill">
            <img src={logo} alt="Logo" className="df-logo-img" />
        </div>
        <span className="df-brand">DigiForm</span>
      </div>

      {/* Rechts: Links + Button */}
      <div className="df-right">
        <button className="df-link" type="button">
          Hinweise
        </button>
        <button className="df-link" type="button">
          Datenschutz
        </button>
        <button className="df-login-pill" type="button">
          Anmelden
        </button>
      </div>
    </header>
  );
};

export default Header;
