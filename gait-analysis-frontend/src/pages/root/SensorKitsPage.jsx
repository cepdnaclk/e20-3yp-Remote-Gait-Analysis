import {
    Box, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody, Paper
  } from "@mui/material";
  import { useState } from "react";
  import SensorKitFormDialog from "../../components/admin/SensorKitFormDialog";
  
  const SensorKitsPage = () => {
    const [open, setOpen] = useState(false);
    const [kits, setKits] = useState([]);
  
    const handleAddKit = (kit) => {
      setKits([...kits, { ...kit, status: "IN_STOCK" }]);
      // POST to backend
    };
  
    return (
      <Box p={4}>
        <Typography variant="h5">Sensor Kits</Typography>
        <Button variant="contained" onClick={() => setOpen(true)} sx={{ my: 2 }}>
          Add New Sensor Kit
        </Button>
        <Table component={Paper}>
          <TableHead>
            <TableRow>
              <TableCell>Serial No</TableCell>
              <TableCell>Firmware</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {kits.map((kit, idx) => (
              <TableRow key={idx}>
                <TableCell>{kit.serialNo}</TableCell>
                <TableCell>{kit.firmwareVersion}</TableCell>
                <TableCell>{kit.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <SensorKitFormDialog open={open} onClose={() => setOpen(false)} onSave={handleAddKit} />
      </Box>
    );
  };
  
  export default SensorKitsPage;
  