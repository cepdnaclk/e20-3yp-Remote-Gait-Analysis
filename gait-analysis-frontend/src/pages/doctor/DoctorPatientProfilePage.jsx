import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import { getDoctorPatients, getPatientTestSession } from "../../services/doctorServices";
import PersonIcon from "@mui/icons-material/Person";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import ArticleIcon from "@mui/icons-material/Article";
import EventNoteIcon from "@mui/icons-material/EventNote";
import Divider from '@mui/material/Divider';


export default function DoctorPatientProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const loadPatientAndReports = async () => {
      try {
        const res = await getDoctorPatients();
        const selected = res.data.find((p) => p.id === parseInt(id));
        setPatient(selected);

        if (selected) {
          const reportRes = await getPatientTestSession(selected.id);
          setReports(reportRes.data || []);
        }
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadPatientAndReports();
  }, [id]);

  const handleOpenReport = (report) => {
    setSelectedReport(report);
    setFeedback(report.feedback?.notes || "");
  };

  const handleCloseDialog = () => {
    setSelectedReport(null);
  };

  const handleSaveFeedback = () => {
    console.log("Updated feedback:", feedback);
    handleCloseDialog();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
        <Typography ml={2}>Loading patient profile...</Typography>
      </Box>
    );
  }

  if (!patient) {
    return (
      <Typography color="error" align="center" mt={5}>
        ❌ Patient not found
      </Typography>
    );
  }

  return (
    <Box p={4} sx={{ background: "#E0F7FA", height: "1800px" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Patient Profile: {patient.name}</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(`/patients/${patient.id}/realtime`)}
        >
          Go to Real-Time Gait Analysis
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Box display="flex" flexDirection="column" gap={3} mb={3}>
          <Paper elevation={3}
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: "#ffffff",
                //background: "#E0F7FA",
                boxShadow: "0px 2px 8px rgba(0,0,0,0.25)",
              }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              👤 Personal Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography><strong>Email:</strong> {patient.email}</Typography>
            <Typography><strong>Phone:</strong> {patient.phoneNumber}</Typography>
            <Typography><strong>NIC:</strong> {patient.nic}</Typography>
            <Typography><strong>Age:</strong> {patient.age}</Typography>
            <Typography><strong>Height:</strong> {patient.height} cm</Typography>
            <Typography><strong>Weight:</strong> {patient.weight} kg</Typography>
            <Typography><strong>Gender:</strong> {patient.gender}</Typography>
            <Typography><strong>Sensor Kit ID:</strong> {patient.sensorKitId}</Typography>
          </Paper>
        
          <Paper elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  //background: "#E0F7FA",
                   backgroundColor: "#ffffff",
                  boxShadow: "0px 2px 8px rgba(0,0,0,0.25)",
                }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
            📋 History
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography>Initial assessment: Stable gait with mild asymmetry.</Typography>
            <Typography>Previous injuries: None reported.</Typography>
            <Typography>Recorded on: {new Date(patient.createdAt).toLocaleString()}</Typography>
          </Paper>
       
          <Paper elevation={3}
              sx={{
                p: 3,
                borderRadius: 3,
                 backgroundColor: "#ffffff",
                //background: "#E0F7FA",
                boxShadow: "0px 2px 8px rgba(0,0,0,0.25)",
              }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
            💊 Treatment Plan
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography>- Week 1-2: Balance and posture correction exercises</Typography>
            <Typography>- Week 3-4: Strengthening lower limb muscles</Typography>
            <Typography>- Week 5-6: Endurance and cadence drills</Typography>
            <Typography>- Final week: Evaluation and readiness for discharge</Typography>
          </Paper>

          <Paper elevation={3}
              sx={{
                p: 3,
                borderRadius: 3,
                  backgroundColor: "#ffffff", 
                //background: "#E0F7FA",
                boxShadow: "0px 2px 8px rgba(0,0,0,0.25)",
              }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
            📅 Appointment History
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography>- 2024-04-05: Follow-up assessment</Typography>
            <Typography>- 2024-04-19: Gait calibration session</Typography>
            <Typography>- 2024-05-02: Cadence training evaluation</Typography>
          </Paper>
        
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box display="flex" flexDirection="column" gap={3} alignItems="center" mb={3}>
          <Paper elevation={3}
              sx={{
                p: 3,
                borderRadius: 3,
                 backgroundColor: "#ffffff",
                //background: "#E0F7FA",
                boxShadow: "0px 2px 8px rgba(0,0,0,0.25)",
              }}>
            <Typography variant="h6" mb={1} fontWeight="bold">
            📝 Report History
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {reports.length === 0 ? (
              <Typography>No reports available.</Typography>
            ) : (
              <Grid container spacing={2}>
                {reports.map((report, idx) => (
                  <Grid item xs={12} key={idx}>
                    <Paper variant = "outlined"sx={{ 
                            p: 2, 
                            cursor: "pointer",
                            borderLeft: "5px solid #3f51b5",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              backgroundColor: "#f0f8ff",
                              boxShadow: 3
                            },
                         }} 
                         onClick={() => navigate(`/patient/test-session/${report.sessionId}`)}>
                      <Typography variant="subtitle1"><strong>Session ID:</strong> {report.sessionId}</Typography>
                      <Typography><strong>Date:</strong> {new Date(report.startTime).toLocaleDateString()}</Typography>
                      <Typography><strong>Balance Score:</strong> {report.results?.balanceScore}</Typography>
                      <Typography variant="body2" noWrap>
                        <strong>Feedback:</strong> {report.feedback?.notes.slice(0, 60)}...
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
          </Box>
        </Grid>
      </Grid>

      <Dialog open={!!selectedReport} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight="bold">📝 Report Details</DialogTitle>
        <DialogContent dividers>
          {selectedReport && (
            <>
              <Typography><strong>Session ID:</strong> {selectedReport.sessionId}</Typography>
              <Typography><strong>Date:</strong> {new Date(selectedReport.startTime).toLocaleString()}</Typography>
              <Typography><strong>Status:</strong> {selectedReport.status}</Typography>
              <Typography><strong>Steps:</strong> {selectedReport.results?.steps}</Typography>
              <Typography><strong>Cadence:</strong> {selectedReport.results?.cadence}</Typography>
              <Typography><strong>Balance Score:</strong> {selectedReport.results?.balanceScore}</Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                margin="normal"
                label="Doctor Feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">Cancel</Button>
          <Button onClick={handleSaveFeedback} variant="contained" color="primary">Save Feedback</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}