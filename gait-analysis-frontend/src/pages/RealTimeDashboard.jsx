import { Box, Typography, Paper, Grid } from "@mui/material";
import { useParams } from "react-router-dom"; // ✅ To get the patient ID
import { usePatients } from "../api/patients";
// import HeatmapComponent from "../components/HeatmapComponent";
import InsoleHeatmap from "../components/heatmap/InsoleHeatmap.jsx";
import InsoleHeatmapPattern from "../components/heatmap/InsoleHeatmapPattern.jsx";
import HeatmapWebSock2 from "../components/heatmap/HeatmapWebSock2.jsx";
import WebSocketCheck from "../components/heatmap/WebSockCheck.jsx";
import HeatmapWebSock3Force from "../components/heatmap/HeatmapWebSock3Force.jsx";

export default function RealTimeDashboard() {
  const { id } = useParams(); // ✅ Get the patient ID from the URL
  const { data: patients, isLoading, error } = usePatients();

  if (isLoading) return <Typography>Loading Patient Data...</Typography>;
  if (error)
    return <Typography color="error">Error loading patient data</Typography>;

  const patient = patients.find((p) => p.id === Number(id));
  if (!patient) return <Typography color="error">Patient not found</Typography>;

  // Mock data for 16 sensors [FOR NOW]
  const generateMockSensorData = () => {
    const data = [];
    const cellSize = 125; // 500 / 4
    for (let i = 0; i < 16; i++) {
      const col = i % 4;
      const row = Math.floor(i / 4);
      // Center of each cell
      const x = col * cellSize + cellSize / 2;
      const y = row * cellSize + cellSize / 2;
      const value = Math.random() * 100; // Random pressure value
      data.push({ x, y, value });
    }
    return data;
  };

  const mockData = generateMockSensorData();
  console.log("Mock Data for Heatmap:", mockData);

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
              {/* Render Heatmap Component here */}
              {/* <HeatmapComponent  key={patient.id} data={mockData} />  */}
              {/* <InsoleHeatmapPattern /> */}
              {/* <HeatmapWebSock2 /> */}
              <HeatmapWebSock3Force />
              {/* <WebSocketCheck /> */}
              {/* <InsoleHeatmap /> */}
              {/* Pass mock data */}
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
