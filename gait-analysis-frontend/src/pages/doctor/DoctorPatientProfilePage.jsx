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
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  Divider,
  Stack,
  List,
  ListItem,
  ListItemText,
  Alert,
  Pagination,
  LinearProgress,
  Tooltip,
  Badge,
  Container,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Badge as BadgeIcon,
  MonitorHeart as MonitorHeartIcon,
  Assignment as AssignmentIcon,
  History as HistoryIcon,
  MedicalServices as MedicalIcon,
  EventNote as EventIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Timeline as TimelineIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Favorite as HeartIcon,
  Speed as SpeedIcon,
} from "@mui/icons-material";
import { getDoctorPatients, getPatientTestSession } from "../../services/doctorServices";

// Enhanced Info Section Component with animations
const InfoSection = ({ title, children, color = "#3b82f6", icon }) => (
  <Paper
    elevation={0}
    sx={{
      p: 0,
      borderRadius: 2,
      bgcolor: "#ffffff",
      border: "1px solid #e5e7eb",
      overflow: "hidden",
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "translateY(-1px)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        borderColor: color,
      },
    }}
  >
    {/* Section Header */}
    <Box
      sx={{
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        borderBottom: `2px solid ${color}30`,
        p: 2,
        display: "flex",
        alignItems: "center",
        gap: 1.5,
      }}
    >
      {icon && (
        <Box
          sx={{
            p: 0.5,
            borderRadius: 1.5,
            backgroundColor: `${color}30`,
            color: color,
            display: "flex",
            alignItems: "center",
          }}
        >
          {icon}
        </Box>
      )}
      <Typography variant="h6" fontWeight={600} color="#374151">
        {title}
      </Typography>
    </Box>
    <Box sx={{ p: 2.5 }}>{children}</Box>
  </Paper>
);

// Enhanced Info Row Component
const InfoRow = ({ label, value, icon, highlight = false }) => (
  <Box sx={{ 
    display: "flex", 
    alignItems: "center", 
    py: 1,
    px: 1.5,
    borderRadius: 1.5,
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "#f8fafc",
    },
  }}>
    {icon && (
      <Box sx={{ mr: 1.5, color: "#6b7280" }}>
        {icon}
      </Box>
    )}
    <Box sx={{ flex: 1 }}>
      <Typography variant="body2" color="#6b7280" sx={{ fontSize: "0.8rem", mb: 0.25 }}>
        {label}
      </Typography>
      <Typography 
        variant="body2" 
        fontWeight={highlight ? 600 : 500} 
        color={highlight ? "#059669" : "#111827"}
        sx={{ fontSize: highlight ? "0.95rem" : "0.9rem" }}
      >
        {value || "Not provided"}
      </Typography>
    </Box>
  </Box>
);

// Enhanced Report Card Component
const ReportCard = ({ report, onClick, isRecent = false }) => (
  <Card
    onClick={onClick}
    sx={{
      cursor: "pointer",
      borderRadius: 2,
      border: "1px solid #e5e7eb",
      position: "relative",
      overflow: "hidden",
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 6px 15px rgba(59, 130, 246, 0.15)",
        borderColor: "#3b82f6",
      },
      "&::before": {
        content: '""',
        position: "absolute",
        left: 0,
        top: 0,
        width: 3,
        height: "100%",
        background: isRecent 
          ? "linear-gradient(180deg, #10b981 0%, #059669 100%)" 
          : "linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)",
      },
    }}
  >
    <CardContent sx={{ p: 2, pl: 2.5 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography variant="subtitle1" fontWeight={600} color="#111827">
            Session #{report.sessionId}
          </Typography>
          {isRecent && (
            <Chip
              label="Recent"
              size="small"
              sx={{
                bgcolor: "#dcfce7",
                color: "#166534",
                fontSize: "0.7rem",
                height: 18,
                fontWeight: 600,
              }}
            />
          )}
        </Box>
        <Chip
          label={report.status || "Completed"}
          size="small"
          sx={{
            bgcolor: "#ecfdf5",
            color: "#047857",
            fontSize: "0.7rem",
            height: 18,
            fontWeight: 600,
          }}
        />
      </Box>
      
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
        <CalendarIcon sx={{ fontSize: 14, color: "#6b7280" }} />
        <Typography variant="caption" color="#6b7280">
          {new Date(report.startTime).toLocaleDateString()}
        </Typography>
        <TimeIcon sx={{ fontSize: 14, color: "#6b7280", ml: 1 }} />
        <Typography variant="caption" color="#6b7280">
          {new Date(report.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Typography>
      </Box>
      
      {/* Metrics Grid */}
      <Grid container spacing={1} mb={1.5}>
        <Grid item xs={4}>
          <Box textAlign="center" sx={{ p: 1, borderRadius: 1.5, bgcolor: "#f0fdf4" }}>
            <HeartIcon sx={{ fontSize: 16, color: "#059669", mb: 0.25 }} />
            <Typography variant="subtitle2" fontWeight={700} color="#059669">
              {report.results?.balanceScore || "N/A"}
            </Typography>
            <Typography variant="caption" color="#6b7280">
              Balance
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box textAlign="center" sx={{ p: 1, borderRadius: 1.5, bgcolor: "#fdf4ff" }}>
            <TimelineIcon sx={{ fontSize: 16, color: "#7c3aed", mb: 0.25 }} />
            <Typography variant="subtitle2" fontWeight={700} color="#7c3aed">
              {report.results?.steps || "0"}
            </Typography>
            <Typography variant="caption" color="#6b7280">
              Steps
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box textAlign="center" sx={{ p: 1, borderRadius: 1.5, bgcolor: "#fefbef" }}>
            <SpeedIcon sx={{ fontSize: 16, color: "#d97706", mb: 0.25 }} />
            <Typography variant="subtitle2" fontWeight={700} color="#d97706">
              {report.results?.cadence || "0"}
            </Typography>
            <Typography variant="caption" color="#6b7280">
              BPM
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {report.feedback?.notes && (
        <Box sx={{ mt: 1.5, p: 1.5, borderRadius: 1.5, bgcolor: "#f8fafc" }}>
          <Typography variant="caption" color="#6b7280" sx={{ fontWeight: 600 }}>
            FEEDBACK
          </Typography>
          <Typography
            variant="body2"
            color="#374151"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              mt: 0.25,
              fontSize: "0.8rem",
            }}
          >
            {report.feedback.notes}
          </Typography>
        </Box>
      )}
    </CardContent>
  </Card>
);

// Stats Card Component
const StatsCard = ({ title, value, icon, color, trend }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      borderRadius: 2,
      background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
      border: `1px solid ${color}30`,
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "translateY(-1px)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      },
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
      <Box
        sx={{
          p: 1,
          borderRadius: 1.5,
          backgroundColor: `${color}30`,
          color: color,
        }}
      >
        {icon}
      </Box>
      {trend && (
        <Chip
          label={trend}
          size="small"
          sx={{
            bgcolor: "#ecfdf5",
            color: "#047857",
            fontWeight: 600,
            fontSize: "0.7rem",
            height: 18,
          }}
        />
      )}
    </Box>
    <Typography variant="h5" fontWeight={700} color={color} mb={0.5}>
      {value}
    </Typography>
    <Typography variant="body2" color="#6b7280" fontWeight={500}>
      {title}
    </Typography>
  </Paper>
);

export default function DoctorPatientProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [feedback, setFeedback] = useState("");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 3;

  useEffect(() => {
    const loadPatientAndReports = async () => {
      try {
        setLoading(true);
        const res = await getDoctorPatients();
        const selected = res.data.find((p) => p.id === parseInt(id));
        setPatient(selected);

        if (selected) {
          const reportRes = await getPatientTestSession(selected.id);
          // Sort reports by date (newest first)
          const sortedReports = (reportRes.data || []).sort((a, b) => 
            new Date(b.startTime) - new Date(a.startTime)
          );
          setReports(sortedReports);
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
    setFeedback("");
  };

  const handleSaveFeedback = () => {
    console.log("Updated feedback:", feedback);
    handleCloseDialog();
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  // Calculate pagination
  const totalPages = Math.ceil(reports.length / reportsPerPage);
  const startIndex = (currentPage - 1) * reportsPerPage;
  const paginatedReports = reports.slice(startIndex, startIndex + reportsPerPage);

  // Calculate BMI if height and weight are available
  const calculateBMI = () => {
    if (patient?.height && patient?.weight) {
      const heightM = patient.height / 100;
      const bmi = (patient.weight / (heightM * heightM)).toFixed(1);
      return `${bmi} kg/m²`;
    }
    return "Not calculated";
  };

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <CircularProgress size={60} sx={{ color: "white", mb: 3 }} />
        <Typography variant="h5" color="white" fontWeight={600} mb={1}>
          Loading Patient Profile
        </Typography>
        <Typography variant="body1" color="rgba(255,255,255,0.8)">
          Please wait while we fetch the latest information...
        </Typography>
        <LinearProgress 
          sx={{ 
            width: 300, 
            mt: 3, 
            "& .MuiLinearProgress-bar": { backgroundColor: "white" },
            backgroundColor: "rgba(255,255,255,0.3)"
          }} 
        />
      </Box>
    );
  }

  if (!patient) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Alert severity="error" sx={{ maxWidth: 400, borderRadius: 3 }}>
          <Typography variant="h6">Patient not found</Typography>
          <Typography>The requested patient could not be found.</Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      bgcolor: "#f8fafc", 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
    }}>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        
        {/* Enhanced Header */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            mb: 3,
            borderRadius: 3,
            bgcolor: "#ffffff",
            border: "1px solid #e5e7eb",
            background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: "linear-gradient(90deg, #3b82f6 0%, #10b981 50%, #7c3aed 100%)",
            },
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
              <Tooltip title="Back to Patients">
                <IconButton
                  onClick={() => navigate(-1)}
                  size="small"
                  sx={{
                    bgcolor: "#f1f5f9",
                    "&:hover": { 
                      bgcolor: "#e2e8f0",
                      transform: "translateX(-2px)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <ArrowBackIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      bgcolor: "#10b981",
                      border: "2px solid white",
                    }}
                  />
                }
              >
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: "#3b82f6",
                    fontSize: "1.2rem",
                    fontWeight: 600,
                    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
                  }}
                >
                  {patient.name?.charAt(0)?.toUpperCase() || "P"}
                </Avatar>
              </Badge>
              
              <Box>
                <Typography variant="h5" fontWeight={700} color="#111827" mb={0.5}>
                  {patient.name}
                </Typography>
                <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                  <Typography variant="body2" color="#6b7280">
                    ID: {patient.id}
                  </Typography>
                  <Chip
                    label="Active"
                    size="small"
                    sx={{
                      bgcolor: "#ecfdf5",
                      color: "#047857",
                      fontSize: "0.7rem",
                      height: 18,
                      fontWeight: 600,
                    }}
                  />
                  <Typography variant="caption" color="#9ca3af">
                    Since {new Date(patient.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Button
              variant="contained"
              startIcon={<MonitorHeartIcon fontSize="small" />}
              onClick={() => navigate(`/patients/${patient.id}/realtime`)}
              sx={{
                background: "linear-gradient(135deg, #10b981 0%, #047857 100%)",
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.9rem",
                px: 2.5,
                py: 1,
                boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: "0 6px 20px rgba(16, 185, 129, 0.4)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Real-Time Analysis
            </Button>
          </Box>
        </Paper>

        {/* Stats Overview */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Reports"
              value={reports.length}
              icon={<AssignmentIcon fontSize="small" />}
              color="#3b82f6"
              trend="+12%"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Age"
              value={patient.age || "N/A"}
              icon={<PersonIcon fontSize="small" />}
              color="#10b981"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="BMI"
              value={calculateBMI()}
              icon={<AssessmentIcon fontSize="small" />}
              color="#7c3aed"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Sensor Kit"
              value={patient.sensorKitId || "Unassigned"}
              icon={<MonitorHeartIcon fontSize="small" />}
              color="#dc2626"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid item xs={12} lg={8}>
            <Stack spacing={3}>
              
              {/* Personal Information */}
              <InfoSection 
                title="Personal Information" 
                color="#3b82f6"
                icon={<PersonIcon />}
              >
                <Grid container spacing={1.5}>
                  <Grid item xs={12} sm={6}>
                    <InfoRow
                      label="Email Address"
                      value={patient.email}
                      icon={<EmailIcon fontSize="small" sx={{ color: "#3b82f6" }} />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoRow
                      label="Phone Number"
                      value={patient.phoneNumber}
                      icon={<PhoneIcon fontSize="small" sx={{ color: "#3b82f6" }} />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoRow
                      label="National ID"
                      value={patient.nic}
                      icon={<BadgeIcon fontSize="small" sx={{ color: "#3b82f6" }} />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoRow
                      label="Gender"
                      value={patient.gender}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <InfoRow
                      label="Age"
                      value={patient.age ? `${patient.age} years` : null}
                      highlight={true}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <InfoRow
                      label="Height"
                      value={patient.height ? `${patient.height} cm` : null}
                      highlight={true}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <InfoRow
                      label="Weight"
                      value={patient.weight ? `${patient.weight} kg` : null}
                      highlight={true}
                    />
                  </Grid>
                </Grid>
              </InfoSection>

              {/* Medical History */}
              <InfoSection 
                title="Medical History" 
                color="#059669"
                icon={<HistoryIcon />}
              >
                <List disablePadding>
                  <ListItem disablePadding sx={{ py: 0.5 }}>
                    <ListItemText
                      primary="Initial Assessment"
                      secondary="Stable gait with mild asymmetry detected during preliminary examination"
                      primaryTypographyProps={{ fontWeight: 600, color: "#111827", mb: 0.25, fontSize: "0.9rem" }}
                      secondaryTypographyProps={{ color: "#6b7280", lineHeight: 1.4, fontSize: "0.8rem" }}
                    />
                  </ListItem>
                  <Divider sx={{ my: 1 }} />
                  <ListItem disablePadding sx={{ py: 0.5 }}>
                    <ListItemText
                      primary="Previous Injuries"
                      secondary="No significant injuries or trauma reported in medical history"
                      primaryTypographyProps={{ fontWeight: 600, color: "#111827", mb: 0.25, fontSize: "0.9rem" }}
                      secondaryTypographyProps={{ color: "#6b7280", lineHeight: 1.4, fontSize: "0.8rem" }}
                    />
                  </ListItem>
                  <Divider sx={{ my: 1 }} />
                  <ListItem disablePadding sx={{ py: 0.5 }}>
                    <ListItemText
                      primary="Registration Date"
                      secondary={`Patient registered on ${new Date(patient.createdAt).toLocaleDateString()}`}
                      primaryTypographyProps={{ fontWeight: 600, color: "#111827", mb: 0.25, fontSize: "0.9rem" }}
                      secondaryTypographyProps={{ color: "#6b7280", lineHeight: 1.4, fontSize: "0.8rem" }}
                    />
                  </ListItem>
                </List>
              </InfoSection>

              {/* Treatment Plan */}
              <InfoSection 
                title="Treatment Plan" 
                color="#7c3aed"
                icon={<MedicalIcon fontSize="small" />}
              >
                <Grid container spacing={1.5}>
                  {[
                    { phase: "Week 1-2", title: "Foundation Phase", desc: "Balance and posture correction exercises" },
                    { phase: "Week 3-4", title: "Strengthening Phase", desc: "Lower limb muscle strengthening and stability" },
                    { phase: "Week 5-6", title: "Enhancement Phase", desc: "Endurance building and cadence optimization" },
                    { phase: "Final Week", title: "Assessment Phase", desc: "Comprehensive evaluation and discharge planning" },
                  ].map((item, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Box sx={{ p: 1.5, borderRadius: 1.5, bgcolor: "#faf5ff", border: "1px solid #e9d5ff" }}>
                        <Typography variant="caption" fontWeight={700} color="#7c3aed" mb={0.25}>
                          {item.phase}
                        </Typography>
                        <Typography variant="body2" fontWeight={600} color="#111827" mb={0.25}>
                          {item.title}
                        </Typography>
                        <Typography variant="caption" color="#6b7280" sx={{ fontSize: "0.8rem" }}>
                          {item.desc}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </InfoSection>
            </Stack>
          </Grid>

          {/* Right Column - Reports */}
          <Grid item xs={12} lg={4}>
            <InfoSection 
              title="Test Reports" 
              color="#ea580c"
              icon={<AssignmentIcon />}
            >
              {reports.length === 0 ? (
                <Box textAlign="center" py={6}>
                  <AssessmentIcon sx={{ fontSize: 64, color: "#d1d5db", mb: 3 }} />
                  <Typography variant="h6" color="#6b7280" mb={2} fontWeight={600}>
                    No Reports Available
                  </Typography>
                  <Typography variant="body2" color="#9ca3af" mb={3}>
                    Gait analysis reports will appear here after conducting sessions with this patient.
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<MonitorHeartIcon />}
                    onClick={() => navigate(`/patients/${patient.id}/realtime`)}
                    sx={{ borderRadius: 2, textTransform: "none" }}
                  >
                    Start First Analysis
                  </Button>
                </Box>
              ) : (
                <Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Typography variant="body2" color="#6b7280">
                      Showing {Math.min(startIndex + 1, reports.length)}-{Math.min(startIndex + reportsPerPage, reports.length)} of {reports.length} reports
                    </Typography>
                    <Chip
                      label={`${reports.length} Total`}
                      size="small"
                      sx={{ bgcolor: "#fef3c7", color: "#92400e", fontWeight: 600 }}
                    />
                  </Box>
                  
                  <Stack spacing={3} mb={3}>
                    {paginatedReports.map((report, idx) => (
                      <ReportCard
                        key={idx}
                        report={report}
                        isRecent={idx === 0 && currentPage === 1}
                        onClick={() => navigate(`/patient/test-session/${report.sessionId}`)}
                      />
                    ))}
                  </Stack>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                      <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        size="small"
                        sx={{
                          "& .MuiPaginationItem-root": {
                            borderRadius: 2,
                          },
                        }}
                      />
                    </Box>
                  )}
                </Box>
              )}
            </InfoSection>
          </Grid>
        </Grid>
      </Container>

      {/* Enhanced Report Details Dialog */}
      <Dialog
        open={!!selectedReport}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: 3,
            boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
          }
        }}
      >
        <DialogTitle sx={{ pb: 2, borderBottom: "1px solid #e5e7eb" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ p: 1, borderRadius: 2, bgcolor: "#dbeafe" }}>
              <AssignmentIcon sx={{ color: "#3b82f6" }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700} color="#111827">
                Gait Analysis Report
              </Typography>
              <Typography variant="body2" color="#6b7280">
                Detailed session information and feedback
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ p: 4 }}>
          {selectedReport && (
            <Stack spacing={4}>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <InfoRow
                    label="Session ID"
                    value={`#${selectedReport.sessionId}`}
                    highlight={true}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InfoRow
                    label="Date & Time"
                    value={new Date(selectedReport.startTime).toLocaleString()}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InfoRow
                    label="Session Status"
                    value={selectedReport.status}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InfoRow
                    label="Duration"
                    value="45 minutes"
                  />
                </Grid>
              </Grid>

              {/* Metrics Overview */}
              <Box>
                <Typography variant="h6" fontWeight={600} color="#111827" mb={2}>
                  Performance Metrics
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Box textAlign="center" sx={{ p: 3, borderRadius: 3, bgcolor: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                      <HeartIcon sx={{ fontSize: 32, color: "#059669", mb: 1 }} />
                      <Typography variant="h4" fontWeight={800} color="#059669">
                        {selectedReport.results?.balanceScore || "N/A"}
                      </Typography>
                      <Typography variant="body2" color="#6b7280" fontWeight={500}>
                        Balance Score
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box textAlign="center" sx={{ p: 3, borderRadius: 3, bgcolor: "#fdf4ff", border: "1px solid #e9d5ff" }}>
                      <TimelineIcon sx={{ fontSize: 32, color: "#7c3aed", mb: 1 }} />
                      <Typography variant="h4" fontWeight={800} color="#7c3aed">
                        {selectedReport.results?.steps || "0"}
                      </Typography>
                      <Typography variant="body2" color="#6b7280" fontWeight={500}>
                        Total Steps
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box textAlign="center" sx={{ p: 3, borderRadius: 3, bgcolor: "#fefbef", border: "1px solid #fed7aa" }}>
                      <SpeedIcon sx={{ fontSize: 32, color: "#d97706", mb: 1 }} />
                      <Typography variant="h4" fontWeight={800} color="#d97706">
                        {selectedReport.results?.cadence || "0"}
                      </Typography>
                      <Typography variant="body2" color="#6b7280" fontWeight={500}>
                        Cadence (BPM)
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Feedback Section */}
              <Box>
                <Typography variant="h6" fontWeight={600} color="#111827" mb={2}>
                  Doctor's Feedback & Notes
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  placeholder="Add your professional assessment, recommendations, and observations about this gait analysis session..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      backgroundColor: "#f8fafc",
                      "& fieldset": {
                        borderColor: "#e5e7eb",
                      },
                      "&:hover fieldset": {
                        borderColor: "#3b82f6",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#3b82f6",
                      },
                    },
                  }}
                />
                <Typography variant="caption" color="#6b7280" sx={{ mt: 1, display: "block" }}>
                  This feedback will be saved to the patient's medical record and can be referenced in future sessions.
                </Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 4, gap: 2, borderTop: "1px solid #e5e7eb" }}>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            startIcon={<CloseIcon />}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              color: "#6b7280",
              borderColor: "#d1d5db",
              "&:hover": {
                borderColor: "#9ca3af",
                backgroundColor: "#f9fafb",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveFeedback}
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #047857 0%, #065f46 100%)",
                transform: "translateY(-1px)",
              },
              transition: "all 0.2s ease",
              fontWeight: 600,
              px: 3,
            }}
          >
            Save Feedback
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}