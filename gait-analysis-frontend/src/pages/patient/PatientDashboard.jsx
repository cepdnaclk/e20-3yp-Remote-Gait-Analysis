import { useEffect, useState } from "react";
import React from "react";
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
  LinearProgress,
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
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import BalanceIcon from "@mui/icons-material/Balance";
import SpeedIcon from "@mui/icons-material/Speed";
import InsightsIcon from "@mui/icons-material/Insights";

import { useNavigate } from "react-router-dom";
import { getPatientProfile, getDashboardStats } from "../../services/patientServices";
import { useMemo } from "react";
import PatientTestSessionsList from "../../components/PatientTestSessionList";

// Enhanced Stat Card Component
const StatCard = ({ title, value, subtitle, icon, gradient, trend }) => (
  <Card 
    sx={{ 
      p: 3, 
      height: "100%",
      background: gradient,
      color: "white",
      boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
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
        <Box sx={{ fontSize: 32, opacity: 0.9 }}>
          {icon}
        </Box>
        {trend && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {trend.startsWith('+') ? 
              <TrendingUpIcon sx={{ fontSize: 16, color: "rgba(255,255,255,0.9)" }} /> :
              <TrendingDownIcon sx={{ fontSize: 16, color: "rgba(255,255,255,0.7)" }} />
            }
            <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 600 }}>
              {trend}
            </Typography>
          </Box>
        )}
      </Box>
      <Typography variant="h4" fontWeight="800" gutterBottom>
        {value}
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.9 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="caption" sx={{ opacity: 0.8, display: "block", mt: 0.5 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  </Card>
);

// Performance Overview Component
const PerformanceOverview = ({ averageMetrics, trends }) => (
  <Card sx={{ p: 2, mb: 3 }}>
    <Typography variant="h6" fontWeight="600" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <InsightsIcon color="primary" />
      Performance Overview
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
      Your average metrics across all sessions
    </Typography>
    
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
            <Typography variant="body2" fontWeight="600">Balance Score</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Typography variant="body2" fontWeight="700" color="primary.main">
                {averageMetrics.balanceScore.toFixed(1)}
              </Typography>
              <Chip 
                label={trends.balanceScoreChange} 
                size="small" 
                color={trends.balanceScoreChange.startsWith('+') ? "success" : "error"}
                sx={{ fontSize: 10, height: 18 }}
              />
            </Box>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={averageMetrics.balanceScore} 
            sx={{ height: 6, borderRadius: 3 }}
          />
        </Box>

        <Box sx={{mb:2}}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
            <Typography variant="body2" fontWeight="600">Steps</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Typography variant="body2" fontWeight="700" color="primary.main">
                {Math.round(averageMetrics.steps)}
              </Typography>
              <Chip 
                label={trends.stepsChange} 
                size="small" 
                color={trends.stepsChange.startsWith('+') ? "success" : "error"}
                sx={{ fontSize: 10, height: 18 }}
              />
            </Box>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={(averageMetrics.steps / 2000) * 100}
            sx={{ height: 6, borderRadius: 3 }}
          />
        </Box>
      </Grid>

      <Grid item xs={6}>
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
            <Typography variant="body2" fontWeight="600">Cadence</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Typography variant="body2" fontWeight="700" color="primary.main">
                {averageMetrics.cadence.toFixed(1)}
              </Typography>
              <Chip 
                label={trends.cadenceChange} 
                size="small" 
                color={trends.cadenceChange.startsWith('+') ? "success" : "error"}
                sx={{ fontSize: 10, height: 18 }}
              />
            </Box>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={(averageMetrics.cadence / 150) * 100}
            sx={{ height: 6, borderRadius: 3 }}
          />
        </Box>

        <Box sx={{mb:2}}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
            <Typography variant="body2" fontWeight="600">Avg Duration</Typography>
            <Typography variant="body2" fontWeight="700" color="primary.main">
              {Math.round(averageMetrics.sessionDuration / 60)}m
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={(averageMetrics.sessionDuration / 1200) * 100}
            sx={{ height: 6, borderRadius: 3 }}
          />
        </Box>
      </Grid>
    </Grid>
  </Card>
);

// Latest Session Component
const LatestSessionCard = ({ latestSession, setSelectedSection }) => {
  const navigate = useNavigate();
  
  if (!latestSession) {
    return (
      <Card sx={{ p: 3, height: "100%" }}>
        <Typography variant="h6" fontWeight="600" gutterBottom>
          Latest Session
        </Typography>
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            No sessions completed yet
          </Typography>
          <Button
            variant="contained"
            startIcon={<PlayArrowIcon />}
            sx={{ mt: 2 }}
            onClick={() => navigate("/patient/test-session")}
          >
            Start Your First Session
          </Button>
        </Box>
      </Card>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card sx={{ p: 3, height: "100%" }}>
      <Typography variant="h6" fontWeight="600" gutterBottom>
        Latest Session
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Session #{latestSession.sessionId}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formatDate(latestSession.startTime)}
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary">
          {formatTime(latestSession.startTime)} - {formatTime(latestSession.endTime)}
        </Typography>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={4}>
          <Box sx={{ textAlign: "center", p: 1.5, bgcolor: "primary.50", borderRadius: 1 }}>
            <Typography variant="h6" fontWeight="700" color="primary.main">
              {latestSession.results.balanceScore}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Balance
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box sx={{ textAlign: "center", p: 1.5, bgcolor: "success.50", borderRadius: 1 }}>
            <Typography variant="h6" fontWeight="700" color="success.main">
              {latestSession.results.steps}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Steps
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box sx={{ textAlign: "center", p: 1.5, bgcolor: "warning.50", borderRadius: 1 }}>
            <Typography variant="h6" fontWeight="700" color="warning.main">
              {latestSession.results.cadence.toFixed(1)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Cadence
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Feedback */}
      {latestSession.feedback && (
        <Box>
          <Typography variant="subtitle2" fontWeight="600" gutterBottom>
            Healthcare Provider Feedback
          </Typography>
          <Typography variant="body2" sx={{ 
            fontStyle: "italic",
            p: 2,
            bgcolor: "grey.50",
            borderRadius: 1,
            borderLeft: "3px solid #3b82f6",
            mb: 2,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>
            "{latestSession.feedback.notes}"
          </Typography>
        </Box>
      )}
      
      <Button 
        variant="outlined" 
        size="small" 
        fullWidth
        onClick={() => setSelectedSection("Test Sessions")}
      >
        View Full Session Details
      </Button>
    </Card>
  );
};

export default function PatientDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedSection, setSelectedSection] = useState("Dashboard");
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState(null); // New state for analytics

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Fetch patient profile and dashboard analytics in parallel
        const [profileRes, statsRes] = await Promise.all([
          getPatientProfile(),
          getDashboardStats()
        ]);
        
        setPatient(profileRes.data);
        setDashboardStats(statsRes.data);
        
        console.log("Loaded dashboard stats:", statsRes.data);
      } catch (err) {
        console.error("Failed to fetch patient data", err);
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

  const renderContent = () => {
    switch (selectedSection) {
      case "Profile":
        // KEEP EXISTING PROFILE UNCHANGED
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
        // KEEP EXISTING TEST SESSIONS PAGE UNCHANGED
        return (
          <Container maxWidth="xl" sx={{ px: 0 }}>
            {/* Page Header */}
            <Box sx={{ mb: 3 }}>
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
                Test Sessions
              </Typography>
              <Typography 
                variant="h6" 
                color="text.secondary" 
                sx={{ fontWeight: 400 }}
              >
                Start new sessions and track your gait analysis progress
              </Typography>
            </Box>

            {/* Action Cards Row - Improved sizing and spacing */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {/* Start New Session - Reduced height */}
              <Grid item xs={12} md={7}>
                <Card 
                  sx={{ 
                    p: 3,  // Reduced from 4 to 3
                    background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                    color: "white", 
                    boxShadow: "0 12px 32px rgba(59, 130, 246, 0.3)",
                    borderRadius: 3,
                    position: "relative",
                    overflow: "hidden",
                    minHeight: "220px", // Set fixed height instead of 100%
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: "120px",
                      height: "120px",
                      background: "rgba(255,255,255,0.08)",
                      borderRadius: "50%",
                      transform: "translate(40px, -40px)",
                    }
                  }}
                >
                  <Box sx={{ position: "relative", zIndex: 1, height: "100%", display: "flex", flexDirection: "column" }}>
                    <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <PlayArrowIcon sx={{ fontSize: 40, mb: 1.5, opacity: 0.9 }} />
                        <Typography variant="h5" fontWeight="700" gutterBottom>
                          Ready for Your Next Session?
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2, opacity: 0.9, maxWidth: "380px", lineHeight: 1.5 }}>
                          Begin a comprehensive gait analysis using your assigned sensor kit. 
                          Each session helps track your progress and provides valuable insights.
                        </Typography>
                      </Box>
                      <Chip 
                        label="New" 
                        size="small" 
                        sx={{ 
                          bgcolor: "rgba(255,255,255,0.2)",
                          color: "white",
                          fontWeight: 600
                        }} 
                      />
                    </Box>
                    
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center", mt: "auto" }}>
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<PlayArrowIcon />}
                        sx={{ 
                          bgcolor: "rgba(255,255,255,0.2)",
                          color: "white",
                          fontWeight: 600,
                          px: 3,
                          py: 1.2,
                          "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                          backdropFilter: "blur(10px)",
                        }}
                        onClick={() => navigate("/patient/test-session")}
                      >
                        Launch New Session
                      </Button>
                      
                      <Typography variant="caption" sx={{ opacity: 0.8, ml: 1 }}>
                        Estimated time: 10-15 minutes
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
              
              {/* Quick Stats - Better spacing */}
              <Grid item xs={12} md={5}>
                <Grid container spacing={2}> {/* Reduced spacing from 3 to 2 */}
                  <Grid item xs={12}>
                    <Card 
                      sx={{ 
                        p: 2.5, 
                        height: "100px", // Fixed height
                        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                        color: "white",
                        boxShadow: "0 8px 24px rgba(16, 185, 129, 0.3)",
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                      }}
                    >
                      <Box>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 1 }}>
                          <AssessmentIcon sx={{ fontSize: 24, opacity: 0.9 }} />
                          <Typography variant="h4" fontWeight="800">
                            {dashboardStats?.totalSessions || 0}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ opacity: 0.9, fontSize: 13 }}>
                          Completed Sessions
                        </Typography>
                      </Box>
                    </Card>
                  </Grid>
                  <Grid item xs={12}>
                    <Card 
                      sx={{ 
                        p: 2.5, 
                        height: "100px", // Fixed height
                        background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                        color: "white",
                        boxShadow: "0 8px 24px rgba(245, 158, 11, 0.3)",
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                      }}
                    >
                      <Box>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 1 }}>
                          <TrendingUpIcon sx={{ fontSize: 24, opacity: 0.9 }} />
                          <Typography variant="h4" fontWeight="800">
                            {dashboardStats?.latestSession?.results?.balanceScore || "N/A"}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ opacity: 0.9, fontSize: 13 }}>
                          Latest Balance Score
                        </Typography>
                      </Box>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            {/* Divider with more space */}
            <Divider sx={{ my: 3, borderColor: "rgba(148, 163, 184, 0.2)" }} />

            {/* Session History */}
            <Box sx={{ mt: 2 }}>
              <PatientTestSessionsList 
                embedded={true}
                initialPageSize={8}
                showControls={true}
                title="Session History & Progress"
              />
            </Box>
          </Container>
        );

      default:
        // NEW ANALYTICS DASHBOARD - Replaces the old "Recent Sessions" section
        return (
          <Container maxWidth="xl" sx={{ px: 0 }}>
            <Grid container spacing={3}>
              
              {/* Row 1: Keep existing appointment cards but make them smaller */}
              <Grid item xs={12} sm={6} md={6}>
                <Card 
                  sx={{ 
                    p: 3, 
                    height: "180px", // Reduced height
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
                      <DescriptionIcon sx={{ fontSize: 28, opacity: 0.9 }} />
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
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                      Last reviewed on{" "}
                      {dashboardStats?.latestSession
                        ? new Date(dashboardStats.latestSession.endTime).toLocaleDateString()
                        : "No data available"}
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        bgcolor: "rgba(255,255,255,0.2)",
                        color: "white",
                        fontWeight: 600,
                        "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                        backdropFilter: "blur(10px)",
                      }}
                      onClick={() => setSelectedSection("Test Sessions")}
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
                    height: "180px", // Reduced height
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
                      <CalendarTodayIcon sx={{ fontSize: 28, opacity: 0.9 }} />
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
                      {patient?.nextAppointment || "Not scheduled"}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      with {patient?.doctor?.name || "Healthcare Provider"}
                    </Typography>
                  </Box>
                </Card>
              </Grid>

              {/* Row 2: NEW Analytics KPI Cards */}
              <Grid item xs={12} sm={6} md={3}>
                <StatCard 
                  title="Total Sessions"
                  value={dashboardStats?.totalSessions || 0}
                  subtitle="Completed"
                  icon={<AssessmentIcon />}
                  gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <StatCard 
                  title="Latest Balance"
                  value={dashboardStats?.latestSession?.results?.balanceScore || "N/A"}
                  subtitle="Score"
                  icon={<BalanceIcon />}
                  gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                  trend={dashboardStats?.trends?.balanceScoreChange}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <StatCard 
                  title="Avg Steps"
                  value={dashboardStats?.averageMetrics?.steps ? Math.round(dashboardStats.averageMetrics.steps) : 0}
                  subtitle="Per session"
                  icon={<DirectionsWalkIcon />}
                  gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                  trend={dashboardStats?.trends?.stepsChange}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <StatCard 
                  title="Avg Cadence"
                  value={dashboardStats?.averageMetrics?.cadence ? dashboardStats.averageMetrics.cadence.toFixed(1) : 0}
                  subtitle="Steps per minute"
                  icon={<SpeedIcon />}
                  gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
                  trend={dashboardStats?.trends?.cadenceChange}
                />
              </Grid>

              {/* Row 3: Performance Overview and Latest Session */}
              <Grid item xs={12} md={8} mt={5}>
                {dashboardStats ? (
                  <PerformanceOverview 
                    averageMetrics={dashboardStats.averageMetrics}
                    trends={dashboardStats.trends}
                  />
                ) : (
                  <Card sx={{ p: 3, height: "350px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <CircularProgress />
                  </Card>
                )}
              </Grid>

              <Grid item xs={12} md={4} mt={5}>
                <LatestSessionCard 
                  latestSession={dashboardStats?.latestSession}
                  setSelectedSection={setSelectedSection}
                />
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