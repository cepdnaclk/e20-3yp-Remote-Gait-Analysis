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
  Paper,
  Container,
  Chip,
  Divider,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useNavigate, Link } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import DevicesIcon from "@mui/icons-material/Devices";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
  getDoctors,
  getPatients,
  getAvailableSensorKits,
} from "../../services/clinicAdminServices";

import DoctorManagementPage from "./DoctorManagementPage";
import PatientManagementPage from "./PatientManagementPage";
import AddPatientPage from "./AddPatientPage";

export default function ClinicAdminDashboard() {
  const navigate = useNavigate();
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

  const StatCard = ({ title, value, icon, gradient, trend }) => (
    <Card
      sx={{
        p: 0,
        height: "100%",
        background: gradient,
        color: "white",
        boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
        borderRadius: 3,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          right: 0,
          width: "100px",
          height: "100px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "50%",
          transform: "translate(30px, -30px)",
        },
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
        },
        transition: "all 0.3s ease",
      }}
    >
      <CardContent sx={{ p: 3, position: "relative", zIndex: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              backgroundColor: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(10px)",
            }}
          >
            {icon}
          </Box>
          {trend && (
            <Chip
              label={trend}
              size="small"
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                color: "white",
                fontWeight: 600,
                backdropFilter: "blur(10px)",
              }}
            />
          )}
        </Box>
        
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            mb: 1,
            fontSize: { xs: "2rem", sm: "2.5rem" },
          }}
        >
          {value}
        </Typography>
        
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            opacity: 0.9,
            fontSize: { xs: "1rem", sm: "1.1rem" },
          }}
        >
          {title}
        </Typography>
      </CardContent>
    </Card>
  );

  const QuickActionCard = ({ title, description, icon, onClick, color }) => (
    <Card
      sx={{
        p: 1.5,
        height: "100%",
        cursor: "pointer",
        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        border: "1px solid rgba(226, 232, 240, 0.8)",
        borderRadius: 3,
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        position: "relative",
        overflow: "hidden",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
          borderColor: color,
        },
        transition: "all 0.3s ease",
      }}
      onClick={onClick}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
        <Box
          sx={{
            p: 1,
            borderRadius: 1,
            background: `linear-gradient(135deg, ${color}15 0%, ${color}25 100%)`,
            color: color,
          }}
        >
          {icon}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" fontWeight="700" sx={{ mb: 1, color: "text.primary" }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            {description}
          </Typography>
        </Box>
      </Box>
    </Card>
  );

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
          <Container maxWidth="xl" sx={{ px: 0 }}>
            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={4}>
                <StatCard
                  title="Total Doctors"
                  value={doctors.length}
                  icon={<LocalHospitalIcon sx={{ fontSize: 32 }} />}
                  gradient="linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
                  trend="+2 this month"
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <StatCard
                  title="Total Patients"
                  value={patients.length}
                  icon={<PeopleIcon sx={{ fontSize: 32 }} />}
                  gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
                  trend="+8 this week"
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <StatCard
                  title="Available Sensor Kits"
                  value={kits.length}
                  icon={<DevicesIcon sx={{ fontSize: 32 }} />}
                  gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                  trend="Ready to use"
                />
              </Grid>
            </Grid>

            <Grid container spacing={3} alignItems={'stretch'}>
              {/* Quick Actions */}
              <Grid item xs={12} md={8}  sx={{ display: 'flex', flexDirection: 'column' }}>
                <Card
                  sx={{
                    p: 4,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                    borderRadius: 3,
                    background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                    border: "1px solid rgba(226, 232, 240, 0.8)",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                        color: "white",
                      }}
                    >
                      <TrendingUpIcon sx={{ fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography variant="h5" fontWeight="700" sx={{ color: "text.primary" }}>
                        Quick Actions
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Streamline your clinic management
                      </Typography>
                    </Box>
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <QuickActionCard
                        title="Manage Doctors"
                        description="View, add, edit, or remove doctor profiles and their specializations."
                        icon={<LocalHospitalIcon sx={{ fontSize: 24 }} />}
                        onClick={() => setSelectedSection("Doctors")}
                        color="#3b82f6"
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <QuickActionCard
                        title="Patient Records"
                        description="Access comprehensive patient information and medical histories."
                        icon={<PeopleIcon sx={{ fontSize: 24 }} />}
                        onClick={() => setSelectedSection("Patients")}
                        color="#10b981"
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} marginTop={4}>
                      <QuickActionCard
                        title="Add New Patient"
                        description="Register new patients and assign them to doctors with sensor kits."
                        icon={<PersonAddIcon sx={{ fontSize: 24 }} />}
                        onClick={() => setSelectedSection("Add Patient")}
                        color="#f59e0b"
                        
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} marginTop={4}>
                      <QuickActionCard
                        title="Sensor Management"
                        description="Monitor and manage available sensor kits and their assignments."
                        icon={<DevicesIcon sx={{ fontSize: 24 }} />}
                        onClick={() => {/* Navigate to sensor management */}}
                        color="#8b5cf6"
                      />
                    </Grid>
                  </Grid>
                </Card>
              </Grid>

              {/* Recent Activity / Summary */}
              <Grid item xs={12} md={4}  sx={{ display: 'flex', flexDirection: 'column' }}>
                <Card
                  sx={{
                    p: 4,
                    height: "100%",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                    borderRadius: 3,
                    background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                    border: "1px solid rgba(226, 232, 240, 0.8)",
                  }}
                >
                  <Typography variant="h6" fontWeight="700" sx={{ mb: 3, color: "text.primary" }}>
                    Clinic Overview
                  </Typography>

                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" fontWeight="600">
                        CAPACITY UTILIZATION
                      </Typography>
                      <Typography variant="body2" fontWeight="700" color="success.main">
                        85%
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: "rgba(34, 197, 94, 0.1)",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          height: "100%",
                          width: "85%",
                          background: "linear-gradient(90deg, #10b981 0%, #059669 100%)",
                          borderRadius: 4,
                        }}
                      />
                    </Box>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  <Box sx={{ space: "y-3" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Doctor-Patient Ratio
                      </Typography>
                      <Typography variant="body2" fontWeight="600">
                        1:{Math.round(patients.length / doctors.length || 0)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Available Kits
                      </Typography>
                      <Chip
                        label={kits.length}
                        size="small"
                        sx={{
                          bgcolor: "rgba(245, 158, 11, 0.1)",
                          color: "#d97706",
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                    
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="body2" color="text.secondary">
                        System Status
                      </Typography>
                      <Chip
                        label="Online"
                        size="small"
                        sx={{
                          bgcolor: "rgba(34, 197, 94, 0.1)",
                          color: "#16a34a",
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Container>
        );
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        sx={{ bgcolor: "#f8fafc" }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={48} thickness={4} />
          <Typography variant="h6" sx={{ mt: 2, color: "text.secondary" }}>
            Loading clinic dashboard...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      {/* Modern Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: sidebarOpen ? 280 : 80,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: sidebarOpen ? 280 : 80,
            transition: "width 0.3s ease",
            boxSizing: "border-box",
            background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
            color: "#fff",
            border: "none",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          },
        }}
      >
        <Box sx={{ p: 3, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {sidebarOpen && (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#fff", mb: 0.5 }}>
                Clinic Admin
              </Typography>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>
                Management Portal
              </Typography>
            </Box>
          )}
          <IconButton
            onClick={() => setSidebarOpen(!sidebarOpen)}
            sx={{
              color: "#fff",
              bgcolor: "rgba(255,255,255,0.1)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        <List sx={{ px: 2 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                selected={selectedSection === item.text}
                onClick={() => setSelectedSection(item.text)}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  "&.Mui-selected": {
                    backgroundColor: "rgba(59, 130, 246, 0.2)",
                    color: "#60a5fa",
                    "& .MuiListItemIcon-root": { color: "#60a5fa" },
                  },
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.1)",
                    transform: "translateX(4px)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <ListItemIcon sx={{ color: "#94a3b8", minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                {sidebarOpen && <ListItemText primary={item.text} />}
              </ListItemButton>
            </ListItem>
          ))}

          <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.1)" }} />

          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/");
              }}
              sx={{
                borderRadius: 2,
                py: 1.5,
                "&:hover": {
                  backgroundColor: "rgba(239, 68, 68, 0.2)",
                  transform: "translateX(4px)",
                },
                transition: "all 0.2s ease",
              }}
            >
              <ListItemIcon sx={{ color: "#f87171", minWidth: 40 }}>
                <LogoutIcon />
              </ListItemIcon>
              {sidebarOpen && <ListItemText primary="Logout" />}
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            p: 4,
            background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
            border: "1px solid rgba(226, 232, 240, 0.8)",
            minHeight: "calc(100vh - 48px)",
          }}
        >
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              fontWeight="800"
              sx={{
                color: "text.primary",
                mb: 1,
                background: "linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Clinic Administration
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ fontWeight: 400 }}
            >
              Comprehensive management of doctors, patients, and medical resources
            </Typography>
          </Box>

          {/* Content */}
          <Box>{renderContent()}</Box>
        </Paper>
      </Box>
    </Box>
  );
}