import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/LoginForm.css";
import { useAuth } from "../Config/AuthContext";

interface LoginFormData {
  username: string;
  password: string;
}

function LoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    document.title = "DigiForm – Anmeldung";
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      // ✅ Proxy-friendly: relative URL (wird von Vite zu http://localhost:8000 weitergeleitet)
      const response = await fetch("/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        // credentials brauchst du bei JWT meist nicht – schadet aber nicht,
        // falls dein Backend zusätzlich Cookies setzt:
        // credentials: "include",
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(
          text || `Anmeldung fehlgeschlagen (${response.status})`,
        );
      }

      const data = await response.json();

      // Erwartet: { access: "...", refresh: "..." }
      login(data.access, data.refresh);

      setSuccessMessage("Anmeldung erfolgreich.");
      setFormData({ username: "", password: "" });

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setErrorMessage(
        "Anmeldung fehlgeschlagen. Bitte überprüfe deine Eingaben und versuche es erneut.",
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
              autoComplete="username"
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
              autoComplete="current-password"
            />
          </label>

          {successMessage && <p className="login-success">{successMessage}</p>}
          {errorMessage && <p className="login-error">{errorMessage}</p>}

          <button
            className="login-submit"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Wird angemeldet…" : "Anmelden"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default LoginForm;
