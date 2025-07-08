// src/pages/DoctorPatientsPage.jsx
import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  IconButton,
  Chip,
  Avatar,
  CircularProgress,
  Alert,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  MonitorHeart as MonitorHeartIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  CalendarToday as CalendarTodayIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function DoctorPatientsPage({ patients, isLoading, error }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter patients based on search query
  const filteredPatients = patients?.filter((patient) =>
    patient.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.phoneNumber?.includes(searchQuery) ||
    patient.id?.toString().includes(searchQuery)
  ) || [];

  const handleViewProfile = (patientId, event) => {
    event?.stopPropagation();
    navigate(`/patients/${patientId}`);
  };

  const handleRealtimeGait = (patientId, event) => {
    event?.stopPropagation();
    navigate(`/patients/${patientId}/realtime`);
  };

  // Loading state
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress size={60} />
        <Typography ml={2} variant="h6">Loading Patients...</Typography>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        <Typography variant="h6">Error fetching patients</Typography>
        <Typography>{error.message}</Typography>
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} mb={1}>
          Patient Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and manage all your patients, access their profiles and real-time gait analysis
        </Typography>
      </Box>

      {/* Search Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          border: "1px solid rgba(226, 232, 240, 0.8)",
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search patients by name, email, phone, or ID..."
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              "&:hover fieldset": {
                borderColor: "#3b82f6",
              },
            },
          }}
        />
        <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Total Patients: <strong>{patients?.length || 0}</strong>
          </Typography>
          {searchQuery && (
            <Typography variant="body2" color="text.secondary">
              Filtered Results: <strong>{filteredPatients.length}</strong>
            </Typography>
          )}
        </Box>
      </Paper>

      {/* Patients Table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid rgba(226, 232, 240, 0.8)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                <TableCell sx={{ fontWeight: 700, py: 2 }}>Patient</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Contact</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Details</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <TableRow
                    key={patient.id}
                    onClick={() => handleViewProfile(patient.id)}
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "#f8fafc",
                        transform: "scale(1.001)",
                      },
                      transition: "all 0.2s ease",
                      "&:last-child td": { border: 0 },
                    }}
                  >
                    {/* Patient Info */}
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: "#3b82f6",
                            width: 40,
                            height: 40,
                            fontSize: "0.9rem",
                          }}
                        >
                          {patient.name?.charAt(0)?.toUpperCase() || "P"}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {patient.name || "Unknown Patient"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ID: {patient.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Contact Info */}
                    <TableCell>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <EmailIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            {patient.email || "No email"}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <PhoneIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            {patient.phoneNumber || "No phone"}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Patient Details */}
                    <TableCell>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <Typography variant="body2">
                          <strong>Age:</strong> {patient.age || "N/A"}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Gender:</strong> {patient.gender || "N/A"}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Sensor:</strong> {patient.sensorKitId || "N/A"}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Chip
                        label={patient.status || "Active"}
                        color={patient.status === "Active" ? "success" : "default"}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Tooltip title="View Profile">
                          <IconButton
                            size="small"
                            onClick={(e) => handleViewProfile(patient.id, e)}
                            sx={{
                              color: "#3b82f6",
                              "&:hover": { backgroundColor: "#eff6ff" },
                            }}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Real-time Gait Analysis">
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<MonitorHeartIcon />}
                            onClick={(e) => handleRealtimeGait(patient.id, e)}
                            sx={{
                              backgroundColor: "#10b981",
                              "&:hover": { backgroundColor: "#059669" },
                              borderRadius: 2,
                              textTransform: "none",
                              fontWeight: 600,
                            }}
                          >
                            Real-time
                          </Button>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: "center" }}>
                      <PersonIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" mb={1}>
                        {searchQuery ? "No patients found" : "No patients available"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {searchQuery
                          ? `No patients match "${searchQuery}". Try a different search term.`
                          : "Start by adding patients to your practice."}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Summary Footer */}
      {filteredPatients.length > 0 && (
        <Box
          sx={{
            mt: 3,
            p: 2,
            borderRadius: 2,
            bgcolor: "#f8fafc",
            border: "1px solid rgba(226, 232, 240, 0.8)",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Showing {filteredPatients.length} of {patients?.length || 0} patients
            {searchQuery && ` matching "${searchQuery}"`}
          </Typography>
        </Box>
      )}
    </Box>
  );
}