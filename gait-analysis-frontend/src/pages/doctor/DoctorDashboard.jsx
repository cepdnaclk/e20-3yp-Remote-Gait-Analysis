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
  Avatar,
  Chip,
  CircularProgress,
  Container,
  Paper,
  Divider,
  Button,
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
  PlayCircleFilledWhite as PlayCircleFilledWhiteIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";

import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useNavigate } from "react-router-dom";
import { getDoctorPatients } from "../../services/doctorServices";
import Appointments from "../Appointments";
import Reports from "../Reports";
import Messages from "../Messages";
import Settings from "../Settings";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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
    <CardContent sx={{ p: 4, position: "relative", zIndex: 1 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
        <Box sx={{ p: 2, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)" }}>
          {icon}
        </Box>
        {trend && (
          <Chip
            label={trend}
            size="small"
            sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white", fontWeight: 600, backdropFilter: "blur(10px)" }}
          />
        )}
      </Box>
      <Typography variant="h3" fontWeight={800} mb={1}>{value}</Typography>
      <Typography variant="h6" fontWeight={600} opacity={0.9}>{title}</Typography>
    </CardContent>
  </Card>
);

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
      <Box sx={{ p: 2, borderRadius: 2, background: `${color}15`, color }}>{icon}</Box>
      <Box>
        <Typography variant="h6" fontWeight={700} mb={1}>{title}</Typography>
        <Typography variant="body2" color="text.secondary">{description}</Typography>
      </Box>
    </Box>
  </Card>
);

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSection, setSelectedSection] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const token = localStorage.getItem("token");
  let doctorName = token ? JSON.parse(atob(token.split(".")[1])).sub : "";

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await getDoctorPatients();
        setPatients(res.data);
      } catch (err) {
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

  const chartData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Appointments",
        data: [12, 19, 14, 22],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
      },
      {
        label: "New Patients",
        data: [8, 11, 9, 16],
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
      },
    ],
  };

  const renderContent = () => {
    if (selectedSection === "Dashboard") {
      return (
        <Container maxWidth="xl" sx={{ px: 0 }}>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                title="Total Patients"
                value={patients.length}
                icon={<PeopleIcon sx={{ fontSize: 32 }} />}
                gradient="linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
                trend="+2 this week"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                title="Today's Appointments"
                value={Math.floor(Math.random() * 20) + 5}
                icon={<CalendarTodayIcon sx={{ fontSize: 32 }} />}
                gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
                trend="+4 today"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                title="Pending Reports"
                value={`${Math.floor(Math.random() * 10) + 1}`}
                icon={<DescriptionIcon sx={{ fontSize: 32 }} />}
                gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                trend="Awaiting Review"
              />
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6}>
              <QuickActionCard
                title="Real-Time Gait Monitoring"
                description="View live gait analysis data for your patients."
                icon={<PlayCircleFilledWhiteIcon sx={{ fontSize: 24 }} />}
                onClick={() => setSelectedSection("Patients")}
                color="#10b981"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <QuickActionCard
                title="Review Gait Reports"
                description="Analyze test session results and leave feedback."
                icon={<VisibilityIcon sx={{ fontSize: 24 }} />}
                onClick={() => setSelectedSection("Reports")}
                color="#3b82f6"
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} mb={2}>Weekly Trends</Typography>
                <Line data={chartData} />
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} mb={2}>Upcoming Appointments</Typography>
                <Box>
                  <Typography variant="body2">July 10 - Gait Analysis with John Doe</Typography>
                  <Typography variant="body2">July 11 - Checkup for Jane Smith</Typography>
                  <Typography variant="body2">July 12 - Evaluation for Sam Fernando</Typography>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Container>
      );
    }
    if (selectedSection === "Patients") return <Appointments />;
    if (selectedSection === "Appointments") return <Appointments />;
    if (selectedSection === "Reports") return <Reports />;
    if (selectedSection === "Messages") return <Messages />;
    if (selectedSection === "Settings") return <Settings />;
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
        <Typography ml={2}>Loading Patient Data...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
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
        <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {sidebarOpen && (
            <Box>
              <Typography variant="h6" fontWeight={700}>Doctor Panel</Typography>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>Gait System</Typography>
            </Box>
          )}
          <IconButton onClick={() => setSidebarOpen(!sidebarOpen)} sx={{ color: "#fff" }}>
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
                <ListItemIcon sx={{ color: "#94a3b8", minWidth: 40 }}>{item.icon}</ListItemIcon>
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
              <ListItemIcon sx={{ color: "#f87171", minWidth: 40 }}><LogoutIcon /></ListItemIcon>
              {sidebarOpen && <ListItemText primary="Logout" />}
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
            border: "1px solid rgba(226, 232, 240, 0.8)",
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{
                background: "linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Welcome Back, Dr. {doctorName}
            </Typography>
            <Typography variant="h6" color="text.secondary">Here’s what’s happening today</Typography>
          </Box>

          {renderContent()}
        </Paper>
      </Box>
    </Box>
  );
}
