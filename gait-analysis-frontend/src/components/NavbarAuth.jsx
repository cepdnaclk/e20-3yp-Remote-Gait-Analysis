import { AppBar, Toolbar, Typography, Avatar, IconButton, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
//import { useUser } from "../UserContext";

export default function NavbarAuth() {
//   //const { user, logout } = useUser();
//   const [anchorEl, setAnchorEl] = useState(null);

//   const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
//   const handleMenuClose = () => setAnchorEl(null);
//   const handleLogout = () => {
//     logout();
//     handleMenuClose();
//   };

  const [anchorEl, setAnchorEl] = useState(null);
  
    const handleMenuOpen = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleMenuClose = () => {
      setAnchorEl(null);
    };
  
  return (
    <AppBar position="static" sx={{ backgroundColor: "#1976D2" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          RehabGait Dashboard
        </Typography>

        <IconButton onClick={handleMenuOpen}>
          <Avatar src={user?.profilePicture} />
        </IconButton>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem>{user?.name}</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
