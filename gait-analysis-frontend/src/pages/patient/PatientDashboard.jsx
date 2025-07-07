import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Grid,
  IconButton,
  CircularProgress,
  Button,
  Avatar,
  Chip,
  Divider,
  Paper,
  Container,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import DescriptionIcon from "@mui/icons-material/Description";
import AssessmentIcon from "@mui/icons-material/Assessment";
import LogoutIcon from "@mui/icons-material/Logout";
import HistoryIcon from "@mui/icons-material/History";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

import { useNavigate } from "react-router-dom";
import { getPatientProfile, getMyTestSessions } from "../../services/patientServices";
import { useMemo } from "react";

export default function PatientDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedSection, setSelectedSection] = useState("Dashboard");
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [testSessions, setTestSessions] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getPatientProfile();
        setPatient(res.data);

        const testRes = await getMyTestSessions();
        console.log("Loaded test sessions:", testRes.data); 
        setTestSessions(testRes.data);
      } catch (err) {
        console.error("Failed to fetch patient profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon /> },
    { text: "Profile", icon: <PersonIcon /> },
    { text: "Test Sessions", icon: <AssessmentIcon /> },
  ];

  const ProfileField = ({ label, value }) => (
    <Box sx={{ mb: 2.5 }}>
      <Typography
        variant="caption"
        sx={{ 
          color: "text.secondary", 
          fontSize: 12,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          mb: 0.5,
          display: "block"
        }}
      >
        {label}
      </Typography>
      <Typography 
        variant="body1" 
        sx={{ 
          fontSize: 16,
          fontWeight: 500,
          color: "text.primary"
        }}
      >
        {value}
      </Typography>
    </Box>
  );

  // Latest session
  const latestSession = useMemo(() => {
    return [...testSessions]
      .filter((s) => s.status === "COMPLETED")
      .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))[0];
  }, [testSessions]);

  const renderContent = () => {
    switch (selectedSection) {
      case "Profile":
        return (
          <Card
            sx={{
              p: 4,
              boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
              borderRadius: 3,
              background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
              border: "1px solid rgba(226, 232, 240, 0.8)",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
              {/* Avatar Section */}
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Box
                  sx={{
                    position: "relative",
                    mb: 2,
                  }}
                >
                  <Avatar
                    src={
                      patient.photoUrl && patient.photoUrl.trim() !== ""
                        ? patient.photoUrl
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            patient.name
                          )}&background=3b82f6&color=ffffff&rounded=true&size=160`
                    }
                    sx={{
                      width: 120,
                      height: 120,
                      border: "4px solid #e2e8f0",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    }}
                  />
                  <label htmlFor="upload-avatar">
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        bgcolor: "primary.main",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        fontSize: 12,
                        fontWeight: 600,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        "&:hover": { bgcolor: "primary.dark" },
                      }}
                    >
                      ✎
                    </Box>
                    <input
                      id="upload-avatar"
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          // upload logic here
                        }
                      }}
                    />
                  </label>
                </Box>
                <Typography variant="h5" fontWeight="700" sx={{ mb: 1 }}>
                  {patient.name}
                </Typography>
                <Chip 
                  label="Patient" 
                  size="small" 
                  sx={{ 
                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                    color: "primary.main",
                    fontWeight: 600
                  }} 
                />
              </Box>

              {/* Profile Information */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight="700" sx={{ mb: 3, color: "text.primary" }}>
                  Personal Information
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <ProfileField label="Full Name" value={patient.name} />
                    <ProfileField label="Gender" value={patient.gender} />
                    <ProfileField label="Email Address" value={patient.email} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <ProfileField label="Age" value={`${patient.age} years`} />
                    <ProfileField
                      label="Physical Stats"
                      value={`${patient.height} cm • ${patient.weight} kg`}
                    />
                    <ProfileField label="Phone Number" value={patient.phoneNumber} />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Doctor Information */}
                <Box
                  sx={{
                    p: 3,
                    backgroundColor: "rgba(34, 197, 94, 0.05)",
                    borderRadius: 2,
                    border: "1px solid rgba(34, 197, 94, 0.2)",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                    <LocalHospitalIcon sx={{ color: "success.main", fontSize: 20 }} />
                    <Typography variant="subtitle2" color="text.secondary" fontWeight="600">
                      Assigned Healthcare Provider
                    </Typography>
                  </Box>
                  <Typography variant="h6" fontWeight="700" sx={{ color: "success.dark" }}>
                    {patient.doctorName || "Not Assigned"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Card>
        );

      case "Test Sessions":
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Card 
                sx={{ 
                  p: 4, 
                  background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                  color: "white", 
                  boxShadow: "0 12px 32px rgba(59, 130, 246, 0.3)",
                  borderRadius: 3,
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "100px",
                    height: "100px",
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: "50%",
                    transform: "translate(30px, -30px)",
                  }
                }}
              >
                <Box sx={{ position: "relative", zIndex: 1 }}>
                  <PlayArrowIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
                  <Typography variant="h5" fontWeight="700" gutterBottom>
                    Start New Session
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                    Begin a comprehensive gait analysis using your assigned sensor kit.
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    sx={{ 
                      bgcolor: "rgba(255,255,255,0.2)",
                      color: "white",
                      fontWeight: 600,
                      px: 3,
                      py: 1.5,
                      "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                      backdropFilter: "blur(10px)",
                    }}
                    onClick={() => navigate("/patient/test-session")}
                  >
                    Launch Session
                  </Button>
                </Box>
              </Card>
            </Grid>
          </Grid>
        );

      default:
        return (
          <Container maxWidth="xl" sx={{ px: 0 }}>
            <Grid container spacing={3}>
              {/* Stats Cards */}
              <Grid item xs={12} sm={6} md={6}>
                <Card 
                  sx={{ 
                    p: 3, 
                    height: "100%",
                    background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
                    color: "white",
                    boxShadow: "0 12px 32px rgba(6, 182, 212, 0.3)",
                    borderRadius: 3,
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: "80px",
                      height: "80px",
                      background: "rgba(255,255,255,0.1)",
                      borderRadius: "50%",
                      transform: "translate(20px, -20px)",
                    }
                  }}
                >
                  <Box sx={{ position: "relative", zIndex: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                      <DescriptionIcon sx={{ fontSize: 32, opacity: 0.9 }} />
                      <Chip 
                        label="Latest" 
                        size="small" 
                        sx={{ 
                          bgcolor: "rgba(255,255,255,0.2)",
                          color: "white",
                          fontWeight: 600
                        }} 
                      />
                    </Box>
                    <Typography variant="h6" fontWeight="700" gutterBottom>
                      Latest Report
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 3 }}>
                      Last reviewed on{" "}
                      {latestSession
                        ? new Date(latestSession.endTime).toLocaleDateString()
                        : "No data available"}
                    </Typography>
                    <Button
                      variant="contained"
                      size="medium"
                      sx={{
                        bgcolor: "rgba(255,255,255,0.2)",
                        color: "white",
                        fontWeight: 600,
                        "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                        backdropFilter: "blur(10px)",
                      }}
                      onClick={() => {
                        if (latestSession) {
                          const el = document.getElementById(`session-${latestSession.sessionId}`);
                          if (el) {
                            el.scrollIntoView({ behavior: "smooth" });
                            el.style.transition = "background-color 0.5s";
                            el.style.backgroundColor = "#fff9c4";
                            setTimeout(() => {
                              el.style.backgroundColor = "";
                            }, 1200);
                            setTimeout(() => {
                              el.click();
                            }, 600);
                          } else {
                            console.warn("Element not found:", `session-${latestSession.sessionId}`);
                          }
                        }
                      }}
                    >
                      View Details
                    </Button>
                  </Box>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <Card 
                  sx={{ 
                    p: 3, 
                    height: "100%",
                    background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                    color: "white",
                    boxShadow: "0 12px 32px rgba(245, 158, 11, 0.3)",
                    borderRadius: 3,
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: "80px",
                      height: "80px",
                      background: "rgba(255,255,255,0.1)",
                      borderRadius: "50%",
                      transform: "translate(20px, -20px)",
                    }
                  }}
                >
                  <Box sx={{ position: "relative", zIndex: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                      <CalendarTodayIcon sx={{ fontSize: 32, opacity: 0.9 }} />
                      <Chip 
                        label="Upcoming" 
                        size="small" 
                        sx={{ 
                          bgcolor: "rgba(255,255,255,0.2)",
                          color: "white",
                          fontWeight: 600
                        }} 
                      />
                    </Box>
                    <Typography variant="h6" fontWeight="700" gutterBottom>
                      Next Appointment
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                      {patient.nextAppointment || "Not scheduled"}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      with {patient.doctor?.name || "Healthcare Provider"}
                    </Typography>
                  </Box>
                </Card>
              </Grid>

              {/* Test Session History */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Card 
                  sx={{ 
                    p: 4, 
                    boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                    borderRadius: 3,
                    background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                    border: "1px solid rgba(226, 232, 240, 0.8)",
                    marginTop: 4,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
                    <Box 
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                        color: "white",
                      }}
                    >
                      <HistoryIcon sx={{ fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography variant="h5" fontWeight="700" sx={{ color: "text.primary" }}>
                        Session History
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Track your progress over time
                      </Typography>
                    </Box>
                  </Box>

                  {testSessions.length === 0 ? (
                    <Paper 
                      sx={{ 
                        p: 4, 
                        textAlign: "center",
                        background: "rgba(148, 163, 184, 0.05)",
                        border: "1px dashed rgba(148, 163, 184, 0.3)",
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="h6" color="text.secondary">
                        No sessions found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Your test sessions will appear here once you start
                      </Typography>
                    </Paper>
                  ) : (
                    <Grid container spacing={2}>
                      {testSessions.map((session) => (
                        <Grid item xs={12} key={session.sessionId}>
                          <Card
                            id={`session-${session.sessionId}`}
                            sx={{
                              p: 3,
                              cursor: "pointer",
                              border: "1px solid rgba(226, 232, 240, 0.8)",
                              borderRadius: 2,
                              transition: "all 0.2s ease",
                              borderLeft: session.status === "FAILED" 
                                ? "4px solid #ef4444" 
                                : "4px solid #3b82f6",
                              backgroundColor: session.status === "FAILED" 
                                ? "rgba(239, 68, 68, 0.05)" 
                                : "white",
                              "&:hover": { 
                                transform: "translateY(-2px)",
                                boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
                                borderColor: session.status === "FAILED" 
                                  ? "#ef4444" 
                                  : "#3b82f6",
                              },
                            }}
                            onClick={() => {
                              if (session.status !== "FAILED") 
                                navigate(`/patient/test-session/${session.sessionId}`)
                            }}
                          >
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                              <Typography variant="h6" fontWeight="700" sx={{ color: "text.primary" }}>
                                Session #{session.sessionId}
                              </Typography>
                              <Chip 
                                label={session.status} 
                                size="small" 
                                sx={{ 
                                  bgcolor: session.status === "FAILED" 
                                    ? "rgba(239, 68, 68, 0.1)" 
                                    : "rgba(34, 197, 94, 0.1)",
                                  color: session.status === "FAILED" 
                                    ? "#dc2626" 
                                    : "#16a34a",
                                  fontWeight: 600,
                                  fontSize: 11,
                                }} 
                              />
                            </Box>
                            
                            <Box sx={{ display: "flex", gap: 3, mb: 2 }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                  📅 {new Date(session.startTime).toLocaleDateString()}
                                </Typography>
                              </Box>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                  🕐 {new Date(session.startTime).toLocaleTimeString()}
                                </Typography>
                              </Box>
                            </Box>

                            <Box sx={{ display: "flex", gap: 4, mb: 2 }}>
                              <Box>
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                  STEPS
                                </Typography>
                                <Typography variant="body1" fontWeight="600">
                                  {session.results?.steps ?? "N/A"}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                  BALANCE SCORE
                                </Typography>
                                <Typography variant="body1" fontWeight="600">
                                  {session.results?.balanceScore ?? "N/A"}
                                </Typography>
                              </Box>
                            </Box>

                            <Typography variant="body2" color="text.secondary" sx={{ 
                              fontStyle: "italic",
                              backgroundColor: "rgba(148, 163, 184, 0.05)",
                              p: 1.5,
                              borderRadius: 1,
                              border: "1px solid rgba(148, 163, 184, 0.1)"
                            }}>
                              {session.feedback?.notes?.substring(0, 100) || "No feedback available yet..."}
                            </Typography>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Card>
              </Grid>
            </Grid>
          </Container>
        );
    }
  };

  if (loading || !patient) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height="100vh"
        sx={{ bgcolor: "#f8fafc" }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={48} thickness={4} />
          <Typography variant="h6" sx={{ mt: 2, color: "text.secondary" }}>
            Loading your dashboard...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      {/* Modern Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: sidebarOpen ? 280 : 80,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: sidebarOpen ? 280 : 80,
            transition: "width 0.3s ease",
            boxSizing: "border-box",
            background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
            color: "#fff",
            border: "none",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          },
        }}
      >
        <Box sx={{ p: 3, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {sidebarOpen && (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#fff", mb: 0.5 }}>
                Patient Portal
              </Typography>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>
                Healthcare Dashboard
              </Typography>
            </Box>
          )}
          <IconButton 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            sx={{ 
              color: "#fff",
              bgcolor: "rgba(255,255,255,0.1)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        <List sx={{ px: 2 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                selected={selectedSection === item.text}
                onClick={() => setSelectedSection(item.text)}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  "&.Mui-selected": { 
                    backgroundColor: "rgba(59, 130, 246, 0.2)",
                    color: "#60a5fa",
                    "& .MuiListItemIcon-root": { color: "#60a5fa" },
                  },
                  "&:hover": { 
                    backgroundColor: "rgba(255,255,255,0.1)",
                    transform: "translateX(4px)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <ListItemIcon sx={{ color: "#94a3b8", minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                {sidebarOpen && <ListItemText primary={item.text} />}
              </ListItemButton>
            </ListItem>
          ))}
          
          <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.1)" }} />
          
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/");
              }}
              sx={{ 
                borderRadius: 2,
                py: 1.5,
                "&:hover": { 
                  backgroundColor: "rgba(239, 68, 68, 0.2)",
                  transform: "translateX(4px)",
                },
                transition: "all 0.2s ease",
              }}
            >
              <ListItemIcon sx={{ color: "#f87171", minWidth: 40 }}>
                <LogoutIcon />
              </ListItemIcon>
              {sidebarOpen && <ListItemText primary="Logout" />}
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            p: 4,
            background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
            border: "1px solid rgba(226, 232, 240, 0.8)",
            minHeight: "calc(100vh - 48px)",
          }}
        >
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h4" 
              fontWeight="800" 
              sx={{ 
                color: "text.primary",
                mb: 1,
                background: "linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Welcome back, {patient.name}
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ fontWeight: 400 }}
            >
              Monitor your health journey and track your progress
            </Typography>
          </Box>

          {/* Content */}
          <Box>{renderContent()}</Box>
        </Paper>
      </Box>
    </Box>
  );
}