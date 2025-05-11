import { usePatients } from "../../api/patients";
import { 
  CircularProgress, 
  Typography, 
  Box, 
  Grid,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemButton,
  ListItemText,
  Card,
  CardContent,
  Paper,
  TextField,
  Button,
  IconButton,
  Avatar,
  Chip,
  Collapse
} from "@mui/material";

import PeopleIcon from "@mui/icons-material/People";
import AddIcon from "@mui/icons-material/Add";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DescriptionIcon from "@mui/icons-material/Description";
import SettingsIcon from "@mui/icons-material/Settings";
import ChatIcon from "@mui/icons-material/Chat";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import RecentPatients from "../RecentPatients";
import Appointments from "../Appointments";
import Reports from "../Reports";
import Messages from "../Messages";
import Settings from "../Settings";
import NavbarAuth from "../../components/NavbarAuth";

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const { data: patients, isLoading, error } = usePatients();
  const [selectedSection, setSelectedSection] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
      case "Dashboard":
      case "Patients":
        return <RecentPatients patients={patients} isLoading={isLoading} error={error} />;
      case "Appointments":
        return <Appointments />;
      case "Reports":
        return <Reports />;
      case "Messages":
        return <Messages />;
      case "Settings":
        return <Settings />;
      default:
        return <RecentPatients patients={patients} isLoading={isLoading} error={error} />;
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
    <Box sx={{ display: "flex", minheight: "100vh", bgcolor: "rgb(208, 218, 223)" }}>
      
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
          {sidebarOpen && (<Typography variant="h6" component={Link} to="/" sx={{ textDecoration: "none", color: "white", fontWeight: "bold" }}
              >RehabGait</Typography>)}
          <IconButton onClick={() => setSidebarOpen(!sidebarOpen)} sx={{ color: "#fff" }}>
            <MenuIcon />
          </IconButton>
        </Box>

        <Collapse in={sidebarOpen}>
          <Box sx={{ textAlign: "center", p: 2 }}>
            <Avatar sx={{ width: 75, height: 75, margin: "auto" }}>K</Avatar>
            <Typography variant="body1" mt={1}>Dr. Keerthi Illukkumbura</Typography>
          </Box>
        </Collapse>

        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={selectedSection === item.text}
                onClick={() => setSelectedSection(item.text)}
                sx={{
                  "&.Mui-selected": { backgroundColor: "rgba(0,0,0,0.3)", color: "rgb(198, 202, 226)" },
                  "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
                }}
              >
                <ListItemIcon sx={{ color: "#fff" }}>{item.icon}</ListItemIcon>
                {sidebarOpen && <ListItemText primary={item.text} />}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, padding: 3 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold" textshadow="2px 2px 5px rgba(0,0,0,0.2)">
          Welcome Back, Dr. Keerthi Ilukkumbura
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Here's what's happening with your patients today!
        </Typography>

        {/* Summary Cards */}
        <Grid container spacing={3} mt={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ padding: 2, textAlign: "center", backgroundColor: "#E3F2FD", boxShadow: 3 }}>
              <CardContent>
                <PeopleIcon fontSize="large" />
                <Typography variant="h6">Total Patients</Typography>
                <Typography variant="h4">{patients?.length || 0}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ padding: 2, textAlign: "center", backgroundColor: "#E8F5E9", boxShadow: 3 }}>
              <CardContent>
                <CalendarTodayIcon fontSize="large" />
                <Typography variant="h6">Today's Appointments</Typography>
                <Typography variant="h4">{Math.floor(Math.random() * 20) + 5}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ padding: 2, textAlign: "center", backgroundColor: "#FFF3E0", boxShadow: 3 }}>
              <CardContent>
                <DescriptionIcon fontSize="large" />
                <Typography variant="h6">Pending Reports</Typography>
                <Typography variant="h4">
                  <Chip label={`${Math.floor(Math.random() * 10) + 1} Pending`} color="warning" />
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ padding: 2, textAlign: "center", backgroundColor: "#EDE7F6", boxShadow: 3 }}>
              <CardContent>
                <ChatIcon fontSize="large" />
                <Typography variant="h6">New Messages</Typography>
                <Typography variant="h4">{Math.floor(Math.random() * 10)}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Dynamic Content */}
        <Box mt={3}>{renderContent()}</Box>
      </Box>
    </Box>
  );
}
