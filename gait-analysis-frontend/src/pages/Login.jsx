import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom"; // React Router Link for navigation
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  CssBaseline,
  Divider,
  FormLabel,
  FormControl,
  Link,
  Snackbar,
  Alert,
  Paper,
  Container,
  Avatar,
  Chip,
  InputAdornment,
  IconButton,
  Grid,
} from "@mui/material";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import logo from "../assets/images/logo-modified.png";
import BASE_URL from "../config";
import BackButton from "../components/BackButton";

// Icons
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import LoginIcon from "@mui/icons-material/Login";
import SecurityIcon from "@mui/icons-material/Security";
import CloudIcon from "@mui/icons-material/Cloud";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

// Form Validation Schema
const schema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  maxWidth: "450px",
  padding: theme.spacing(4),
  gap: theme.spacing(2.5),
  margin: "auto",
  background: "rgba(255, 255, 255, 0.98)",
  backdropFilter: "blur(15px)",
  borderRadius: "20px",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.12)",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: "linear-gradient(90deg, #1976D2 0%, #388E3C 50%, #F57C00 100%)",
  },
  [theme.breakpoints.down("sm")]: {
    maxWidth: "100%",
    padding: theme.spacing(3),
    borderRadius: "16px",
  },
}));

const LoginContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100vh",
  width: "100vw",
  padding: theme.spacing(4),
  background:
    "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 25%, #90CAF9 50%, #64B5F6 75%, #42A5F5 100%)",
  position: "relative",
  overflow: "auto",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const BackgroundDecoration = styled(Box)({
  position: "absolute",
  borderRadius: "50%",
  background:
    "linear-gradient(135deg, rgba(25, 118, 210, 0.08) 0%, rgba(56, 142, 60, 0.08) 100%)",
  filter: "blur(40px)",
});

const FeatureChip = ({ icon, text }) => (
  <Chip
    icon={icon}
    label={text}
    size="small"
    sx={{
      backgroundColor: "rgba(25, 118, 210, 0.1)",
      color: "#1565C0",
      fontWeight: 600,
      border: "1px solid rgba(25, 118, 210, 0.2)",
      "& .MuiChip-icon": {
        color: "#1565C0",
      },
    }}
  />
);

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  // Display Message errors
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState("error");

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/signin`, {
        username: data.username,
        password: data.password,
      });

      // Save to localStorage
      const { jwtToken: token, roles } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("roles", JSON.stringify(roles));

      // Redirect based on role
      if (roles.includes("ROLE_ADMIN")) navigate("/root/dashboard");
      else if (roles.includes("ROLE_CLINIC")) navigate("/clinic/dashboard");
      else if (roles.includes("ROLE_DOCTOR")) navigate("/doctor/dashboard");
      else if (roles.includes("ROLE_PATIENT")) navigate("/patient/dashboard");
      else {
        // Show error message for unknown role
        setSnackbarMessage("Unknown role, access denied");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Login failed. Please check your network or try again.";
      setSnackbarMessage(message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <React.Fragment>
      <CssBaseline enableColorScheme />
      <LoginContainer
        direction="column"
        justifyContent="center"
        alignItems="center"
        sx={{ py: 8 }}
      >
        <BackButton />
        {/* Background Decorations */}
        <BackgroundDecoration
          sx={{
            width: "400px",
            height: "400px",
            top: "15%",
            right: "10%",
            animation: "float 8s ease-in-out infinite",
          }}
        />
        <BackgroundDecoration
          sx={{
            width: "250px",
            height: "250px",
            bottom: "15%",
            left: "10%",
            background:
              "linear-gradient(135deg, rgba(56, 142, 60, 0.1) 0%, rgba(245, 124, 0, 0.1) 100%)",
            animation: "float 6s ease-in-out infinite reverse",
          }}
        />

        {/* Main Container */}
        <Container
          maxWidth="xl"
          sx={{ position: "relative", zIndex: 1, mt: 4 }}
        >
          <Grid
            container
            spacing={6}
            alignItems="center"
            sx={{ minHeight: "85vh" }}
          >
            {/* Left Side - Marketing Content */}
            <Grid
              item
              xs={12}
              md={7}
              sx={{ display: { xs: "none", md: "block" } }}
            >
              <Box sx={{ pr: 4 }}>
                <Chip
                  label="Next-Generation Healthcare Technology"
                  sx={{
                    mb: 4,
                    px: 3,
                    py: 1.5,
                    backgroundColor: "rgba(25, 118, 210, 0.1)",
                    color: "#1565C0",
                    borderRadius: 3,
                    fontSize: "14px",
                    fontWeight: 600,
                    border: "1px solid rgba(25, 118, 210, 0.2)",
                  }}
                />

                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 800,
                    fontSize: { md: "3rem", lg: "3.5rem" },
                    color: "#1A237E",
                    mb: 2,
                    lineHeight: 1.2,
                  }}
                >
                  Advanced Gait Analysis
                </Typography>

                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 800,
                    fontSize: { md: "3rem", lg: "3.5rem" },
                    background:
                      "linear-gradient(135deg, #1976D2 0%, #388E3C 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    mb: 4,
                    lineHeight: 1.2,
                  }}
                >
                  Platform
                </Typography>

                <Typography
                  variant="h6"
                  sx={{
                    color: "#37474F",
                    mb: 5,
                    lineHeight: 1.6,
                    fontWeight: 400,
                  }}
                >
                  Empowering healthcare professionals with modern technology to
                  monitor gait and accelerate recovery.
                </Typography>

                {/* Benefits */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {[
                    {
                      icon: <SecurityIcon />,
                      text: "Secure Platform",
                      desc: "Bank-level encryption and compliance",
                    },
                    {
                      icon: <VerifiedUserIcon />,
                      text: "Medical Grade Accuracy",
                      desc: "Clinically validated for reliable insights",
                    },
                    {
                      icon: <CloudIcon />,
                      text: "Cloud-Based Analytics",
                      desc: "Real-time data processing",
                    },
                  ].map((benefit, index) => (
                    <Box
                      key={index}
                      sx={{ display: "flex", alignItems: "center", gap: 3 }}
                    >
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: "12px",
                          background: "rgba(25, 118, 210, 0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#1976D2",
                        }}
                      >
                        {benefit.icon}
                      </Box>
                      <Box>
                        <Typography
                          variant="h6"
                          fontWeight="600"
                          color="#1A237E"
                        >
                          {benefit.text}
                        </Typography>
                        <Typography variant="body2" color="#546E7A">
                          {benefit.desc}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>

            {/* Right Side - Login Form */}
            <Grid item xs={12} md={5} maxHeight="90vh">
              <Card variant="outlined">
                {/* Header with Logo */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                    mb: 1,
                  }}
                >
                  <Box
                    component="img"
                    src={logo}
                    alt="RehabGait Logo"
                    sx={{
                      height: 48,
                      width: "auto",
                    }}
                  />

                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 800,
                      color: "#1A237E",
                      fontSize: { xs: "1.8rem", sm: "2.125rem" },
                    }}
                  >
                    RehabGait
                  </Typography>
                </Box>

                <Typography
                  variant="body1"
                  sx={{
                    textAlign: "center",
                    color: "#546E7A",
                    fontSize: { xs: "1.0rem", sm: "1.5rem" },
                    fontWeight: 500,
                    mb: 3,
                  }}
                >
                  Welcome Back
                </Typography>

                {/* Login Form */}
                <Box
                  component="form"
                  onSubmit={handleSubmit(onSubmit)}
                  sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                >
                  <FormControl>
                    <FormLabel
                      htmlFor="username"
                      sx={{
                        fontWeight: 600,
                        color: "#1A237E",
                        mb: 1,
                      }}
                    >
                      Username
                    </FormLabel>
                    <TextField
                      autoFocus
                      required
                      fullWidth
                      id="username"
                      placeholder="Enter your username"
                      name="username"
                      autoComplete="username"
                      variant="outlined"
                      error={!!errors.username}
                      helperText={errors.username?.message}
                      {...register("username")}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AccountCircleIcon sx={{ color: "#546E7A" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          backgroundColor: "rgba(248, 250, 252, 0.8)",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            backgroundColor: "rgba(248, 250, 252, 1)",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                          },
                          "&.Mui-focused": {
                            backgroundColor: "white",
                            boxShadow: "0 0 0 3px rgba(25, 118, 210, 0.1)",
                            borderColor: "#1976D2",
                          },
                        },
                      }}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel
                      htmlFor="password"
                      sx={{
                        fontWeight: 600,
                        color: "#1A237E",
                        mb: 1,
                      }}
                    >
                      Password
                    </FormLabel>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                      id="password"
                      autoComplete="current-password"
                      variant="outlined"
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      {...register("password")}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: "#546E7A" }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              sx={{ color: "#546E7A" }}
                            >
                              {showPassword ? (
                                <VisibilityOffIcon />
                              ) : (
                                <VisibilityIcon />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          backgroundColor: "rgba(248, 250, 252, 0.8)",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            backgroundColor: "rgba(248, 250, 252, 1)",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                          },
                          "&.Mui-focused": {
                            backgroundColor: "white",
                            boxShadow: "0 0 0 3px rgba(25, 118, 210, 0.1)",
                            borderColor: "#1976D2",
                          },
                        },
                      }}
                    />
                  </FormControl>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={<LoginIcon />}
                    sx={{
                      py: 2,
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      borderRadius: "12px",
                      background:
                        "linear-gradient(135deg, #1976D2 0%, #1565C0 100%)",
                      boxShadow: "0 8px 25px rgba(25, 118, 210, 0.3)",
                      textTransform: "none",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 12px 30px rgba(25, 118, 210, 0.4)",
                      },
                    }}
                  >
                    Sign In
                  </Button>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  {/* <Link
                    href="/forgot-password"
                    component={RouterLink} // Add this import: import { Link as RouterLink } from 'react
                    underline="hover"
                    sx={{
                      color: "rgb(64, 131, 208)",
                      fontWeight: 500,
                      textDecoration: "none",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Forgot your password?
                  </Link> */}
                  <RouterLink
                    to="/forgot-password"
                    style={{
                      color: "rgb(64, 131, 208)",
                      fontWeight: 500,
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.textDecoration = "underline")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.textDecoration = "none")
                    }
                  >
                    Forgot your password?
                  </RouterLink>
                </Box>

                <Divider sx={{ my: 3 }}>
                  <Typography variant="body2" color="#546E7A" fontWeight="500">
                    Need Access?
                  </Typography>
                </Divider>

                <Box
                  sx={{
                    p: 3,
                    borderRadius: "12px",
                    background: "rgba(25, 118, 210, 0.05)",
                    border: "1px solid rgba(25, 118, 210, 0.15)",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="body2" color="#546E7A" sx={{ mb: 1 }}>
                    Don't have an account?
                  </Typography>
                  <Link
                    href="/contact"
                    underline="hover"
                    sx={{
                      color: "#1976D2",
                      fontWeight: 600,
                      textDecoration: "none",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Contact us to get started →
                  </Link>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Container>

        {/* Snackbar for feedback */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            sx={{
              width: "100%",
              borderRadius: "12px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px) rotate(0deg);
            }
            50% {
              transform: translateY(-15px) rotate(2deg);
            }
          }
        `}</style>
      </LoginContainer>
    </React.Fragment>
  );
}
