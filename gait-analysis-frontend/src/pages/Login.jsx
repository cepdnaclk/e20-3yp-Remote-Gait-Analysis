import * as React from 'react';
import { useNavigate } from "react-router-dom";
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
  Grid
} from "@mui/material";
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import logo from "../assets/images/logo-modified.png";
import BASE_URL from '../config';

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
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  maxWidth: '450px',
  padding: theme.spacing(4),
  gap: theme.spacing(2.5),
  margin: 'auto',
  background: 'rgba(255, 255, 255, 0.98)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: 'linear-gradient(90deg, #4299e1 0%, #48bb78 50%, #ed8936 100%)',
  },
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
    padding: theme.spacing(3),
    borderRadius: '12px',
  },
}));

const LoginContainer = styled(Stack)(({ theme }) => ({
  minHeight: '100vh',
  width: '100vw',
  padding: theme.spacing(3),
  background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 50%, #4a5568 100%)',
  position: 'relative',
  overflow: 'auto',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const BackgroundDecoration = styled(Box)({
  position: 'absolute',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, rgba(66, 153, 225, 0.06) 0%, rgba(72, 187, 120, 0.06) 100%)',
  filter: 'blur(30px)',
});

const FeatureChip = ({ icon, text }) => (
  <Chip
    icon={icon}
    label={text}
    size="small"
    sx={{
      backgroundColor: 'rgba(66, 153, 225, 0.12)',
      color: '#2b6cb0',
      fontWeight: 600,
      border: '1px solid rgba(66, 153, 225, 0.2)',
      '& .MuiChip-icon': {
        color: '#2b6cb0',
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
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState('error');

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/signin`, {
        username: data.username,
        password: data.password
      });

      // Save to localStorage
      const { jwtToken: token, roles} = response.data;
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
      <LoginContainer direction="column" justifyContent="center" alignItems="center" sx={{ py: 8 }}>
        
        {/* Background Decorations */}
        <BackgroundDecoration 
          sx={{ 
            width: '500px', 
            height: '500px', 
            top: '10%', 
            right: '10%',
            animation: 'float 8s ease-in-out infinite',
          }} 
        />
        <BackgroundDecoration 
          sx={{ 
            width: '300px', 
            height: '300px', 
            bottom: '10%', 
            left: '10%',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(245, 158, 11, 0.08) 100%)',
            animation: 'float 6s ease-in-out infinite reverse',
          }} 
        />

        {/* Left Side - Branding (Desktop Only) */}
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center" sx={{ minHeight: '80vh' }}>
            
            {/* Left Side - Marketing Content */}
            <Grid item xs={12} md={7} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box sx={{ pr: 4 }}>
                <Chip 
                  label="Next-Generation Healthcare Technology" 
                  sx={{ 
                    mb: 3,
                    px: 2,
                    py: 1,
                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                    color: "#60a5fa",
                    borderRadius: 3,
                    fontSize: "14px",
                    fontWeight: 600,
                    border: "1px solid rgba(59, 130, 246, 0.2)",
                  }} 
                />
                
                <Typography 
                  variant="h2" 
                  sx={{
                    fontWeight: 800,
                    fontSize: { md: "3rem", lg: "3.5rem" },
                    color: 'white',
                    mb: 3,
                    lineHeight: 1.2,
                  }}
                >
                  Advanced Gait Analysis
                  <br />
                  <Box 
                    component="span" 
                    sx={{
                      background: "linear-gradient(135deg, #3b82f6 0%, #10b981 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Platform
                  </Box>
                </Typography>

                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: "rgba(255, 255, 255, 0.8)",
                    mb: 4,
                    lineHeight: 1.6,
                    fontWeight: 400,
                  }}
                >
                  Empowering healthcare professionals with modern technology to monitor gait and accelerate recovery.
                </Typography>

                {/* Benefits */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {[
                    { icon: <SecurityIcon />, text: 'HIPAA Compliant Security', desc: 'Bank-level encryption and compliance' },
                    { icon: <VerifiedUserIcon />, text: 'Medical Grade Accuracy', desc: 'FDA approved technology' },
                    { icon: <CloudIcon />, text: 'Cloud-Based Analytics', desc: 'Real-time data processing' },
                  ].map((benefit, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box 
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '10px',
                          background: 'rgba(59, 130, 246, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#60a5fa',
                        }}
                      >
                        {benefit.icon}
                      </Box>
                      <Box>
                        <Typography variant="body1" fontWeight="600" color="white">
                          {benefit.text}
                        </Typography>
                        <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                          {benefit.desc}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>

            {/* Right Side - Login Form */}
            <Grid item xs={12} md={5}>
              <Card variant="outlined">
            {/* Header with Enhanced Logo */}
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 70,
                  height: 70,
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)',
                  mb: 3,
                  boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'url(' + logo + ') center/contain no-repeat',
                    filter: 'brightness(0) invert(1)',
                  }
                }}
              >
                <LocalHospitalIcon sx={{ fontSize: 28, color: 'white', position: 'relative', zIndex: 1 }} />
              </Box>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  mb: 1,
                  fontSize: { xs: '1.8rem', sm: '2.125rem' },
                }}
              >
                RehabGait
              </Typography>
              
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 500,
                  mb: 3,
                }}
              >
                Welcome Back
              </Typography>

              {/* Feature Chips - Mobile Responsive */}
              <Box sx={{ display: { xs: 'flex', md: 'flex' }, gap: 1, justifyContent: 'center', flexWrap: 'wrap', mb: 2 }}>
                <FeatureChip icon={<SecurityIcon sx={{ fontSize: 14 }} />} text="HIPAA" />
                <FeatureChip icon={<CloudIcon sx={{ fontSize: 14 }} />} text="Secure" />
                <FeatureChip icon={<VerifiedUserIcon sx={{ fontSize: 14 }} />} text="FDA" />
              </Box>
            </Box>

            {/* Login Form */}
            <Box 
              component="form" 
              onSubmit={handleSubmit(onSubmit)} 
              sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
            >
              <FormControl>
                <FormLabel 
                  htmlFor="username"
                  sx={{ 
                    fontWeight: 600, 
                    color: 'text.primary',
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
                        <AccountCircleIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      backgroundColor: 'rgba(247, 250, 252, 0.9)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(247, 250, 252, 1)',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'white',
                        boxShadow: '0 0 0 2px rgba(66, 153, 225, 0.2)',
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
                    color: 'text.primary',
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
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  variant="outlined"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  {...register("password")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: 'text.secondary' }}
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      backgroundColor: 'rgba(247, 250, 252, 0.9)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(247, 250, 252, 1)',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'white',
                        boxShadow: '0 0 0 2px rgba(66, 153, 225, 0.2)',
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
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
                  boxShadow: '0 4px 15px rgba(66, 153, 225, 0.25)',
                  textTransform: 'none',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #3182ce 0%, #2c5282 100%)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 6px 20px rgba(66, 153, 225, 0.3)',
                  },
                }}
              >
                Sign In
              </Button>
            </Box>

            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary" fontWeight="500">
                Need Access?
              </Typography>
            </Divider>

            <Box
              sx={{
                p: 2.5,
                borderRadius: '12px',
                background: 'rgba(66, 153, 225, 0.04)',
                border: '1px solid rgba(66, 153, 225, 0.15)',
                textAlign: 'center',
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Don't have an account?
              </Typography>
              <Link 
                href="/contact" 
                underline="hover" 
                sx={{ 
                  color: '#2b6cb0', 
                  fontWeight: 600,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
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

        {/* Trust Indicators */}
        <Box sx={{ textAlign: 'center', mt: 3, position: 'relative', zIndex: 1 }}>
          <Typography variant="caption" color="rgba(255, 255, 255, 0.8)" sx={{ mb: 1, display: 'block' }}>
            Trusted by healthcare professionals worldwide
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SecurityIcon sx={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.8)' }} />
              <Typography variant="caption" color="rgba(255, 255, 255, 0.8)">
                HIPAA Compliant
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <VerifiedUserIcon sx={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.8)' }} />
              <Typography variant="caption" color="rgba(255, 255, 255, 0.8)">
                Medical Grade Security
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Snackbar for feedback */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            sx={{ 
              width: '100%',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(2deg); }
          }
        `}</style>
      </LoginContainer>
    </React.Fragment>
  );
}