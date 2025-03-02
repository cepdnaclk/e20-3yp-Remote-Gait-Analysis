import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, Card, CardContent, Avatar, Grid } from '@mui/material';
import ImageHaritha from '../assets/images/e20037.jpg';
import ImageChamodi from '../assets/images/e20365.jpeg';
import ImageChamath from '../assets/images/e20342.jpg';
import ImageYohan from '../assets/images/e20363.jpg';

const teamMembers = [
  { name: 'Haritha Bandara', image: ImageHaritha },
  { name: 'Chamodi Senaratne', image: ImageChamodi },
  { name: 'Chamath Rupasinghe', image: ImageChamath },
  { name: 'Yohan Senanayake', image: ImageYohan },
];

const AboutUs = () => {
  return (
    <Box>
      <Box sx={styles.header}>
        <Typography variant="h3">Welcome to RehabGait</Typography>
        <Typography variant="h6">Transforming Gait Analysis with IoT & Cloud Technology</Typography>
      </Box>

      <Box sx={styles.container}>
        <Box sx={styles.aboutSection}>
          <Typography variant="h4" gutterBottom>About Us</Typography>
          <Typography variant="body1" paragraph>
            At RehabGait, we are committed to revolutionizing gait analysis with cutting-edge IoT and cloud technology.
            Our goal is to provide healthcare professionals with an accurate, real-time solution for monitoring and assessing gait,
            improving the quality of rehabilitation for individuals with movement disorders and injuries.
          </Typography>
          <Typography variant="body1" paragraph>
            Our platform bridges the gap in conventional gait analysis systems by enabling remote assessments, reducing human errors,
            and increasing accessibility to high-quality care. Whether it's for Parkinson’s patients, stroke recovery, or
            physiotherapy clinics, RehabGait offers a scalable, efficient, and user-friendly solution.
          </Typography>
        </Box>

        <Box sx={styles.team}>
          <Typography variant="h4" align="center" gutterBottom>Meet Our Team</Typography>
          <Grid container spacing={3} justifyContent="center">
            {teamMembers.map((member, index) => (
              <Grid item key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Card sx={styles.card}>
                  <Avatar alt={member.name} src={member.image} sx={styles.avatar} />
                  <CardContent>
                    <Typography variant="h6" align="center">{member.name}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={styles.section}>
          <Typography variant="h4" gutterBottom>Our Key Features</Typography>
          <List>
            {features.map((feature, index) => (
              <ListItem key={index}>
                <ListItemText primary={feature} />
              </ListItem>
            ))}
          </List>
        </Box>

        <Box sx={styles.section}>
          <Typography variant="h4" gutterBottom>Our Mission</Typography>
          <List>
            {missionStatements.map((statement, index) => (
              <ListItem key={index}>
                <ListItemText primary={statement} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>

      <Box sx={styles.footer}>
        <Typography variant="body2" align="center">&copy; 2025 RehabGait - All rights reserved.</Typography>
      </Box>
    </Box>
  );
};

const features = [
  "Real-time heat map for plantar pressure analysis",
  "Interactive 3D gait analysis visualization",
  "Comprehensive gait parameter analysis (cadence, velocity, stride length)",
  "Automatic report generation for easy progress tracking",
];

const missionStatements = [
  "Provide an innovative, scalable solution for gait analysis using IoT and cloud technology.",
  "Enable remote monitoring for more effective physiotherapy and rehabilitation.",
  "Enhance accessibility to high-quality care and improve patient outcomes.",
  "Reduce human error and streamline the analysis process for better efficiency.",
];

const styles = {
  header: {
    textAlign: 'center',
    backgroundColor: '#002884',
    color: 'white',
    padding: '30px 0',
  },
  container: {
    width: '80%',
    margin: '0 auto',
    padding: '40px 20px',
  },
  aboutSection: {
    marginBottom: '40px',
  },
  team: {
    textAlign: 'center',
    backgroundColor: '#f5f5f5',
    padding: '30px',
    borderRadius: '10px',
  },
  card: {
    width: 200,
    minHeight: 250,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    borderRadius: '10px',
    boxShadow: 3,
  },
  avatar: {
    width: 100,
    height: 100,
    margin: '10px auto',
    border: '3px solid #0d47a1',
  },
  section: {
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