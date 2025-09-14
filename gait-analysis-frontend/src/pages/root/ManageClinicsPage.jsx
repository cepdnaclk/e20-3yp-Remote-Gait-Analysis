import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TablePagination,
  Chip,
  Avatar,
  Grid
} from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";
import { getClinics, addClinic } from "../../services/rootServices";
import { useNavigate } from "react-router-dom";

export default function ManageClinicsPage() {
  const navigate = useNavigate();
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // New status filter state
  const [addingClinic, setAddingClinic] = useState(false);

  // Pagination state - now handled by backend
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [open, setOpen] = useState(false);
  const [newClinic, setNewClinic] = useState({
    name: "",
    phoneNumber: "",
    email: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const isFormValid = Object.values(newClinic).every(
    (field) => field.trim() !== ""
  );

  // Fetch clinics with pagination, search, and status filter
  const fetchClinics = useCallback(async (pageNum = 0, pageSize = 5, search = "", status = "") => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        size: pageSize.toString(),
      });
      
      if (search.trim()) {
        params.append('search', search.trim());
      }

      if (status.trim()) {
        params.append('status', status.trim());
      }

      const response = await getClinics(`?${params.toString()}`);
      const data = response.data;
      
      setClinics(data.content || []);
      setTotalElements(data.totalElements || 0);
      setTotalPages(data.totalPages || 0);
      // Don't override page state here as it can cause issues
    } catch (err) {
      console.error("Failed to load clinics", err);
      setSnackbar({
        open: true,
        message: "Error loading clinics",
        severity: "error",
      });
      setClinics([]);
      setTotalElements(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect for handling page and size changes
  useEffect(() => {
    fetchClinics(page, size, searchQuery, statusFilter);
  }, [page, size, fetchClinics]);

  // Effect for handling search and status filter with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      // Reset to first page when searching or filtering
      setPage(0);
      fetchClinics(0, size, searchQuery, statusFilter);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter, size, fetchClinics]);

  const handleAddClinic = async () => {
    setAddingClinic(true);
    try {
      const response = await addClinic(newClinic);
      setOpen(false);
      setNewClinic({ name: "", phoneNumber: "", email: "" });
      setSnackbar({
        open: true,
        message: "Clinic added successfully",
        severity: "success",
      });
      // Refresh the current page
      fetchClinics(page, size, searchQuery, statusFilter);
    } catch (err) {
      console.error("Failed to add clinic", err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to add clinic",
        severity: "error",
      });
    } finally {
      setAddingClinic(false);
    }
  };

  const handleChange = (field) => (e) => {
    setNewClinic({ ...newClinic, [field]: e.target.value });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newSize = parseInt(event.target.value, 10);
    setSize(newSize);
    setPage(0);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "ACCOUNT_CREATED":
        return "Account Created";
      case "INVITATION_SENT":
        return "Invitation Sent";
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ACCOUNT_CREATED":
        return "success";
      case "INVITATION_SENT":
        return "warning";
      default:
        return "default";
    }
  };

  if (loading && clinics.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="50vh"
      >
        <CircularProgress />
        <Typography ml={2}>Loading Clinics...</Typography>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight={700}>
          Manage Clinics
        </Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Add Clinic
        </Button>
      </Box>

      {/* Search and Filter Section */}
      <Box mb={3}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search clinics by name, phone, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Account Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Account Status"
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="ACCOUNT_CREATED">Account Created</MenuItem>
                <MenuItem value="INVITATION_SENT">Invitation Sent</MenuItem>
                
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={clearFilters}
              startIcon={<ClearIcon />}
              disabled={!searchQuery && !statusFilter}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Active Filters Display */}
      {(searchQuery || statusFilter) && (
        <Box mb={2}>
          <Typography variant="body2" color="text.secondary" mb={1}>
            Active filters:
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            {searchQuery && (
              <Chip
                label={`Search: "${searchQuery}"`}
                size="small"
                onDelete={() => setSearchQuery("")}
                color="primary"
                variant="outlined"
              />
            )}
            {statusFilter && (
              <Chip
                label={`Status: ${getStatusLabel(statusFilter)}`}
                size="small"
                onDelete={() => setStatusFilter("")}
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
        </Box>
      )}

      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f8fafc" }}>
              <TableCell sx={{ fontWeight: 700 }}>Clinic Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Account Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : clinics.length > 0 ? (
              clinics.map((clinic) => (
                <TableRow
                  key={clinic.id}
                  hover
                  onClick={() => navigate(`/root/clinics/${clinic.id}`)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: "#469943ff",
                          width: 40,
                          height: 40,
                          fontSize: "0.9rem",
                        }}
                      >
                        {clinic.name?.charAt(0)?.toUpperCase() || "C"}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {clinic.name || "Unknown Clinic"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ID: {clinic.id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{clinic.phoneNumber}</TableCell>
                  <TableCell>{clinic.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(clinic.accountStatus)}
                      color={getStatusColor(clinic.accountStatus)}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography variant="body1" color="text.secondary">
                    {searchQuery || statusFilter ? "No clinics match your search criteria" : "No clinics found"}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        <TablePagination
          component="div"
          count={totalElements}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={size}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 20, 50]}
          labelRowsPerPage="Clinics per page:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`
          }
        />
      </TableContainer>

      {/* Add Clinic Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Clinic</DialogTitle>
        <DialogContent>
          <TextField
            label="Clinic Name"
            fullWidth
            margin="normal"
            value={newClinic.name}
            onChange={handleChange("name")}
          />
          <TextField
            label="Phone Number"
            fullWidth
            margin="normal"
            value={newClinic.phoneNumber}
            onChange={handleChange("phoneNumber")}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={newClinic.email}
            onChange={handleChange("email")}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAddClinic}
            disabled={!isFormValid || addingClinic}
            startIcon={addingClinic ? <CircularProgress size={20} /> : null}
          >
            {addingClinic ? "Adding..." : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}