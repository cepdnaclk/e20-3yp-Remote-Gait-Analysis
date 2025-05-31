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
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import DescriptionIcon from "@mui/icons-material/Description";
import AssessmentIcon from "@mui/icons-material/Assessment";
import LogoutIcon from "@mui/icons-material/Logout";

import { useNavigate } from "react-router-dom";
import { getPatientProfile } from "../../services/patientServices";

export default function PatientDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedSection, setSelectedSection] = useState("Dashboard");
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getPatientProfile();
        setPatient(res.data);
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

  const renderContent = () => {
    switch (selectedSection) {
      case "Profile":
        return (
          <Card sx={{ p: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Profile Summary
              </Typography>
              <Typography>Name: {patient.name}</Typography>
              <Typography>Email: {patient.email}</Typography>
              <Typography>Phone: {patient.phoneNumber}</Typography>
              <Typography>Age: {patient.age}</Typography>
              <Typography>Height: {patient.height} cm</Typography>
              <Typography>Weight: {patient.weight} kg</Typography>
              <Typography>Gender: {patient.gender}</Typography>
              <Typography>
                Assigned Doctor: {patient.doctorName || "Not Assigned"}
              </Typography>
              
            </CardContent>
          </Card>
        );
      case "Test Sessions":
        return (
          <Card sx={{ p: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Test Sessions
              </Typography>
              <Typography>View and manage your gait test sessions.</Typography>
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={() => navigate("/patient/test-session")}
              >
                Go to Test Session
              </Button>
            </CardContent>
          </Card>
        );
      default:
        return (
          <Grid container spacing={3} mt={1}>
            <Grid item xs={12} sm={6} md={6}>
              <Card sx={{ p: 2, textAlign: "center", background: "#E0F7FA", boxShadow: 6 }}>
                <CardContent>
                  <DescriptionIcon fontSize="large" />
                  <Typography variant="h6">Latest Report</Typography>
                  <Typography variant="body1">Reviewed on 2025-02-20</Typography>
                  <Button variant="outlined" sx={{ mt: 2 }}>
                    View Full Report
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Card sx={{ p: 2, textAlign: "center", background: "#FFF3E0", boxShadow: 6 }}>
                <CardContent>
                  <DashboardIcon fontSize="large" />
                  <Typography variant="h6">Next Appointment</Typography>
                  <Typography variant="body1">
                    {patient.nextAppointment || "Not Scheduled"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    with {patient.doctor?.name || "N/A"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );
    }
  };

  if (loading || !patient) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
        <Typography ml={2}>Loading patient dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F2F4F7" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: sidebarOpen ? 240 : 80,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: sidebarOpen ? 240 : 80,
            transition: "width 0.3s",
            boxSizing: "border-box",
            background: "linear-gradient(to bottom, rgb(25, 45, 75), rgb(5, 25, 55))",
            color: "#fff",
          },
        }}
      >
        <Box sx={{ padding: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {sidebarOpen && (
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#fff" }}>
              Patient Portal
            </Typography>
          )}
          <IconButton onClick={() => setSidebarOpen(!sidebarOpen)} sx={{ color: "#fff" }}>
            <MenuIcon />
          </IconButton>
        </Box>

        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={selectedSection === item.text}
                onClick={() => setSelectedSection(item.text)}
                sx={{
                  "&.Mui-selected": { backgroundColor: "rgba(0,0,0,0.3)", color: "#fff" },
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
                }}
              >
                <ListItemIcon sx={{ color: "#fff" }}>{item.icon}</ListItemIcon>
                {sidebarOpen && <ListItemText primary={item.text} />}
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/");
              }}
              sx={{ "&:hover": { backgroundColor: "rgba(255, 0, 0, 0.2)" } }}
            >
              <ListItemIcon sx={{ color: "#fff" }}>
                <LogoutIcon />
              </ListItemIcon>
              {sidebarOpen && <ListItemText primary="Logout" />}
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Patient Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Welcome {patient.name}, manage your sessions and view insights below.
        </Typography>

        <Box mt={3}>{renderContent()}</Box>
      </Box>
    </Box>
  );
}
