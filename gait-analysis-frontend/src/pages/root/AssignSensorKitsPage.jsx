import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Paper,
  Chip,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  getClinics,
  getSensorKits,
  assignSensorKits,
} from "../../services/rootServices";

const AssignSensorKitsPage = () => {
  const [clinics, setClinics] = useState([]);
  const [kits, setKits] = useState([]);
  const [selectedClinic, setSelectedClinic] = useState("");
  const [selectedKits, setSelectedKits] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Fetch all clinics with a large page size to get all available clinics
      // You might want to implement a backend endpoint to get all clinics without pagination
      const [clinicRes, kitRes] = await Promise.all([
        getClinics("?page=0&size=1000"), // Large size to get all clinics
        getSensorKits()
      ]);
      
      // Handle paginated response for clinics
      const clinicsData = clinicRes.data?.content || [];
      setClinics(clinicsData);
      
      // Filter kits to show only IN_STOCK ones
      setKits(kitRes.data?.filter((k) => k.status === "IN_STOCK") || []);
    } catch (error) {
      console.error("Error loading data:", error);
      showSnackbar("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleAssign = async () => {
    if (!selectedClinic || selectedKits.length === 0) return;

    setAssigning(true);
    try {
      await assignSensorKits(selectedClinic, selectedKits);
      showSnackbar(`Successfully assigned ${selectedKits.length} sensor kit(s)`, "success");
      
      // Reset form and refresh data
      setSelectedClinic("");
      setSelectedKits([]);
      await loadData();
    } catch (error) {
      console.error("Assignment error:", error);
      showSnackbar(error?.response?.data?.message || "Assignment failed", "error");
    } finally {
      setAssigning(false);
    }
  };

  const handleClear = () => {
    setSelectedClinic("");
    setSelectedKits([]);
  };

  const getSelectedClinicName = () => {
    const clinic = clinics.find(c => c.id === selectedClinic);
    return clinic?.name || "";
  };

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
        <Typography color="text.secondary">Loading data...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Paper elevation={1} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" fontWeight={600} color="primary.main" gutterBottom>
          Assign Sensor Kits
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Assign available sensor kits to clinics for deployment
        </Typography>

        {/* Clinic Selection */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Select Clinic</InputLabel>
          <Select
            value={selectedClinic}
            onChange={(e) => setSelectedClinic(e.target.value)}
            label="Select Clinic"
          >
            {clinics.map((clinic) => (
              <MenuItem key={clinic.id} value={clinic.id}>
                {clinic.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Sensor Kit Selection */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Available Sensor Kits ({kits.length})</InputLabel>
          <Select
            multiple
            value={selectedKits}
            onChange={(e) => setSelectedKits(e.target.value)}
            label={`Available Sensor Kits (${kits.length})`}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => {
                  const kit = kits.find(k => k.id === value);
                  return (
                    <Chip 
                      key={value} 
                      label={kit?.serialNo || value}
                      size="small"
                      variant="outlined"
                    />
                  );
                })}
              </Box>
            )}
          >
            {kits.map((kit) => (
              <MenuItem key={kit.id} value={kit.id}>
                <Checkbox checked={selectedKits.includes(kit.id)} />
                <ListItemText 
                  primary={kit.serialNo}
                  secondary={`Firmware v${kit.firmwareVersion} • ${kit.status}`}
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Summary */}
        {(selectedClinic || selectedKits.length > 0) && (
          <Paper 
            variant="outlined" 
            sx={{ 
              p: 2, 
              mb: 3, 
              bgcolor: "primary.50",
              borderColor: "primary.200"
            }}
          >
            <Typography variant="subtitle2" color="primary.main" gutterBottom>
              Assignment Summary:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedKits.length > 0 
                ? `Assigning ${selectedKits.length} sensor kit(s) to ${getSelectedClinicName() || "selected clinic"}`
                : "Select clinic and sensor kits to assign"
              }
            </Typography>
          </Paper>
        )}

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-start' }}>
          <Button
            variant="contained"
            onClick={handleAssign}
            disabled={!selectedClinic || selectedKits.length === 0 || assigning}
            startIcon={assigning ? <CircularProgress size={16} /> : null}
            sx={{ minWidth: 120 }}
          >
            {assigning ? "Assigning..." : "Assign Kits"}
          </Button>

          <Button
            variant="outlined"
            onClick={handleClear}
            disabled={assigning}
          >
            Clear Selection
          </Button>
        </Box>

        {/* Empty States */}
        {!loading && kits.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Available Sensor Kits
            </Typography>
            <Typography variant="body2" color="text.secondary">
              All sensor kits are currently assigned or unavailable
            </Typography>
          </Box>
        )}

        {!loading && clinics.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Clinics Available
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please add clinics before assigning sensor kits
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Snackbar */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AssignSensorKitsPage;