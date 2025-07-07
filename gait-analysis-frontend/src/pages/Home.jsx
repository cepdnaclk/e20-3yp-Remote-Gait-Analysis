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
import Navbar from "../components/Navbar";
import MainImage from "../assets/images/gait.jpg";
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

export default function Home() {
  const userTypes = [
    {
      title: "Doctors",
      description: "Monitor patient progress and analyze gait patterns with advanced diagnostic tools",
      icon: <LocalHospitalIcon sx={{ fontSize: 32 }} />,
      color: "#3b82f6",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
    },
    {
      title: "Patients",
      description: "Access your personalized gait analysis reports and track recovery progress",
      icon: <PersonIcon sx={{ fontSize: 32 }} />,
      color: "#10b981",
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)"
    },
    {
      title: "Clinic Admins",
      description: "Manage healthcare teams, patient records, and system operations efficiently",
      icon: <AdminPanelSettingsIcon sx={{ fontSize: 32 }} />,
      color: "#f59e0b",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
    }
  ];

  const features = [
    {
      title: "Real-Time Monitoring",
      desc: "Advanced sensor technology provides continuous gait pattern analysis with instant feedback and alerts",
      icon: <DirectionsWalkIcon fontSize="large" />,
      color: "#3b82f6",
      stats: "24/7 Monitoring"
    },
    {
      title: "Data Visualization",
      desc: "Interactive dashboards and comprehensive reports with AI-powered insights for better diagnosis",
      icon: <ShowChartIcon fontSize="large" />,
      color: "#10b981",
      stats: "Advanced Analytics"
    },
    {
      title: "Secure & Cloud-Based",
      desc: "HIPAA-compliant cloud infrastructure ensures patient data security with 99.9% uptime guarantee",
      icon: <CloudDoneIcon fontSize="large" />,
      color: "#8b5cf6",
      stats: "Bank-Level Security"
    },
    {
      title: "Smart Scheduling",
      desc: "Intelligent appointment management with automated reminders and telehealth integration",
      icon: <EventAvailableIcon fontSize="large" />,
      color: "#f59e0b",
      stats: "Automated Workflow"
    }
  ];

  const benefits = [
    { icon: <VerifiedUserIcon />, text: "FDA Compliant", subtext: "Medical grade accuracy" },
    { icon: <TrendingUpIcon />, text: "98% Accuracy", subtext: "Clinical validation" },
    { icon: <AccessTimeIcon />, text: "50% Faster", subtext: "Recovery tracking" },
  ];

  return (
    <Box sx={{ width: "100vw", overflowX: "hidden" }}>
      <Navbar />

      {/* Background */}
      <Box
        sx={{
          position: "fixed",
          width: "100%",
          height: "100vh",
          top: 0,
          left: 0,
          zIndex: -2,
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
        }}
      />

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
          paddingTop: "80px",
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
              backgroundPosition: "center",
              opacity: 0.15,
              zIndex: 1,
            },
            "&::after": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)",
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
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(29, 78, 216, 0.1) 100%)",
            animation: "float 6s ease-in-out infinite",
            zIndex: 1,
          }}
        />
        
        <Box
          sx={{
            position: "absolute",
            bottom: "15%",
            left: "5%",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)",
            animation: "float 8s ease-in-out infinite reverse",
            zIndex: 1,
          }}
        />

        {/* Hero Content */}
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 3, textAlign: "center" }}>
          <Box sx={{ mb: 3 }}>
            <Chip 
              label="Next-Generation Healthcare Technology" 
              sx={{ 
                mb: 3,
                px: 2,
                py: 1,
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                color: "#60a5fa",
                borderRadius: 3,
                fontSize: "14px",
                fontWeight: 600,
                border: "1px solid rgba(59, 130, 246, 0.2)",
                backdropFilter: "blur(10px)",
              }} 
            />
          </Box>

          <Typography 
            variant="h1" 
            sx={{
              fontWeight: 800,
              fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" },
              background: "linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              mb: 3,
              lineHeight: 1.1,
            }}
          >
            Remote Gait Analysis
            <br />
            <Box 
              component="span" 
              sx={{
                background: "linear-gradient(135deg, #3b82f6 0%, #10b981 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Revolutionized
            </Box>
          </Typography>

          <Typography 
            variant="h5" 
            sx={{ 
              color: "rgba(255, 255, 255, 0.8)",
              mb: 4,
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
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap", mb: 6 }}>
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/login"
              startIcon={<PlayArrowIcon />}
              sx={{
                px: 4,
                py: 2,
                fontSize: "1.1rem",
                fontWeight: 700,
                borderRadius: 3,
                background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                boxShadow: "0 12px 32px rgba(59, 130, 246, 0.4)",
                "&:hover": {
                  background: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 16px 40px rgba(59, 130, 246, 0.5)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Get Started Now
            </Button>

            <Button 
              variant="outlined" 
              size="large" 
              component={Link} 
              to="/about"
              endIcon={<ArrowForwardIcon />}
              sx={{ 
                px: 4,
                py: 2,
                fontSize: "1.1rem",
                fontWeight: 600,
                borderRadius: 3,
                color: "white",
                borderColor: "rgba(255, 255, 255, 0.3)",
                backdropFilter: "blur(10px)",
                "&:hover": {
                  borderColor: "rgba(255, 255, 255, 0.6)",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  transform: "translateY(-2px)",
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
                  gap: 1,
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <Box sx={{ color: "#60a5fa" }}>{benefit.icon}</Box>
                <Box>
                  <Typography variant="body2" fontWeight="600" color="white">
                    {benefit.text}
                  </Typography>
                  <Typography variant="caption" color="rgba(255, 255, 255, 0.7)">
                    {benefit.subtext}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* User Types Section */}
      <Box sx={{ backgroundColor: "rgba(15, 23, 42, 0.95)", py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography 
              variant="h3" 
              fontWeight="700" 
              color="white" 
              sx={{ mb: 2 }}
            >
              Built for Healthcare Professionals
            </Typography>
            <Typography 
              variant="h6" 
              color="rgba(255, 255, 255, 0.7)" 
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
                    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: 4,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: `0 20px 60px ${userType.color}40`,
                      border: `1px solid ${userType.color}60`,
                    },
                  }}
                >
                  <CardContent sx={{ p: 4, textAlign: "center" }}>
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
                        boxShadow: `0 8px 32px ${userType.color}40`,
                      }}
                    >
                      {userType.icon}
                    </Box>

                    <Typography variant="h5" fontWeight="700" color="white" sx={{ mb: 2 }}>
                      {userType.title}
                    </Typography>

                    <Typography variant="body1" color="rgba(255, 255, 255, 0.7)" sx={{ lineHeight: 1.6 }}>
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
      <Box sx={{ backgroundColor: "rgba(30, 41, 59, 0.95)", py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography 
              variant="h3" 
              fontWeight="700" 
              color="white" 
              sx={{ mb: 2 }}
            >
              Why Choose RehabGait?
            </Typography>
            <Typography 
              variant="h6" 
              color="rgba(255, 255, 255, 0.7)" 
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
                    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: 4,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: `0 16px 48px ${feature.color}30`,
                      border: `1px solid ${feature.color}40`,
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 3 }}>
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: 3,
                          background: `linear-gradient(135deg, ${feature.color}20 0%, ${feature.color}10 100%)`,
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
                          <Typography variant="h6" fontWeight="700" color="white">
                            {feature.title}
                          </Typography>
                          <Chip 
                            label={feature.stats} 
                            size="small" 
                            sx={{ 
                              backgroundColor: `${feature.color}20`,
                              color: feature.color,
                              fontWeight: 600,
                              fontSize: "11px",
                            }} 
                          />
                        </Box>

                        <Typography 
                          variant="body1" 
                          color="rgba(255, 255, 255, 0.7)" 
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
          backgroundColor: "rgba(0, 0, 0, 0.8)", 
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          py: 3,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2 }}>
            <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
              &copy; 2025 RehabGait. All Rights Reserved.
            </Typography>
            <Box sx={{ color: "rgba(255, 255, 255, 0.3)" }}>•</Box>
            <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
              HIPAA Compliant
            </Typography>
            <Box sx={{ color: "rgba(255, 255, 255, 0.3)" }}>•</Box>
            <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
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