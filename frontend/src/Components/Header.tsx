import React from 'react';
import './Header.css';
import logo from '../assets/digi.png';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();
  return (
    <header className="df-header">
      
      <div className="df-left">
        <div className="df-logo-pill">
            <img src={logo} alt="Logo" className="df-logo-img" />
        </div>
        <span className="df-brand">DigiForm</span>
      </div>

      
      <div className="df-right">
        <button className="df-link" type="button">
          Hinweise
        </button>
        <button className="df-link" type="button">
          Datenschutz
        </button>
        <button
          className="df-login-pill"
          type="button"
          onClick={() => navigate('/anmelden')}
        >
          Anmelden
        </button>
      </div>
    </header>
  );
};

export default Header;
