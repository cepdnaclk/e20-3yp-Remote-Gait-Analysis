// src/components/AboutUs.js
import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, Paper, Card, CardContent, Avatar, Grid } from '@mui/material';

const AboutUs = () => {
  return (
    <div>
      <Box sx={styles.header}>
        <Typography variant="h3" color="white">Welcome to RehabGait</Typography>
        <Typography variant="h6" color="white">Transforming Gait Analysis with IoT & Cloud Technology</Typography>
      </Box>

      <Box sx={styles.container}>
        <Box sx={styles.aboutSection}>
          <Box sx={styles.aboutText}>
            <Typography variant="h4">About Us</Typography>
            <Typography variant="body1" paragraph>
              At RehabGait, we are committed to revolutionizing the way gait analysis is conducted. Our team of passionate innovators is focused on developing a comprehensive and accessible solution that uses advanced IoT and cloud technology to assist healthcare providers and physiotherapists in accurately monitoring and assessing patients' gait.
            </Typography>
            <Typography variant="body1" paragraph>
              Our goal is to bridge the gap in current gait analysis systems by providing a remote solution that allows for real-time monitoring, reducing errors, and enhancing accessibility. We are dedicated to improving outcomes for individuals with movement disorders like Parkinson’s and those recovering from strokes, as well as offering a scalable solution for physiotherapy practices worldwide.
            </Typography>
          </Box>

          <Box sx={styles.team}>
            <Typography variant="h6" align="center" sx={{ marginBottom: 2 }}>Meet Our Team</Typography>
            <Grid container spacing={2} justifyContent="center" sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Grid item>
                <Card sx={styles.card}>
                  <Avatar
                    alt="Haritha Bandara"
                    src="docs\images\team\e20037.jpg" // Path to the image file
                    sx={styles.avatar}
                  />
                  <CardContent>
                    <Typography variant="h6" align="center">Haritha Bandara</Typography>
                    
                  </CardContent>
                </Card>
              </Grid>
              <Grid item>
                <Card sx={styles.card}>
                  <Avatar
                    alt="Chamodi Senaratne"
                    src="/path/to/chamodi-image.jpg" // Path to the image file
                    sx={styles.avatar}
                  />
                  <CardContent>
                    <Typography variant="h6" align="center">Chamodi Senaratne</Typography>
                    
                  </CardContent>
                </Card>
              </Grid>
              <Grid item>
                <Card sx={styles.card}>
                  <Avatar
                    alt="Chamath Rupasinghe"
                    src="/path/to/chamath-image.jpg" // Path to the image file
                    sx={styles.avatar}
                  />
                  <CardContent>
                    <Typography variant="h6" align="center">Chamath Rupasinghe</Typography>
                   
                  </CardContent>
                </Card>
              </Grid>
              <Grid item>
                <Card sx={styles.card}>
                  <Avatar
                    alt="Yohan Senanayake"
                    src="/docs/images/team/e20365.jpg" // Path to the image file
                    sx={styles.avatar}
                  />
                  <CardContent>
                    <Typography variant="h6" align="center">Yohan Senanayake</Typography>
                
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Box>

        <Box sx={styles.features}>
          <Typography variant="h4">Our Key Features</Typography>
          <List>
            <ListItem>
              <ListItemText primary="Real-time heat map for plantar pressure analysis" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Interactive 3D gait analysis visualization" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Comprehensive gait parameter analysis (e.g., cadence, velocity, stride length)" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Automatic report generation for easy tracking of progress" />
            </ListItem>
          </List>
        </Box>

        <Box sx={styles.mission}>
          <Typography variant="h4">Our Mission</Typography>
          <List>
            <ListItem>
              <ListItemText primary="Provide an innovative, scalable solution for gait analysis using IoT and cloud technology." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Enable remote monitoring for more effective physiotherapy and rehabilitation." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Enhance accessibility to high-quality care and improve patient outcomes." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Reduce human error and time consumption in the analysis process, making it more efficient." />
            </ListItem>
          </List>
        </Box>
      </Box>

      <Box sx={styles.footer}>
        <Typography variant="body2" color="white" align="center">
          &copy; 2025 Rehab Gait - All rights reserved.
        </Typography>
      </Box>
    </div>
  );
};

const styles = {
  header: {
    textAlign: 'center',
    backgroundColor: '#002884',
    color: 'white',
    padding: '30px',
  },
  container: {
    width: '80%',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '10px',
  },
  aboutSection: {
    marginTop: '50px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  aboutText: {
    width: '65%',
  },
  team: {
    width: '100%',
    backgroundColor: '#e0e0e0',
    padding: '20px',
    borderRadius: '10px',
  },
  card: {
    width: 200,
    textAlign: 'center',
    borderRadius: '10px',
    boxShadow: 3,
  },
  avatar: {
    width: 100,
    height: 100,
    margin: '0 auto',
    border: '3px solid #0d47a1', // Optional: Border color for the avatar
  },
  features: {
    marginTop: '30px',
  },
  mission: {
    marginTop: '30px',
  },
  footer: {
    textAlign: 'center',
    backgroundColor: '#0d47a1',
    color: 'white',
    padding: '20px',
    marginTop: '50px',
  },
};

export default AboutUs;
