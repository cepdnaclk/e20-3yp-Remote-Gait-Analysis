import { useState } from "react";
import axios from "axios";

import {
  TextField, Button, Typography, Box, Snackbar, Alert, MenuItem
} from "@mui/material";

export default function AddDoctor() {
  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
    username: "",
    email: "",
    password: "",
    specialization: "",
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/clinics/me/doctors", form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });
      setSnackbarMessage("✅ Doctor created successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      
      setForm({ name: "", phoneNumber: "", username: "", email: "", password: "",  specialiazation: "" });
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "❌ Failed to create doctor";
      setSnackbarMessage(msg);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 500, mx: "auto", mt: 4, display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h5" gutterBottom>Register Doctor</Typography>

      <TextField name="name" label="Full Name" value={form.name} onChange={handleChange} required />
      <TextField name="phoneNumber" label="Phone Number" value={form.phoneNumber} onChange={handleChange} required />
      <TextField name="username" label="Username" value={form.username} onChange={handleChange} required />
      <TextField name="email" label="Email" type="email" value={form.email} onChange={handleChange} required />
      <TextField name="password" label="Password" type="password" value={form.password} onChange={handleChange} required />

      <TextField
        name="specialization"
        label="Specialization"
        value={form.specialization}
        onChange={handleChange}
        required
        select
      >
        <MenuItem value="">-- Select Specialization --</MenuItem>
        <MenuItem value="Physiotherapist">Physiotherapist</MenuItem>
        <MenuItem value="Orthopedic Surgeon">Orthopedic Surgeon</MenuItem>
        <MenuItem value="Neurologist">Neurologist</MenuItem>
        <MenuItem value="Other">Other</MenuItem>
      </TextField>

      <Button type="submit" variant="contained">Create Doctor</Button>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}