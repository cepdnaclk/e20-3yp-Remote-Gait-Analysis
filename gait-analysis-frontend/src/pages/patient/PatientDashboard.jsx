import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Avatar,
  Divider,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DescriptionIcon from "@mui/icons-material/Description";
import PersonIcon from "@mui/icons-material/Person";

export default function PatientDashboard() {
  // Replace with API call later
  // Replace the setPatient(...) with an API call like GET /api/patient/me
  const [patient, setPatient] = useState({
    name: "Jane Perera",
    email: "jane@example.com",
    age: 34,
    gender: "FEMALE",
    phoneNumber: "0712345678",
    height: 165,
    weight: 63,
    nextAppointment: "2025-03-05",
    doctor: "Dr. Keerthi Ilukkumbura",
  });

  return (
    <Box
      sx={{
        padding: 4,
        background: "linear-gradient(to right, #1a237e, #283593)",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Welcome, {patient.name}
      </Typography>
      <Typography variant="h6" color="rgba(255,255,255,0.8)">
        Here is your health summary and latest updates.
      </Typography>

      <Grid container spacing={3} mt={3}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, backgroundColor: "#303f9f", color: "white" }}>
            <CalendarTodayIcon fontSize="large" />
            <Typography variant="h6">Next Appointment</Typography>
            <Typography variant="body1" mt={1}>
              {patient.nextAppointment}
            </Typography>
            <Typography variant="body2" color="lightgray">
              with {patient.doctor}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, backgroundColor: "#3949ab", color: "white" }}>
            <DescriptionIcon fontSize="large" />
            <Typography variant="h6">Latest Report</Typography>
            <Typography variant="body1" mt={1}>
              Reviewed on 2025-02-20
            </Typography>
            <Button variant="outlined" color="inherit" sx={{ mt: 2 }}>
              View Full Report
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, backgroundColor: "#5c6bc0", color: "white" }}>
            <PersonIcon fontSize="large" />
            <Typography variant="h6">Profile Summary</Typography>
            <Typography variant="body2">Age: {patient.age}</Typography>
            <Typography variant="body2">Height: {patient.height} cm</Typography>
            <Typography variant="body2">Weight: {patient.weight} kg</Typography>
            <Typography variant="body2">Gender: {patient.gender}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.3)" }} />

      <Paper
        sx={{
          p: 3,
          backgroundColor: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Account Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography>Email: {patient.email}</Typography>
            <Typography>Phone: {patient.phoneNumber}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography>Assigned Doctor: {patient.doctor}</Typography>
            <Button
              variant="contained"
              color="secondary"
              sx={{ mt: 2 }}
              onClick={() => alert("Navigate to feedback view")}
            >
              View Doctor Feedback
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
