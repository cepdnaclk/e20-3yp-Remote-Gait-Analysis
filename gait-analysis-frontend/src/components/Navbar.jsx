import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import {
  AppBar,
  Box,
  Stack,
  Typography,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Container,
} from "@mui/material";
import MuiToolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";

const CustomToolbar = styled(MuiToolbar)({
  width: "100%",
  maxHeight: "24px", // Reduced navbar height
  padding: "2px 12px", // Adjusted padding for compactness
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
});

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="fixed" sx={{ boxShadow: 2, bgcolor: "rgba(255, 255, 255, 0.15)" }}>
      <Container maxWidth="lg">
        <CustomToolbar>
          {/* Logo */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ textDecoration: "none", color: "white", fontWeight: "bold" }}
          >
            RehabGait
          </Typography>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
            <Button color="inherit" component={Link} to="/about">
              About Us
            </Button>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuOpen}
            sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} // Added margin-right to prevent sticking to the edge
          >
            <MenuIcon />
          </IconButton>

          {/* Mobile Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{ display: { xs: "block", md: "none" } }}
          >
            <MenuItem component={Link} to="/about" onClick={handleMenuClose}>
              About Us
            </MenuItem>
            <MenuItem component={Link} to="/login" onClick={handleMenuClose}>
              Login
            </MenuItem>
            
          </Menu>
        </CustomToolbar>
      </Container>
    </AppBar>
  );
}
