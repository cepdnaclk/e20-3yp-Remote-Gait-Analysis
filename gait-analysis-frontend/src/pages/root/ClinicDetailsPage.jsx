import {
    Box,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    IconButton,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Snackbar,
    Alert,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Divider
  } from '@mui/material';
  import DeleteIcon from '@mui/icons-material/Delete';
  import { useEffect, useState } from 'react';
  import { useParams, useNavigate } from 'react-router-dom';
  import {
    getClinics,
    getSensorKits,
    assignSensorKits,
  } from '../../services/rootServices';
  import axios from 'axios';
  
  export default function ClinicDetailsPage() {
    const { clinicId } = useParams();
    const navigate = useNavigate();
  
    const [clinic, setClinic] = useState(null);
    const [assignedKits, setAssignedKits] = useState([]);
    const [availableKits, setAvailableKits] = useState([]);
    const [selectedKits, setSelectedKits] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [confirmDelete, setConfirmDelete] = useState(false);
  
    useEffect(() => {
      fetchClinicData();
    }, [clinicId]);
  
    const fetchClinicData = async () => {
      try {
        const [clinicsRes, kitsRes] = await Promise.all([getClinics(), getSensorKits()]);
        const clinicData = clinicsRes.data.find((c) => c.id.toString() === clinicId);
  
        // Show only AVAILABLE and IN_USE kits assigned to this clinic
        const assigned = kitsRes.data.filter(
          (k) =>
            k.clinicId === clinicData.id &&
            (k.status === 'AVAILABLE' || k.status === 'IN_USE')
        );
  
        // Show only IN_STOCK kits for assignment
        const available = kitsRes.data.filter((k) => k.status === 'IN_STOCK');
  
        setClinic(clinicData);
        setAssignedKits(assigned);
        setAvailableKits(available);
      } catch (err) {
        console.error('Error loading clinic data', err);
      }
    };
  
    const handleAssign = async () => {
      try {
        await assignSensorKits(clinic.id, selectedKits);
        setSnackbar({ open: true, message: 'Sensor kits assigned', severity: 'success' });
        setSelectedKits([]);
        fetchClinicData();
      } catch (err) {
        console.error('Error assigning kits', err);
        setSnackbar({ open: true, message: 'Failed to assign kits', severity: 'error' });
      }
    };
  
    const handleRemoveKit = async (kitId) => {
      try {
        await axios.patch(`http://localhost:8080/api/sensor-kits/${kitId}/unassign`);
        fetchClinicData();
        setSnackbar({ open: true, message: 'Sensor kit removed', severity: 'info' });
      } catch (err) {
        setSnackbar({ open: true, message: 'Error removing sensor kit', severity: 'error' });
      }
    };
  
    const handleDeleteClinic = async () => {
      try {
        await axios.delete(`http://localhost:8080/api/clinics/${clinic.id}`);
        setSnackbar({ open: true, message: 'Clinic deleted', severity: 'success' });
        setTimeout(() => navigate('/root/dashboard'), 1000);
      } catch (err) {
        setSnackbar({ open: true, message: 'Failed to delete clinic', severity: 'error' });
      }
    };
  
    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });
  
    if (!clinic) return <Typography p={4}>Loading clinic details...</Typography>;
  
    return (
      <Box p={4} sx ={{
        background: "linear-gradient(to bottom, rgb(28, 32, 57), rgb(6, 40, 97))",
        minheight: "100vh"}}
        >
        {/* Clinic Profile Card */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>{clinic.name}</Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">Email : </Typography>
              <Typography>{clinic.email}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">Phone :</Typography>
              <Typography>{clinic.phoneNumber}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button color="error" variant="outlined" sx={{ mt: 2 }} onClick={() => setConfirmDelete(true)}>
                Delete Clinic
              </Button>
            </Grid>
          </Grid>
        </Paper>
  
        {/* Assigned Sensor Kits */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>Sensor Kits Assigned to This Clinic</Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Serial No</TableCell>
                <TableCell>Firmware</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignedKits.length > 0 ? assignedKits.map((kit) => (
                <TableRow key={kit.serialNo}>
                  <TableCell>{kit.serialNo}</TableCell>
                  <TableCell>{kit.firmwareVersion}</TableCell>
                  <TableCell>
                    <Chip
                      label={kit.status}
                      color={
                        kit.status === 'IN_USE'
                          ? 'warning'
                          : kit.status === 'AVAILABLE'
                          ? 'primary'
                          : 'default'
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton color="error" onClick={() => handleRemoveKit(kit.serialNo)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">No sensor kits assigned to this clinic.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
  
        {/* Assign New Kits */}
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Assign New Sensor Kits to This Clinic</Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Kits</InputLabel>
            <Select
              multiple
              value={selectedKits}
              onChange={(e) => setSelectedKits(e.target.value)}
              renderValue={(selected) => selected.join(', ')}
            >
              {availableKits.length > 0 ? availableKits.map((kit) => (
                <MenuItem key={kit.id} value={kit.id}>
                  {kit.serialNo} - v{kit.firmwareVersion}
                </MenuItem>
              )) : (
                <MenuItem disabled>No IN_STOCK kits available to assign</MenuItem>
              )}
            </Select>
          </FormControl>
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              onClick={handleAssign}
              disabled={selectedKits.length === 0}
            >
              Assign Kits
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setSelectedKits([])}
            >
              Clear
            </Button>
          </Box>
        </Paper>
  
        {/* Confirm Delete Dialog */}
        <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
          <DialogTitle>Delete Clinic</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete <strong>{clinic.name}</strong>?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDelete(false)}>Cancel</Button>
            <Button color="error" onClick={handleDeleteClinic}>Delete</Button>
          </DialogActions>
        </Dialog>
  
        {/* Snackbar */}
        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    );
  }
  