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
  CardContent,
  Avatar,
  Chip,
  IconButton,
  InputAdornment,
  Grid,
  Container,
  Fade,
  Divider,
  CircularProgress,
  Pagination,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
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

export default function DoctorManagementPage({ refreshData }) {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
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
      setFilteredDoctors(content);
      setTotalPages(totalPages);
      setTotalElements(totalElements);
      setPage(currentPage);
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
      if (searchTerm !== "") {
        fetchDoctors(0, pageSize, searchTerm);
      } else {
        fetchDoctors(page, pageSize);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handlePageChange = (event, newPage) => {
    fetchDoctors(newPage - 1, pageSize, searchTerm);
  };

  const handlePageSizeChange = (event) => {
    const newSize = event.target.value;
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

  const DoctorCard = ({ doctor }) => (
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
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 3 }}>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              background: `linear-gradient(135deg, ${getSpecializationColor(
                doctor.specialization
              )}15 0%, ${getSpecializationColor(
                doctor.specialization
              )}25 100%)`,
              color: getSpecializationColor(doctor.specialization),
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            {doctor.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </Avatar>

          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              fontWeight="700"
              sx={{ mb: 1, color: "text.primary" }}
            >
              {doctor.name}
            </Typography>

            <Chip
              label={doctor.specialization}
              size="small"
              sx={{
                mb: 2,
                bgcolor: `${getSpecializationColor(doctor.specialization)}15`,
                color: getSpecializationColor(doctor.specialization),
                fontWeight: 600,
                borderRadius: 2,
              }}
            />

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
          </Box>
        </Box>
      </Card>
    </Fade>
  );

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
            }}
          />

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Per Page</InputLabel>
            <Select
              value={pageSize}
              label="Per Page"
              onChange={handlePageSizeChange}
              sx={{
                borderRadius: 2,
                backgroundColor: "white",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </FormControl>

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
      </Box>

      {/* Loading State */}
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="50vh"
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
          {/* Content */}
          {filteredDoctors.length > 0 ? (
            <>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {filteredDoctors.map((doctor) => (
                  <Grid item xs={12} sm={6} lg={4} key={doctor.id}>
                    <DoctorCard doctor={doctor} />
                  </Grid>
                ))}
              </Grid>

              {/* Pagination */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mt: 4,
                  gap: 2,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Showing {page * pageSize + 1}-{Math.min((page + 1) * pageSize, totalElements)} of {totalElements} doctors
                </Typography>
                <Pagination
                  count={totalPages}
                  page={page + 1}
                  onChange={handlePageChange}
                  color="primary"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Box>
            </>
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
              <MedicalServicesIcon
                sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                {searchTerm ? "No doctors found" : "No doctors available"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {searchTerm
                  ? `No doctors match your search for "${searchTerm}"`
                  : "Start by adding your first doctor to the system"}
              </Typography>
            </Card>
          )}
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