import { Box, Typography, Paper, Grid } from "@mui/material";
import { useParams } from "react-router-dom"; // ✅ To get the patient ID
import { usePatients } from "../api/patients";

export default function RealTimeDashboard() {
    const { id } = useParams(); // ✅ Get the patient ID from the URL
    const { data: patients, isLoading, error } = usePatients();

    if (isLoading)
        return <Typography>Loading Patient Data...</Typography>;
    if (error)
        return <Typography color="error">Error loading patient data</Typography>;

    const patient = patients.find((p) => p.id === Number(id));
    if (!patient) return <Typography color="error">Patient not found</Typography>;

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4">Real-time Dashboard - {patient.name}</Typography>

            {/* Section for displaying Heatmap, IMU Plots, Gait Graphs */}
            <Grid container spacing={3} mt={3}>
                {/* Heatmap */}
                <Grid item xs={12} sm={6} md={4}>
                    <Paper sx={{ padding: 2 }}>
                        <Typography variant="h6">Heatmap</Typography>
                        <div id="heatmap-container">
                            {/* Insert Heatmap.js component or chart here */}
                        </div>
                    </Paper>
                </Grid>

                {/* IMU Plots */}
                <Grid item xs={12} sm={6} md={4}>
                    <Paper sx={{ padding: 2 }}>
                        <Typography variant="h6">IMU Plots</Typography>
                        <div id="imu-plots">
                            {/* Insert IMU Plots component or graph here */}
                        </div>
                    </Paper>
                </Grid>

                {/* Gait Graphs */}
                <Grid item xs={12} sm={6} md={4}>
                    <Paper sx={{ padding: 2 }}>
                        <Typography variant="h6">Gait Graphs</Typography>
                        <div id="gait-graphs">
                            {/* Insert Gait Graphs component or chart here */}
                        </div>
                    </Paper>
                </Grid>
            </Grid>
        </Box>

    );


}