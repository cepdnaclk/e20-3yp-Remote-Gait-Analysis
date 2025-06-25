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
  Alert,
  Snackbar,
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
  const [downloading, setDownloading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: "", severity: "info" });

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

  const handleDownload = async () => {
    if (!session?.results?.pressureResultsPath) {
      setNotification({
        open: true,
        message: "No report available for download",
        severity: "error"
      });
      return;
    }

    setDownloading(true);
    
    try {
      let downloadUrl = session.results.pressureResultsPath;
      
      // Check if URL is expired (presigned URLs have expiration)
      const testResponse = await fetch(downloadUrl, { method: 'HEAD' });
      
      if (!testResponse.ok && testResponse.status === 403) {
        // URL might be expired, try to get a fresh one
        try {
          const refreshResponse = await axios.get(`/api/sessions/${session.sessionId}/report-url`);
          if (refreshResponse.data.success) {
            downloadUrl = refreshResponse.data.reportUrl;
            setNotification({
              open: true,
              message: "Refreshed download link",
              severity: "info"
            });
          }
        } catch (refreshError) {
          console.warn("Could not refresh URL:", refreshError);
        }
      }
      
      // Download the file
      const response = await fetch(downloadUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to download: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename with session info
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `Gait_Analysis_Report_Session_${session.sessionId}_${timestamp}.pdf`;
      link.download = filename;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setNotification({
        open: true,
        message: "Report downloaded successfully!",
        severity: "success"
      });
      
    } catch (error) {
      console.error("Download failed:", error);
      
      // Fallback: Try to open in new tab
      try {
        window.open(session.results.pressureResultsPath, '_blank');
        setNotification({
          open: true,
          message: "Report opened in new tab (download failed)",
          severity: "warning"
        });
      } catch (fallbackError) {
        setNotification({
          open: true,
          message: "Failed to download or open report. The link may have expired.",
          severity: "error"
        });
      }
    } finally {
      setDownloading(false);
    }
  };

  const handleViewReport = async () => {
    if (!session?.results?.pressureResultsPath) {
      setNotification({
        open: true,
        message: "No report available to view",
        severity: "error"
      });
      return;
    }

    try {
      let viewUrl = session.results.pressureResultsPath;
      
      // Check if URL is expired
      const testResponse = await fetch(viewUrl, { method: 'HEAD' });
      
      if (!testResponse.ok && testResponse.status === 403) {
        // Try to get fresh URL
        try {
          const refreshResponse = await axios.get(`/api/sessions/${session.sessionId}/report-url`);
          if (refreshResponse.data.success) {
            viewUrl = refreshResponse.data.reportUrl;
          }
        } catch (refreshError) {
          console.warn("Could not refresh URL:", refreshError);
        }
      }
      
      window.open(viewUrl, '_blank');
      
    } catch (error) {
      setNotification({
        open: true,
        message: "Failed to open report. The link may have expired.",
        severity: "error"
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minheight="100vh">
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
    <Box p={4} sx={{
        background: "linear-gradient(1deg, #e3e7ed 0%, #aab6d3 100%)",
        minheight: "100vh"}}
        >
      <Typography variant="h4" fontWeight="bold" color="#212121" gutterBottom>
        Test Session #{session.sessionId}
      </Typography>
      <Typography variant="subtitle1" gutterBottom color="black">
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
                onClick={handleViewReport}
                disabled={!session?.results?.pressureResultsPath}
              >
                📊 View PDF Report
              </Button>
              
              <Button
                variant="outlined"
                color="secondary"
                href={rawSensorData?.path}
                target="_blank"
                disabled={!rawSensorData?.path}
              >
                📁 View Raw Sensor Data
              </Button>

              <Button
                variant="contained"
                color="success"
                onClick={handleDownload}
                disabled={downloading || !session?.results?.pressureResultsPath}
                startIcon={downloading ? <CircularProgress size={16} /> : null}
              >
                {downloading ? 'Downloading...' : '⬇️ Download PDF Report'}
              </Button>
            </Box>

            {/* Status indicator for report availability */}
            {session?.results?.pressureResultsPath ? (
              <Typography variant="caption" color="green" sx={{ mt: 1, display: 'block' }}>
                ✅ PDF Report available
              </Typography>
            ) : (
              <Typography variant="caption" color="orange" sx={{ mt: 1, display: 'block' }}>
                ⏳ PDF Report not yet available
              </Typography>
            )}
          </Paper>
        </Grid>

      </Grid>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}