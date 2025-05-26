import {
    Box,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    CircularProgress,
    Snackbar,
    Alert,
  } from "@mui/material";
  import { useEffect, useState } from "react";
  import { getPatients } from "../../services/clinicAdminServices";
  
  export default function PatientManagementPage({ patients: initialPatients, refreshData }) {
    const [patients, setPatients] = useState(initialPatients || []);
    const [loading, setLoading] = useState(!initialPatients);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  
    useEffect(() => {
      if (!initialPatients) {
        getPatients()
          .then((res) => setPatients(res.data))
          .catch(() => {
            setSnackbar({ open: true, message: "Failed to load patients", severity: "error" });
          })
          .finally(() => setLoading(false));
      }
    }, [initialPatients]);
  
    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });
  
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" height="40vh">
          <CircularProgress />
          <Typography ml={2}>Loading patients...</Typography>
        </Box>
      );
    }
  
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Patients
        </Typography>
  
        <Paper>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Doctor</TableCell>
                <TableCell>Sensor Kit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.length > 0 ? (
                patients.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.age}</TableCell>
                    <TableCell>{p.gender}</TableCell>
                    <TableCell>{p.doctor?.name || "Not assigned"}</TableCell>
                    <TableCell>{p.sensorKit?.serialNo || "Not assigned"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No patients registered.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
  
        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar}>
          <Alert severity={snackbar.severity} onClose={handleCloseSnackbar} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    );
  }
  