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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getPatients } from "../../services/clinicAdminServices";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import SearchIcon from "@mui/icons-material/Search";
import CakeIcon from "@mui/icons-material/Cake";
import SensorOccupiedIcon from "@mui/icons-material/SensorOccupied";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function PatientManagementPage({ refreshData }) {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Pagination states
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Statistics
  const [stats, setStats] = useState({
    totalPatients: 0,
    assignedToDoctors: 0,
    withSensorKits: 0,
    averageAge: 0,
  });

  const fetchPatients = async (currentPage = 0, currentSize = 10, search = "") => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        size: currentSize,
      };
      
      if (search) {
        params.search = search;
      }
      
      const response = await getPatients(params);
      const { content, totalPages, totalElements } = response.data;
      
      setPatients(content);
      setTotalPages(totalPages);
      setTotalElements(totalElements);
      setPage(currentPage);

      // Calculate statistics from current page data
      const assignedToDoctors = content.filter(p => p.doctorName).length;
      const withSensorKits = content.filter(p => p.sensorKitId).length;
      const averageAge = content.length > 0 
        ? Math.round(content.reduce((sum, p) => sum + p.age, 0) / content.length)
        : 0;

      setStats({
        totalPatients: totalElements,
        assignedToDoctors,
        withSensorKits,
        averageAge,
      });
      
    } catch (error) {
      console.error("Error fetching patients:", error);
      setSnackbar({ open: true, message: "Failed to load patients", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchPatients(0, pageSize, searchTerm);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, pageSize]);

  const handlePageChange = (event, newPage) => {
    fetchPatients(newPage, pageSize, searchTerm);
  };

  const getNameBasedColor = (name) => {
    const colors = [
      "#94a3b8", // Slate
      "#64748b", // Slate dark
      "#6b7280", // Gray
      "#78716c", // Stone
      "#ef4444", // Red (muted)
      "#f97316", // Orange (muted)
      "#eab308", // Yellow (muted)
      "#22c55e", // Green (muted)
      "#06b6d4", // Cyan (muted)
      "#3b82f6", // Blue (muted)
      "#8b5cf6", // Purple (muted)
      "#ec4899", // Pink (muted)
    ];
    
    // Generate consistent color based on name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const handlePageSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    setPageSize(newSize);
    fetchPatients(0, newSize, searchTerm);
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const getAgeGroup = (age) => {
    if (age < 18) return "Pediatric";
    if (age < 65) return "Adult";
    return "Senior";
  };

  const getAgeGroupColor = (age) => {
    if (age < 18) return "warning";
    if (age < 65) return "success";
    return "secondary";
  };

  const getAccountStatusColor = (status) => {
    const statusColors = {
      "ACCOUNT_CREATED": "success",
      "INVITATION_SENT": "warning",
    };
    return statusColors[status] || "default";
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

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
              Monitor and manage patient information and assignments ({totalElements} total)
            </Typography>
          </Box>
        </Box>

        {/* Search and Controls */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
            mb: 3,
          }}
        >
          <TextField
            placeholder="Search patients by name, doctor, or gender..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              flex: 1,
              minWidth: 300,
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
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton onClick={clearSearch} size="small">
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Active Search Filter */}
        {searchTerm && (
          <Box mb={2}>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Active filter:
            </Typography>
            <Chip
              label={`Search: "${searchTerm}"`}
              size="small"
              onDelete={clearSearch}
              color="primary"
              variant="outlined"
            />
          </Box>
        )}
      </Box>

      {/* Loading State */}
      {loading && patients.length === 0 ? (
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
      ) : (
        <>
          {/* Statistics */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6}>
              <Card
                sx={{
                  p: 3,
                  background: "linear-gradient(135deg, #0aa9beff 0%, #20638fff 100%)",
                  color: "white",
                  borderRadius: 3,
                  boxShadow: "0 8px 24px rgba(59, 130, 246, 0.3)",
                }}
              >
                <Typography variant="h4" fontWeight="800">
                  {stats.totalPatients}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Total Patients
                </Typography>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6}>
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
                  {stats.averageAge}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Average Age
                </Typography>
              </Card>
            </Grid>
          </Grid>

          {/* Patient Table */}
          <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                  <TableCell sx={{ fontWeight: 700, fontSize: 14 }}>Patient</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: 14 }}>Age & Gender</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: 14 }}>Doctor</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: 14 }}>Sensor Kit</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: 14 }}>Account Status</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: 14 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <CircularProgress size={24} />
                    </TableCell>
                  </TableRow>
                ) : patients.length > 0 ? (
                  patients.map((patient) => (
                    <TableRow 
                      key={patient.id} 
                      hover 
                      sx={{ 
                        "&:hover": { backgroundColor: "rgba(0,0,0,0.02)" },
                        cursor: "pointer"
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              bgcolor: getNameBasedColor(patient.name),
                              color: "white",
                              fontSize: 14,
                              fontWeight: 700,
                            }}
                          >
                            {patient.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.5 }}>
                              {patient.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {patient.id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <CakeIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                            <Typography variant="body2" fontWeight={600}>
                              {patient.age} years
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Chip
                              label={patient.gender}
                              size="small"
                              sx={{
                                fontWeight: 600,
                                fontSize: 11,
                                height: 24,
                              }}
                            />
                            <Chip
                              label={getAgeGroup(patient.age)}
                              size="small"
                              color={getAgeGroupColor(patient.age)}
                              variant="outlined"
                              sx={{ fontSize: 11, height: 24 }}
                            />
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <LocalHospitalIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {patient.doctorName || "Not assigned"}
                            </Typography>
                            {!patient.doctorName && (
                              <Typography variant="caption" color="warning.main">
                                Needs assignment
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <SensorOccupiedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                          <Box>
                            {patient.sensorKitId ? (
                              <>
                                <Typography variant="body2" fontWeight={600}>
                                  ID: {patient.sensorKitId}
                                </Typography>
                                {patient.sensorKit?.serialNo && (
                                  <Chip
                                    label="Active"
                                    size="small"
                                    color="success"
                                    variant="outlined"
                                    sx={{ fontSize: 10, height: 20, mt: 0.5 }}
                                  />
                                )}
                              </>
                            ) : (
                              <>
                                <Typography variant="body2" color="text.secondary">
                                  Not assigned
                                </Typography>
                                <Typography variant="caption" color="warning.main">
                                  Needs sensor kit
                                </Typography>
                              </>
                            )}
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          
                          <Box>
                            {patient.accountStatus ? (
                              <Chip
                                label={patient.accountStatus}
                                size="small"
                                color={getAccountStatusColor(patient.accountStatus)}
                                variant="outlined"
                                sx={{ 
                                  fontSize: 11, 
                                  height: 24,
                                  fontWeight: 600,
                                }}
                              />
                            ) : (
                              <Chip
                                label="Unknown"
                                size="small"
                                color="default"
                                variant="outlined"
                                sx={{ 
                                  fontSize: 11, 
                                  height: 24,
                                  fontWeight: 600,
                                }}
                              />
                            )}
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Tooltip title="View Patient">
                            <IconButton size="small" color="primary">
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Patient">
                            <IconButton size="small" color="secondary">
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                      <Box sx={{ textAlign: "center" }}>
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
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            
            <TablePagination
              component="div"
              count={totalElements}
              page={page}
              onPageChange={handlePageChange}
              rowsPerPage={pageSize}
              onRowsPerPageChange={handlePageSizeChange}
              rowsPerPageOptions={[5, 10, 20, 50]}
              labelRowsPerPage="Patients per page:"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`
              }
            />
          </TableContainer>
        </>
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