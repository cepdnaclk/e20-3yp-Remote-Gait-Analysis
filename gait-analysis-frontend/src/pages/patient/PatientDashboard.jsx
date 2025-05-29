import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DescriptionIcon from "@mui/icons-material/Description";
import PersonIcon from "@mui/icons-material/Person";
import AssessmentIcon from "@mui/icons-material/Assessment";

import { getPatientProfile } from "../../services/patientServices";

export default function PatientDashboard() {
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  // retrieve the logged in patient's ID
  //const patientId = localStorage.getItem("patientId");

  // ✅ Extract user ID from JWT
  const getLoggedInUserId = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    console.log("JWT payload:", payload);

    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id || payload.sub || null;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getPatientProfile();
        setPatient(res.data);
      } catch (err) {
        console.error("Failed to fetch patient profile", err);
      } finally {
        setLoading(false);
      }
    };
      fetchProfile();
  }, []);

  if (loading || !patient) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress color="inherit" />
        <Typography ml={2}>Loading patient dashboard...</Typography>
      </Box>
    );
  }

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
              {patient.nextAppointment || "Not Scheduled"}
            </Typography>
            <Typography variant="body2" color="lightgray">
              with {patient.doctor?.name || "N/A"}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, backgroundColor: "#3949ab", color: "white" }}>
            <DescriptionIcon fontSize="large" />
            <Typography variant="h6">Latest Report</Typography>
            <Typography variant="body1" mt={1}>
              {/* Placeholder until dynamic date added */}
              Reviewed on 2025-02-20
            </Typography>
            <Button variant="outlined" color="inherit" sx={{ mt: 2 }}>
              View Full Report
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, backgroundColor: "#7986cb", color: "white" }}>
            <AssessmentIcon fontSize="large" />
            <Typography variant="h6">Test Sessions</Typography>
            <Typography variant="body1" mt={1}>
              View and manage your gait test sessions.
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              sx={{ mt: 2 }}
              onClick={() => navigate("/patient/test-session")}
            >
              Go to Test Session
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
            <Typography>
              Assigned Doctor: {patient.doctor?.name || "Not Assigned"}
            </Typography>
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
