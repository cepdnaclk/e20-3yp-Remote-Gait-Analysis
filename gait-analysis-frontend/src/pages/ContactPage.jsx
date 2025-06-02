import React from 'react';
import { Box, Typography, TextField, Button, Grid, Paper } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

export default function ContactPage() {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#e0e0e0', py: 6, px: 2 }}>
      <Paper
        elevation={6}
        sx={{
          maxWidth: 900,
          margin: 'auto',
          padding: 4,
          borderRadius: 3,
          backgroundColor: '#ffffff',
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold" color="#0D47A1">
          Contact Us
        </Typography>

        <Typography variant="subtitle1" gutterBottom sx={{ mb: 3 }}>
          Reach out to us for inquiries, onboarding, or support. We're here to help!
        </Typography>

        <Grid container spacing={4}>
          {/* Contact Info */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <EmailIcon sx={{ color: '#0D47A1', mr: 1 }} />
              <Typography>Email: <a href="mailto:support@rehabgait.com">support@rehabgait.com</a></Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PhoneIcon sx={{ color: '#0D47A1', mr: 1 }} />
              <Typography>Phone: +94 71 594 6400</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <WhatsAppIcon sx={{ color: '#0D47A1', mr: 1 }} />
              <Typography>WhatsApp: +94 +94 71 594 6400</Typography>
            </Box>
          </Grid>

          {/* Contact Form */}
          <Grid item xs={12} md={6}>
            <Box component="form">
              <TextField fullWidth label="Your Name" variant="outlined" sx={{ mb: 2 }} />
              <TextField fullWidth label="Email" variant="outlined" sx={{ mb: 2 }} />
              <TextField
                fullWidth
                label="Your Message"
                multiline
                rows={4}
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <Button variant="contained" color="primary" sx={{ backgroundColor: '#0D47A1' }}>
                Send Message
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
