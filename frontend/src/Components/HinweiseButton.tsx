import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const HinweiseButton: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Wenn wir schon auf /hinweise sind → Button nicht anzeigen
  if (location.pathname === "/hinweise") {
    return null;
  }

  return (
    <button
      className="df-link"
      type="button"
      onClick={() => navigate("/hinweise")}
    >
      Hinweise
    </button>
  );
};

export default HinweiseButton;
