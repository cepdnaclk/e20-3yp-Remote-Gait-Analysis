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
  InputAdornment,
  Card,
  CardContent,
  Divider,
  Container,
  Stepper,
  Step,
  StepLabel,
  Chip,
} from "@mui/material";
import { useState } from "react";
import { addPatient } from "../../services/clinicAdminServices";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import CakeIcon from "@mui/icons-material/Cake";
import HeightIcon from "@mui/icons-material/Height";
import MonitorWeightIcon from "@mui/icons-material/MonitorWeight";
import WcIcon from "@mui/icons-material/Wc";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import DevicesIcon from "@mui/icons-material/Devices";
import SaveIcon from "@mui/icons-material/Save";
import ClearIcon from "@mui/icons-material/Clear";

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

  const clearForm = () => {
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
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const isFormValid = () => {
    return patient.name && patient.email && patient.nic && patient.age && 
           patient.gender && patient.username && patient.password;
  };

  const getSelectedDoctor = () => {
    return doctors.find(doc => doc.id === patient.doctorId);
  };

  const getSelectedSensorKit = () => {
    return sensorKits.find(kit => kit.id === patient.sensorKitId);
  };

  return (
    <Container maxWidth="lg" sx={{ px: 0 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              color: "white",
            }}
          >
            <PersonAddIcon sx={{ fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight="700" sx={{ color: "text.primary" }}>
              Add New Patient
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Register a new patient and assign healthcare resources
            </Typography>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Main Form */}
        <Grid item xs={12} lg={8}>
          <Card
            sx={{
              boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
              borderRadius: 3,
              background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
              border: "1px solid rgba(226, 232, 240, 0.8)",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              {/* Personal Information Section */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" fontWeight="700" sx={{ mb: 3, color: "text.primary" }}>
                  Personal Information
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={patient.name}
                      onChange={handleChange("name")}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon sx={{ color: "text.secondary" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="National ID Card (NIC)"
                      value={patient.nic}
                      onChange={handleChange("nic")}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BadgeIcon sx={{ color: "text.secondary" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={patient.email}
                      onChange={handleChange("email")}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon sx={{ color: "text.secondary" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={patient.phoneNumber}
                      onChange={handleChange("phoneNumber")}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon sx={{ color: "text.secondary" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 4 }} />

              {/* Physical Information Section */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" fontWeight="700" sx={{ mb: 3, color: "text.primary" }}>
                  Physical Information
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Age"
                      type="number"
                      value={patient.age}
                      onChange={handleChange("age")}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CakeIcon sx={{ color: "text.secondary" }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <Typography variant="caption" color="text.secondary">years</Typography>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Height"
                      type="number"
                      value={patient.height}
                      onChange={handleChange("height")}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <HeightIcon sx={{ color: "text.secondary" }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <Typography variant="caption" color="text.secondary">cm</Typography>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Weight"
                      type="number"
                      value={patient.weight}
                      onChange={handleChange("weight")}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MonitorWeightIcon sx={{ color: "text.secondary" }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <Typography variant="caption" color="text.secondary">kg</Typography>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Gender</InputLabel>
                      <Select 
                        value={patient.gender} 
                        label="Gender" 
                        onChange={handleChange("gender")}
                        sx={{ borderRadius: 2 }}
                      >
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 4 }} />

              {/* Account & Assignment Section */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" fontWeight="700" sx={{ mb: 3, color: "text.primary" }}>
                  Account & Assignment
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Username"
                      value={patient.username}
                      onChange={handleChange("username")}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AccountCircleIcon sx={{ color: "text.secondary" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="password"
                      label="Password"
                      value={patient.password}
                      onChange={handleChange("password")}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: "text.secondary" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Assign Doctor</InputLabel>
                      <Select 
                        value={patient.doctorId} 
                        label="Assign Doctor" 
                        onChange={handleChange("doctorId")}
                        sx={{ borderRadius: 2 }}
                      >
                        {doctors.map((doc) => (
                          <MenuItem key={doc.id} value={doc.id}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <LocalHospitalIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                              {doc.name}
                              <Chip 
                                label={doc.specialization} 
                                size="small" 
                                sx={{ ml: 1, fontSize: 10 }}
                              />
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Assign Sensor Kit</InputLabel>
                      <Select 
                        value={patient.sensorKitId} 
                        label="Assign Sensor Kit" 
                        onChange={handleChange("sensorKitId")}
                        sx={{ borderRadius: 2 }}
                      >
                        {sensorKits.map((kit) => (
                          <MenuItem key={kit.id} value={kit.id}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <DevicesIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                              {kit.serialNo}
                              <Chip 
                                label={`v${kit.firmwareVersion}`} 
                                size="small" 
                                sx={{ ml: 1, fontSize: 10 }}
                              />
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 4 }}>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<ClearIcon />}
                  onClick={clearForm}
                  sx={{
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    borderColor: "rgba(148, 163, 184, 0.5)",
                    color: "text.secondary",
                    "&:hover": {
                      borderColor: "rgba(148, 163, 184, 0.8)",
                      backgroundColor: "rgba(148, 163, 184, 0.04)",
                    },
                  }}
                >
                  Clear Form
                </Button>
                
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<SaveIcon />}
                  onClick={handleSubmit}
                  disabled={!isFormValid()}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    boxShadow: "0 4px 16px rgba(16, 185, 129, 0.3)",
                    fontWeight: 600,
                    "&:hover": {
                      background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                      transform: "translateY(-1px)",
                      boxShadow: "0 8px 24px rgba(16, 185, 129, 0.4)",
                    },
                    "&:disabled": {
                      background: "rgba(0,0,0,0.12)",
                      color: "rgba(0,0,0,0.26)",
                      transform: "none",
                      boxShadow: "none",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  Add Patient
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Summary Sidebar */}
        <Grid item xs={12} lg={4}>
          <Card
            sx={{
              boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
              borderRadius: 3,
              background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
              border: "1px solid rgba(226, 232, 240, 0.8)",
              position: "sticky",
              top: 24,
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight="700" sx={{ mb: 3, color: "text.primary" }}>
                Registration Summary
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Patient Info */}
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    Patient Details
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" color={patient.name ? "text.primary" : "text.secondary"}>
                      Name: {patient.name || "Not specified"}
                    </Typography>
                    <Typography variant="body2" color={patient.age ? "text.primary" : "text.secondary"}>
                      Age: {patient.age ? `${patient.age} years` : "Not specified"}
                    </Typography>
                    <Typography variant="body2" color={patient.gender ? "text.primary" : "text.secondary"}>
                      Gender: {patient.gender || "Not specified"}
                    </Typography>
                  </Box>
                </Box>

                <Divider />

                {/* Doctor Assignment */}
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    Doctor Assignment
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {getSelectedDoctor() ? (
                      <Box sx={{ p: 2, borderRadius: 2, bgcolor: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                        <Typography variant="body2" fontWeight="600">
                          {getSelectedDoctor().name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {getSelectedDoctor().specialization}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No doctor assigned
                      </Typography>
                    )}
                  </Box>
                </Box>

                <Divider />

                {/* Sensor Kit Assignment */}
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    Sensor Kit Assignment
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {getSelectedSensorKit() ? (
                      <Box sx={{ p: 2, borderRadius: 2, bgcolor: "rgba(245, 158, 11, 0.05)", border: "1px solid rgba(245, 158, 11, 0.2)" }}>
                        <Typography variant="body2" fontWeight="600">
                          {getSelectedSensorKit().serialNo}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Firmware v{getSelectedSensorKit().firmwareVersion}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No sensor kit assigned
                      </Typography>
                    )}
                  </Box>
                </Box>

                <Divider />

                {/* Form Validation Status */}
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    Form Status
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip
                      label={isFormValid() ? "Ready to Submit" : "Missing Required Fields"}
                      size="small"
                      sx={{
                        bgcolor: isFormValid() ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
                        color: isFormValid() ? "#16a34a" : "#dc2626",
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={handleCloseSnackbar} 
          sx={{ 
            width: "100%",
            borderRadius: 2,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}