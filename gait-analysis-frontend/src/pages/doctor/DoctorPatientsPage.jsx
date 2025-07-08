// src/pages/DoctorPatientsPage.jsx
import { useState, useEffect } from "react";
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
  Pagination,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
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
import { getDoctorPatients } from "../../services/doctorServices";

export default function DoctorPatientsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch patients with pagination
  const fetchPatients = async (page = 0, size = 5, search = "") => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Use the service function with parameters object
      const params = {
        page: page,
        size: size,
        ...(search.trim() && { search: search.trim() })
      };
      
      const response = await getDoctorPatients(params);
      
      // Axios returns data in response.data
      if (response.data) {
        setPatients(response.data.content || []);
        setTotalElements(response.data.totalElements || 0);
        setTotalPages(response.data.totalPages || 0);
        setCurrentPage(response.data.page || 0);
      }
    } catch (err) {
      console.error("Error fetching patients:", err);
      setError(err);
      setPatients([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchPatients(currentPage, pageSize, searchQuery);
  }, []);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Reset to first page when searching
      setCurrentPage(0);
      fetchPatients(0, pageSize, searchQuery);
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [searchQuery, pageSize]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePageChange = (event, page) => {
    const newPage = page - 1; // MUI Pagination is 1-based, API is 0-based
    setCurrentPage(newPage);
    fetchPatients(newPage, pageSize, searchQuery);
  };

  const handlePageSizeChange = (event) => {
    const newSize = event.target.value;
    setPageSize(newSize);
    setCurrentPage(0); // Reset to first page
    fetchPatients(0, newSize, searchQuery);
  };

  const handleViewProfile = (patient, event) => {
    event?.stopPropagation();
    // Pass patient data via navigation state
    navigate(`/patients/${patient.id}`, { state: { patient } });
  };

  const handleRealtimeGait = (patientId, event) => {
    event?.stopPropagation();
    navigate(`/patients/${patientId}/realtime`);
  };

  // Loading state
  if (isLoading && patients.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress size={60} />
        <Typography ml={2} variant="h6">Loading Patients...</Typography>
      </Box>
    );
  }

  // Error state
  if (error && patients.length === 0) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        <Typography variant="h6">Error fetching patients</Typography>
        <Typography>{error.message}</Typography>
        <Button onClick={() => fetchPatients(currentPage, pageSize, searchQuery)} sx={{ mt: 1 }}>
          Retry
        </Button>
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

      {/* Search and Filter Section */}
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
        <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "flex-end" }}>
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
          <FormControl variant="outlined" sx={{ minWidth: 120 }}>
            <InputLabel>Per Page</InputLabel>
            <Select
              value={pageSize}
              onChange={handlePageSizeChange}
              label="Per Page"
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          <Typography variant="body2" color="text.secondary">
            Total Patients: <strong>{totalElements}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Page: <strong>{currentPage + 1}</strong> of <strong>{totalPages || 1}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Showing: <strong>{patients.length}</strong> results
          </Typography>
          {searchQuery && (
            <Chip
              label={`Searching: "${searchQuery}"`}
              onDelete={() => setSearchQuery("")}
              size="small"
              variant="outlined"
              color="primary"
            />
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
          position: "relative",
        }}
      >
        {/* Loading overlay */}
        {isLoading && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255,255,255,0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1,
            }}
          >
            <CircularProgress size={40} />
          </Box>
        )}

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
              {patients.length > 0 ? (
                patients.map((patient) => (
                  <TableRow
                    key={patient.id}
                    onClick={() => handleViewProfile(patient)}
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
                        label="Active"
                        color="success"
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
                            onClick={(e) => handleViewProfile(patient, e)}
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

      {/* Pagination Section */}
      {totalPages > 1 && (
        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Showing {patients.length} of {totalElements} patients
            {searchQuery && ` matching "${searchQuery}"`}
          </Typography>
          
          <Pagination
            count={totalPages}
            page={currentPage + 1} // Convert 0-based to 1-based
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
            sx={{
              "& .MuiPaginationItem-root": {
                borderRadius: 2,
              },
            }}
          />
        </Box>
      )}

      {/* Summary Footer for single page */}
      {totalPages <= 1 && patients.length > 0 && (
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
            Showing {patients.length} of {totalElements} patients
            {searchQuery && ` matching "${searchQuery}"`}
          </Typography>
        </Box>
      )}
    </Box>
  );
}