import {
  Box,
  Typography,
  Button,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';

import { useState, useEffect } from 'react';
import {
  getClinics,
  getSensorKits,
  addSensorKit,
  assignSensorKits,
} from '../../services/rootServices';

export default function ManageSensorKitsPage() {
  const [kits, setKits] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newKit, setNewKit] = useState({ serialNo: '', firmwareVersion: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [kitRes, clinicRes] = await Promise.all([getSensorKits(), getClinics()]);
      setKits(kitRes.data);
      setClinics(clinicRes.data);
    } catch (err) {
      console.error('Error loading data', err);
      setSnackbar({ open: true, message: 'Failed to load data', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (kitId, clinicId) => {
    try {
      await assignSensorKits(clinicId, [kitId]);
      setSnackbar({ open: true, message: 'Sensor kit assigned', severity: 'success' });
      fetchData();
    } catch (err) {
      setSnackbar({ open: true, message: 'Assignment failed', severity: 'error' });
    }
  };

  const handleAddKit = async () => {
    try {
      const parsed = {
        serialNo: parseInt(newKit.serialNo),
        firmwareVersion: parseInt(newKit.firmwareVersion),
      };
      await addSensorKit(parsed);
      setSnackbar({ open: true, message: 'Sensor kit added', severity: 'success' });
      setDialogOpen(false);
      setNewKit({ serialNo: '', firmwareVersion: '' });
      fetchData();
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to add sensor kit', severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
        <Typography ml={2}>Loading Sensor Kits...</Typography>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h5" gutterBottom>
        Manage Sensor Kits
      </Typography>

      <Button variant="contained" onClick={() => setDialogOpen(true)} sx={{ mb: 2 }}>
        Add New Sensor Kit
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Serial No</TableCell>
              <TableCell>Firmware</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Assigned Clinic</TableCell>
              <TableCell>Assign</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {kits.map((kit) => (
              <TableRow key={kit.serialNo}>
                <TableCell>{kit.serialNo}</TableCell>
                <TableCell>{kit.firmwareVersion}</TableCell>
                <TableCell>{kit.status}</TableCell>
                <TableCell>
                  {kit.clinicName || (kit.status === 'AVAILABLE' ? 'Assigned' : '-')}
                </TableCell>
                <TableCell>
                  {kit.status === 'IN_STOCK' && (
                    <Select
                      displayEmpty
                      value=""
                      onChange={(e) => handleAssign(kit.serialNo, e.target.value)}
                      sx={{ minWidth: 150 }}
                    >
                      <MenuItem disabled value="">
                        Assign to Clinic
                      </MenuItem>
                      {clinics.map((clinic) => (
                        <MenuItem key={clinic.id} value={clinic.id}>
                          {clinic.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Sensor Kit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Add New Sensor Kit</DialogTitle>
        <DialogContent>
          <TextField
            label="Serial No"
            fullWidth
            type="number"
            margin="normal"
            value={newKit.serialNo}
            onChange={(e) => setNewKit({ ...newKit, serialNo: e.target.value })}
          />
          <TextField
            label="Firmware Version"
            fullWidth
            type="number"
            margin="normal"
            value={newKit.firmwareVersion}
            onChange={(e) => setNewKit({ ...newKit, firmwareVersion: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddKit} variant="contained" disabled={!newKit.serialNo || !newKit.firmwareVersion}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar}>
        <Alert severity={snackbar.severity} onClose={handleCloseSnackbar} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
