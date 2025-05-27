import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Grid,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Snackbar,
    Alert,
  } from "@mui/material";
  import { useState } from "react";
  import { addPatient } from "../../services/clinicAdminServices";
  
  export default function AddPatientPage({ doctors, sensorKits, onPatientAdded }) {
    const [patient, setPatient] = useState({
      name: "",
      nic: "",
      email: "",
      phoneNumber: "",
      age: "",
      height: "",
      weight: "",
      gender: "",
      username: "",
      password: "",
      doctorId: "",
      sensorKitId: "",
    });
  
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  
    const handleChange = (field) => (e) => {
      setPatient({ ...patient, [field]: e.target.value });
    };
  
    const handleSubmit = async () => {
      try {
        const payload = {
          ...patient,
          age: parseInt(patient.age),
          height: parseFloat(patient.height),
          weight: parseFloat(patient.weight),
        };
        await addPatient(payload);
        setSnackbar({ open: true, message: "Patient added successfully", severity: "success" });
        setPatient({
          name: "",
          nic: "",
          email: "",
          phoneNumber: "",
          age: "",
          height: "",
          weight: "",
          gender: "",
          username: "",
          password: "",
          doctorId: "",
          sensorKitId: "",
        });
        if (onPatientAdded) onPatientAdded();
      } catch (err) {
        setSnackbar({ open: true, message: "Failed to add patient", severity: "error" });
      }
    };
  
    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });
  
    return (
      <Box>
        <Typography variant="h6" gutterBottom>Add New Patient</Typography>
  
        <Paper sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Name" value={patient.name} onChange={handleChange("name")} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="NIC" value={patient.nic} onChange={handleChange("nic")} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Email" value={patient.email} onChange={handleChange("email")} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Phone Number" value={patient.phoneNumber} onChange={handleChange("phoneNumber")} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Age" type="number" value={patient.age} onChange={handleChange("age")} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Height (cm)" type="number" value={patient.height} onChange={handleChange("height")} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Weight (kg)" type="number" value={patient.weight} onChange={handleChange("weight")} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select value={patient.gender} label="Gender" onChange={handleChange("gender")}>
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Username" value={patient.username} onChange={handleChange("username")} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="password" label="Password" value={patient.password} onChange={handleChange("password")} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Assign Doctor</InputLabel>
                <Select value={patient.doctorId} label="Assign Doctor" onChange={handleChange("doctorId")}>
                  {doctors.map((doc) => (
                    <MenuItem key={doc.id} value={doc.id}>{doc.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Assign Sensor Kit</InputLabel>
                <Select value={patient.sensorKitId} label="Assign Sensor Kit" onChange={handleChange("sensorKitId")}>
                  {sensorKits.map((kit) => (
                    <MenuItem key={kit.id} value={kit.id}>
                      {kit.serialNo} - v{kit.firmwareVersion}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
  
          <Box mt={3} display="flex" gap={2}>
            <Button variant="contained" onClick={handleSubmit}>
              Add Patient
            </Button>
            <Button variant="outlined" color="secondary" onClick={() => setPatient({
              name: "",
              nic: "",
              email: "",
              phoneNumber: "",
              age: "",
              height: "",
              weight: "",
              gender: "",
              username: "",
              password: "",
              doctorId: "",
              sensorKitId: "",
            })}>
              Clear
            </Button>
          </Box>
        </Paper>
  
        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar}>
          <Alert severity={snackbar.severity} onClose={handleCloseSnackbar} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    );
  }
  