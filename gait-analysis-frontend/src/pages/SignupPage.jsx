import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Container,
  Alert,
  Snackbar,
  InputAdornment,
  Chip,
  CircularProgress,
  Paper,
  Divider,
} from "@mui/material";
import {
  AccountCircle as AccountCircleIcon,
  Lock as LockIcon,
  Email as EmailIcon,
  Business as BusinessIcon,
  LocalHospital as LocalHospitalIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { invitationSignup } from "../services/authService";

const SignupPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // URL Parameters
  const [token, setToken] = useState("");
  const [accountType, setAccountType] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  // UI State
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Extract URL parameters on component mount
  useEffect(() => {
    const tokenParam = searchParams.get("token");
    const typeParam = searchParams.get("type");

    if (!tokenParam || !typeParam) {
      setSnackbar({
        open: true,
        message:
          "Invalid invitation link. Please check your email and try again.",
        severity: "error",
      });
      return;
    }

    setToken(tokenParam);
    setAccountType(typeParam);
  }, [searchParams]);

  // Handle form input changes
  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  // Form validation
  const isFormValid = () => {
    return (
      formData.username.trim().length >= 3 &&
      formData.password.length >= 6 &&
      formData.confirmPassword === formData.password &&
      token &&
      accountType
    );
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isFormValid()) {
      setSnackbar({
        open: true,
        message: "Please fill in all fields correctly",
        severity: "error",
      });
      return;
    }

    setLoading(true);

    try {
      // Prepare signup data
      const signupData = {
        token: token,
        accountType: accountType,
        username: formData.username.trim(),
        password: formData.password,
      };

      // Call API
      await invitationSignup(signupData);

      // Success
      setSnackbar({
        open: true,
        message: "Account created successfully! Redirecting to login...",
        severity: "success",
      });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Signup failed:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to create account. Please try again.";

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Get account type display info
  const getAccountTypeInfo = () => {
    switch (accountType?.toLowerCase()) {
      case "clinic":
        return {
          icon: <BusinessIcon />,
          label: "Clinic Administrator",
          color: "#2563eb",
          description: "Manage patients, doctors, and clinic operations",
        };
      case "doctor":
        return {
          icon: <LocalHospitalIcon />,
          label: "Doctor",
          color: "#16a34a",
          description: "Access patient records and provide medical care",
        };
      case "patient":
        return {
          icon: <PersonIcon />,
          label: "Patient",
          color: "#dc2626",
          description: "View your health data and communicate with doctors",
        };
      default:
        return {
          icon: <AccountCircleIcon />,
          label: "User",
          color: "#6b7280",
          description: "Complete your account setup",
        };
    }
  };

  const accountInfo = getAccountTypeInfo();

  // Handle snackbar close
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: 480,
            boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
            borderRadius: 3,
            background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Header */}
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${accountInfo.color}15 0%, ${accountInfo.color}25 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px auto",
                  color: accountInfo.color,
                }}
              >
                {React.cloneElement(accountInfo.icon, { sx: { fontSize: 40 } })}
              </Box>

              <Typography variant="h4" fontWeight="700" gutterBottom>
                Complete Your Setup
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Welcome to GaitMate! Set up your account credentials below.
              </Typography>

              <Chip
                label={accountInfo.label}
                sx={{
                  bgcolor: `${accountInfo.color}15`,
                  color: accountInfo.color,
                  fontWeight: 600,
                  borderRadius: 2,
                }}
              />
            </Box>

            {/* Account Type Info */}
            {/* <Paper
              sx={{
                p: 3,
                mb: 4,
                bgcolor: "rgba(59, 130, 246, 0.05)",
                border: "1px solid rgba(59, 130, 246, 0.1)",
                borderRadius: 2,
              }}
            >
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Account Details
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {accountInfo.description}
              </Typography>
            </Paper>

            <Divider sx={{ my: 3 }} /> */}

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Username"
                value={formData.username}
                onChange={handleChange("username")}
                margin="normal"
                required
                autoFocus
                disabled={loading}
                helperText="Choose a unique username (minimum 3 characters)"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircleIcon sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "white",
                  },
                }}
              />

              <TextField
                fullWidth
                type="password"
                label="Password"
                value={formData.password}
                onChange={handleChange("password")}
                margin="normal"
                required
                disabled={loading}
                helperText="Create a secure password (minimum 6 characters)"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "white",
                  },
                }}
              />

              <TextField
                fullWidth
                type="password"
                label="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange("confirmPassword")}
                margin="normal"
                required
                disabled={loading}
                helperText="Re-enter your password to confirm"
                error={
                  formData.confirmPassword &&
                  formData.password !== formData.confirmPassword
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "white",
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={!isFormValid() || loading}
                sx={{
                  mt: 4,
                  py: 1.5,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${accountInfo.color} 0%, ${accountInfo.color}dd 100%)`,
                  boxShadow: `0 4px 16px ${accountInfo.color}40`,
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  "&:hover": {
                    background: `linear-gradient(135deg, ${accountInfo.color}dd 0%, ${accountInfo.color}bb 100%)`,
                    transform: "translateY(-1px)",
                    boxShadow: `0 8px 24px ${accountInfo.color}50`,
                  },
                  "&:disabled": {
                    background: "rgba(0,0,0,0.12)",
                    color: "rgba(0,0,0,0.26)",
                    transform: "none",
                    boxShadow: "none",
                  },
                  transition: "all 0.2s ease",
                }}
                startIcon={
                  loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <CheckCircleIcon />
                  )
                }
              >
                {loading ? "Creating Account..." : "Complete Setup"}
              </Button>
            </Box>

            {/* Debug Info (Optional - remove in production) */}
            {/* {process.env.NODE_ENV === "development" && (
              <Paper
                sx={{
                  mt: 3,
                  p: 2,
                  bgcolor: "rgba(107, 114, 128, 0.05)",
                  border: "1px solid rgba(107, 114, 128, 0.1)",
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mb: 1 }}
                >
                  Debug Info (Development Only):
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block" }}
                >
                  Token: {token || "Not found"}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block" }}
                >
                  Type: {accountType || "Not found"}
                </Typography>
              </Paper>
            )} */}
          </CardContent>
        </Card>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={handleCloseSnackbar}
          sx={{
            width: "100%",
            borderRadius: 2,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SignupPage;
