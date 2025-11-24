import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterForm.css';

type Role = '' | 'student' | 'teacher';; 

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  role: Role;
  class_name: string;
}

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
    role: '',
    class_name: '',
  });
    const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  console.log('API_BASE_URL =', API_BASE_URL);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setFormData(prev => ({
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
      const response = await fetch(`${API_BASE_URL}/api/auth/register/`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Registrierung fehlgeschlagen');
      }

        const data = await response.json();
        //JWT speichern
        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);

        //redirect auf Dashboard
        navigate('/dashboard');


      setSuccessMessage('Registrierung erfolgreich.');
      setFormData({
        username: '',
        email: '',
        password: '',
        role: 'student',
        class_name: '',
      });
    } catch (err) {
      console.error(err);
      setErrorMessage('Registrierung fehlgeschlagen. Bitte überprüfe deine Eingaben und versuche es erneut.');
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
                    >
        <option value="" disabled hidden>Rolle auswählen…</option>
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
          {errorMessage && (
            <p className="register-error">{errorMessage}</p>
          )}

          <button
            className="register-submit"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Wird gesendet…' : 'Registrieren'}
          </button>
        </form>
      </div>
    </main>
  );
};

export default RegisterForm;
