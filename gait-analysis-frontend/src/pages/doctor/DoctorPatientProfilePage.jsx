// src/pages/doctor/DoctorPatientProfilePage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  CircularProgress,
} from "@mui/material";
import { getDoctorPatients } from "../../services/doctorServices";

export default function DoctorPatientProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDoctorPatients()
      .then((res) => {
        const selectedPatient = res.data.find((p) => p.id === parseInt(id));
        setPatient(selectedPatient);
      })
      .catch((err) => {
        console.error("Error fetching patient", err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
        <Typography ml={2}>Loading patient profile...</Typography>
      </Box>
    );
  }

  if (!patient) {
    return (
      <Typography color="error" align="center" mt={5}>
        ❌ Patient not found
      </Typography>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Patient Profile: {patient.name}</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(`/patients/${patient.id}/realtime`)}
        >
          Go to Real-Time Gait Analysis
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Personal Details</Typography>
            <Typography><strong>Email:</strong> {patient.email}</Typography>
            <Typography><strong>Phone:</strong> {patient.phoneNumber}</Typography>
            <Typography><strong>NIC:</strong> {patient.nic}</Typography>
            <Typography><strong>Age:</strong> {patient.age}</Typography>
            <Typography><strong>Height:</strong> {patient.height} cm</Typography>
            <Typography><strong>Weight:</strong> {patient.weight} kg</Typography>
            <Typography><strong>Gender:</strong> {patient.gender}</Typography>
            <Typography><strong>Sensor Kit ID:</strong> {patient.sensorKitId}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">History</Typography>
            <Typography>Recorded on: {new Date(patient.createdAt).toLocaleString()}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Appointment History</Typography>
            <Typography>No appointment records yet.</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Report History</Typography>
            <Typography>No reports available.</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
