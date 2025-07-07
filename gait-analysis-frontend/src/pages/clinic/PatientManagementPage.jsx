import {
  Box,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Card,
  Avatar,
  Chip,
  InputAdornment,
  TextField,
  Grid,
  Container,
  Fade,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getPatients } from "../../services/clinicAdminServices";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import DevicesIcon from "@mui/icons-material/Devices";
import SearchIcon from "@mui/icons-material/Search";
import CakeIcon from "@mui/icons-material/Cake";
import WcIcon from "@mui/icons-material/Wc";
import SensorOccupiedIcon from "@mui/icons-material/SensorOccupied";

export default function PatientManagementPage({ patients: initialPatients, refreshData }) {
  const [patients, setPatients] = useState(initialPatients || []);
  const [filteredPatients, setFilteredPatients] = useState(initialPatients || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(!initialPatients);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    if (!initialPatients) {
      getPatients()
        .then((res) => {
          setPatients(res.data);
          setFilteredPatients(res.data);
        })
        .catch(() => {
          setSnackbar({ open: true, message: "Failed to load patients", severity: "error" });
        })
        .finally(() => setLoading(false));
    } else {
      setFilteredPatients(initialPatients);
    }
  }, [initialPatients]);

  useEffect(() => {
    const filtered = patients.filter((patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.doctor?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.gender.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(filtered);
  }, [searchTerm, patients]);

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const getGenderColor = (gender) => {
    const colors = {
      "Male": "#3b82f6",
      "Female": "#ec4899", 
      "Other": "#8b5cf6",
    };
    return colors[gender] || "#6b7280";
  };

  const getAgeGroup = (age) => {
    if (age < 18) return "Pediatric";
    if (age < 65) return "Adult";
    return "Senior";
  };

  const getAgeGroupColor = (age) => {
    if (age < 18) return "#f59e0b";
    if (age < 65) return "#10b981";
    return "#8b5cf6";
  };

  const PatientCard = ({ patient }) => (
    <Fade in={true}>
      <Card
        sx={{
          p: 3,
          height: "100%",
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          border: "1px solid rgba(226, 232, 240, 0.8)",
          borderRadius: 3,
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 3, mb: 3 }}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              background: `linear-gradient(135deg, ${getGenderColor(patient.gender)}15 0%, ${getGenderColor(patient.gender)}25 100%)`,
              color: getGenderColor(patient.gender),
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            {patient.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </Avatar>
          
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight="700" sx={{ mb: 1, color: "text.primary" }}>
              {patient.name}
            </Typography>
            
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip
                label={patient.gender}
                size="small"
                sx={{
                  bgcolor: `${getGenderColor(patient.gender)}15`,
                  color: getGenderColor(patient.gender),
                  fontWeight: 600,
                  borderRadius: 2,
                }}
              />
              
              <Chip
                label={getAgeGroup(patient.age)}
                size="small"
                sx={{
                  bgcolor: `${getAgeGroupColor(patient.age)}15`,
                  color: getAgeGroupColor(patient.age),
                  fontWeight: 600,
                  borderRadius: 2,
                }}
              />
            </Box>
          </Box>
        </Box>
        
        {/* Patient Details */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <CakeIcon sx={{ fontSize: 18, color: "text.secondary" }} />
            <Typography variant="body2" color="text.secondary">
              <strong>{patient.age}</strong> years old
            </Typography>
          </Box>
          
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <LocalHospitalIcon sx={{ fontSize: 18, color: "text.secondary" }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Assigned Doctor
              </Typography>
              <Typography variant="body2" fontWeight="600" color="text.primary">
                {patient.doctor?.name || "Not assigned"}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <SensorOccupiedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Sensor Kit
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2" fontWeight="600" color="text.primary">
                  {patient.sensorKit?.serialNo || "Not assigned"}
                </Typography>
                {patient.sensorKit?.serialNo && (
                  <Chip
                    label="Active"
                    size="small"
                    sx={{
                      bgcolor: "rgba(34, 197, 94, 0.1)",
                      color: "#16a34a",
                      fontWeight: 600,
                      fontSize: 10,
                      height: 20,
                    }}
                  />
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Card>
    </Fade>
  );

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="50vh"
        sx={{ bgcolor: "transparent" }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={48} thickness={4} />
          <Typography variant="h6" sx={{ mt: 2, color: "text.secondary" }}>
            Loading patients...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ px: 0 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "white",
            }}
          >
            <PeopleIcon sx={{ fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight="700" sx={{ color: "text.primary" }}>
              Patient Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Monitor and manage patient information and assignments
            </Typography>
          </Box>
        </Box>

        {/* Search */}
        <TextField
          placeholder="Search patients by name, doctor, or gender..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            maxWidth: 500,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: "white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "text.secondary" }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 3,
              background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              color: "white",
              borderRadius: 3,
              boxShadow: "0 8px 24px rgba(59, 130, 246, 0.3)",
            }}
          >
            <Typography variant="h4" fontWeight="800">
              {filteredPatients.length}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Total Patients
            </Typography>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 3,
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "white",
              borderRadius: 3,
              boxShadow: "0 8px 24px rgba(16, 185, 129, 0.3)",
            }}
          >
            <Typography variant="h4" fontWeight="800">
              {filteredPatients.filter(p => p.doctor?.name).length}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Assigned to Doctors
            </Typography>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 3,
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              color: "white",
              borderRadius: 3,
              boxShadow: "0 8px 24px rgba(245, 158, 11, 0.3)",
            }}
          >
            <Typography variant="h4" fontWeight="800">
              {filteredPatients.filter(p => p.sensorKit?.serialNo).length}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              With Sensor Kits
            </Typography>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 3,
              background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
              color: "white",
              borderRadius: 3,
              boxShadow: "0 8px 24px rgba(139, 92, 246, 0.3)",
            }}
          >
            <Typography variant="h4" fontWeight="800">
              {Math.round(filteredPatients.reduce((sum, p) => sum + p.age, 0) / filteredPatients.length) || 0}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Average Age
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Patient Cards */}
      {filteredPatients.length > 0 ? (
        <Grid container spacing={3}>
          {filteredPatients.map((patient) => (
            <Grid item xs={12} sm={6} lg={4} key={patient.id}>
              <PatientCard patient={patient} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Card
          sx={{
            p: 6,
            textAlign: "center",
            background: "rgba(148, 163, 184, 0.05)",
            border: "1px dashed rgba(148, 163, 184, 0.3)",
            borderRadius: 3,
          }}
        >
          <PersonIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            {searchTerm ? "No patients found" : "No patients registered"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm 
              ? `No patients match your search for "${searchTerm}"`
              : "Patient records will appear here once they are registered"
            }
          </Typography>
        </Card>
      )}

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={handleCloseSnackbar} 
          sx={{ 
            width: "100%",
            borderRadius: 2,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}