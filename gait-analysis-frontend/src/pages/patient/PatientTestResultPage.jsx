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

      <Grid container spacing={3} >
        <Grid item xs={12} md={6}>
          <Paper sx={{ backgroundColor: "#ffffff", boxShadow: 4, p: 2, borderRadius: 2 }}>
            <Typography variant="h6" color="#212121" fontWeight="bold" gutterBottom>
              🕒 Session Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Start Time</Typography>
                <Typography>{new Date(session.startTime).toLocaleString()}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">End Time</Typography>
                <Typography>{new Date(session.endTime).toLocaleString()}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Steps</Typography>
                <Typography>{results.steps}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Cadence</Typography>
                <Typography>{results.cadence} steps/min</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Balance Score</Typography>
                <Typography>{results.balanceScore}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Peak Impact</Typography>
                <Typography>{results.peakImpact}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Swing Time</Typography>
                <Typography>{results.avgSwingTime}s</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Stance Time</Typography>
                <Typography>{results.avgStanceTime}s</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Duration</Typography>
                <Typography>{results.durationSeconds}s</Typography>
              </Grid>

            </Grid>
            
          </Paper>
        </Grid>

      


      


        <Grid item xs={12} md={6}>
          <Paper sx={{ backgroundColor: "#ffffff", boxShadow: 4, p: 2, borderRadius: 2 }}>
            <Typography variant="h6" color="#212121" fontWeight="bold" gutterBottom>
              🦶 Average Force Distribution
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Heel</Typography>
                <Typography>{avgForce.heel}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Midfoot</Typography>
                <Typography>{avgForce.midfoot}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Toe</Typography>
                <Typography>{avgForce.toe}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid container spacing={2} mt={1} marginLeft={1}>
          {/* Stride Time Chart */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ backgroundColor: "#ffffff", boxShadow: 4, p: 2, borderRadius: 2 }}>
              <Typography variant="h6" color="#212121" fontWeight="bold" gutterBottom>📈 Stride Time Chart</Typography>
              {strideTimes.length > 0 ? (
                <Line data={chartData} />
              ) : (
                <Typography>No stride time data available.</Typography>
              )}
            </Paper>
          </Grid>

          {/* Force Over Time Chart Placeholder */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ backgroundColor: "#ffffff", boxShadow: 4, p: 2, borderRadius: 2 }}>
              <Typography variant="h6" color="#212121" fontWeight="bold" gutterBottom>💥 Force Over Time</Typography>
              <Typography color="text.secondary">Coming soon or loading chart here</Typography>
              {/* Replace this with <Line data={forceChartData} /> once available */}
            </Paper>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ backgroundColor: "#ffffff", boxShadow: 4, p: 3, borderRadius: 2 }}>
            <Typography variant="h6" color="#212121" fontWeight="bold" gutterBottom>
              📄 Feedback
            </Typography>

            {feedback?.createdAt && (
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <i>Submitted on:</i> {new Date(feedback.createdAt).toLocaleString()}
              </Typography>
            )}

            <Divider sx={{ my: 2 }} />

            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
              {feedback?.notes || "No feedback provided."}
            </Typography>
          </Paper>
        </Grid>


        <Grid item xs={12}>
          <Paper sx={{ backgroundColor: "#ffffff", boxShadow: 4, p: 3, borderRadius: 2 }}>
            <Typography variant="h6" color="#212121" fontWeight="bold" gutterBottom>
              📂 Session Files
            </Typography>

            <Box mt={2} display="flex" flexWrap="wrap" gap={2}>
              <Button
                variant="outlined"
                color="primary"
                href={results.pressureResultsPath}
                target="_blank"
              >
                📊 View Pressure Results
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                href={rawSensorData?.path}
                target="_blank"
              >
                📁 View Raw Sensor Data
              </Button>
            </Box>
          </Paper>
        </Grid>

      </Grid>
    </Box>
  );
}
