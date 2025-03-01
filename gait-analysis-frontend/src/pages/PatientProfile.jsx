import { useParams } from "react-router-dom";
import { Typography, Box, Paper, Button } from "@mui/material";
import { usePatients } from "../api/patients";
import PatientSidebar from "../components/PatientSidebar";
import { useNavigate } from "react-router-dom";


export default function PatientProfile() {
    const { id } = useParams(); // Get the patient ID from the URL
    const { data: patients, isLoading, error} = usePatients();
    const navigate = useNavigate();

    console.log("Patients Data:", patients); // ✅ Debugging Log
    console.log("Patient ID from URL:", id); // ✅ Debugging Log

    if (isLoading)
        return <Typography>Loading Patient Data...</Typography>;

    if (error)
        return <Typography color="error">Error loading patient data</Typography>;

    // find patient by ID
    const patient = patients.find((p) => p.id === Number(id));

    console.log("Found Patient:", patient); // ✅ Debugging Log

    if (!patient)
        return <Typography color="error">Patient not found</Typography>;

    return (
        <Box sx={{ display: "flex", height:"100vh", padding: 3 }}>
            {/* Left Sidebar */}
            <PatientSidebar patient={patient} />

            {/* Right Content */}
            
            <Box sx={{ flexGrow: 1, marginLeft: 3 }}>
                <Typography variant="h4">Patient Profile</Typography>
                <Typography variant="subtitle1">Welcome back, Dr. Keerthi Ilukkumbura</Typography>

                {/* Real-time Dashboard Section */}
                <Paper sx={{ padding: 2, mt: 2 }}>
                    <Typography variant="h6">Real-time Dashboard</Typography>
                    <Box sx={{marginTop:2}}>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={() => navigate(`/patients/${id}/realtime`)} // Navigate to Real-time Dashboard
                        >
                            View
                        </Button>
                    </Box>
                </Paper>

                {/* Patient Details */}

            </Box>
        </Box>

    );
}