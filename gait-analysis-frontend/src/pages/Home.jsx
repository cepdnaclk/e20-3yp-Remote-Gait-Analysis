import React from "react";
import { Box, Container, Grid, Card, CardContent, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar"; // Importing the Navbar component
import MainImage from "../assets/images/gait.jpg"; // Webpack will process this correctly
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

export default function Home() {
  return (
    <Box>
      {/* Navbar */}
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
          paddingTop: "80px",
          overflow: "hidden",
        }}
      >
        {/* Background Image */}
        <img
          src={MainImage}
          alt="Gait Analysis"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            top: 0,
            left: 0,
            zIndex: 0,
          }}
        />

        {/* Gradient Overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8))",
            zIndex: 1,
          }}
        />

        {/* Content */}
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            textAlign: "center",
            maxWidth: { xs: "90%", md: "70%" },
            color: "white",
            animation: "fadeIn 1.5s ease-in-out",
          }}
        >
          <Typography variant="h2" fontWeight="bold">
            Remote Gait Analysis System
          </Typography>
          <Typography variant="h5" sx={{ mt: 2, mb: 3 }}>
            Empowering physiotherapists with cutting-edge technology to monitor and improve patient mobility—anytime, anywhere.
          </Typography>
          <Button variant="contained" color="primary" size="large" component={Link} to="/signup" sx={{ mr: 2 }}>
            Get Started
          </Button>
          <Button variant="outlined" color="inherit" size="large" sx={{ borderColor: "white", color: "white" }}>
            Learn More
          </Button>
        </Box>
      </Box>

      {/* Features Section */}
      <Container sx={{ my: 8 }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" sx={{ mb: 4 }}>
          Why Choose Gait Mate?
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {[
            { title: "Real-Time Monitoring", desc: "Track and analyze gait patterns remotely in real-time.", icon: <DirectionsWalkIcon fontSize="large" /> },
            { title: "Data Visualization", desc: "View gait reports with interactive graphs and charts.", icon: <ShowChartIcon fontSize="large" /> },
            { title: "Secure & Cloud-Based", desc: "Securely store patient data for easy access and analysis.", icon: <CloudDoneIcon fontSize="large" /> },
            { title: "Smart Appointment Management", desc: "Streamline scheduling and follow-ups.", icon: <EventAvailableIcon fontSize="large" /> },
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  textAlign: "center",
                  padding: 3,
                  backgroundColor: "#f5faff",
                  transition: "0.3s",
                  "&:hover": { boxShadow: 6, transform: "scale(1.05)" },
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "center", mb: 1, color: "#1976D2" }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" fontWeight="bold">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2">{feature.desc}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{ backgroundColor: "#0d47a1", color: "white", textAlign: "center", padding: 3, mt: 5 }}>
        <Typography variant="body2">&copy; 2025 Gait Mate. All Rights Reserved.</Typography>
      </Box>
    </Box>
  );
}
