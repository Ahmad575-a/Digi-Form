// src/App.tsx
import React from 'react';
import './App.css';
import Header from './Components/Header';
import Hero from './Components/Hero';

const App: React.FC = () => {
  return (
    <div className="app-root">
      <Header />
      <Hero />


    </div>
  );
};

export default App;
