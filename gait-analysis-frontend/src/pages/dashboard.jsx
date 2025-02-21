import { usePatients } from "../api/patients";
import { CircularProgress, Typography, Box, Grid, Paper } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {

  const navigate = useNavigate(); // hook to navigate to different pages

  // console.log("Dashboard Component Rendered!"); // Debugging log

  // Fetch patient data using the custom hook
  const { data: patients, isLoading, error } = usePatients();

  // Improved Loading UI
  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading Patient Data...</Typography>
      </Box>
    );

  // Improved Error UI
  if (error)
    return (
      <Typography color="error" align="center" mt={5}>
        ❌ Error loading data: {error.message}
      </Typography>
    );

  return (
    <Box sx={{ padding: 3 }}>
      {/* Page Title */}
      <Typography variant="h4" gutterBottom>
        🏥 Gait Analysis Physiotherapists' Dashboard
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ padding: 3, display: "flex", alignItems: "center" }}>
            <PeopleIcon sx={{ fontSize: 40, marginRight: 2 }} />
            <Box>
              <Typography variant="h6">Total Patients</Typography>
              <Typography variant="h4">{ patients?.length || 0}</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Patient List */}
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          👤 Recent Patients
        </Typography>

        {patients && patients.length > 0 ? (
          patients.map((patient) => (

            <Paper 
              key={patient.id} 
              sx={{ padding: 2, marginBottom: 2, cursor: "pointer", "&:hover": { backgroundColor: "#f5f5f5" }  }}
              onClick={() => navigate(`/patient/${patient.id}`)} // navigate to patient profile
            >
              
              <Typography variant="h6">{patient.name}</Typography>
              <Typography color="text.secondary">Age: {patient.age}</Typography>
            </Paper>
          ))
        ) : (
          <Typography>No patients found</Typography>
        )}
      </Box>
    </Box>
  );
}
