import { useState } from "react";
import axios from "axios";

export default function AddDoctor() {
  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
    username: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/clinic/create-doctor", form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });
      alert("✅ Doctor created");
      setForm({ name: "", phoneNumber: "", username: "", email: "", password: "" });
    } catch (err) {
      console.error(err);
      alert("❌ Failed to create doctor");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 500, margin: "auto" }}>
      <h2>Register Doctor</h2>
      <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
      <input name="phoneNumber" placeholder="Phone Number" value={form.phoneNumber} onChange={handleChange} required />
      <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
      <br /><br />
      <button type="submit">Create Doctor</button>
    </form>
  );
}
