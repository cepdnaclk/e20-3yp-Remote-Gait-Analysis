import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ClinicDashboard() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/clinics/me/doctors", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log("📦 Doctors API Response:", res.data);
        setDoctors(res.data);
      } catch (err) {
        console.error("❌ Failed to load doctors", err);
        alert("Could not fetch doctors.");
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "auto" }}>
      <h1>Clinic Admin Dashboard</h1>

      <div style={{ marginBottom: "1.5rem" }}>
        <button onClick={() => navigate("/clinic/add-doctor")}>
          ➕ Register Doctor
        </button>

        <button onClick={() => navigate("/clinic/add-patient")} style={{ marginLeft: "1rem" }}>
          ➕ Register Patient
        </button>
      </div>

      <div>
        <h3>📊 Clinic Overview</h3>
        {/* Replace with real clinic info once backend is connected */}
        <p>Clinic Name: <strong>ABC Clinic</strong></p>
        <p>Email: abc@clinic.com</p>
        <p>Phone: 0712345678</p>

        <h3 style={{ marginTop: "2rem" }}>👨‍⚕️ Registered Doctors ({doctors.length})</h3>
        <table border="1" width="100%" cellPadding={10}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Specialization</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.id}</td>
                <td>{doc.name}</td>
                <td>{doc.email}</td>
                <td>{doc.phoneNumber}</td>
                <td>{doc.specialization}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
