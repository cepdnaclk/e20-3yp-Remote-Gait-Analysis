import { Box, Typography, Paper, Grid, Button } from "@mui/material";
import { useParams } from "react-router-dom"; // ✅ To get the patient ID
import { useEffect, useState } from "react";
import axios from "axios";


// import HeatmapComponent from "../components/HeatmapComponent";
import InsoleHeatmap from "../components/heatmap/InsoleHeatmap.jsx";
import InsoleHeatmapPattern from "../components/heatmap/InsoleHeatmapPattern.jsx";
import HeatmapWebSock2 from "../components/heatmap/HeatmapWebSock2.jsx";
import WebSocketCheck from "../components/heatmap/WebSockCheck.jsx";
import HeatmapWebSock3Force from "../components/heatmap/HeatmapWebSock3Force.jsx";

// import HeatmapComponent from "../components/HeatmapComponent";
import RealTimeGraph from "../components/RealTimeGraph";
import YawRealTimeGraph from "../components/YawRealTimeGraph";
import Scene from "../components/Scene";

import HeatmapWebSock3ForceOptimized from "../components/heatmap/HeatmapWebSock3ForceOptimized.jsx";

export default function RealTimeDashboard() {
  const { id } = useParams(); // ✅ Get the patient ID from the URL
  
  const [patient, setPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await axios.get(`/api/patients/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setPatient(res.data);
        console.log("Patient Data:", res.data);
      } catch (err) {
        console.error("Failed to load patient", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  const [activeGraph, setActiveGraph] = useState("angles");

  if (isLoading) return <Typography>Loading Patient Data...</Typography>;
  if (error)
    return <Typography color="error">Error loading patient data</Typography>;

  // const patient = patients.find((p) => p.id === Number(id));
  if (!patient) return <Typography color="error">Patient not found</Typography>;

  console.log("Patient Data:", patient);
  return (
    <Box sx={{ padding: 3, height: "100vh" }}>
      <Typography variant="h4">Real-time Dashboard - {patient.name}</Typography>

      <Grid container spacing={3} mt={3} sx={{ height: "85vh" }}>
        {/* Heatmap - Reduce width */}
        <Grid item xs={12} sm={3} md={3} sx={{ height: "100%" }}>
          <Paper
            sx={{
              padding: 2,
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6">Heatmap</Typography>
            <Box sx={{ flexGrow: 1 }}>
              {/*<HeatmapComponent key={patient.id} data={[]} />*/}{" "}
              {/* Placeholder */}
              {/* Render Heatmap Component here */}
              {/* <HeatmapComponent  key={patient.id} data={mockData} />  */}
              {/* <InsoleHeatmapPattern /> */}
              {/* <HeatmapWebSock2 /> */}
              <HeatmapWebSock3ForceOptimized />
              {/* <HeatmapWebSock3Force /> */}
              {/* <WebSocketCheck /> */}
              {/* <InsoleHeatmap /> */}
              {/* Pass mock data */}
            </Box>
          </Paper>
        </Grid>

        {/* Graphs - Increase width */}
        <Grid item xs={12} sm={5} md={5} sx={{ height: "100%" }}>
          <Paper
            sx={{
              padding: 2,
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6">Graphs</Typography>
            <Box
              sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 2 }}
            >
              <Button
                variant={activeGraph === "angles" ? "contained" : "outlined"}
                onClick={() => setActiveGraph("angles")}
                color="primary"
              >
                Angles
              </Button>
              <Button
                variant={activeGraph === "pressure" ? "contained" : "outlined"}
                onClick={() => setActiveGraph("pressure")}
                color="secondary"
              >
                Pressure
              </Button>
            </Box>
            <Box sx={{ flexGrow: 1, minHeight: 0, overflow: "hidden" }}>
              {" "}
              {/* Ensure consistent height */}
              {activeGraph === "angles" ? (
                <YawRealTimeGraph />
              ) : (
                // <div></div>
                <RealTimeGraph />
                // <div></div>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* 3D Foot Model */}
        <Grid item xs={12} sm={4} md={4} sx={{ height: "100%" }}>
          <Paper
            sx={{
              padding: 2,
              backgroundColor: "rgba(1, 1, 1, 0.81)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" color="white">
              3D Foot Model
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
              <Scene />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
