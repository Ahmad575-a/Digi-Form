import React from 'react';
import './App.css';
import Header from './Components/Header';
import Hero from './Components/Hero';
import LoginChoice from './Components/LoginChoice';
import { Routes, Route } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <div className="app-root">
      <Header />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/anmelden" element={<LoginChoice />} />
      </Routes>

    </div>
  );
};

export default App;
