import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/RegisterForm.css";
import { useAuth } from "../Config/AuthContext";

type Role = "student" | "teacher";

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  role: Role;
  class_name: string;
}

function RegisterForm() {
  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    email: "",
    password: "",
    role: "student", // ✅ direkt default setzen
    class_name: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ wie beim Login nutzen (einheitlich)

  useEffect(() => {
    document.title = "DigiForm – Registrierung";
  }, []);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
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
      // ✅ Proxy-friendly: relative URL
      const response = await fetch("/api/auth/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        // credentials meist nicht nötig bei JWT:
        // credentials: "include",
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(
          text || `Registrierung fehlgeschlagen (${response.status})`,
        );
      }

      const data = await response.json();

      // Erwartet: { access: "...", refresh: "..." }
      login(data.access, data.refresh);

      setSuccessMessage("Registrierung erfolgreich.");
      setFormData({
        username: "",
        email: "",
        password: "",
        role: "student",
        class_name: "",
      });

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setErrorMessage(
        "Registrierung fehlgeschlagen. Bitte überprüfe deine Eingaben und versuche es erneut.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="register-wrapper">
      <div className="register-card">
        <h1>Konto erstellen</h1>
        <p className="register-subtitle">
          Bitte fülle alle Felder aus, um dein DigiForm-Konto zu erstellen.
        </p>

        <form className="register-form" onSubmit={handleSubmit}>
          <label className="register-field">
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

          <label className="register-field">
            <span>E-Mail</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </label>

          <label className="register-field">
            <span>Passwort</span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
          </label>

          <label className="register-field">
            <span>Rolle</span>
            <div className="register-select-wrapper">
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="register-select"
                required
              >
                <option value="student">Schüler:in</option>
                <option value="teacher">Lehrer:in</option>
              </select>
            </div>
          </label>

          <label className="register-field">
            <span>Klassenname</span>
            <input
              type="text"
              name="class_name"
              value={formData.class_name}
              onChange={handleChange}
              required
            />
          </label>

          {successMessage && (
            <p className="register-success">{successMessage}</p>
          )}
          {errorMessage && <p className="register-error">{errorMessage}</p>}

          <button
            className="register-submit"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Wird gesendet…" : "Registrieren"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default RegisterForm;
