/* File: components/VideoCard.jsx */
import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { PlayCircleOutline } from '@mui/icons-material';

const VideoCard = ({ title, subtitle, aspectRatio = '4/5', dark = false }) => (
  <Paper 
    elevation={0}
    sx={{ 
      aspectRatio,
      background: dark 
        ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
        : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 4,
      cursor: 'pointer',
      border: '1px solid',
      borderColor: dark ? 'grey.800' : 'grey.200',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'scale(1.02)',
        boxShadow: dark 
          ? '0 20px 40px rgba(0, 0, 0, 0.3)'
          : '0 20px 40px rgba(0, 0, 0, 0.1)'
      }
    }}
  >
    <Box textAlign="center" p={3}>
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 3,
          boxShadow: '0 8px 30px rgba(59, 130, 246, 0.3)'
        }}
      >
        <PlayCircleOutline sx={{ fontSize: 40, color: 'white' }} />
      </Box>
      <Typography variant="h6" fontWeight="600" color={dark ? 'white' : 'text.primary'} sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" color={dark ? 'grey.400' : 'text.secondary'}>
        {subtitle}
      </Typography>
    </Box>
  </Paper>
);

export default VideoCard;
