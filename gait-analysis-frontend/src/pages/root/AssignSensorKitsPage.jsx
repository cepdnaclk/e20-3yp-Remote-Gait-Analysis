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
  
    useEffect(() => {
      Promise.all([getClinics(), getSensorKits()])
        .then(([clinicRes, kitRes]) => {
          setClinics(clinicRes.data);
          setKits(kitRes.data.filter((k) => k.status === "IN_STOCK")); // <-- FIXED HERE
        })
        .catch(() => {
          setSnackbar({ open: true, message: "Failed to load data", severity: "error" });
        })
        .finally(() => setLoading(false));
    }, []);
  
    const handleAssign = async () => {
      if (!selectedClinic || selectedKits.length === 0) return;
  
      try {
        await assignSensorKits(selectedClinic, selectedKits);
        setSnackbar({ open: true, message: "Sensor kits assigned successfully", severity: "success" });
        setSelectedClinic("");
        setSelectedKits([]);
        const refreshedKits = await getSensorKits();
        setKits(refreshedKits.data.filter((k) => k.status === "AVAILABLE")); 
      } catch (err) {
        setSnackbar({ open: true, message: "Assignment failed", severity: "error" });
      }
    };
  
    const handleCloseSnackbar = () => {
      setSnackbar({ ...snackbar, open: false });
    };
  
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <CircularProgress />
          <Typography ml={2}>Loading data...</Typography>
        </Box>
      );
    }
  
    return (
      <Box p={4}>
        <Typography variant="h5" gutterBottom>
          Assign Sensor Kits to Clinics
        </Typography>
  
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Select Clinic</InputLabel>
          <Select
            value={selectedClinic}
            onChange={(e) => setSelectedClinic(e.target.value)}
            displayEmpty
          >
            <MenuItem disabled value="">
            
            </MenuItem>
            {clinics.map((clinic) => (
              <MenuItem key={clinic.id} value={clinic.id}>
                {clinic.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
  
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Sensor Kits</InputLabel>
          <Select
            multiple
            value={selectedKits}
            onChange={(e) => setSelectedKits(e.target.value)}
            renderValue={(selected) => selected.join(", ")}
          >
            {kits.map((kit) => (
              <MenuItem key={kit.id} value={kit.id}>
                <Checkbox checked={selectedKits.includes(kit.id)} />
                <ListItemText primary={`${kit.serialNo} - v${kit.firmwareVersion}`} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
  
        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            onClick={handleAssign}
            disabled={!selectedClinic || selectedKits.length === 0}
          >
            Assign Kits
          </Button>
  
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              setSelectedClinic("");
              setSelectedKits([]);
            }}
          >
            Clear
          </Button>
        </Box>
  
        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    );
  };
  
  export default AssignSensorKitsPage;
  