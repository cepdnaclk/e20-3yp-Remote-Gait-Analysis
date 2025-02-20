import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <Box>
      {/* Navbar */}
      <AppBar position="static" sx={{ backgroundColor: "#1976D2" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Remote Gait Analysis
          </Typography>
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
          <Button color="inherit" component={Link} to="/signup">
            Sign Up
          </Button>
        </Toolbar>
      </AppBar>

      {/* Home Page Content */}
      <Box sx={{ padding: 3, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Welcome to Remote Gait Analysis
        </Typography>
        <Typography variant="body1">
          Helping physiotherapists analyze gait patterns effectively.
        </Typography>
      </Box>
    </Box>
  );
}
