import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  FormControl,
  FormLabel,
  InputAdornment,
  Alert,
  CircularProgress,
  Link,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import EmailIcon from "@mui/icons-material/Email";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { forgotPassword } from "../services/authService";

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");

    try {
      await forgotPassword(data.email);
      setIsSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              borderRadius: "16px",
            }}
          >
            <Alert severity="success" sx={{ width: "100%", mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Check your email!
              </Typography>
              <Typography variant="body2">
                If an account with that email exists, we've sent you a password
                reset link.
              </Typography>
            </Alert>

            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/login")}
              sx={{
                mt: 2,
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 600,
                padding: "12px 24px",
              }}
            >
              Back to Login
            </Button>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            borderRadius: "16px",
          }}
        >
          {/* Header */}
          <Typography
            component="h1"
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#1A237E",
              mb: 1,
              textAlign: "center",
            }}
          >
            Forgot Password?
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#546E7A",
              textAlign: "center",
              mb: 4,
              maxWidth: "400px",
            }}
          >
            No worries! Enter your email address and we'll send you a link to
            reset your password.
          </Typography>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Form */}
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              width: "100%",
            }}
          >
            <FormControl>
              <FormLabel
                htmlFor="email"
                sx={{
                  fontWeight: 600,
                  color: "#1A237E",
                  mb: 1,
                }}
              >
                Email Address
              </FormLabel>
              <TextField
                autoFocus
                required
                fullWidth
                id="email"
                placeholder="Enter your email address"
                name="email"
                autoComplete="email"
                type="email"
                variant="outlined"
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Please enter a valid email address",
                  },
                })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: "#546E7A" }} />
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

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                mt: 2,
                mb: 2,
                py: 1.5,
                borderRadius: "12px",
                textTransform: "none",
                fontSize: "16px",
                fontWeight: 600,
                background: "linear-gradient(135deg, #1976D2 0%, #42A5F5 100%)",
                boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                "&:hover": {
                  boxShadow: "0 6px 20px rgba(25, 118, 210, 0.4)",
                  transform: "translateY(-1px)",
                },
                "&:disabled": {
                  background: "#E0E0E0",
                  boxShadow: "none",
                },
              }}
            >
              {isLoading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>

            {/* Back to Login Link */}
            <Box sx={{ textAlign: "center" }}>
              <Link
                component={RouterLink}
                to="/login"
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
                ← Back to Login
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
