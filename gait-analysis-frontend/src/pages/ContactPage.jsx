import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Paper,
  Container,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

// Icons
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import SendIcon from '@mui/icons-material/Send';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    inquiryType: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      setSnackbarMessage('Thank you for your inquiry! We\'ll get back to you within 24 hours.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setIsLoading(false);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        organization: '',
        inquiryType: '',
        message: ''
      });
    }, 1500);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 25%, #90CAF9 50%, #64B5F6 75%, #42A5F5 100%)',
      py: 6, 
      px: 2 
    }}>
      <Container maxWidth="lg">
        <Paper
          elevation={6}
          sx={{
            maxWidth: 1000,
            margin: 'auto',
            padding: 4,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(15px)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.12)',
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" color="#1A237E">
              Contact Us
            </Typography>
            <Typography variant="h6" sx={{ color: '#546E7A', mb: 3 }}>
              Get in touch to learn more about RehabGait or to request access to our platform
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* Contact Info */}
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom fontWeight="600" color="#1A237E" sx={{ mb: 3 }}>
                Get In Touch
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 4, color: '#546E7A', lineHeight: 1.6 }}>
                Reach out to us for inquiries, onboarding, or support. We're here to help you get started with our advanced gait analysis platform.
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box 
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: '12px',
                      background: 'rgba(25, 118, 210, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#1976D2',
                      mr: 3,
                    }}
                  >
                    <EmailIcon />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight="600" color="#1A237E">
                      Email
                    </Typography>
                    <Typography variant="body1" color="#1976D2" fontWeight="600">
                      <a href="mailto:support@rehabgait.com" style={{ textDecoration: 'none', color: 'inherit' }}>
                        support@rehabgait.com
                      </a>
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box 
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: '12px',
                      background: 'rgba(56, 142, 60, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#388E3C',
                      mr: 3,
                    }}
                  >
                    <PhoneIcon />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight="600" color="#1A237E">
                      Phone
                    </Typography>
                    <Typography variant="body1" color="#388E3C" fontWeight="600">
                      +94 71 594 6400
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box 
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: '12px',
                      background: 'rgba(76, 175, 80, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#4CAF50',
                      mr: 3,
                    }}
                  >
                    <WhatsAppIcon />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight="600" color="#1A237E">
                      WhatsApp
                    </Typography>
                    <Typography variant="body1" color="#4CAF50" fontWeight="600">
                      +94 71 594 6400
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box 
                sx={{
                  mt: 4,
                  p: 3,
                  borderRadius: '12px',
                  background: 'rgba(25, 118, 210, 0.05)',
                  border: '1px solid rgba(25, 118, 210, 0.15)',
                }}
              >
                <Typography variant="h6" fontWeight="600" color="#1A237E" sx={{ mb: 1 }}>
                  Response Time
                </Typography>
                <Typography variant="body2" color="#546E7A">
                  We typically respond to all inquiries within 24 hours during business days.
                </Typography>
              </Box>
            </Grid>

            {/* Contact Form */}
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom fontWeight="600" color="#1A237E" sx={{ mb: 3 }}>
                Send us a Message
              </Typography>

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField 
                      fullWidth 
                      label="Your Name" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      variant="outlined" 
                      required
                      disabled={isLoading}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: 'rgba(248, 250, 252, 0.8)',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField 
                      fullWidth 
                      label="Email" 
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      variant="outlined" 
                      required
                      disabled={isLoading}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: 'rgba(248, 250, 252, 0.8)',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField 
                      fullWidth 
                      label="Organization (Optional)" 
                      name="organization"
                      value={formData.organization}
                      onChange={handleInputChange}
                      variant="outlined"
                      disabled={isLoading}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: 'rgba(248, 250, 252, 0.8)',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Inquiry Type</InputLabel>
                      <Select
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleInputChange}
                        label="Inquiry Type"
                        disabled={isLoading}
                        sx={{
                          borderRadius: '12px',
                          backgroundColor: 'rgba(248, 250, 252, 0.8)',
                        }}
                      >
                        <MenuItem value="demo">Request a Demo</MenuItem>
                        <MenuItem value="pricing">Pricing Information</MenuItem>
                        <MenuItem value="support">Technical Support</MenuItem>
                        <MenuItem value="partnership">Partnership</MenuItem>
                        <MenuItem value="general">General Inquiry</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Your Message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      multiline
                      rows={4}
                      variant="outlined"
                      required
                      disabled={isLoading}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: 'rgba(248, 250, 252, 0.8)',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button 
                      type="submit" 
                      fullWidth 
                      variant="contained"
                      size="large"
                      disabled={isLoading}
                      startIcon={<SendIcon />}
                      sx={{
                        py: 2,
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)',
                        textTransform: 'none',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)',
                        },
                      }}
                    >
                      {isLoading ? 'Sending Message...' : 'Send Message'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>

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
    </Box>
  );
}