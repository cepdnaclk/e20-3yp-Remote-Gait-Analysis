import { AppBar, Toolbar, Typography, Button, Box, Container, Grid, Card, CardContent } from "@mui/material";
import { Link } from "react-router-dom";
import MainImage from "../assets/images/gait.jpg"; // Webpack will process this correctly

export default function Home() {
  return (
    <Box>
      {/* Navbar */}
      <AppBar position="fixed" sx={{ backgroundColor: "#1976D2", zIndex: 3 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Remote Gait Analysis
          </Typography>
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
          <Button color="inherit" component={Link} to="/signup">
            Sign Up
          </Button>
        </Toolbar>
      </AppBar>

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
          paddingTop: "80px", // Adjusted for fixed navbar
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

        {/* Overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1,
          }}
        />

        {/* Content */}
        <Box sx={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: { xs: "90%", md: "80%" }, color: "white" }}>
          <Typography variant="h2" fontWeight="bold">
            Remote Gait Analysis System
          </Typography>
          <Typography variant="h5" sx={{ mt: 2, mb: 3 }}>
            Empowering physiotherapists with cutting-edge technology to monitor and improve patient mobility—anytime, anywhere.
          </Typography>
          <Button variant="contained" color="primary" size="large" component={Link} to="/signup" sx={{ mr: 2 }}>
            Get Started
          </Button>
          <Button variant="contained" color="inherit" size="large" sx={{ color: "#1565C0" }}>
            Learn More
          </Button>
        </Box>
      </Box>

      {/* Features Section */}
      <Container sx={{ my: 6 }}>
        <Grid container spacing={4} justifyContent="center">
          {[
            { title: "Real-Time Monitoring", desc: "Track and analyze gait patterns remotely in real-time." },
            { title: "Data Visualization", desc: "View gait reports with interactive graphs and charts." },
            { title: "Secure & Cloud-Based", desc: "Securely store patient data for easy access and analysis." },
            { title: "Smart Appointment Management", desc: "Streamline scheduling and follow-ups." },
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ textAlign: "center", padding: 3, backgroundColor: "#d6e4ea" }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">{feature.title}</Typography>
                  <Typography variant="body2">{feature.desc}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{ backgroundColor: "#1565C0", color: "white", textAlign: "center", padding: 2, mt: 5 }}>
        <Typography variant="body2">&copy; 2025 Gait Mate. All Rights Reserved.</Typography>
      </Box>
    </Box>
  );
}
