import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
  } from "@mui/material";
  import { useState } from "react";
  
  const SensorKitFormDialog = ({ open, onClose, onSave }) => {
    const [formData, setFormData] = useState({
      serialNo: "",
      firmwareVersion: "",
    });
  
    const handleChange = (field) => (e) => {
      setFormData({ ...formData, [field]: e.target.value });
    };
  
    const handleSubmit = () => {
      const parsed = {
        serialNo: parseInt(formData.serialNo),
        firmwareVersion: parseInt(formData.firmwareVersion),
      };
      onSave(parsed); // Send JSON to parent
      onClose();
      setFormData({ serialNo: "", firmwareVersion: "" });
    };
  
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Add New Sensor Kit</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Serial Number"
            type="number"
            fullWidth
            value={formData.serialNo}
            onChange={handleChange("serialNo")}
          />
          <TextField
            margin="dense"
            label="Firmware Version"
            type="number"
            fullWidth
            value={formData.firmwareVersion}
            onChange={handleChange("firmwareVersion")}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>Add</Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default SensorKitFormDialog;
  