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
  Collapse,
  Chip,
  CircularProgress,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import BusinessIcon from "@mui/icons-material/Business";
import DevicesIcon from "@mui/icons-material/Devices";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DashboardIcon from "@mui/icons-material/Dashboard";

import { getClinics, getSensorKits } from "../../services/rootServices";
import ManageClinicsPage from "./ManageClinicsPage";
import ManageSensorKitsPage from "./ManageSensorKitsPage";
import AssignSensorKitsPage from "./AssignSensorKitsPage";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";

export default function SystemAdminDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedSection, setSelectedSection] = useState("Dashboard");
  const [clinics, setClinics] = useState([]);
  const [kits, setKits] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [clinicsRes, kitsRes] = await Promise.all([getClinics(), getSensorKits()]);
      setClinics(clinicsRes.data);
      setKits(kitsRes.data);
    } catch (err) {
      console.error("Error fetching data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon /> },
    { text: "Clinics", icon: <BusinessIcon /> },
    { text: "Sensor Kits", icon: <DevicesIcon /> },
    { text: "Assign Sensor Kits", icon: <AssignmentIcon /> },
  ];

  const renderContent = () => {
    switch (selectedSection) {
      case "Clinics":
        return <ManageClinicsPage />;
      case "Sensor Kits":
        return <ManageSensorKitsPage />;
      case "Assign Sensor Kits":
        return <AssignSensorKitsPage />;
      default:
        return (
          <Grid container spacing={3} mt={1}>
            <Grid item xs={6} sm={6} md={6}>
              <Card sx={{ p: 2, textAlign: "center", background: "radial-gradient(rgb(136, 223, 255),rgb(130, 205, 255))", boxShadow: 6 }}>
                <CardContent>
                  <BusinessIcon fontSize="large" />
                  <Typography variant="h6">Total Clinics</Typography>
                  <Typography variant="h4">{clinics.length}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={6} md={6}>
              <Card sx={{ p: 2, textAlign: "center", background: "radial-gradient(rgb(136, 223, 255),rgb(130, 205, 255))", boxShadow: 6}}>
                <CardContent>
                  <BusinessIcon fontSize="large" />
                  <Typography variant="h6">Total Sensor Kits</Typography>
                  <Typography variant="h4">{kits.length}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={6} md={6}>
              <Card sx={{ p: 2, textAlign: "center", background: "radial-gradient(rgb(136, 223, 255),rgb(130, 205, 255))", boxShadow: 6 }}>
                <CardContent>
                  <DevicesIcon fontSize="large" />
                  <Typography variant="h6">In Stock Kits</Typography>
                  <Typography variant="h4">
                    {kits.filter((k) => k.status === "IN_STOCK").length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={6} md={6}>
              <Card sx={{ p: 2, textAlign: "center", background: "radial-gradient(rgb(136, 223, 255),rgb(130, 205, 255))", boxShadow: 6}}>
                <CardContent>
                  <AssignmentIcon fontSize="large" />
                  <Typography variant="h6">Assigned Kits</Typography>
                  <Typography variant="h4">
                    {kits.filter((k) => k.status === "AVAILABLE").length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
        <Typography ml={2}>Loading system data...</Typography>
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
            background: "linear-gradient(to bottom, rgb(28, 32, 57), rgb(6, 40, 97))",
            color: "#fff",
          },
        }}
      >
        <Box sx={{ padding: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {sidebarOpen && (
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#fff" }}>
              RehabGait Admin
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
                sx={{
                    "&:hover": { backgroundColor: "rgba(255, 0, 0, 0.2)" },
                }}
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
          System Administrator Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Manage your clinics and sensor kits from one place.
        </Typography>

        <Box mt={3}>{renderContent()}</Box>
      </Box>
    </Box>
  );
}
