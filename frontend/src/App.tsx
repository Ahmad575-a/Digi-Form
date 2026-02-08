import React from "react";
import { Routes, Route } from "react-router-dom";

import "./App.css";

import Header from "./Components/Sections/Header";
import Hero from "./Components/Sections/Hero";
import LoginChoice from "./Components/Sections/LoginChoice";
import RegisterForm from "./Components/Sections/RegisterForm";
import LoginForm from "./Components/Sections/LoginForm";
import Dashboard from "./Components/Sections/Dashboard";
import ProtectedRoute from "./Components/Config/ProtectedRoute";
import { AuthProvider } from "./Components/Config/AuthContext";
import HinweisePage from "./Components/Sections/HinweisePage";
import DatenschutzPage from "./Components/Sections/DatenschutzPage";

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
