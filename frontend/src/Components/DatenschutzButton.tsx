import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const DatenschutzButton: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Wenn wir schon auf /datenschutz sind → Button nicht anzeigen
  if (location.pathname === "/datenschutz") {
    return null;
  }

  return (
    <button
      className="df-link"
      type="button"
      onClick={() => navigate("/datenschutz")}
    >
      Datenschutz
    </button>
  );
};

export default DatenschutzButton;
