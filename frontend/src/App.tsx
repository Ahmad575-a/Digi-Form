import React from "react";
import { Routes, Route } from "react-router-dom";

import "./App.css";

import Header from "./Components/Pages/Header";
import Hero from "./Components/Pages/Hero";
import LoginChoice from "./Components/Pages/LoginChoice";
import RegisterForm from "./Components/Pages/RegisterForm";
import LoginForm from "./Components/Pages/LoginForm";
import Dashboard from "./Components/Pages/Dashboard";
import ProtectedRoute from "./Components/Config/ProtectedRoute";
import { AuthProvider } from "./Components/Config/AuthContext";
import HinweisePage from "./Components/Pages/HinweisePage";
import DatenschutzPage from "./Components/Pages/DatenschutzPage";

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
