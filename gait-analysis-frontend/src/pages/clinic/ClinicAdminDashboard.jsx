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
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import DashboardIcon from "@mui/icons-material/Dashboard";

import {
  getDoctors,
  getPatients,
  getAvailableSensorKits,
} from "../../services/clinicAdminServices";

import DoctorManagementPage from "./DoctorManagementPage";
import PatientManagementPage from "./PatientManagementPage";
import AddPatientPage from "./AddPatientPage"; // includes doctor + kit assignment

export default function ClinicAdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedSection, setSelectedSection] = useState("Dashboard");

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [kits, setKits] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [doctorRes, patientRes, kitRes] = await Promise.all([
        getDoctors(),
        getPatients(),
        getAvailableSensorKits(),
      ]);
      setDoctors(doctorRes.data);
      setPatients(patientRes.data);
      setKits(kitRes.data);
    } catch (err) {
      console.error("Error fetching clinic admin data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon /> },
    { text: "Doctors", icon: <PeopleIcon /> },
    { text: "Patients", icon: <PersonAddIcon /> },
    { text: "Add Patient", icon: <AssignmentIndIcon /> },
  ];

  const renderContent = () => {
    switch (selectedSection) {
      case "Doctors":
        return <DoctorManagementPage doctors={doctors} refreshData={fetchData} />;
      case "Patients":
        return <PatientManagementPage patients={patients} refreshData={fetchData} />;
      case "Add Patient":
        return (
          <AddPatientPage
            doctors={doctors}
            sensorKits={kits}
            onPatientAdded={fetchData}
          />
        );
      default:
        return (
          <Grid container spacing={3} mt={1}>
            <Grid item xs={6} sm={6} md={6}>
              <Card sx={{ p: 2, textAlign: "center", background: "#D7F0FF", boxShadow: 6 }}>
                <CardContent>
                  <PeopleIcon fontSize="large" />
                  <Typography variant="h6">Total Doctors</Typography>
                  <Typography variant="h4">{doctors.length}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={6} md={6}>
              <Card sx={{ p: 2, textAlign: "center", background: "#E0FFD8", boxShadow: 6 }}>
                <CardContent>
                  <PersonAddIcon fontSize="large" />
                  <Typography variant="h6">Total Patients</Typography>
                  <Typography variant="h4">{patients.length}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={6} md={6}>
              <Card sx={{ p: 2, textAlign: "center", background: "#FFEED8", boxShadow: 6 }}>
                <CardContent>
                  <AssignmentIndIcon fontSize="large" />
                  <Typography variant="h6">Available Sensor Kits</Typography>
                  <Typography variant="h4">{kits.length}</Typography>
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
        <Typography ml={2}>Loading dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F4F6F8" }}>
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
              Clinic Admin
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
        </List>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Clinic Admin Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Manage your clinic's doctors, patients, and sensor kits.
        </Typography>

        <Box mt={3}>{renderContent()}</Box>
      </Box>
    </Box>
  );
}
