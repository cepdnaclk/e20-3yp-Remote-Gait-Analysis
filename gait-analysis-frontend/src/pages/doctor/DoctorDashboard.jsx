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
  Avatar,
  Chip,
  Collapse,
  CircularProgress,
} from "@mui/material";

import {
  People as PeopleIcon,
  CalendarToday as CalendarTodayIcon,
  Description as DescriptionIcon,
  Settings as SettingsIcon,
  Chat as ChatIcon,
  Dashboard as DashboardIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";

import { useNavigate, Link } from "react-router-dom";
import { getDoctorPatients } from "../../services/doctorServices";
//import RecentPatients from "../RecentPatients";
import DoctorPatientsPage from "./DoctorPatientsPage";

import Appointments from "../Appointments";
import Reports from "../Reports";
import Messages from "../Messages";
import Settings from "../Settings";

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSection, setSelectedSection] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const token = localStorage.getItem("token");
  let doctorName = "";

  if (token) {
    const decoded = JSON.parse(atob(token.split(".")[1]));
    doctorName = decoded.sub;
  }

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await getDoctorPatients();
        setPatients(res.data);
      } catch (err) {
        console.error("Failed to load patients", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon /> },
    { text: "Patients", icon: <PeopleIcon /> },
    { text: "Appointments", icon: <CalendarTodayIcon /> },
    { text: "Reports", icon: <DescriptionIcon /> },
    { text: "Messages", icon: <ChatIcon /> },
    { text: "Settings", icon: <SettingsIcon /> },
  ];

  const renderContent = () => {
    switch (selectedSection) {
      case "Patients":
        return <DoctorPatientsPage patients={patients} isLoading={isLoading} error={error} />;
      case "Appointments":
        return <Appointments />;
      case "Reports":
        return <Reports />;
      case "Messages":
        return <Messages />;
      case "Settings":
        return <Settings />;
      default:
        return (
          <>
            <Grid container spacing={3} mt={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ p: 2, textAlign: "center", background: "radial-gradient(rgb(136, 223, 255),rgb(130, 205, 255))", boxShadow: 3 }}>
                  <CardContent>
                    <PeopleIcon fontSize="large" />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>Total Patients</Typography>
                    <Typography variant="h4">{patients?.length || 0}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ p: 2, textAlign: "center", background: "radial-gradient(rgb(136, 223, 255),rgb(130, 205, 255))", boxShadow: 3 }}>
                  <CardContent>
                    <CalendarTodayIcon fontSize="large" />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>Today's Appointments</Typography>
                    <Typography variant="h4">{Math.floor(Math.random() * 20) + 5}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ p: 2, textAlign: "center", background: "radial-gradient(rgb(136, 223, 255),rgb(130, 205, 255))", boxShadow: 3 }}>
                  <CardContent>
                    <DescriptionIcon fontSize="large" />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>Pending Reports</Typography>
                    <Typography variant="h4">
                      <Chip label={`${Math.floor(Math.random() * 10) + 1} Pending`} color="primary" />
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <Box mt={3}>
              <DoctorPatientsPage patients={patients} isLoading={isLoading} error={error} />
            </Box>
          </>
        );
    }
  };

  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading Patient Data...</Typography>
      </Box>
    );

  if (error)
    return (
      <Typography color="error" align="center" mt={5}>
        ❌ Error loading data: {error.message}
      </Typography>
    );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: "#ffffff" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: sidebarOpen ? 240 : 80,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: sidebarOpen ? 240 : 80,
            transition: "width 0.3s",
            boxSizing: "border-box",
            background: "linear-gradient(to bottom, rgb(28, 32, 57), rgb(6, 40, 97))",
            color: "#fff",
          },
        }}
      >
        <Box sx={{ padding: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {sidebarOpen && (
            <Typography variant="h6" component={Link} to="/" sx={{ textDecoration: "none", color: "white", fontWeight: "bold" }}>
              RehabGait
            </Typography>
          )}
          <IconButton onClick={() => setSidebarOpen(!sidebarOpen)} sx={{ color: "#fff" }}>
            <MenuIcon />
          </IconButton>
        </Box>

        <Collapse in={sidebarOpen}>
          <Box sx={{ textAlign: "center", p: 2 }}>
            <Avatar sx={{ width: 75, height: 75, margin: "auto" }}>
              {doctorName.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="body1" mt={1}>
              Dr. {doctorName}
            </Typography>
          </Box>
        </Collapse>

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
              sx={{
                color: "#ffdddd",
                "&:hover": { backgroundColor: "rgba(255, 0, 0, 0.2)" },
              }}
            >
              <ListItemIcon sx={{ color: "#ffdddd" }}>
                <LogoutIcon />
              </ListItemIcon>
              {sidebarOpen && <ListItemText primary="Logout" />}
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <Box sx={{ flexGrow: 1, padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          Welcome Back, Dr. {doctorName}
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Here's what's happening with your patients today!
        </Typography>
        <Box mt={3}>{renderContent()}</Box>
      </Box>
    </Box>
  );
}
