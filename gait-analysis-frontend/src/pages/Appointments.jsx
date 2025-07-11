// src/pages/Appointments.jsx
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Grid,
  CircularProgress,
} from "@mui/material";
import AppointmentCard from "../components/AppointmentCard";

export default function Appointments() {
  const [tabIndex, setTabIndex] = useState(0);
  const [appointments, setAppointments] = useState({
    pending: [],
    upcoming: [],
    history: [],
  });
  const [loading, setLoading] = useState(true);

  const handleTabChange = (_, newIndex) => setTabIndex(newIndex);

  // Mock API call
  useEffect(() => {
    const mockFetchAppointments = async () => {
      setLoading(true);
      setTimeout(() => {
        setAppointments({
          pending: [
            {
              id: 1,
              patientName: "John Doe",
              startTime: "2025-07-11T10:00:00",
              reason: "Back pain after a fall",
              status: "PENDING",
            },
          ],
          upcoming: [
            {
              id: 2,
              patientName: "Jane Smith",
              startTime: "2025-07-12T14:30:00",
              status: "CONFIRMED",
            },
          ],
          history: [
            {
              id: 3,
              patientName: "Alice Brown",
              startTime: "2025-07-05T09:00:00",
              status: "COMPLETED",
              notes: "Steady gait, slight limp on left foot",
            },
          ],
        });
        setLoading(false);
      }, 1000);
    };

    mockFetchAppointments();
  }, []);

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
            <Typography variant="body1" ml={2}>No appointments found.</Typography>
          ) : (
            appointments[tabKeys[tabIndex]].map((appt) => (
              <Grid item xs={12} md={6} key={appt.id}>
                <AppointmentCard
                  appointment={appt}
                  type={tabKeys[tabIndex]}
                  // We'll implement these props later when backend is ready
                  onAccept={() => {}}
                  onReject={() => {}}
                  onReschedule={() => {}}
                  onAddNote={() => {}}
                />
              </Grid>
            ))
          )}
        </Grid>
      )}
    </Box>
  );
}
