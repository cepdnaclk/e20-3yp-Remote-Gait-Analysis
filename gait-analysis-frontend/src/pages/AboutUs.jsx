import React from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Card, 
  CardContent, 
  Avatar, 
  Grid, 
  Button,
  Container,
  Chip,
  Divider,
  Paper
} from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';
import EmailIcon from '@mui/icons-material/Email';
import GroupIcon from '@mui/icons-material/Group';
import SchoolIcon from '@mui/icons-material/School';
import ImageHaritha from '../assets/images/e20037.jpg';
import ImageChamodi from '../assets/images/e20365.jpeg';
import ImageChamath from '../assets/images/e20342.jpg';
import ImageYohan from '../assets/images/e20363.jpg';
import ImageSupervisor from '../assets/images/isuru-nawinne.png';

const teamMembers = [
  { name: 'Haritha Bandara', image: ImageHaritha },
  { name: 'Chamodi Senaratne', image: ImageChamodi},
  { name: 'Chamath Rupasinghe', image: ImageChamath },
  { name: 'Yohan Senanayake', image: ImageYohan },
];

const supervisor = {
  name: 'Dr. Isuru Nawinne',
  image: ImageSupervisor,
  title: 'Senior Lecturer',
  department: 'Department of Computer Engineering',
  university: 'University of Peradeniya',
  //email: 'isuru.nawinne@eng.pdn.ac.lk'
};

const AboutUs = () => {
  const handleProjectPageClick = () => {
    window.open('https://cepdnaclk.github.io/e20-3yp-Remote-Gait-Analysis/', '_blank');
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fcfcfcff 0%, #ffffffff 100%)' }}>
      {/* Hero Section */}
      <Box sx={styles.hero}>
        <Container maxWidth="lg">
          <Typography variant="h2" sx={styles.heroTitle}>
            Welcome to RehabGait
          </Typography>
          <Typography variant="h5" sx={styles.heroSubtitle}>
            Empowering Every Step Towards Recovery
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              onClick={handleProjectPageClick}
              startIcon={<LaunchIcon />}
              sx={styles.projectButton}
              size="large"
            >
              View Project Details
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* About Section */}
        <Paper elevation={3} sx={styles.section}>
          <Typography variant="h4" gutterBottom sx={styles.sectionTitle}>
            About RehabGait
          </Typography>
          <Typography variant="body1" paragraph sx={styles.bodyText}>
            At RehabGait, we are committed to revolutionizing gait analysis with cutting-edge IoT and cloud technology.
            Our goal is to provide healthcare professionals with an accurate, real-time solution for monitoring and assessing gait,
            improving the quality of rehabilitation for individuals with movement disorders and injuries.
          </Typography>
          <Typography variant="body1" paragraph sx={styles.bodyText}>
            Our platform bridges the gap in conventional gait analysis systems by enabling remote assessments, reducing human errors,
            and increasing accessibility to high-quality care. Whether it's for Parkinson's patients, stroke recovery, or
            physiotherapy clinics, RehabGait offers a scalable, efficient, and user-friendly solution.
          </Typography>
        </Paper>

        {/* Supervisor Section */}
        <Paper elevation={3} sx={styles.section}>
          <Typography variant="h4" gutterBottom sx={styles.sectionTitle}>
            <SchoolIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
            Project Supervisor
          </Typography>
          <Card sx={styles.supervisorCard}>
            <CardContent sx={styles.supervisorContent}>
              <Avatar 
                alt={supervisor.name} 
                src={supervisor.image} 
                sx={styles.supervisorAvatar} 
              />
              <Box sx={styles.supervisorInfo}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  {supervisor.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {supervisor.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {supervisor.department}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {supervisor.university}
                </Typography>
                
              </Box>
            </CardContent>
          </Card>
        </Paper>

        {/* Team Section */}
        <Paper elevation={3} sx={styles.section}>
          <Typography variant="h4" gutterBottom sx={styles.sectionTitle}>
            <GroupIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
            Meet Our Team
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, textAlign: 'center', color: 'text.secondary' }}>
            A dedicated team of Computer Engineering students from the University of Peradeniya
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {teamMembers.map((member, index) => (
              <Grid item key={index} xs={12} sm={6} md={3}>
                <Card sx={styles.teamCard}>
                  <CardContent sx={styles.teamCardContent}>
                    <Avatar 
                      alt={member.name} 
                      src={member.image} 
                      sx={styles.teamAvatar} 
                    />
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      {member.name}
                    </Typography>
                    
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Features Section */}
        <Paper elevation={3} sx={styles.section}>
          <Typography variant="h4" gutterBottom sx={styles.sectionTitle}>
            Key Features
          </Typography>
          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card sx={styles.featureCard}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <Box sx={styles.featureBullet} />
                      <Typography variant="body1" sx={{ ml: 2 }}>
                        {feature}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Mission Section */}
        <Paper elevation={3} sx={styles.section}>
          <Typography variant="h4" gutterBottom sx={styles.sectionTitle}>
            Our Mission
          </Typography>
          <List sx={{ p: 0 }}>
            {missionStatements.map((statement, index) => (
              <Box key={index}>
                <ListItem sx={styles.missionItem}>
                  <Box sx={styles.missionNumber}>
                    {index + 1}
                  </Box>
                  <ListItemText 
                    primary={statement}
                    primaryTypographyProps={{ 
                      variant: 'body1',
                      sx: { lineHeight: 1.6 }
                    }}
                  />
                </ListItem>
                {index < missionStatements.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        </Paper>
      </Container>

      {/* Footer */}
      <Box sx={styles.footer}>
        <Container maxWidth="lg">
          <Typography variant="body2" align="center">
            &copy; 2025 RehabGait - All rights reserved.
          </Typography>
        </Container>
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
  hero: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    py: 10,
    textAlign: 'center',
  },
  heroTitle: {
    fontWeight: 700,
    mb: 2,
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
  },
  heroSubtitle: {
    opacity: 0.9,
    fontWeight: 300,
    mb: 4,
  },
  projectButton: {
    backgroundColor: '#ffffff',
    color: '#667eea',
    '&:hover': {
      backgroundColor: '#f8fafc',
      transform: 'translateY(-2px)',
    },
    px: 4,
    py: 1.5,
    borderRadius: 3,
    fontWeight: 600,
    transition: 'all 0.3s ease',
  },
  section: {
    p: 4,
    mb: 4,
    borderRadius: 2,
    background: '#ffffff',
  },
  sectionTitle: {
    fontWeight: 600,
    color: '#1a202c',
    display: 'flex',
    alignItems: 'center',
    mb: 3,
  },
  bodyText: {
    lineHeight: 1.7,
    color: '#4a5568',
    fontSize: '1.1rem',
  },
  supervisorCard: {
    borderRadius: 3,
    border: '1px solid #e2e8f0',
    '&:hover': {
      boxShadow: 6,
    },
    transition: 'box-shadow 0.3s ease',
  },
  supervisorContent: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    p: 4,
    flexDirection: { xs: 'column', sm: 'row' },
    textAlign: { xs: 'center', sm: 'left' },
  },
  supervisorAvatar: {
    width: 140,
    height: 140,
    border: '4px solid #667eea',
    boxShadow: 3,
  },
  supervisorInfo: {
    flex: 1,
  },
  teamCard: {
    height: '100%',
    borderRadius: 3,
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: 6,
    },
  },
  teamCardContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    p: 3,
  },
  teamAvatar: {
    width: 100,
    height: 100,
    mb: 2,
    border: '3px solid #667eea',
    boxShadow: 2,
  },
  featureCard: {
    height: '100%',
    borderRadius: 2,
    border: '1px solid #e2e8f0',
    '&:hover': {
      boxShadow: 4,
    },
    transition: 'box-shadow 0.3s ease',
  },
  featureBullet: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: '#667eea',
    mt: 1,
    flexShrink: 0,
  },
  missionItem: {
    py: 2,
    alignItems: 'flex-start',
  },
  missionNumber: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    backgroundColor: '#667eea',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    mr: 3,
    flexShrink: 0,
  },
  footer: {
    backgroundColor: '#2d3748',
    color: 'white',
    py: 3,
  },
};

export default AboutUs