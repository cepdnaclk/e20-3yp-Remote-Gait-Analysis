import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function RootDashboard() {
  const [clinics, setClinics] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/clinics", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        console.log("📦 API Response:", response.data);

        // Have to fix depending on actual structure
        const data = response.data;
        setClinics(Array.isArray(data) ? data : data.clinics); // ✅ handles both cases
      } catch (error) {
        console.error("Failed to fetch clinics:", error);
        alert("Could not load clinics.");
      }
    };

    fetchClinics();
  }, []);

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "auto" }}>
      <h1>Root Dashboard</h1>

      <button onClick={() => navigate("/root/add-clinic")} style={{ marginBottom: "1rem" }}>
        ➕ Add Clinic Admin
      </button>

      <h3>Registered Clinics ({clinics.length})</h3>
      <table border="1" width="100%" cellPadding={10}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Clinic Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {clinics.map(clinic => (
            <tr key={clinic.id}>
              <td>{clinic.id}</td>
              <td>{clinic.name}</td>
              <td>{clinic.email}</td>
              <td>{clinic.phoneNumber}</td>
              <td>{clinic.createdAt?.split("T")[0]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
