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
} from "@mui/material";

import { useEffect, useState } from "react";
import { getClinics, addClinic } from "../../services/rootServices";
import { useNavigate } from "react-router-dom";

export default function ManageClinicsPage() {
  const navigate = useNavigate();

  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newClinic, setNewClinic] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    // username: '',
    // password: '',
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
      .then((res) => setClinics(res.data))
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

  const handleAddClinic = () => {
    addClinic(newClinic)
      .then((res) => {
        setClinics((prev) => [...prev, res.data]);
        setOpen(false);
        setNewClinic({
          name: "",
          phoneNumber: "",
          email: "",
          username: "",
          password: "",
        });
        setSnackbar({
          open: true,
          message: "Clinic added successfully",
          severity: "success",
        });
      })
      .catch((err) => {
        console.error("Failed to add clinic", err);
        setSnackbar({
          open: true,
          message: err.response?.data?.message || "Failed to add clinic",
          severity: "error",
        });
      });
  };

  const handleChange = (field) => (e) => {
    setNewClinic({ ...newClinic, [field]: e.target.value });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

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
      <Typography variant="h5" gutterBottom>
        Manage Clinics
      </Typography>
      <Button variant="contained" onClick={() => setOpen(true)} sx={{ mb: 2 }}>
        Add Clinic
      </Button>

      <TableContainer
        component={Paper}
        sx={{
          boxShadow: 4,
          borderRadius: 2,
          overflow: "hidden",
          border: "1px solid #e0e0e0",
        }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f7fa" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Clinic Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              {/*<TableCell>Username</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {clinics.map((clinic) => (
              <TableRow
                key={clinic.id || clinic.username}
                hover
                onClick={() => navigate(`/root/clinics/${clinic.id}`)}
                style={{ cursor: "pointer" }}
              >
                <TableCell>{clinic.name}</TableCell>
                <TableCell>{clinic.phoneNumber}</TableCell>
                <TableCell>{clinic.email}</TableCell>
                {/*<TableCell>{clinic.username}</TableCell>*/}
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
          {/* <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={newClinic.username}
            onChange={handleChange("username")}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={newClinic.password}
            onChange={handleChange("password")}
          /> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAddClinic}
            disabled={!isFormValid}
          >
            Add
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
