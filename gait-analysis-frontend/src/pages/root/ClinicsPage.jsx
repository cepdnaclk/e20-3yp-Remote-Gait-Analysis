import {
    Box, Typography, Button, Paper, Table, TableHead, TableRow, TableCell, TableBody
  } from "@mui/material";
import { useState } from "react";
import ClinicFormDialog from "../../components/admin/ClinicFormDialog";


  const ClinicsPage = () => {
    const [open, setOpen] = useState(false);
    const [clinics, setClinics] = useState([]); // Replace with fetched data
  
    const handleAddClinic = (clinic) => {
      setClinics([...clinics, clinic]);
      // Send `clinic` JSON to backend via POST
    };
  
    return (
      <Box p={4}>
        <Typography variant="h5">Registered Clinics</Typography>
        <Button variant="contained" onClick={() => setOpen(true)} sx={{ my: 2 }}>
          Add New Clinic
        </Button>
        <Table component={Paper}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clinics.map((clinic, idx) => (
              <TableRow key={idx}>
                <TableCell>{clinic.name}</TableCell>
                <TableCell>{clinic.phoneNumber}</TableCell>
                <TableCell>{clinic.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ClinicFormDialog open={open} onClose={() => setOpen(false)} onSave={handleAddClinic} />
      </Box>
    );
  };
  
  export default ClinicsPage;
  