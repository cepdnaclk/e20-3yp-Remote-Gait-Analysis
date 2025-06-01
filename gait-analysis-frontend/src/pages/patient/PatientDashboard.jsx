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
import HistoryIcon from "@mui/icons-material/History";


import { useNavigate } from "react-router-dom";
import { getPatientProfile, getMyTestSessions } from "../../services/patientServices";


export default function PatientDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedSection, setSelectedSection] = useState("Dashboard");
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [testSessions, setTestSessions] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getPatientProfile();
        setPatient(res.data);

        const testRes = await getMyTestSessions();
        console.log("Loaded test sessions:", testRes.data); 
        setTestSessions(testRes.data);
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
    <Card sx={{ p: 4, boxShadow: 4, borderRadius: 2, background: "#E0F7FA" }}>
      <CardContent>
        <Typography variant="h5" fontWeight="bold" marginTop={0} gutterBottom>
          🧍 Profile Summary
        </Typography>

        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" mb={1} fontSize={18}><strong>Name:</strong> {patient.name}</Typography>
            <Typography variant="body1" mb={1} fontSize={18}><strong>Email:</strong> {patient.email}</Typography>
            <Typography variant="body1" mb={1} fontSize={18}><strong>Phone:</strong> {patient.phoneNumber}</Typography>
            <Typography variant="body1" mb={1} fontSize={18}><strong>Gender:</strong> {patient.gender}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" mb={1} fontSize={18}><strong>Age:</strong> {patient.age}</Typography>
            <Typography variant="body1" mb={1} fontSize={18}><strong>Height:</strong> {patient.height} cm</Typography>
            <Typography variant="body1" mb={1} fontSize={18}><strong>Weight:</strong> {patient.weight} kg</Typography>
            <Typography variant="body1" mb={1} fontSize={18}>
              <strong>Assigned Doctor:</strong> {patient.doctorName || "Not Assigned"}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );


        // case TEST SESSIONS
        case "Test Sessions":
  return (
    <Grid container spacing={3}>
      {/* Left: Go to Test Session */}
      <Grid item xs={12} sm={6}>
        <Card sx={{ p: 3, backgroundColor: "#7986cb", color: "white", boxShadow: 3 }}>
          <AssessmentIcon fontSize="large" />
          <Typography variant="h6" gutterBottom>Run New Session</Typography>
          <Typography variant="body1">
            Start a gait analysis session using your assigned sensor kit.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            sx={{ mt: 2 }}
            onClick={() => navigate("/patient/test-session")}
          >
            Go to Test Session
          </Button>
        </Card>
      </Grid>

      {/* Right: Test Session History */}
      <Grid item xs={12} sm={6} >
        <Card sx={{ p: 3, boxShadow: 4, background: "#E0F7FA" }} bgcolor="#F2F4F7">
          <CardContent>
            <Typography variant="h5" fontWeight="bold"  gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <HistoryIcon fontSize="medium" />
              Test Session History
            </Typography>
            {testSessions.length === 0 ? (
              <Typography>No sessions found.</Typography>
            ) : (
              <Grid container spacing={2}>
                {testSessions.map((session) => (
                  <Grid item xs={12} key={session.sessionId}>
                    <Card
                      variant="outlined"
                      sx={{
                        p: 2,
                        cursor: "pointer",
                        "&:hover": { backgroundColor: "#F2F4F7" },
                        borderLeft: session.status === "FAILED" ? "5px solid red" : "5px solid #3f51b5",
                        backgroundColor: session.status === "FAILED" ? "#fff0f0" : "inherit",
                      }}
                      onClick={() => {
                        if (session.status !== "FAILED") navigate(`/patient/test-session/${session.sessionId}`)}}
                    >
                      <Typography variant="subtitle1" fontWeight="bold">
                        Session #{session.sessionId}
                      </Typography>
                      <Typography variant="body2">
                        🕒 {new Date(session.startTime).toLocaleString()}
                      </Typography>
                      <Typography variant="body2">
                        👣 Steps: {session.results?.steps ?? "N/A"} | ⚖️ Balance: {session.results?.balanceScore ?? "N/A"}
                      </Typography>
                      <Typography variant="body2">
                        🗒️ Feedback: {session.feedback?.notes?.substring(0, 100) || "No feedback yet..."}
                      </Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

        
      default:
        return (
          <Grid container spacing={3} mt={1}>
            <Grid item xs={12} sm={6} md={6}>
              <Card sx={{ p: 2, textAlign: "center", height: "100%", background: "#E0F7FA", boxShadow: 6, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
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
              <Card sx={{ p: 2, textAlign: "center", background: "#FFF3E0", boxShadow: 6, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
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
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <Box
          sx={{
            backgroundColor: "#ffffff",
            borderRadius: 2,
            p: 3,
            boxShadow: 5,
            height: "400px",
            
          }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Patient Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Welcome {patient.name}, manage your sessions and view insights below.
          </Typography>

          <Box mt={3}>{renderContent()}</Box>
        </Box>
      </Box>

      
    </Box>
  );
}
