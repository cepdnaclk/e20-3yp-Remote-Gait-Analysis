import React, { useState } from "react";
import { Box, Typography, TextField, Button, FormControlLabel, Checkbox, Select, MenuItem, FormControl, InputLabel } from "@mui/material";

export default function Settings() {
  const [selectedImage, setSelectedImage] = useState(null);

  // handle file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>Settings</Typography>
      <Typography variant="h6" sx={{ marginBottom: 2 }}></Typography>

      {/* Profile Section */}
      <Box sx={{ marginBottom: 3 }}>
        <Typography variant="h6">Profile Information</Typography>
        <Box display="flex" alignItems="center" mt={2}>
          <Box sx={{ width: "80px", height: "80px", borderRadius: "50%", overflow: "hidden" }}>
            {/* Display the selected image or the default profile picture */}
            <img
              src={selectedImage || "/profile_picture.png"} // Default image if no image is selected
              alt="Profile"
              style={{
                width: "100%", // Make image fully responsive
                height: "100%",
                objectFit: "cover", // Ensure the image covers the area properly
              }}
            />
          </Box>
          {/* File input field */}
          <input
            type="file"
            id="file-upload"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }} // Hide the input field
          />
          {/* Button to trigger file input */}
          <Button
            variant="outlined"
            color="primary"
            sx={{ ml: 2 }}
            onClick={() => document.getElementById("file-upload").click()} // Trigger the file input on button click
          >
            Upload New Picture
          </Button>
        </Box>
      
        <TextField fullWidth label="Name" value="Dr. Keerthi Ilukkumbura" sx={{ mt: 2 }} />
        <TextField fullWidth label="Email" value="keerthi@example.com" sx={{ mt: 2 }} />
        <TextField fullWidth label="Phone Number" value="071-466-7390" sx={{ mt: 2 }} />
      </Box>

      {/* Account Settings */}
      <Box sx={{ marginBottom: 3 }}>
        <Typography variant="h6">Account Settings</Typography>
        <TextField fullWidth label="Change Password" type="password" sx={{ mt: 2 }} />
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Language</InputLabel>
          <Select value="English">
            <MenuItem value="English">English</MenuItem>
            <MenuItem value="Sinhala">Sinhala</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Notification Settings */}
      <Box sx={{ marginBottom: 3 }}>
        <Typography variant="h6">Notification Settings</Typography>
        <FormControlLabel control={<Checkbox />} label="Notify for new appointments" sx={{ mt: 2 }} />
        <FormControlLabel control={<Checkbox />} label="Notify when lab results are ready" sx={{ mt: 2 }} />
        <FormControlLabel control={<Checkbox />} label="Send daily summary" sx={{ mt: 2 }} />
      </Box>

      {/* Data Privacy Section */}
      <Box sx={{ marginBottom: 3 }}>
        <Typography variant="h6">Data Privacy</Typography>
        <FormControlLabel control={<Checkbox />} label="Allow data sharing for research" sx={{ mt: 2 }} />
        <Button variant="contained" color="secondary" sx={{ mt: 2 }}>
          Export Patient Data
        </Button>
      </Box>

      {/* Save and Cancel Buttons */}
      <Button variant="contained" color="primary" sx={{ mt: 3 }}>Save Settings</Button>
    </Box>
  );
}
