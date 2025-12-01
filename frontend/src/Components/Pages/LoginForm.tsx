import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/LoginForm.css";
import { useAuth } from "../Config/AuthContext";

interface loginFormData {
  username: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<loginFormData>({
    username: "",
    password: "",
  });

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "DigiForm – Anmeldung";

    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  console.log("API_BASE_URL =", API_BASE_URL);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Anmeldung fehlgeschlagen");
      }

      const data = await response.json();
      //JWT speichern
      login(data.access, data.refresh);

      //redirect auf Dashboard
      navigate("/dashboard");

      setSuccessMessage("Anmeldung erfolgreich.");
      setFormData({
        username: "",
        password: "",
      });
    } catch (err) {
      console.error(err);
      setErrorMessage(
        "Anmeldung fehlgeschlagen. Bitte überprüfe deine Eingaben und versuche es erneut."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="login-wrapper">
      <div className="login-card">
        <h1>Anmelden</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-field">
            <span>Benutzername</span>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </label>

          <label className="login-field">
            <span>Passwort</span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>

          {successMessage && <p className="login-success">{successMessage}</p>}
          {errorMessage && <p className="login-error">{errorMessage}</p>}

          <button
            className="login-submit"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Wird gesendet…" : "Anmelden"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default LoginForm;
