import { useState } from "react";
import axios from "axios";

export default function AddClinicAdmin() {
  const [formData, setFormData] = useState({
    clinicName: "",
    clinicEmail: "",
    clinicPhone: "",
    adminUsername: "",
    adminEmail: "",
    adminPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/root/create-clinic", {
        clinic: {
          name: formData.clinicName,
          email: formData.clinicEmail,
          phoneNumber: formData.clinicPhone,
        },
        admin: {
          username: formData.adminUsername,
          email: formData.adminEmail,
          password: formData.adminPassword,
        }
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });

      alert("✅ Clinic admin created successfully");
      setFormData({
        clinicName: "",
        clinicEmail: "",
        clinicPhone: "",
        adminUsername: "",
        adminEmail: "",
        adminPassword: "",
      });
    } catch (err) {
      console.error(err);
      alert("❌ Failed to create clinic admin");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 500, margin: "auto" }}>
      <h2>Create Clinic Admin</h2>

      <label>Clinic Name</label>
      <input name="clinicName" required onChange={handleChange} value={formData.clinicName} />

      <label>Clinic Email</label>
      <input name="clinicEmail" type="email" required onChange={handleChange} value={formData.clinicEmail} />

      <label>Clinic Phone</label>
      <input name="clinicPhone" required onChange={handleChange} value={formData.clinicPhone} />

      <hr />

      <label>Admin Username</label>
      <input name="adminUsername" required onChange={handleChange} value={formData.adminUsername} />

      <label>Admin Email</label>
      <input name="adminEmail" type="email" required onChange={handleChange} value={formData.adminEmail} />

      <label>Admin Password</label>
      <input name="adminPassword" type="password" required onChange={handleChange} value={formData.adminPassword} />

      <br /><br />
      <button type="submit">Create Clinic Admin</button>
    </form>
  );
}
