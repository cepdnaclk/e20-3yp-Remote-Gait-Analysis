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
  } from '@mui/material';
  import DeleteIcon from '@mui/icons-material/Delete';
  import { useEffect, useState } from 'react';
  import { useParams, useNavigate } from 'react-router-dom';
  import {
    getClinics,
    getSensorKits,
    assignSensorKits,
  } from '../../services/rootApi';
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
        const assigned = kitsRes.data.filter((k) => k.clinicId === clinicData.id || k.status === 'AVAILABLE');
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
        setTimeout(() => navigate('/admin/clinics'), 1000);
      } catch (err) {
        setSnackbar({ open: true, message: 'Failed to delete clinic', severity: 'error' });
      }
    };
  
    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });
  
    if (!clinic) return <Typography>Loading clinic...</Typography>;
  
    return (
      <Box p={4}>
        <Typography variant="h5" gutterBottom>{clinic.name}</Typography>
        <Typography variant="body1" mb={3}>Username: {clinic.username} | Email: {clinic.email}</Typography>
  
        {/* Assigned Kits Table */}
        <Typography variant="h6" gutterBottom>Assigned Sensor Kits</Typography>
        <Table component={Paper}>
          <TableHead>
            <TableRow>
              <TableCell>Serial No</TableCell>
              <TableCell>Firmware</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Remove</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assignedKits.map((kit) => (
              <TableRow key={kit.serialNo}>
                <TableCell>{kit.serialNo}</TableCell>
                <TableCell>{kit.firmwareVersion}</TableCell>
                <TableCell><Chip label={kit.status} /></TableCell>
                <TableCell>
                  <IconButton onClick={() => handleRemoveKit(kit.serialNo)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
  
        {/* Assign New Kits */}
        <Box mt={4}>
          <Typography variant="h6">Assign New Sensor Kits</Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Kits</InputLabel>
            <Select
              multiple
              value={selectedKits}
              onChange={(e) => setSelectedKits(e.target.value)}
              renderValue={(selected) => selected.join(', ')}
            >
              {availableKits.map((kit) => (
                <MenuItem key={kit.serialNo} value={kit.serialNo}>
                  {kit.serialNo} - v{kit.firmwareVersion}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" sx={{ mt: 2 }} onClick={handleAssign} disabled={selectedKits.length === 0}>
            Assign Kits
          </Button>
        </Box>
  
        {/* Delete Clinic */}
        <Box mt={6}>
          <Button color="error" variant="outlined" onClick={() => setConfirmDelete(true)}>
            Delete Clinic
          </Button>
        </Box>
  
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
  