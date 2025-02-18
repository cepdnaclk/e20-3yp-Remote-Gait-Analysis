import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <AppBar position="static" color="primary" sx={{boxShadow:3}}>
      <Toolbar>
        {/* Logo */}
        <Typography variant="h6" sx={{flexGrow:1}}>
          Remote Gait Analysis
        </Typography>

        {/*Buttons*/}
        <Box>
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
          <Button
            variant="contained"
            color="secondary"
            component={Link}
            to="/signup"
            sx={{ ml: 2 }}
          >
            Sign Up
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
