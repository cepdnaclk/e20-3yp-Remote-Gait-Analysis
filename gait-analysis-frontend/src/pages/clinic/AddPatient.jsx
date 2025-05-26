import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Typography,
  Select,
  InputLabel,
  FormControl
} from "@mui/material";
// Importing axios for making API requests
import axios from "axios";
// Importing React hooks for state management and side effects

import { Snackbar, Alert } from "@mui/material";

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
    nic: ""
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");


  const [doctors, setDoctors] = useState([]);
  const [kits, setKits] = useState([]);

  useEffect(() => {
    // fetch doctors and sensor kits
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const doctorRes = await axios.get("/api/clinic/doctors", { headers: { Authorization: `Bearer ${token}` } });
        const kitRes = await axios.get("/api/clinic/available-kits", { headers: { Authorization: `Bearer ${token}` } });
        console.log("Doctors:", doctorRes.data);
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
  
      setSnackbarMessage("✅ Patient created successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
  
      setForm({
        name: "", email: "", age: "", phoneNumber: "", height: "", weight: "", gender: "MALE",
        username: "", password: "", doctorId: "", sensorKitId: "", nic: ""
      });
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "❌ Failed to create patient";
      setSnackbarMessage(msg);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };
  

  return (
    <>
      <Box
        sx={{
          maxWidth: 600,
          mx: "auto",
          mt: 4,
          p: 3,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: "#fff"
        }}
      >
        <Typography variant="h5" gutterBottom>
          Register New Patient
        </Typography>
  
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </Box>
  
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              label="Age"
              name="age"
              value={form.age}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Phone Number"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              required
            />
          </Box>
  
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              label="Height (cm)"
              name="height"
              value={form.height}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Weight (kg)"
              name="weight"
              value={form.weight}
              onChange={handleChange}
              required
            />
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                label="Gender"
              >
                <MenuItem value="MALE">Male</MenuItem>
                <MenuItem value="FEMALE">Female</MenuItem>
                <MenuItem value="OTHER">Other</MenuItem>
              </Select>
            </FormControl>
          </Box>
  
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              type="password"
              label="Password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </Box>
  
          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Assign Doctor</InputLabel>
              <Select
                name="doctorId"
                value={form.doctorId}
                onChange={handleChange}
                label="Assign Doctor"
              >
                <MenuItem value="">-- Select Doctor --</MenuItem>
                {Array.isArray(doctors) &&
                  doctors.map((d) => (
                    <MenuItem key={d.id} value={d.id}>
                      {d.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
  
            <FormControl fullWidth>
              <InputLabel>Assign Sensor Kit</InputLabel>
              <Select
                name="sensorKitId"
                value={form.sensorKitId}
                onChange={handleChange}
                label="Assign Sensor Kit"
              >
                <MenuItem value="">-- Select Kit --</MenuItem>
                {Array.isArray(kits) &&
                  kits.map((k) => (
                    <MenuItem key={k.id} value={k.id}>
                      {k.serialNumber}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>
  
          <TextField
            fullWidth
            label="NIC Number"
            name="nic"
            value={form.nic}
            onChange={handleChange}
            required
          />
  
          <Button type="submit" variant="contained" size="large" sx={{ mt: 2 }}>
            Create Patient
          </Button>
        </Box>
      </Box>
  
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          severity={snackbarSeverity}
          onClose={() => setSnackbarOpen(false)}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
  
  
}
