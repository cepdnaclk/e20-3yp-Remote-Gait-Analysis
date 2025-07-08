// DoctorDashboard.jsx

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
  Chip,
  CircularProgress,
  Paper,
  Divider,
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
  TrendingUp as TrendingUpIcon,
  AccessTime as AccessTimeIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";

import { Line } from "react-chartjs-2";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { useNavigate } from "react-router-dom";
import { getDoctorPatients } from "../../services/doctorServices";
import Appointments from "../Appointments";
import Reports from "../../components/Reports";
import Messages from "../Messages";
import Settings from "../Settings";
import DoctorPatientsPage from "./DoctorPatientsPage";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Enhanced StatCard component with better styling
const StatCard = ({ title, value, icon, gradient, trend }) => (
  <Card
    sx={{
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
    <CardContent sx={{ p: 4, position: "relative", zIndex: 1 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
        <Box sx={{ 
          p: 2, 
          borderRadius: 2, 
          backgroundColor: "rgba(255,255,255,0.2)", 
          backdropFilter: "blur(10px)" 
        }}>
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
              backdropFilter: "blur(10px)" 
            }}
          />
        )}
      </Box>
      <Typography variant="h3" fontWeight={800} mb={1}>{value}</Typography>
      <Typography variant="h6" fontWeight={600} opacity={0.9}>{title}</Typography>
    </CardContent>
  </Card>
);

// Quick Action Card component
const QuickActionCard = ({ title, description, icon, onClick, color }) => (
  <Card
    onClick={onClick}
    sx={{
      p: 3,
      cursor: "pointer",
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      border: "1px solid rgba(226, 232, 240, 0.8)",
      borderRadius: 3,
      boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
        borderColor: color,
      },
      transition: "all 0.3s ease",
    }}
  >
    <Box sx={{ display: "flex", gap: 2 }}>
      <Box sx={{ p: 2, borderRadius: 2, background: `${color}15`, color }}>
        {icon}
      </Box>
      <Box>
        <Typography variant="h6" fontWeight={700} mb={1}>{title}</Typography>
        <Typography variant="body2" color="text.secondary">{description}</Typography>
      </Box>
    </Box>
  </Card>
);

// Now using the imported DoctorPatientsPage component

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSection, setSelectedSection] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Extract doctor name from token
  const token = localStorage.getItem("token");
  let doctorName = "";
  try {
    if (token) {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      doctorName = decoded.sub || decoded.name || "Doctor";
    }
  } catch (error) {
    console.error("Error decoding token:", error);
    doctorName = "Doctor";
  }

  // Fetch patients data
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setIsLoading(true);
        const res = await getDoctorPatients();
        setPatients(res.data || []);
      } catch (err) {
        console.error("Error fetching patients:", err);
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

  // Chart configuration
  const chartData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Appointments",
        data: [12, 19, 14, 22],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "New Patients",
        data: [8, 11, 9, 16],
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Weekly Statistics',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0,0,0,0.1)',
        },
      },
      x: {
        grid: {
          color: 'rgba(0,0,0,0.1)',
        },
      },
    },
  };

  // Generate mock data for demo
  const todayAppointments = Math.floor(Math.random() * 20) + 5;
  const pendingReports = Math.floor(Math.random() * 10) + 1;

  // Dashboard content
  const DashboardContent = () => (
    <Box>
      {/* Statistics Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Patients"
            value={patients?.length || 0}
            icon={<PeopleIcon fontSize="large" />}
            gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            trend="+12%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Today's Appointments"
            value={todayAppointments}
            icon={<CalendarTodayIcon fontSize="large" />}
            gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
            trend="+8%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Pending Reports"
            value={pendingReports}
            icon={<DescriptionIcon fontSize="large" />}
            gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
            trend="-5%"
          />
        </Grid>
      </Grid>

      {/* Chart Section */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
            <Typography variant="h6" fontWeight={700} mb={2}>
              Activity Overview
            </Typography>
            <Box sx={{ height: 300 }}>
              <Line data={chartData} options={chartOptions} />
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3, height: "100%" }}>
            <Typography variant="h6" fontWeight={700} mb={3}>
              Quick Actions
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <QuickActionCard
                title="Schedule Appointment"
                description="Book a new patient appointment"
                icon={<CalendarTodayIcon />}
                onClick={() => setSelectedSection("Appointments")}
                color="#3b82f6"
              />
              <QuickActionCard
                title="View Reports"
                description="Review pending medical reports"
                icon={<AssignmentIcon />}
                onClick={() => setSelectedSection("Reports")}
                color="#10b981"
              />
              <QuickActionCard
                title="Patient Messages"
                description="Check new patient messages"
                icon={<ChatIcon />}
                onClick={() => setSelectedSection("Messages")}
                color="#f59e0b"
              />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  // Main content renderer
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
        return <DashboardContent />;
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Loading state
  if (isLoading && selectedSection === "Dashboard") {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress size={60} />
        <Typography ml={2} variant="h6">Loading Dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: sidebarOpen ? 280 : 80,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: sidebarOpen ? 280 : 80,
            transition: "width 0.3s ease",
            background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
            color: "#fff",
            border: "none",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          },
        }}
      >
        {/* Sidebar Header */}
        <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {sidebarOpen && (
            <Box>
              <Typography variant="h6" fontWeight={700}>Doctor Panel</Typography>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>
                Gait Analysis System
              </Typography>
            </Box>
          )}
          <IconButton onClick={() => setSidebarOpen(!sidebarOpen)} sx={{ color: "#fff" }}>
            <MenuIcon />
          </IconButton>
        </Box>

        {/* Menu Items */}
        <List sx={{ px: 2, flexGrow: 1 }}>
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
        </List>

        {/* Logout Button */}
        <Box sx={{ p: 2 }}>
          <Divider sx={{ mb: 2, borderColor: "rgba(255,255,255,0.1)" }} />
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
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
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
            border: "1px solid rgba(226, 232, 240, 0.8)",
            minHeight: "calc(100vh - 48px)",
          }}
        >
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{
                background: "linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
              }}
            >
              Welcome Back, Dr. {doctorName}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Here's what's happening with your practice today
            </Typography>
          </Box>

          {/* Dynamic Content */}
          {renderContent()}
        </Paper>
      </Box>
    </Box>
  );
}