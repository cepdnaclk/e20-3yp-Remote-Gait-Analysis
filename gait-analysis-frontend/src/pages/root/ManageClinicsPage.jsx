// Updated ManageClinicsPage to handle paginated response

import { useEffect, useState } from "react";
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
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { getClinics, addClinic } from "../../services/rootServices";
import { useNavigate } from "react-router-dom";

export default function ManageClinicsPage() {
  const navigate = useNavigate();
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
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

  // Fetch clinics with pagination and search
  const fetchClinics = async (pageNum = 0, pageSize = 5, search = "") => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        size: pageSize.toString(),
      });
      
      if (search.trim()) {
        params.append('search', search.trim());
      }

      const response = await getClinics(`?${params.toString()}`);
      const data = response.data;
      
      setClinics(data.content || []);
      setTotalElements(data.totalElements || 0);
      setTotalPages(data.totalPages || 0);
      setPage(data.page || 0);
      setSize(data.size || pageSize);
    } catch (err) {
      console.error("Failed to load clinics", err);
      setSnackbar({
        open: true,
        message: "Error loading clinics",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClinics(page, size, searchQuery);
  }, [page, size, searchQuery]);

  // Handle search with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page === 0) {
        fetchClinics(0, size, searchQuery);
      } else {
        setPage(0); // Reset to first page when searching
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

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
      fetchClinics(page, size, searchQuery);
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

      <Box display="flex" gap={2} alignItems="flex-end" mb={2}>
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
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f8fafc" }}>
              <TableCell sx={{ fontWeight: 700 }}>Clinic Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
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
                  <TableCell>{clinic.name}</TableCell>
                  <TableCell>{clinic.phoneNumber}</TableCell>
                  <TableCell>{clinic.email}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No clinics found
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