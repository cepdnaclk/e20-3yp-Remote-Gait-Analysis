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
import { useMemo } from "react";

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

  const ProfileField = ({ label, value }) => (
    <Box mb={1}>
      <Typography
        variant="subtitle2"
        sx={{ color: "text.secondary", fontSize: 14 }}
      >
        {label}
      </Typography>
      <Typography variant="body1" fontWeight="500" sx={{ fontSize: 16 }}>
        {value}
      </Typography>
    </Box>
  );
  

  // Latest session
  const latestSession = useMemo(() => {
    return [...testSessions]
      .filter((s) => s.status === "COMPLETED")
      .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))[0];
  }, [testSessions]);

  const renderContent = () => {

  
    switch (selectedSection) {

      case "Profile":
  return (
    <Card
      sx={{
        p: 4,
        boxShadow: 5,
        borderRadius: 4,
        background: "linear-gradient(145deg, #ffffff, #f2f2f2)",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        gap: 4,
      }}
    >
      {/* Left: Avatar */}
<Box
  sx={{
    width: 160,
    height: 160,
    borderRadius: "50%",
    overflow: "hidden",
    border: "4px solid #e0e0e0",
    boxShadow: 3,
    flexShrink: 0,
    position: "relative",
  }}
>
<img
  src={
    patient.photoUrl && patient.photoUrl.trim() !== ""
      ? patient.photoUrl
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
          patient.name
        )}&background=dee2e6&color=263238&rounded=true&size=160`
  }
  alt="Patient Avatar"
  style={{ width: "100%", height: "100%", objectFit: "cover" }}
/>


  {/* Optional: Upload Button Overlay */}
  <label htmlFor="upload-avatar">
    <Box
      sx={{
        position: "absolute",
        bottom: 0,
        width: "100%",
        textAlign: "center",
        bgcolor: "rgba(0,0,0,0.5)",
        color: "#fff",
        fontSize: 12,
        cursor: "pointer",
        py: 0.5,
      }}
    >
      Change
    </Box>
    <input
      id="upload-avatar"
      type="file"
      accept="image/*"
      style={{ display: "none" }}
      onChange={(e) => {
        const file = e.target.files[0];
        if (file) {
          // upload logic here (to Firebase / your server)
          // then update patient.photoUrl state
        }
      }}
    />
  </label>
</Box>


      {/* Right: Info */}
      <Box flex={1}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          🧍 Patient Profile
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <ProfileField label="Name" value={patient.name} />
            <ProfileField label="Gender" value={patient.gender} />
            <ProfileField label="Email" value={patient.email} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <ProfileField label="Age" value={`${patient.age} yrs`} />
            <ProfileField
              label="Height / Weight"
              value={`${patient.height} cm / ${patient.weight} kg`}
            />
            <ProfileField label="Phone" value={patient.phoneNumber} />
          </Grid>
        </Grid>

        {/* Doctor Info */}
        <Box
          mt={4}
          p={2}
          sx={{
            background: "#e8f5e9",
            borderRadius: 2,
            borderLeft: "5px solid #66bb6a",
          }}
        >
          <Typography variant="subtitle2" color="text.secondary">
            Assigned Doctor For You
          </Typography>
          <Typography variant="h6" fontWeight="bold" color="#2e7d32">
            {patient.doctorName || "Not Assigned"}
          </Typography>
        </Box>
      </Box>
    </Card>
  );

      


        // case TEST SESSIONS
        case "Test Sessions":
  return (
    <Grid container spacing={3}>
      {/* Left: Go to Test Session */}
      <Grid item xs={12} sm={6}>
        <Card sx={{ p: 5, backgroundColor: "#7986cb", color: "white", boxShadow: 3 }}>
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

      
    </Grid>
  );

      {/* DASHBOARD SECTION */}  
      default:
        return (
          <Grid container spacing={3} mt={1}>
            <Grid item xs={12} sm={6} md={6}>
              <Card sx={{ p: 2, textAlign: "center", height: "100%", background: "#E0F7FA", boxShadow: 6, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <CardContent>
                  <DescriptionIcon fontSize="large" />
                  <Typography variant="h6">Latest Report</Typography>
                  <Typography variant="body1">
                    Reviewed on{" "}
                    {latestSession
                      ? new Date(latestSession.endTime).toLocaleDateString()
                      : "N/A"}
                  </Typography>

                  <Button
                    variant="outlined"
                    sx={{ mt: 2 }}
                    onClick={() => {
                      if (latestSession) {
                        
                          const el = document.getElementById(`session-${latestSession.sessionId}`);
                          if (el) {

                            // Smooth scroll into view
                            el.scrollIntoView({ behavior: "smooth" });

                            // Highlight the element
                            el.style.transition = "background-color 0.5s";
                            el.style.backgroundColor = "#fff9c4";

                            // Delay to remove highlight
                            setTimeout(() => {
                              el.style.backgroundColor = "";
                            }, 1200);

                            // Trigger click to navigate
                            setTimeout(() => {
                              el.click();
                            }, 600); // Delay to allow scroll/animation first
                          } else {
                            console.warn("Element not found:", `session-${latestSession.sessionId}`);
                          }
                         
                      }
                    }}
                  >
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

            {/* Right: Test Session History */}
            <Grid item xs={12} sm={12} marginTop={8} >
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
                          id = {`session-${session.sessionId}`}
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
