import { useParams } from "react-router-dom";
import { Typography, Box, Paper } from "@mui/material";
import { usePatients } from "../api/patients";

export default function PatientProfile() {
    const { id } = useParams(); // Get the patient ID from the URL
    const { data: patients, isLoading, error} = usePatients();

    if (isLoading)
        return <Typography>Loading Patient Data...</Typography>;

    if (error)
        return <Typography color="error">Error loading patient data</Typography>;

    // find patient by ID
    const patient = patients.find((p) => p.id.toString() === id);

    if (!patient)
        return <Typography color="error">Patient not found</Typography>;

    return (
        <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>🩺 Patient Profile</Typography>
      <Paper sx={{ padding: 3 }}>
        <Typography variant="h5">{patient.name}</Typography>
        <Typography color="text.secondary">Age: {patient.age}</Typography>
        <Typography color="text.secondary">ID: {patient.id}</Typography>
        {/* Add more patient details here */}
      </Paper>
    </Box>

    );
}