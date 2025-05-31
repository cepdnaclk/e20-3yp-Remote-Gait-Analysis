import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Grid,
  Divider,
  Button,
} from "@mui/material";
import axios from "../../services/axiosInstance";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function PatientTestResultPage() {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await axios.get(`/api/test-sessions/${id}`);
        setSession(res.data);
      } catch (err) {
        console.error("Failed to load test session", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
        <Typography ml={2}>Loading test session...</Typography>
      </Box>
    );
  }

  if (!session) {
    return <Typography sx={{ p: 4 }}>Test session not found.</Typography>;
  }

  const { results, feedback, rawSensorData } = session;
  const { avgForce, strideTimes = [] } = results;

  const chartData = {
    labels: strideTimes.map((_, index) => `Stride ${index + 1}`),
    datasets: [
      {
        label: "Stride Times (s)",
        data: strideTimes,
        borderColor: "#3f51b5",
        backgroundColor: "#7986cb",
        fill: false,
        tension: 0.2,
      },
    ],
  };

  return (
    <Box sx={{ backgroundColor: "#eeeeee", minHeight: "100vh", p: 3 }}>
      <Typography variant="h4" fontWeight="bold" color="#3f51b5" gutterBottom>
        Test Session #{session.sessionId}
      </Typography>
      <Typography variant="subtitle1" gutterBottom color="text.secondary">
        Status: {session.status} | Duration: {results.durationSeconds}s
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ backgroundColor: "#ffffff", boxShadow: 4, p: 2, borderRadius: 2 }}>
            <Typography variant="h6" color="#212121">🕒 Session Details</Typography>
            <Typography>Start Time: {new Date(session.startTime).toLocaleString()}</Typography>
            <Typography>End Time: {new Date(session.endTime).toLocaleString()}</Typography>
            <Typography>Steps: {results.steps}</Typography>
            <Typography>Cadence: {results.cadence} steps/min</Typography>
            <Typography>Balance Score: {results.balanceScore}</Typography>
            <Typography>Peak Impact: {results.peakImpact}</Typography>
            <Typography>Swing Time: {results.avgSwingTime}s</Typography>
            <Typography>Stance Time: {results.avgStanceTime}s</Typography>
            <Typography>Duration: {results.durationSeconds}s</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ backgroundColor: "#ffffff", boxShadow: 4, p: 2, borderRadius: 2 }}>
            <Typography variant="h6" color="#212121">🦶 Average Force Distribution</Typography>
            <Typography>Heel: {avgForce.heel}</Typography>
            <Typography>Midfoot: {avgForce.midfoot}</Typography>
            <Typography>Toe: {avgForce.toe}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ backgroundColor: "#ffffff", boxShadow: 4, p: 2, borderRadius: 2 }}>
            <Typography variant="h6" color="#212121" gutterBottom>📈 Stride Time Chart</Typography>
            {strideTimes.length > 0 ? (
              <Line data={chartData} />
            ) : (
              <Typography>No stride time data available.</Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ backgroundColor: "#ffffff", boxShadow: 4, p: 2, borderRadius: 2 }}>
            <Typography variant="h6" color="#212121">📄 Feedback</Typography>
            <Typography fontStyle="italic" color="text.secondary">
              {feedback?.createdAt && `Submitted on: ${new Date(feedback.createdAt).toLocaleString()}`}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography>{feedback?.notes || "No feedback provided."}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ backgroundColor: "#ffffff", boxShadow: 4, p: 2, borderRadius: 2 }}>
            <Typography variant="h6" color="#212121">📂 Session Files</Typography>
            <Box mt={1}>
              <Button
                variant="outlined"
                href={results.pressureResultsPath}
                target="_blank"
                sx={{ mr: 2 }}
              >
                View Pressure Results
              </Button>
              <Button
                variant="outlined"
                href={rawSensorData?.path}
                target="_blank"
              >
                View Raw Sensor Data
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
