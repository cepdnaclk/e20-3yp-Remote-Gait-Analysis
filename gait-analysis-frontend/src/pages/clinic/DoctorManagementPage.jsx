import {
    Box,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert,
  } from "@mui/material";
  import { useEffect, useState } from "react";
  import { getDoctors, addDoctor } from "../../services/clinicAdminServices";
  
  export default function DoctorManagementPage({ doctors: initialDoctors, refreshData }) {
    const [doctors, setDoctors] = useState(initialDoctors || []);
    const [open, setOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  
    const [newDoctor, setNewDoctor] = useState({
      name: "",
      email: "",
      phoneNumber: "",
      specialization: "",
      username: "",
      password: "",
    });
  
    useEffect(() => {
      if (!initialDoctors) {
        getDoctors().then((res) => setDoctors(res.data)).catch(() => {
          setSnackbar({ open: true, message: "Failed to load doctors", severity: "error" });
        });
      }
    }, [initialDoctors]);
  
    const handleChange = (field) => (e) => {
      setNewDoctor({ ...newDoctor, [field]: e.target.value });
    };
  
    const handleAddDoctor = async () => {
      try {
        await addDoctor(newDoctor);
        setSnackbar({ open: true, message: "Doctor added successfully", severity: "success" });
        setNewDoctor({
          name: "",
          email: "",
          phoneNumber: "",
          specialization: "",
          username: "",
          password: "",
        });
        setOpen(false);
        if (refreshData) refreshData();
        else {
          const res = await getDoctors();
          setDoctors(res.data);
        }
      } catch (err) {
        setSnackbar({ open: true, message: "Failed to add doctor", severity: "error" });
      }
    };
  
    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });
  
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Doctors
        </Typography>
        <Button variant="contained" onClick={() => setOpen(true)} sx={{ mb: 2 }}>
          Add Doctor
        </Button>
  
        <Paper>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Specialization</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {doctors.length > 0 ? (
                doctors.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>{doc.name}</TableCell>
                    <TableCell>{doc.email}</TableCell>
                    <TableCell>{doc.phoneNumber}</TableCell>
                    <TableCell>{doc.specialization}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No doctors available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
  
        {/* Add Doctor Dialog */}
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Add Doctor</DialogTitle>
          <DialogContent>
            <TextField fullWidth label="Name" margin="normal" value={newDoctor.name} onChange={handleChange("name")} />
            <TextField fullWidth label="Email" margin="normal" value={newDoctor.email} onChange={handleChange("email")} />
            <TextField fullWidth label="Phone Number" margin="normal" value={newDoctor.phoneNumber} onChange={handleChange("phoneNumber")} />
            <TextField fullWidth label="Specialization" margin="normal" value={newDoctor.specialization} onChange={handleChange("specialization")} />
            <TextField fullWidth label="Username" margin="normal" value={newDoctor.username} onChange={handleChange("username")} />
            <TextField fullWidth label="Password" type="password" margin="normal" value={newDoctor.password} onChange={handleChange("password")} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleAddDoctor} disabled={!newDoctor.name || !newDoctor.email}>
              Add
            </Button>
          </DialogActions>
        </Dialog>
  
        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar}>
          <Alert severity={snackbar.severity} onClose={handleCloseSnackbar} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    );
  }
  