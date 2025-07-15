// src/pages/ManageSensorKitsPage.jsx

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
  InputAdornment,
  Chip,
  Pagination,
  FormControl,
  InputLabel,
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
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

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [kitRes, clinicRes] = await Promise.all([
        getSensorKits(), 
        getClinics("?page=0&size=1000") // Fetch all clinics with large page size
      ]);
      
      setKits(kitRes.data || []);
      
      // Handle paginated response for clinics
      const clinicsData = clinicRes.data?.content || [];
      setClinics(clinicsData);
      
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
      console.error('Assignment error:', err);
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
      console.error('Add kit error:', err);
      setSnackbar({ open: true, message: 'Failed to add sensor kit', severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const getStatusChipColor = (status) => {
    switch (status) {
      case 'IN_STOCK':
        return 'primary';
      case 'AVAILABLE':
        return 'success';
      case 'IN_USE':
        return 'warning';
      default:
        return 'default';
    }
  };

  const filteredKits = kits
    .filter((kit) =>
      searchQuery.trim() === '' ||
      kit.serialNo.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((kit) => statusFilter === 'ALL' || kit.status === statusFilter);

  const totalPages = Math.ceil(filteredKits.length / pageSize);
  const paginatedKits = filteredKits.slice((page - 1) * pageSize, page * pageSize);

  if (loading) {
    return (
      <Box 
        display="flex" 
        flexDirection="column"
        justifyContent="center" 
        alignItems="center" 
        height="400px"
        gap={2}
      >
        <CircularProgress size={40} />
        <Typography color="text.secondary">Loading sensor kits...</Typography>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h5" gutterBottom>
        Manage Sensor Kits
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Search by Serial No"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            label="Status"
          >
            <MenuItem value="ALL">All</MenuItem>
            <MenuItem value="IN_STOCK">In Stock</MenuItem>
            <MenuItem value="AVAILABLE">Available</MenuItem>
            <MenuItem value="IN_USE">In Use</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" sx={{ ml: 'auto' }} onClick={() => setDialogOpen(true)}>
          Add New Sensor Kit
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          boxShadow: 4,
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid #e0e0e0',
        }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f7fa" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Serial No</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Firmware</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Assigned Clinic</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Assign</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedKits.length > 0 ? (
              paginatedKits.map((kit) => (
                <TableRow key={kit.serialNo || kit.id}>
                  <TableCell>{kit.serialNo}</TableCell>
                  <TableCell>{kit.firmwareVersion}</TableCell>
                  <TableCell>
                    <Chip
                      label={kit.status}
                      color={getStatusChipColor(kit.status)}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell>
                    {kit.clinicId
                      ? clinics.find((c) => c.id === kit.clinicId)?.name || 'Assigned'
                      : (['AVAILABLE', 'IN_USE'].includes(kit.status) ? 'Assigned' : '-')}
                  </TableCell>
                  <TableCell>
                    {kit.status === 'IN_STOCK' && (
                      <Select
                        displayEmpty
                        value=""
                        onChange={(e) => handleAssign(kit.id, e.target.value)}
                        sx={{ minWidth: 150 }}
                      >
                        <MenuItem disabled value="">
                          Assign to Clinic
                        </MenuItem>
                        {clinics.length > 0 ? (
                          clinics.map((clinic) => (
                            <MenuItem key={clinic.id} value={clinic.id}>
                              {clinic.name}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled>No clinics available</MenuItem>
                        )}
                      </Select>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  {searchQuery || statusFilter !== 'ALL' 
                    ? 'No sensor kits match your filters' 
                    : 'No sensor kits found'
                  }
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box mt={3} display="flex" justifyContent="flex-end">
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}

      {/* Add Dialog */}
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
          <Button
            onClick={handleAddKit}
            variant="contained"
            disabled={!newKit.serialNo || !newKit.firmwareVersion}
          >
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