import { usePatients } from "../api/patients";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions, 
  Paper, 
  TextField, 
  Button, 
  IconButton, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow 
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DescriptionIcon from "@mui/icons-material/Description";
import SettingsIcon from "@mui/icons-material/Settings";
import ChatIcon from "@mui/icons-material/Chat";
import NotificationsIcon from "@mui/icons-material/Notifications";

import RecentPatients from "./RecentPatients"; // Import the recent patients section
import Appointments from "./Appointments"; // Placeholder for Appointments component
import Reports from "./Reports"; // Placeholder for Reports component
import Messages from "./Messages"; // Placeholder for Messages component
import Settings from "./Settings"; // Placeholder for Settings component

import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Dashboard() {

  const navigate = useNavigate(); // hook to navigate to different pages

  // console.log("Dashboard Component Rendered!"); // Debugging log

  // Fetch patient data using the custom hook
  const { data: patients, isLoading, error } = usePatients();

  // Track the selected menu item
  const [selectedSection, setSelectedSection] = useState("Dashboard");

  // Sidebar menu items
  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon /> },
    { text: "Patients", icon: <PeopleIcon /> },
    { text: "Appointments", icon: <CalendarTodayIcon /> },
    { text: "Reports", icon: <DescriptionIcon /> },
    { text: "Messages", icon: <ChatIcon /> },
    { text: "Settings", icon: <SettingsIcon /> },
  ];

  // function to render the selected section
  const renderContent = () => {
    switch (selectedSection) {
      case "Dashboard":
      case "Patients": // Show RecentPatients on both "Dashboard" and "Patients"
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

  // Search query state
  const [searchQuery, setSearchQuery] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: "",
    id: "",
    age: "",
    status: "Pending",
    lastReport: new Date().toISOString().split("T")[0], // Default to today's date
  });

  // Handle new patient modal open/close 
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  

  // Improved Loading UI
  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading Patient Data...</Typography>
      </Box>
    );

  // Improved Error UI
  if (error)
    return (
      <Typography color="error" align="center" mt={5}>
        ❌ Error loading data: {error.message}
      </Typography>
    );

   return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
            backgroundColor: "#F8F9FA",
            borderRight: "1px solid #ddd",
          },
        }}
      >
        <Box sx={{ padding: 2, textAlign: "center" }}>
          <Typography variant="h6" fontWeight="bold">
            Gait-Mate
          </Typography>
        </Box>

        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={selectedSection === item.text}
                onClick={() => setSelectedSection(item.text)}
                sx={{
                  "&.Mui-selected": { backgroundColor: "#E3F2FD", color: "#1976D2" },
                  "&:hover": { backgroundColor: "#E3F2FD" },
                }}
              >
                <ListItemIcon sx={{ color: selectedSection === item.text ? "#1976D2" : "inherit" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, padding: 3, marginLeft: "20px" }}>
        {/* ✅ Summary Cards Section (Always Visible) */}
        <Typography variant="h4" gutterBottom>
          🏥 Welcome Back, Dr. Keerthi Ilukkumbura
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Here's what's happening with your patients today.
        </Typography>

        <Grid container spacing={3} mt={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ padding: 2, textAlign: "center", backgroundColor: "#E3F2FD" }}>
              <CardContent>
                <Typography variant="h6">Total Patients</Typography>
                <Typography variant="h4">{patients?.length || 0}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ padding: 2, textAlign: "center", backgroundColor: "#E8F5E9" }}>
              <CardContent>
                <Typography variant="h6">Today's Appointments</Typography>
                <Typography variant="h4">{Math.floor(Math.random() * 20) + 5}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ padding: 2, textAlign: "center", backgroundColor: "#FFF3E0" }}>
              <CardContent>
                <Typography variant="h6">Pending Reports</Typography>
                <Typography variant="h4">{Math.floor(Math.random() * 10) + 1}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ padding: 2, textAlign: "center", backgroundColor: "#EDE7F6" }}>
              <CardContent>
                <Typography variant="h6">New Messages</Typography>
                <Typography variant="h4">{Math.floor(Math.random() * 10)}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Render Selected Section */}
        <Box mt={3}>{renderContent()}</Box>
      </Box>
    </Box>
  );
}
        
        
