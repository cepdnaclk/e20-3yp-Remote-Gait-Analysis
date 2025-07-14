import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import AppointmentCard from "../components/AppointmentCard";
import {
  getDoctorPendingAppointments,
  getDoctorUpcomingAppointments,
  getDoctorHistoryAppointments,
  acceptAppointment,
  rejectAppointment,
  rescheduleAppointment,
  addNoteToAppointment,
} from "../services/doctorServices";

export default function Appointments() {
  const [tabIndex, setTabIndex] = useState(0);
  const [appointments, setAppointments] = useState({
    pending: [],
    upcoming: [],
    history: [],
  });
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleTabChange = (_, newIndex) => setTabIndex(newIndex);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const [pendingRes, upcomingRes, historyRes] = await Promise.all([
        getDoctorPendingAppointments(),
        getDoctorUpcomingAppointments(),
        getDoctorHistoryAppointments(),
      ]);

      setAppointments({
        pending: pendingRes.data,
        upcoming: upcomingRes.data.filter(a => a.status === "CONFIRMED"),
        history: historyRes.data,
      });
    } catch (error) {
      console.error("Error fetching appointments:", error);
      showSnackbar("Failed to load appointments", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleAccept = async (id) => {
    try {
      await acceptAppointment(id);
      showSnackbar("Appointment accepted");
      fetchAppointments();
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to accept appointment", "error");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectAppointment(id);
      showSnackbar("Appointment rejected");
      fetchAppointments();
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to reject appointment", "error");
    }
  };

  const handleReschedule = async (id, newTime) => {
    const paddedTime = `${newTime}:00`;
    try {
      await rescheduleAppointment(id, paddedTime);
      showSnackbar("Appointment rescheduled");
      fetchAppointments();
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to reschedule", "error");
    }
  };

  const handleAddNote = async (id, note) => {
    try {
      await addNoteToAppointment(id, note);
      showSnackbar("Note added to appointment");
      fetchAppointments();
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to add note", "error");
    }
  };

  const tabLabels = ["Pending Requests", "Upcoming", "History"];
  const tabKeys = ["pending", "upcoming", "history"];

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Appointments
      </Typography>
      <Tabs value={tabIndex} onChange={handleTabChange} sx={{ mb: 3 }}>
        {tabLabels.map((label, i) => (
          <Tab key={i} label={label} />
        ))}
      </Tabs>

      {loading ? (
        <Box display="flex" justifyContent="center" py={5}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {appointments[tabKeys[tabIndex]].length === 0 ? (
            <Typography variant="body1" ml={2}>
              No appointments found.
            </Typography>
          ) : (
            appointments[tabKeys[tabIndex]].map((appt) => (
              <Grid item xs={12} md={6} key={appt.id}>
                <AppointmentCard
                  appointment={appt}
                  type={tabKeys[tabIndex]}
                  onAccept={handleAccept}
                  onReject={handleReject}
                  onReschedule={handleReschedule}
                  onAddNote={handleAddNote}
                />
              </Grid>
            ))
          )}
        </Grid>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
