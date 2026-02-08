import { useNavigate } from "react-router-dom";
import "../Styles/DashboardButton.css";
import { useAuth } from "../Config/AuthContext";

function DashboardButton() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Button nur anzeigen, wenn User eingeloggt ist
  if (!isAuthenticated) return null;

  return (
    <button
      className="dashboard-btn"
      onClick={() => navigate("/dashboard")}
      type="button"
    >
      Dashboard
    </button>
  );
}

export default DashboardButton;
