import { useParams } from "react-router-dom";
import { Box, Typography, Paper, Divider } from "@mui/material";

export default function TestResult() {
  const { id } = useParams();

  // Replace with real API call later
  const mockResult = {
    id,
    date: "2025-02-20",
    status: "Reviewed",
    strideLength: "0.8 m",
    cadence: "110 steps/min",
    supportTime: "0.6 sec",
    ankleAngle: "12°",
    comments: "Improved balance and support time compared to last session.",
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Gait Test Report
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Test ID: {mockResult.id}</Typography>
        <Typography>Date: {mockResult.date}</Typography>
        <Typography>Status: {mockResult.status}</Typography>
        <Divider sx={{ my: 2 }} />
        <Typography>Stride Length: {mockResult.strideLength}</Typography>
        <Typography>Cadence: {mockResult.cadence}</Typography>
        <Typography>Single Support Time: {mockResult.supportTime}</Typography>
        <Typography>Ankle Angle: {mockResult.ankleAngle}</Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1">Doctor's Comments:</Typography>
        <Typography>{mockResult.comments}</Typography>
      </Paper>
    </Box>
  );
}
