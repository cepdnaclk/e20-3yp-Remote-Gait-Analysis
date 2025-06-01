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
  
        <TableContainer
          component={Paper}
          sx={{
            boxShadow: 4,
            borderRadius: 2,
            overflow: "hidden",
            border: "1px solid #e0e0e0",
          }}
        >
          <Table size="small">
            <TableHead sx={{ backgroundColor: "#f5f7fa" }}>
              <TableRow>
                <TableCell sx={{ py: 2, px: 3, fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ py: 2, px: 3, fontWeight: "bold" }}>Age</TableCell>
                <TableCell sx={{ py: 2, px: 3, fontWeight: "bold" }}>Gender</TableCell>
                <TableCell sx={{ py: 2, px: 3, fontWeight: "bold" }}>Doctor</TableCell>
                <TableCell sx={{ py: 2, px: 3, fontWeight: "bold" }}>Sensor Kit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.length > 0 ? (
                patients.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell sx={{ py: 2, px: 3 }}>{p.name}</TableCell>
                    <TableCell sx={{ py: 2, px: 3 }}>{p.age}</TableCell>
                    <TableCell sx={{ py: 2, px: 3 }}>{p.gender}</TableCell>
                    <TableCell sx={{ py: 2, px: 3 }}>{p.doctor?.name || "Not assigned"}</TableCell>
                    <TableCell sx={{ py: 2, px: 3 }}>{p.sensorKit?.serialNo || "Not assigned"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    No patients registered.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

  
        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar}>
          <Alert severity={snackbar.severity} onClose={handleCloseSnackbar} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    );
  }
  