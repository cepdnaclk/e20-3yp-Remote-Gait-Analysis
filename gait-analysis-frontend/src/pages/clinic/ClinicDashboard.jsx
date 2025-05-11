// Main dashboard for the clinic
import { useNavigate } from "react-router-dom";

export default function ClinicDashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "auto" }}>
      <h1>Clinic Admin Dashboard</h1>

      <button onClick={() => navigate("/clinic/add-doctor")}>
        ➕ Register Doctor
      </button>

      <button onClick={() => navigate("/clinic/add-patient")} style={{ marginLeft: "1rem" }}>
        ➕ Register Patient
      </button>

      <div style={{ marginTop: "2rem" }}>
        <h3>📊 Clinic Overview</h3>
        {/* Placeholder until backend ready */}
        <p>Clinic Name: <strong>ABC Clinic</strong></p>
        <p>Email: abc@clinic.com</p>
        <p>Phone: 0712345678</p>
        <p>Doctors: 3 | Patients: 12</p>
      </div>
    </div>
  );
}
