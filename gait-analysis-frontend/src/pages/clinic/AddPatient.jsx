import { useEffect, useState } from "react";
import axios from "axios";

export default function AddPatient() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
    phoneNumber: "",
    height: "",
    weight: "",
    gender: "MALE",
    username: "",
    password: "",
    doctorId: "",
    sensorKitId: "",
  });

  const [doctors, setDoctors] = useState([]);
  const [kits, setKits] = useState([]);

  useEffect(() => {
    // fetch doctors and sensor kits
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const doctorRes = await axios.get("/api/clinic/doctors", { headers: { Authorization: `Bearer ${token}` } });
        const kitRes = await axios.get("/api/clinic/available-kits", { headers: { Authorization: `Bearer ${token}` } });
        setDoctors(doctorRes.data);
        setKits(kitRes.data);
      } catch (e) {
        console.error("Error loading dropdowns", e);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/clinic/create-patient", form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      alert("✅ Patient created");
      setForm({
        name: "", email: "", age: "", phoneNumber: "", height: "", weight: "", gender: "MALE",
        username: "", password: "", doctorId: "", sensorKitId: ""
      });
    } catch (err) {
      console.error(err);
      alert("❌ Failed to create patient");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 500, margin: "auto" }}>
      <h2>Register New Patient</h2>

      <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
      <input name="age" placeholder="Age" value={form.age} onChange={handleChange} required />
      <input name="phoneNumber" placeholder="Phone Number" value={form.phoneNumber} onChange={handleChange} required />
      <input name="height" placeholder="Height (cm)" value={form.height} onChange={handleChange} required />
      <input name="weight" placeholder="Weight (kg)" value={form.weight} onChange={handleChange} required />

      <label>Gender</label>
      <select name="gender" value={form.gender} onChange={handleChange}>
        <option value="MALE">Male</option>
        <option value="FEMALE">Female</option>
        <option value="OTHER">Other</option>
      </select>

      <hr />
      <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />

      <label>Assign Doctor</label>
      <select name="doctorId" value={form.doctorId} onChange={handleChange}>
        <option value="">-- Select Doctor --</option>
        {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
      </select>

      <label>Assign Sensor Kit</label>
      <select name="sensorKitId" value={form.sensorKitId} onChange={handleChange}>
        <option value="">-- Select Kit --</option>
        {kits.map(k => <option key={k.id} value={k.id}>{k.serialNumber}</option>)}
      </select>

      <br /><br />
      <button type="submit">Create Patient</button>
    </form>
  );
}
