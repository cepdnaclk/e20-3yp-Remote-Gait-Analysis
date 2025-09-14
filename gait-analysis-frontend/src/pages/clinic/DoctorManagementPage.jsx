import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Card,
  Avatar,
  Chip,
  IconButton,
  InputAdornment,
  Grid,
  Container,
  Divider,
  CircularProgress,
  TablePagination,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getDoctors, addDoctor } from "../../services/clinicAdminServices";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BadgeIcon from "@mui/icons-material/Badge";
import SearchIcon from "@mui/icons-material/Search";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function DoctorManagementPage({ refreshData }) {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Pagination states
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Statistics
  const [stats, setStats] = useState({
    totalDoctors: 0,
    specializations: 0,
  });

  const [newDoctor, setNewDoctor] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    specialization: "",
  });

  const [addingDoctor, setAddingDoctor] = useState(false);

  const fetchDoctors = async (currentPage = 0, currentSize = 10, search = "") => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        size: currentSize,
      };
      
      if (search) {
        params.search = search;
      }
      
      const response = await getDoctors(params);
      const { content, totalPages, totalElements } = response.data;
      
      setDoctors(content);
      setTotalPages(totalPages);
      setTotalElements(totalElements);
      setPage(currentPage);

      // Calculate statistics
      const uniqueSpecializations = [...new Set(content.map(d => d.specialization))].length;
      setStats({
        totalDoctors: totalElements,
        specializations: uniqueSpecializations,
      });
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setSnackbar({
        open: true,
        message: "Failed to load doctors",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchDoctors(0, pageSize, searchTerm);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, pageSize]);

  const handlePageChange = (event, newPage) => {
    fetchDoctors(newPage, pageSize, searchTerm);
  };

  const handlePageSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    setPageSize(newSize);
    fetchDoctors(0, newSize, searchTerm);
  };

  const handleChange = (field) => (e) => {
    setNewDoctor({ ...newDoctor, [field]: e.target.value });
  };

  const isFormValid = () => {
    return (
      newDoctor.name &&
      newDoctor.email &&
      newDoctor.specialization &&
      newDoctor.phoneNumber
    );
  };

  const handleAddDoctor = async () => {
    setAddingDoctor(true);
    try {
      await addDoctor(newDoctor);
      setSnackbar({
        open: true,
        message: "Doctor added successfully",
        severity: "success",
      });
      setNewDoctor({
        name: "",
        email: "",
        phoneNumber: "",
        specialization: "",
      });
      setOpen(false);
      
      // Refresh the current page
      await fetchDoctors(page, pageSize, searchTerm);
      
      // Also refresh the dashboard data if callback provided
      if (refreshData) refreshData();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to add doctor",
        severity: "error",
      });
    } finally {
      setAddingDoctor(false);
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

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

  const getSpecializationColor = (specialization) => {
    const colors = {
      Cardiology: "#ef4444",
      Neurology: "#8b5cf6",
      Orthopedics: "#10b981",
      Pediatrics: "#f59e0b",
      Dermatology: "#06b6d4",
      Psychiatry: "#ec4899",
      General: "#6b7280",
    };
    return colors[specialization] || "#3b82f6";
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
              background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              color: "white",
            }}
          >
            <LocalHospitalIcon sx={{ fontSize: 24 }} />
          </Box>
          <Box>
            <Typography
              variant="h4"
              fontWeight="700"
              sx={{ color: "text.primary" }}
            >
              Doctor Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage healthcare professionals and their information ({totalElements} total)
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
            placeholder="Search doctors by name, email, or specialization..."
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

          <Button
            variant="contained"
            size="large"
            startIcon={<PersonAddIcon />}
            onClick={() => setOpen(true)}
            sx={{
              px: 3,
              py: 1.5,
              borderRadius: 2,
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              boxShadow: "0 4px 16px rgba(16, 185, 129, 0.3)",
              fontWeight: 600,
              "&:hover": {
                background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                transform: "translateY(-1px)",
                boxShadow: "0 8px 24px rgba(16, 185, 129, 0.4)",
              },
              transition: "all 0.2s ease",
            }}
          >
            Add Doctor
          </Button>
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
      {loading && doctors.length === 0 ? (
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
              Loading doctors...
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
                  background: "linear-gradient(135deg, #299368ff 0%, #065d3dff 100%)",
                  color: "white",
                  borderRadius: 3,
                  boxShadow: "0 8px 24px rgba(59, 130, 246, 0.3)",
                }}
              >
                <Typography variant="h4" fontWeight="800">
                  {stats.totalDoctors}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Total Doctors
                </Typography>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Card
                sx={{
                  p: 3,
                  background: "linear-gradient(135deg, #5e4992ff 0%, #49228cff 100%)",
                  color: "white",
                  borderRadius: 3,
                  boxShadow: "0 8px 24px rgba(139, 92, 246, 0.3)",
                }}
              >
                <Typography variant="h4" fontWeight="800">
                  {stats.specializations}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Specializations
                </Typography>
              </Card>
            </Grid>
          </Grid>

          {/* Doctor Table */}
          <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                  <TableCell sx={{ fontWeight: 700, fontSize: 14 }}>Doctor</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: 14 }}>Specialization</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: 14 }}>Contact</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: 14 }}>Account Status</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: 14 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <CircularProgress size={24} />
                    </TableCell>
                  </TableRow>
                ) : doctors.length > 0 ? (
                  doctors.map((doctor) => (
                    <TableRow 
                      key={doctor.id} 
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
                              bgcolor: getNameBasedColor(doctor.name),
                              color: "white",
                              fontSize: 14,
                              fontWeight: 700,
                            }}
                          >
                            {doctor.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.5 }}>
                              {doctor.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {doctor.id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Box>
                            {doctor.accountStatus ? (
                              <Chip
                                label={doctor.accountStatus}
                                size="small"
                                color={getAccountStatusColor(doctor.accountStatus)}
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
                        <Chip
                          label={doctor.specialization}
                          size="small"
                          sx={{
                            bgcolor: `${getSpecializationColor(doctor.specialization)}15`,
                            color: getSpecializationColor(doctor.specialization),
                            fontWeight: 600,
                            fontSize: 11,
                            height: 24,
                            borderRadius: 2,
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <EmailIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                            <Typography variant="body2" color="text.secondary">
                              {doctor.email}
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <PhoneIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                            <Typography variant="body2" color="text.secondary">
                              {doctor.phoneNumber}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Tooltip title="View Doctor">
                            <IconButton size="small" color="primary">
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Doctor">
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
                    <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                      <Box sx={{ textAlign: "center" }}>
                        <MedicalServicesIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                          {searchTerm ? "No doctors found" : "No doctors registered"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {searchTerm 
                            ? `No doctors match your search for "${searchTerm}"`
                            : "Start by adding your first doctor to the system"
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
              labelRowsPerPage="Doctors per page:"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`
              }
            />
          </TableContainer>
        </>
      )}

      {/* Add Doctor Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          },
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "white",
              }}
            >
              <PersonAddIcon sx={{ fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight="700">
                Add New Doctor
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enter doctor information and credentials
              </Typography>
            </Box>
          </Box>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                value={newDoctor.name}
                onChange={handleChange("name")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeIcon sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={newDoctor.email}
                onChange={handleChange("email")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={newDoctor.phoneNumber}
                onChange={handleChange("phoneNumber")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Specialization"
                value={newDoctor.specialization}
                onChange={handleChange("specialization")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocalHospitalIcon sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={() => setOpen(false)}
            sx={{
              px: 3,
              py: 1,
              borderRadius: 2,
              color: "text.secondary",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddDoctor}
            disabled={!isFormValid() || addingDoctor}
            startIcon={addingDoctor ? <CircularProgress size={20} /> : null}
            sx={{
              px: 3,
              py: 1,
              borderRadius: 2,
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              fontWeight: 600,
              "&:hover": {
                background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
              },
              "&:disabled": {
                background: "rgba(0,0,0,0.12)",
                color: "rgba(0,0,0,0.26)",
              },
            }}
          >
            Add Doctor
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
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