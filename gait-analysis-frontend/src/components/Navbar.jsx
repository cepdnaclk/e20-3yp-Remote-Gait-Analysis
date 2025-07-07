import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import {
  AppBar,
  Box,
  Typography,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Container,
  Avatar,
  Chip,
} from "@mui/material";
import MuiToolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import InfoIcon from "@mui/icons-material/Info";
import LoginIcon from "@mui/icons-material/Login";

const CustomToolbar = styled(MuiToolbar)({
  width: "100%",
  minHeight: "64px",
  padding: "8px 16px",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
});

const StyledNavButton = styled(Button)(({ theme }) => ({
  color: "white",
  fontWeight: 600,
  textTransform: "none",
  fontSize: "1rem",
  padding: "8px 20px",
  borderRadius: "12px",
  transition: "all 0.3s ease",
  position: "relative",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    transform: "translateY(-1px)",
    backdropFilter: "blur(10px)",
  },
  "&:before": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: "50%",
    width: 0,
    height: "2px",
    background: "linear-gradient(90deg, #3b82f6, #10b981)",
    transition: "all 0.3s ease",
    transform: "translateX(-50%)",
  },
  "&:hover:before": {
    width: "80%",
  },
}));

const LogoContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  textDecoration: "none",
  color: "white",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.02)",
  },
});

const LoginButton = styled(Button)({
  background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
  color: "white",
  fontWeight: 700,
  textTransform: "none",
  padding: "10px 24px",
  borderRadius: "12px",
  boxShadow: "0 4px 16px rgba(59, 130, 246, 0.3)",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
    transform: "translateY(-2px)",
    boxShadow: "0 8px 24px rgba(59, 130, 246, 0.4)",
  },
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
    <AppBar 
      position="fixed" 
      sx={{ 
        background: "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Container maxWidth="lg">
        <CustomToolbar>
          {/* Logo */}
          <LogoContainer component={Link} to="/">
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #3b82f6 0%, #10b981 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 16px rgba(59, 130, 246, 0.3)",
              }}
            >
              <LocalHospitalIcon sx={{ fontSize: 20, color: "white" }} />
            </Box>
            
            <Box>
              <Typography
                variant="h6"
                sx={{ 
                  fontWeight: 800, 
                  fontSize: "1.4rem",
                  background: "linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                RehabGait
              </Typography>
              <Typography
                variant="caption"
                sx={{ 
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  display: "block",
                  lineHeight: 1,
                  marginTop: "-2px",
                }}
              >
                Medical Analytics
              </Typography>
            </Box>
            
            <Chip 
              label="Pro" 
              size="small" 
              sx={{ 
                backgroundColor: "rgba(16, 185, 129, 0.2)",
                color: "#10b981",
                fontWeight: 700,
                fontSize: "0.7rem",
                height: "20px",
                border: "1px solid rgba(16, 185, 129, 0.3)",
              }} 
            />
          </LogoContainer>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1 }}>
            <StyledNavButton 
              component={Link} 
              to="/about"
              startIcon={<InfoIcon sx={{ fontSize: 18 }} />}
            >
              About Us
            </StyledNavButton>
            
            <LoginButton
              component={Link}
              to="/login"
              startIcon={<LoginIcon sx={{ fontSize: 18 }} />}
            >
              Login
            </LoginButton>
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuOpen}
            sx={{ 
              display: { xs: "flex", md: "none" },
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              borderRadius: "12px",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                transform: "scale(1.05)",
              },
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Mobile Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{ 
              display: { xs: "block", md: "none" },
              "& .MuiPaper-root": {
                borderRadius: "16px",
                background: "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 12px 48px rgba(0, 0, 0, 0.2)",
                marginTop: "8px",
                minWidth: "200px",
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem 
              component={Link} 
              to="/about" 
              onClick={handleMenuClose}
              sx={{
                color: "white",
                fontWeight: 600,
                py: 1.5,
                px: 3,
                borderRadius: "12px",
                margin: "4px 8px",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  transform: "translateX(4px)",
                },
              }}
            >
              <InfoIcon sx={{ mr: 2, fontSize: 18, color: "rgba(255, 255, 255, 0.7)" }} />
              About Us
            </MenuItem>
            
            <Box sx={{ px: 2, pb: 2 }}>
              <Button
                component={Link}
                to="/login"
                onClick={handleMenuClose}
                fullWidth
                sx={{
                  background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                  color: "white",
                  fontWeight: 700,
                  textTransform: "none",
                  py: 1.5,
                  borderRadius: "12px",
                  boxShadow: "0 4px 16px rgba(59, 130, 246, 0.3)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
                    transform: "translateY(-1px)",
                    boxShadow: "0 6px 20px rgba(59, 130, 246, 0.4)",
                  },
                }}
                startIcon={<LoginIcon sx={{ fontSize: 18 }} />}
              >
                Login
              </Button>
            </Box>
          </Menu>
        </CustomToolbar>
      </Container>
    </AppBar>
  );
}