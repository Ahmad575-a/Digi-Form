import React from "react";
import { Routes, Route } from "react-router-dom";

import "./App.css";

import Header from "./Components/Header";
import Hero from "./Components/Hero";
import LoginChoice from "./Components/LoginChoice";
import RegisterForm from "./Components/RegisterForm";
import LoginForm from "./Components/LoginForm";
import Dashboard from "./Components/Dashboard";
import ProtectedRoute from "./Components/ProtectedRoute";
import { AuthProvider } from "./Components/AuthContext";
import HinweisePage from "./Components/HinweisePage";
import DatenschutzPage from "./Components/DatenschutzPage";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="app-root">
        <Header />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/anmelden" element={<LoginChoice />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/hinweise" element={<HinweisePage />} />
          <Route path="/datenschutz" element={<DatenschutzPage />} />
        </Routes>
      </div>
    </AuthProvider>
  );
};

export default App;
