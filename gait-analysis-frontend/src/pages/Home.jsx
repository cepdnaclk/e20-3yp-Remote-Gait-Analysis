import React from "react";
import { 
  Box, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button,
  Chip,
  Paper,
  Avatar,
  Divider
} from "@mui/material";
import { Link } from "react-router-dom";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import InfoIcon from "@mui/icons-material/Info";
import LoginIcon from "@mui/icons-material/Login";

// Import images
import MainImage from "../assets/images/gait.jpg";
import LogoImage from "../assets/images/logo-modified.png";

// Mock Navbar component
const Navbar = () => (
  <Box
    sx={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      height: "80px",
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(10px)",
      borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      px: { xs: 3, md: 6 },
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Box
        component="img"
        src={LogoImage}
        alt="RehabGait Logo"
        sx={{
          height: 50,
          width: "auto",
        }}
      />
      <Box>
        <Typography variant="h5" fontWeight="700" color="#1565C0" sx={{ lineHeight: 1 }}>
          RehabGait
        </Typography>
        <Typography variant="caption" color="#666" sx={{ lineHeight: 1 }}>
          Medical Analytics
        </Typography>
      </Box>
      <Chip 
        label="Pro" 
        size="small"
        sx={{ 
          backgroundColor: "#E3F2FD",
          color: "#1565C0",
          fontWeight: 600,
          fontSize: "11px",
          ml: 1,
        }} 
      />
    </Box>

    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Button
        startIcon={<InfoIcon />}
        sx={{ 
          color: "#666", 
          fontWeight: 600,
          display: { xs: "none", sm: "flex" }
        }}
      >
        About Us
      </Button>
      <Button
        variant="contained"
        startIcon={<LoginIcon />}
        component={Link}
        to="/login"
        sx={{
          backgroundColor: "#1976D2",
          fontWeight: 600,
          borderRadius: 2,
          px: 3,
          "&:hover": { backgroundColor: "#1565C0" },
        }}
      >
        Login
      </Button>
    </Box>
  </Box>
);

export default function Home() {
  const userTypes = [
    {
      title: "Doctors",
      description: "Monitor patient progress and analyze gait patterns with advanced diagnostic tools",
      icon: <LocalHospitalIcon sx={{ fontSize: 32 }} />,
      color: "#1976D2",
      gradient: "linear-gradient(135deg, #1976D2 0%, #1565C0 100%)"
    },
    {
      title: "Patients",
      description: "Access your personalized gait analysis reports and track recovery progress",
      icon: <PersonIcon sx={{ fontSize: 32 }} />,
      color: "#388E3C",
      gradient: "linear-gradient(135deg, #388E3C 0%, #2E7D32 100%)"
    },
    {
      title: "Clinic Admins",
      description: "Manage healthcare teams, patient records, and system operations efficiently",
      icon: <AdminPanelSettingsIcon sx={{ fontSize: 32 }} />,
      color: "#F57C00",
      gradient: "linear-gradient(135deg, #F57C00 0%, #EF6C00 100%)"
    }
  ];

  const features = [
    {
      title: "Real-Time Monitoring",
      desc: "Advanced sensor technology provides continuous gait pattern analysis with instant feedback and alerts",
      icon: <DirectionsWalkIcon fontSize="large" />,
      color: "#1976D2",
      stats: "24/7 Monitoring"
    },
    {
      title: "Data Visualization",
      desc: "Interactive dashboards and comprehensive reports with AI-powered insights for better diagnosis",
      icon: <ShowChartIcon fontSize="large" />,
      color: "#388E3C",
      stats: "Advanced Analytics"
    },
    {
      title: "Secure & Cloud-Based",
      desc: "HIPAA-compliant cloud infrastructure ensures patient data security with 99.9% uptime guarantee",
      icon: <CloudDoneIcon fontSize="large" />,
      color: "#7B1FA2",
      stats: "Bank-Level Security"
    },
    {
      title: "Smart Scheduling",
      desc: "Intelligent appointment management with automated reminders and telehealth integration",
      icon: <EventAvailableIcon fontSize="large" />,
      color: "#F57C00",
      stats: "Automated Workflow"
    }
  ];

  const benefits = [
    { icon: <VerifiedUserIcon />, text: "FDA Compliant", subtext: "Medical grade accuracy" },
    { icon: <TrendingUpIcon />, text: "98% Accuracy", subtext: "Clinical validation" },
    { icon: <AccessTimeIcon />, text: "50% Faster", subtext: "Recovery tracking" },
  ];

  return (
    <Box sx={{ width: "100%", overflowX: "hidden" }}>
      <Navbar />

      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: "100px", // Increased padding to prevent navbar overlap
          paddingBottom: "60px",
          overflow: "hidden",
        }}
      >
        {/* Hero Background Image */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 0,
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage: `url(${MainImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center top 80px",
              opacity: 0.7,
              zIndex: 1,
            },
            "&::after": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(227, 242, 253, 0.65) 25%, rgba(187, 222, 251, 0.6) 50%, rgba(144, 202, 249, 0.55) 75%, rgba(100, 181, 246, 0.5) 100%)",
              zIndex: 2,
            }
          }}
        />

        {/* Animated Background Elements */}
        <Box
          sx={{
            position: "absolute",
            top: "20%",
            right: "10%",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(21, 101, 192, 0.08) 100%)",
            animation: "float 8s ease-in-out infinite",
            zIndex: 1,
          }}
        />
        
        <Box
          sx={{
            position: "absolute",
            bottom: "15%",
            left: "5%",
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(56, 142, 60, 0.1) 0%, rgba(46, 125, 50, 0.08) 100%)",
            animation: "float 10s ease-in-out infinite reverse",
            zIndex: 1,
          }}
        />

        {/* Hero Content */}
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 3, textAlign: "center" }}>
          <Box sx={{ mb: 3 }}>
            <Chip 
              label="Advanced Healthcare Technology" 
              sx={{ 
                mb: 4,
                px: 3,
                py: 1.5,
                backgroundColor: "rgba(25, 118, 210, 0.1)",
                color: "#1565C0",
                borderRadius: 3,
                fontSize: "14px",
                fontWeight: 600,
                border: "1px solid rgba(25, 118, 210, 0.2)",
              }} 
            />
          </Box>

          <Typography 
            variant="h1" 
            sx={{
              fontWeight: 800,
              fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" },
              color: "#1A237E",
              mb: 2,
              lineHeight: 1.1,
            }}
          >
            Remote Gait Analysis
          </Typography>
          
          <Typography 
            variant="h1" 
            sx={{
              fontWeight: 800,
              fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" },
              background: "linear-gradient(135deg, #1976D2 0%, #388E3C 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              mb: 4,
              lineHeight: 1.1,
            }}
          >
            System
          </Typography>

          <Typography 
            variant="h5" 
            sx={{ 
              color: "#37474F",
              mb: 6,
              maxWidth: "800px",
              mx: "auto",
              lineHeight: 1.6,
              fontWeight: 400,
            }}
          >
            Empowering healthcare professionals with modern gait analysis technology. 
            Monitor patient mobility, accelerate recovery, and deliver personalized care remotely.
          </Typography>

          {/* CTA Buttons */}
          <Box sx={{ display: "flex", gap: 3, justifyContent: "center", flexWrap: "wrap", mb: 8 }}>
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/login"
              startIcon={<PlayArrowIcon />}
              sx={{
                px: 5,
                py: 2.5,
                fontSize: "1.1rem",
                fontWeight: 700,
                borderRadius: 3,
                background: "linear-gradient(135deg, #1976D2 0%, #1565C0 100%)",
                boxShadow: "0 8px 25px rgba(25, 118, 210, 0.3)",
                "&:hover": {
                  background: "linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 12px 30px rgba(25, 118, 210, 0.4)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Get Started
            </Button>

            <Button 
              variant="outlined" 
              size="large" 
              component={Link} 
              to="/about"
              endIcon={<ArrowForwardIcon />}
              sx={{ 
                px: 5,
                py: 2.5,
                fontSize: "1.1rem",
                fontWeight: 600,
                borderRadius: 3,
                color: "#1976D2",
                borderColor: "#1976D2",
                borderWidth: 2,
                "&:hover": {
                  borderColor: "#1565C0",
                  backgroundColor: "rgba(25, 118, 210, 0.1)",
                  transform: "translateY(-2px)",
                  borderWidth: 2,
                },
                transition: "all 0.3s ease",
              }}
            >
              Learn More
            </Button>
          </Box>

          {/* Benefits Row */}
          <Box sx={{ display: "flex", justifyContent: "center", gap: 4, flexWrap: "wrap" }}>
            {benefits.map((benefit, index) => (
              <Box 
                key={index}
                sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 2,
                  px: 4,
                  py: 3,
                  borderRadius: 3,
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.6)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Box sx={{ color: "#1976D2" }}>{benefit.icon}</Box>
                <Box>
                  <Typography variant="body2" fontWeight="600" color="#1A237E">
                    {benefit.text}
                  </Typography>
                  <Typography variant="caption" color="#546E7A">
                    {benefit.subtext}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* User Types Section */}
      <Box sx={{ 
        background: "linear-gradient(135deg, #F8FDFF 0%, #E8F4FD 50%, #F0F9FF 100%)", 
        py: 10,
        borderTop: "1px solid rgba(0, 0, 0, 0.05)"
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography 
              variant="h3" 
              fontWeight="700" 
              color="#1A237E" 
              sx={{ mb: 3 }}
            >
              Built for Healthcare Professionals
            </Typography>
            <Typography 
              variant="h6" 
              color="#546E7A" 
              sx={{ maxWidth: "600px", mx: "auto" }}
            >
              Comprehensive solutions tailored for every healthcare stakeholder
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {userTypes.map((userType, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    background: "linear-gradient(145deg, #FFFFFF 0%, #FAFAFA 100%)",
                    border: "1px solid rgba(0, 0, 0, 0.08)",
                    borderRadius: 4,
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: `0 20px 40px ${userType.color}20`,
                      border: `1px solid ${userType.color}30`,
                    },
                  }}
                >
                  <CardContent sx={{ p: 5, textAlign: "center" }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        background: userType.gradient,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 24px auto",
                        color: "white",
                        boxShadow: `0 8px 25px ${userType.color}40`,
                      }}
                    >
                      {userType.icon}
                    </Box>

                    <Typography variant="h5" fontWeight="700" color="#1A237E" sx={{ mb: 3 }}>
                      {userType.title}
                    </Typography>

                    <Typography variant="body1" color="#546E7A" sx={{ lineHeight: 1.6 }}>
                      {userType.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ 
        background: "linear-gradient(135deg, #FDFAFF 0%, #F8F3FF 50%, #FBFAFF 100%)", 
        py: 10,
        borderTop: "1px solid rgba(0, 0, 0, 0.05)"
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography 
              variant="h3" 
              fontWeight="700" 
              color="#1A237E" 
              sx={{ mb: 3 }}
            >
              Why Choose RehabGait?
            </Typography>
            <Typography 
              variant="h6" 
              color="#546E7A" 
              sx={{ maxWidth: "700px", mx: "auto" }}
            >
              Advanced technology meets clinical excellence to deliver unprecedented patient care
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={6} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    background: "linear-gradient(145deg, #FFFFFF 0%, #FAFAFA 100%)",
                    border: "1px solid rgba(0, 0, 0, 0.08)",
                    borderRadius: 4,
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: `0 16px 40px ${feature.color}20`,
                      border: `1px solid ${feature.color}30`,
                    },
                  }}
                >
                  <CardContent sx={{ p: 5 }}>
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 3 }}>
                      <Box
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: 3,
                          background: `${feature.color}15`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: feature.color,
                          flexShrink: 0,
                        }}
                      >
                        {feature.icon}
                      </Box>

                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                          <Typography variant="h6" fontWeight="700" color="#1A237E">
                            {feature.title}
                          </Typography>
                          <Chip 
                            label={feature.stats} 
                            size="small" 
                            sx={{ 
                              backgroundColor: `${feature.color}15`,
                              color: feature.color,
                              fontWeight: 600,
                              fontSize: "11px",
                            }} 
                          />
                        </Box>

                        <Typography 
                          variant="body1" 
                          color="#546E7A" 
                          sx={{ lineHeight: 1.6 }}
                        >
                          {feature.desc}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box 
        sx={{ 
          background: "linear-gradient(180deg, #1A237E 0%, #0D47A1 100%)", 
          py: 5,
          borderTop: "1px solid rgba(255, 255, 255, 0.1)"
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 3, flexWrap: "wrap" }}>
            <Typography variant="body2" color="rgba(255, 255, 255, 0.8)">
              &copy; 2025 RehabGait. All Rights Reserved.
            </Typography>
            <Box sx={{ color: "rgba(255, 255, 255, 0.4)" }}>•</Box>
            <Typography variant="body2" color="rgba(255, 255, 255, 0.8)">
              HIPAA Compliant
            </Typography>
            <Box sx={{ color: "rgba(255, 255, 255, 0.4)" }}>•</Box>
            <Typography variant="body2" color="rgba(255, 255, 255, 0.8)">
              FDA Approved Technology
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Box>
  );
}