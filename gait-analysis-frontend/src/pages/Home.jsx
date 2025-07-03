import React from "react";
import { Box, Container, Grid, Card, CardContent, Typography, Button } from "@mui/material";

import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import MainImage from "../assets/images/gait.jpg";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

export default function Home() {
  return (
    <Box sx={{ width: "100vw", overflowX: "hidden" }}>
      <Navbar />

      {/* 🔹 Fix: Set minHeight instead of height to allow scrolling */}
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          minHeight: "100vh",  // ✅ Changed from height: 100vh
          top: 0,
          left: 0,
          zIndex: -1,
          background: "radial-gradient(circle, rgb(6, 40, 97), rgb(28, 32, 57))",
        }}
      />

      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          minHeight: "100vh",  // ✅ Changed to minHeight
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: "80px",
          overflow: "hidden",
        }}
      >
        <img
          src={MainImage}
          alt="Gait Analysis"
          style={{
            position: "absolute",
            width: "100%",
            // height: "100%",
            objectFit: "cover",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 0,
            opacity: 0.3,
          }}
        />

        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4))",
            zIndex: 1,
          }}
        />


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

            Empowering physiotherapists with cutting-edge technology to monitor and improve patient mobility Anytime, Anywhere. Heal Smart Heal fast.Github Action.

          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            component={Link}
            to="/login"
            sx={{ mr: 2 }}
          >
            Get Started
          </Button>

          <Button variant="outlined" color="inherit" size="large" component={Link} to="/about" sx={{ ml: 2 }}>

            Learn More
          </Button>
        </Box>
      </Box>

      {/* Features Section */}
      <Container sx={{ my: 8 }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" sx={{ mb: 4, color: "white", textShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)" }}>
          Why Choose RehabGait?
        </Typography>
        <Grid container spacing={4} justifyContent="center">

          {[{
            title: "Real-Time Monitoring", 
            desc: "Track and analyze gait patterns remotely in real-time.", 
            icon: <DirectionsWalkIcon fontSize="large" /> 
          }, {
            title: "Data Visualization", 
            desc: "View gait reports with interactive graphs and charts.", 
            icon: <ShowChartIcon fontSize="large" /> 
          }, {
            title: "Secure & Cloud-Based", 
            desc: "Securely store patient data for easy access and analysis.", 
            icon: <CloudDoneIcon fontSize="large" /> 
          }, {
            title: "Smart Appointment Management", 
            desc: "Streamline scheduling and follow-ups.", 
            icon: <EventAvailableIcon fontSize="large" /> 
          }].map((feature, index) => (

            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  textAlign: "center",
                  padding: 3,

                  backgroundColor: "rgba(255, 255, 255, 0.6)",
                  borderRadius: "16px",
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

      <Box sx={{ backgroundColor: "black", color: "white", textAlign: "center", padding: 1, mt: 1 }}>
        <Typography variant="body2">&copy; RehabGait 2025. All Rights Reserved.</Typography>

      </Box>
    </Box>
  );
}
