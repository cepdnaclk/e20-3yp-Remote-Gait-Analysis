import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate


export default function RecentPatients({ patients, isLoading, error }) {
  const navigate = useNavigate(); // ✅ Initialize navigate hook

  // State for search query
  const [searchQuery, setSearchQuery] = useState("");

  // State for Add Patient Modal
  const [openModal, setOpenModal] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: "",
    id: "",
    age: "",
    status: "Pending",
    lastReport: new Date().toISOString().split("T")[0], // Default to today
  });

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter patients based on search query
  const filteredPatients = patients?.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle modal open/close
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  // Handle input change in modal
  const handleChange = (e) => {
    setNewPatient({ ...newPatient, [e.target.name]: e.target.value });
  };

  // Handle adding a new patient
  const handleAddPatient = () => {
    if (!newPatient.name || !newPatient.id || !newPatient.age) {
      alert("Please fill in all fields.");
      return;
    }

    console.log("New Patient Added:", newPatient);
    // IMPLEMENT: Call API to add patient to database

    handleCloseModal(); // Close modal after adding
  };

  // Handle removing a patient
  const handleRemovePatient = (id) => {
    console.log("Removing patient with ID:", id);
    // IMPLEMENT: Call API to remove patient from database
  };

  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <Typography>Loading Patients...</Typography>
      </Box>
    );

  if (error) return <Typography color="error">❌ Error fetching patients: {error.message}</Typography>;

  return (
    <Box>
      {/* Header Section */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">👤 Recent Patients</Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenModal}>
          Add Patient
        </Button>
      </Box>

      {/* Search Bar */}
      <Box display="flex" alignItems="center" mb={2}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search Patients..."
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1 }} />,
          }}
        />
      </Box>

      {/* Patients Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Patient Name</strong></TableCell>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Last Report</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Action</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <TableRow
                  key={patient.id}
                  sx={{ cursor: "pointer", "&:hover": { backgroundColor: "#f5f5f5" } }}
                  onClick={() => navigate(`/patients/${patient.id}`)} // ✅ Navigate to patient profile
                >
                  <TableCell>
                    <Typography>{patient.name}</Typography>
                  </TableCell>
                  <TableCell>{patient.id}</TableCell>
                  <TableCell>{patient.lastReport || "N/A"}</TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        padding: "4px 8px",
                        borderRadius: "12px",
                        backgroundColor:
                          patient.status === "Completed"
                            ? "#d4edda"
                            : patient.status === "Pending"
                            ? "#fff3cd"
                            : "#cce5ff",
                        color:
                          patient.status === "Completed"
                            ? "#155724"
                            : patient.status === "Pending"
                            ? "#856404"
                            : "#004085",
                        display: "inline-block",
                      }}
                    >
                      {patient.status}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    {/* Prevent row click from triggering when clicking buttons */}
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation(); // ✅ Prevent row click navigation
                        console.log("View Details clicked for patient ID:", patient.id);
                        navigate(`/patients/${patient.id}/realtime`); // ✅ Navigate to real-time dashboard
                      }}
                    >
                      View Details
                    </Button>
                    <IconButton color="error" onClick={(e) => {
                      e.stopPropagation(); // ✅ Prevent row click navigation
                      handleRemovePatient(patient.id);
                    }}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No patients found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Patient Modal */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Add New Patient</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Patient Name" name="name" margin="dense" onChange={handleChange} />
          <TextField fullWidth label="Patient ID" name="id" margin="dense" onChange={handleChange} />
          <TextField fullWidth label="Age" name="age" margin="dense" type="number" onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">Cancel</Button>
          <Button onClick={handleAddPatient} color="primary" variant="contained">Add Patient</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
