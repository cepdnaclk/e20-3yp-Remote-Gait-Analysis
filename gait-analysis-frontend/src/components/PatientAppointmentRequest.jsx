import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Chip,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import axios from "../services/axiosInstance"; // adjust path based on your setup

const PatientAppointmentRequest = ({ patient }) => {
  const [requestedTime, setRequestedTime] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [appointmentHistory, setAppointmentHistory] = useState([]);

  // Fetch past requests
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get("/appointments/my-requests");
        setAppointmentHistory(res.data);
      } catch (err) {
        console.error("Failed to fetch appointments", err);
      }
    };
    fetchAppointments();
  }, []);

  const handleSubmit = async () => {
    if (!requestedTime) {
      setErrorMsg("Please select a date and time.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/appointments/request", {
        patientId: patient.id,
        doctorId: patient.doctorId,
        requestedTime,
        reason,
      });

      setSuccessMsg("Appointment request sent!");
      setRequestedTime("");
      setReason("");
      setErrorMsg("");

      // Refresh history
      const res = await axios.get("/appointments/my-requests");
      setAppointmentHistory(res.data);
    } catch (err) {
      console.error(err);
      setErrorMsg("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>
        Request an Appointment
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Preferred Date & Time"
                type="datetime-local"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={requestedTime}
                onChange={(e) => setRequestedTime(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Reason (optional)"
                placeholder="e.g., Follow-up, Pain in ankle..."
                fullWidth
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </Grid>
          </Grid>

          {errorMsg && <Alert severity="error" sx={{ mt: 2 }}>{errorMsg}</Alert>}
          {successMsg && <Alert severity="success" sx={{ mt: 2 }}>{successMsg}</Alert>}

          <Box mt={3}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : "Send Request"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Divider sx={{ mb: 3 }} />

      <Typography variant="h6" fontWeight={600} mb={2}>
        Appointment Request History
      </Typography>

      {appointmentHistory.length === 0 ? (
        <Typography color="text.secondary">No previous requests found.</Typography>
      ) : (
        <Grid container spacing={2}>
          {appointmentHistory.map((appt) => (
            <Grid item xs={12} md={6} key={appt.id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="subtitle1" fontWeight={600}>
                      {new Date(appt.requestedTime).toLocaleString()}
                    </Typography>
                    <Chip
                      label={appt.status}
                      size="small"
                      color={
                        appt.status === "Pending"
                          ? "warning"
                          : appt.status === "Approved"
                          ? "success"
                          : "error"
                      }
                    />
                  </Box>
                  <Typography variant="body2" mt={1}>
                    {appt.reason || "No reason provided"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default PatientAppointmentRequest;
