// Final merged and resolved version of ManageClinicsPage

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
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { getClinics, addClinic } from "../../services/rootServices";
import { useNavigate } from "react-router-dom";

export default function ManageClinicsPage() {
  const navigate = useNavigate();
  const [clinics, setClinics] = useState([]);
  const [filteredClinics, setFilteredClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [addingClinic, setAddingClinic] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);

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

  useEffect(() => {
    getClinics()
      .then((res) => {
        setClinics(res.data);
        setFilteredClinics(res.data);
      })
      .catch((err) => {
        console.error("Failed to load clinics", err);
        setSnackbar({
          open: true,
          message: "Error loading clinics",
          severity: "error",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const filtered = clinics.filter(
      (clinic) =>
        clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        clinic.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        clinic.phoneNumber.includes(searchQuery)
    );
    setFilteredClinics(filtered);
    setCurrentPage(0);
  }, [searchQuery, clinics]);

  const handleAddClinic = () => {
    setAddingClinic(true);
    addClinic(newClinic)
      .then((res) => {
        const updated = [...clinics, res.data];
        setClinics(updated);
        setOpen(false);
        setNewClinic({ name: "", phoneNumber: "", email: "" });
        setSnackbar({
          open: true,
          message: "Clinic added successfully",
          severity: "success",
        });
        setAddingClinic(false);
      })
      .catch((err) => {
        console.error("Failed to add clinic", err);
        setSnackbar({
          open: true,
          message: err.response?.data?.message || "Failed to add clinic",
          severity: "error",
        });
        setAddingClinic(false);
      });
  };

  const handleChange = (field) => (e) => {
    setNewClinic({ ...newClinic, [field]: e.target.value });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setCurrentPage(0);
  };

  const paginatedClinics = filteredClinics.slice(
    currentPage * pageSize,
    currentPage * pageSize + pageSize
  );

  if (loading) {
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
        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
          <InputLabel>Per Page</InputLabel>
          <Select
            value={pageSize}
            onChange={handlePageSizeChange}
            label="Per Page"
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
          </Select>
        </FormControl>
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
            {paginatedClinics.map((clinic) => (
              <TableRow
                key={clinic.id || clinic.email}
                hover
                onClick={() => navigate(`/root/clinics/${clinic.id}`)}
                sx={{ cursor: "pointer" }}
              >
                <TableCell>{clinic.name}</TableCell>
                <TableCell>{clinic.phoneNumber}</TableCell>
                <TableCell>{clinic.email}</TableCell>
              </TableRow>
            ))}
            {paginatedClinics.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No clinics found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        mt={3}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="body2">
          Showing {paginatedClinics.length} of {filteredClinics.length} clinics
        </Typography>
        <Box>
          {[...Array(Math.ceil(filteredClinics.length / pageSize)).keys()].map(
            (page) => (
              <Button
                key={page}
                variant={page === currentPage ? "contained" : "outlined"}
                size="small"
                onClick={() => setCurrentPage(page)}
                sx={{ mx: 0.5 }}
              >
                {page + 1}
              </Button>
            )
          )}
        </Box>
      </Box>

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
