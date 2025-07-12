import React, { useState, useEffect } from "react";
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
  IconButton,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { resetPassword } from "../services/authService";

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  // Check if token exists in URL
  useEffect(() => {
    if (!token) {
      setError(
        "Invalid or missing reset token. Please request a new password reset."
      );
    }
  }, [token]);

  const onSubmit = async (data) => {
    if (!token) return;

    setIsLoading(true);
    setError("");

    try {
      await resetPassword(token, data.password);
      setIsSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to reset password. Please try again."
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
            <CheckCircleIcon
              sx={{
                fontSize: 60,
                color: "#4CAF50",
                mb: 2,
              }}
            />

            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: "#1A237E",
                mb: 2,
                textAlign: "center",
              }}
            >
              Password Reset Successful!
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "#546E7A",
                textAlign: "center",
                mb: 3,
              }}
            >
              Your password has been updated successfully. You will be
              redirected to the login page in a few seconds.
            </Typography>

            <Button
              variant="contained"
              onClick={() => navigate("/login")}
              sx={{
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 600,
                padding: "12px 24px",
                background: "linear-gradient(135deg, #1976D2 0%, #42A5F5 100%)",
              }}
            >
              Go to Login
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
            Reset Your Password
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
            Enter your new password below. Make sure it's strong and secure.
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
            {/* New Password Field */}
            <FormControl>
              <FormLabel
                htmlFor="password"
                sx={{
                  fontWeight: 600,
                  color: "#1A237E",
                  mb: 1,
                }}
              >
                New Password
              </FormLabel>
              <TextField
                autoFocus
                required
                fullWidth
                name="password"
                placeholder="Enter your new password"
                type={showPassword ? "text" : "password"}
                id="password"
                variant="outlined"
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters long",
                  },
                })}
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

            {/* Confirm Password Field */}
            <FormControl>
              <FormLabel
                htmlFor="confirmPassword"
                sx={{
                  fontWeight: 600,
                  color: "#1A237E",
                  mb: 1,
                }}
              >
                Confirm New Password
              </FormLabel>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                placeholder="Confirm your new password"
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                variant="outlined"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: "#546E7A" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        edge="end"
                        sx={{ color: "#546E7A" }}
                      >
                        {showConfirmPassword ? (
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

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading || !token}
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
                  Updating Password...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ResetPassword;
