import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
  } from "@mui/material";
  import { useState } from "react";
  
  const ClinicFormDialog = ({ open, onClose, onSave }) => {
    const [formData, setFormData] = useState({
      name: "",
      phoneNumber: "",
      email: "",
      username: "",
      password: "",
    });
  
    const handleChange = (field) => (e) => {
      setFormData({ ...formData, [field]: e.target.value });
    };
  
    const handleSubmit = () => {
      onSave(formData); // Send JSON to parent
      onClose();
      setFormData({
        name: "",
        phoneNumber: "",
        email: "",
        username: "",
        password: "",
      });
    };
  
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Add New Clinic</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Clinic Name"
            fullWidth
            value={formData.name}
            onChange={handleChange("name")}
          />
          <TextField
            margin="dense"
            label="Phone Number"
            fullWidth
            value={formData.phoneNumber}
            onChange={handleChange("phoneNumber")}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={formData.email}
            onChange={handleChange("email")}
          />
          <TextField
            margin="dense"
            label="Username"
            fullWidth
            value={formData.username}
            onChange={handleChange("username")}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            value={formData.password}
            onChange={handleChange("password")}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>Add</Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default ClinicFormDialog;
  