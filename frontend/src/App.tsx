import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import './App.css';

import Header from './Components/Header';
import Hero from './Components/Hero';
import LoginChoice from './Components/LoginChoice';
import RegisterForm from './Components/RegisterForm';
import Dashboard from './Components/Dashboard';


type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem('access');

  return token ? <>{children}</> : <Navigate to="/anmelden" replace />;
};



const App: React.FC = () => {
  return (
    <div className="app-root">
      <Header />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/anmelden" element={<LoginChoice />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>

    </div>
  );
};

export default App;
