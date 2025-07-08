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
  Divider,
  Chip,
  Avatar,
  LinearProgress,
  Stack,
  Button,
} from "@mui/material";

import {
  Menu as MenuIcon,
  Business as BusinessIcon,
  Devices as DevicesIcon,
  Assignment as AssignmentIcon,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  TrendingUp as TrendingUpIcon,
  Inventory as InventoryIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Analytics as AnalyticsIcon,
  Speed as SpeedIcon,
} from "@mui/icons-material";

import { Pie, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

import { getClinics, getSensorKits } from "../../services/rootServices";
import ManageClinicsPage from "./ManageClinicsPage";
import ManageSensorKitsPage from "./ManageSensorKitsPage";
import AssignSensorKitsPage from "./AssignSensorKitsPage";
import { useNavigate } from "react-router-dom";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

// Enhanced StatCard Component
const StatCard = ({ title, value, icon, gradient, trend, subtitle }) => (
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 3,
        }}
      >
        <Box
          sx={{
            p: 2,
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
      <Typography variant="h3" fontWeight={800} mb={1}>
        {value}
      </Typography>
      <Typography variant="h6" fontWeight={600} opacity={0.9}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" opacity={0.8} mt={0.5}>
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
);

// Quick Action Card Component
const QuickActionCard = ({ title, description, icon, onClick, color }) => (
  <Card
    onClick={onClick}
    sx={{
      p: 3,
      cursor: "pointer",
      borderRadius: 3,
      border: "1px solid #e5e7eb",
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
        borderColor: color,
      },
    }}
  >
    <Box sx={{ display: "flex", gap: 2 }}>
      <Box sx={{ p: 2, borderRadius: 2, background: `${color}15`, color }}>
        {icon}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" fontWeight={700} mb={1} color="#111827">
          {title}
        </Typography>
        <Typography variant="body2" color="#6b7280">
          {description}
        </Typography>
      </Box>
    </Box>
  </Card>
);

// System Health Card Component
const SystemHealthCard = ({ metric, value, status, color }) => (
  <Box sx={{ p: 2, borderRadius: 2, bgcolor: "#f8fafc", border: "1px solid #e5e7eb" }}>
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
      <Typography variant="body2" fontWeight={600} color="#374151">
        {metric}
      </Typography>
      <Chip
        label={status}
        size="small"
        sx={{
          bgcolor: color === "#10b981" ? "#ecfdf5" : color === "#f59e0b" ? "#fef3c7" : "#fef2f2",
          color: color === "#10b981" ? "#047857" : color === "#f59e0b" ? "#92400e" : "#dc2626",
          fontWeight: 600,
          fontSize: "0.7rem",
        }}
      />
    </Box>
    <Typography variant="h5" fontWeight={700} color={color} mb={1}>
      {value}
    </Typography>
    <LinearProgress
      variant="determinate"
      value={parseInt(value)}
      sx={{
        height: 6,
        borderRadius: 3,
        backgroundColor: "#e5e7eb",
        "& .MuiLinearProgress-bar": {
          backgroundColor: color,
          borderRadius: 3,
        },
      }}
    />
  </Box>
);

export default function SystemAdminDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedSection, setSelectedSection] = useState("Dashboard");
  const [clinics, setClinics] = useState([]);
  const [kits, setKits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clinicsRes, kitsRes] = await Promise.all([
          getClinics(),
          getSensorKits(),
        ]);
        setClinics(clinicsRes.data || []);
        setKits(kitsRes.data || []);
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon /> },
    { text: "Clinics", icon: <BusinessIcon /> },
    { text: "Sensor Kits", icon: <DevicesIcon /> },
    { text: "Assign Sensor Kits", icon: <AssignmentIcon /> },
  ];

  // Calculate kit statistics
  const inStockKits = kits.filter((k) => k.status === "IN_STOCK").length;
  const availableKits = kits.filter((k) => k.status === "AVAILABLE").length;
  const inUseKits = kits.filter((k) => k.status === "IN_USE").length;
  const totalKits = kits.length;

  // Chart configurations
  const pieChartData = {
    labels: ["In Stock", "Available", "In Use", "Other"],
    datasets: [
      {
        data: [
          inStockKits,
          availableKits,
          inUseKits,
          totalKits - inStockKits - availableKits - inUseKits,
        ],
        backgroundColor: ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b"],
        borderWidth: 0,
        cutout: "60%",
      },
    ],
  };

  const lineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Active Clinics",
        data: [1, 2, 3, 2, 2, clinics.length],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Total Sensor Kits",
        data: [5, 7, 10, 14, 15, totalKits],
        borderColor: "#10b981",
        backgroundColor: "rgba(16,185,129,0.1)",
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
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
    },
  };

  const DashboardContent = () => (
    <Box>
      {/* Statistics Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Clinics"
            value={clinics.length}
            icon={<BusinessIcon sx={{ fontSize: 32 }} />}
            gradient="linear-gradient(135deg,rgb(59, 191, 134) 0%,rgb(11, 119, 83) 100%)"
            trend="+12%"
            subtitle="Active healthcare facilities"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Sensor Kits"
            value={totalKits}
            icon={<DevicesIcon sx={{ fontSize: 32 }} />}
            gradient="linear-gradient(135deg,rgb(154, 120, 222) 0%,rgb(131, 31, 151) 100%)"
            trend="+8%"
            subtitle="Available hardware units"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="In Stock Kits"
            value={inStockKits}
            icon={<InventoryIcon sx={{ fontSize: 32 }} />}
            gradient="linear-gradient(135deg, #00d2d3 0%, #54a0ff 100%)"
            trend="+15%"
            subtitle="Ready for deployment"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Assigned Kits"
            value={availableKits}
            icon={<AssignmentIcon sx={{ fontSize: 32 }} />}
            gradient="linear-gradient(135deg,rgb(194, 86, 165) 0%,rgb(109, 18, 97) 100%)"
            trend="+6%"
            subtitle="Currently deployed"
          />
        </Grid>
      </Grid>

      {/* Charts and Analytics */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ p: 3, borderRadius: 3, height: 400 }}>
            <Typography variant="h6" fontWeight={700} mb={3} color="#111827">
              System Growth Analytics
            </Typography>
            <Box sx={{ height: 300 }}>
              <Line data={lineChartData} options={chartOptions} />
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card sx={{ p: 3, borderRadius: 3, height: 400 }}>
            <Typography variant="h6" fontWeight={700} mb={3} color="#111827">
              Sensor Kit Distribution
            </Typography>
            <Box sx={{ height: 250, display: "flex", justifyContent: "center" }}>
              <Doughnut data={pieChartData} options={chartOptions} />
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <QuickActionCard
            title="Manage Clinics"
            description="Add, edit, or remove healthcare facilities"
            icon={<BusinessIcon />}
            onClick={() => setSelectedSection("Clinics")}
            color="#3b82f6"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <QuickActionCard
            title="Sensor Inventory"
            description="Monitor and manage sensor kit inventory"
            icon={<InventoryIcon />}
            onClick={() => setSelectedSection("Sensor Kits")}
            color="#10b981"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <QuickActionCard
            title="Kit Assignment"
            description="Assign sensor kits to clinics and patients"
            icon={<AssignmentIcon />}
            onClick={() => setSelectedSection("Assign Sensor Kits")}
            color="#8b5cf6"
          />
        </Grid>
      </Grid>

      {/* System Health Monitoring */}
      <Card sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={700} mb={3} color="#111827">
          System Health Monitoring
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <SystemHealthCard
              metric="Server Performance"
              value="95%"
              status="Excellent"
              color="#10b981"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <SystemHealthCard
              metric="Database Load"
              value="67%"
              status="Good"
              color="#f59e0b"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <SystemHealthCard
              metric="API Response Time"
              value="89%"
              status="Good"
              color="#10b981"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <SystemHealthCard
              metric="Storage Usage"
              value="78%"
              status="Normal"
              color="#f59e0b"
            />
          </Grid>
        </Grid>
      </Card>
    </Box>
  );

  const renderContent = () => {
    switch (selectedSection) {
      case "Clinics":
        return <ManageClinicsPage />;
      case "Sensor Kits":
        return <ManageSensorKitsPage />;
      case "Assign Sensor Kits":
        return <AssignSensorKitsPage />;
      default:
        return <DashboardContent />;
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <CircularProgress size={60} sx={{ color: "white", mb: 3 }} />
        <Typography variant="h5" color="white" fontWeight={600} mb={1}>
          Loading System Dashboard
        </Typography>
        <Typography variant="body1" color="rgba(255,255,255,0.8)">
          Initializing system components...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      {/* Enhanced Sidebar */}
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
              <Typography variant="h6" fontWeight={700}>
                RehabGait Admin
              </Typography>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>
                System Control Panel
              </Typography>
            </Box>
          )}
          <IconButton onClick={() => setSidebarOpen(!sidebarOpen)} sx={{ color: "#fff" }}>
            <MenuIcon />
          </IconButton>
        </Box>

        {/* Navigation Menu */}
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

        {/* Logout Section */}
        <Box sx={{ p: 2 }}>
          <Divider sx={{ mb: 2, borderColor: "rgba(255,255,255,0.1)" }} />
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
        </Box>
      </Drawer>

      {/* Main Content Area */}
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
          {/* Header Section */}
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
              System Administrator Dashboard
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Monitor and manage your entire RehabGait ecosystem from one central location
            </Typography>
          </Box>

          {/* Dynamic Content */}
          {renderContent()}
        </Paper>
      </Box>
    </Box>
  );
}