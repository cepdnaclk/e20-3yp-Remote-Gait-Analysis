/* File: components/StepStartTest.jsx */
import React from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Paper, Button, CircularProgress
} from '@mui/material';
import {
  PlayArrow, Stop, ArrowBack, Wifi, Battery90, SignalCellularAlt, FiberManualRecord, CheckCircle
} from '@mui/icons-material';
import DeviceStatusCard from './DeviceStatusCard';
import VideoCard from './VideoCard';

const StepStartTest = ({
  isRecording,
  recordingTime,
  formatTime,
  setIsRecording,
  setRecordingTime,
  setActiveStep,
  deviceStatus,
  orientationCaptured
}) => (
  <Card elevation={0} sx={{
    borderRadius: 4,
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  }}>
    <CardContent sx={{ p: 4 }}>
      <Box display="flex" alignItems="center" gap={3} mb={4}>
        <Box sx={{
          width: 64, height: 64,
          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
          borderRadius: 3,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 30px rgba(139, 92, 246, 0.3)'
        }}>
          <PlayArrow sx={{ color: 'white', fontSize: 32 }} />
        </Box>
        <Box>
          <Typography variant="h4" fontWeight="700" sx={{ mb: 1 }}>
            Step 3: Let's Start Walking
          </Typography>
          <Typography variant="h6" color="text.secondary" fontWeight="400">
            Begin your gait analysis test
          </Typography>
        </Box>
      </Box>

      <Typography variant="h5" fontWeight="600" sx={{ mb: 3 }}>
        Device Status
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <DeviceStatusCard status={deviceStatus.deviceAlive} label="Device Alive" icon={Wifi} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <DeviceStatusCard status={deviceStatus.deviceCalibrated} label="Device Calibrated" icon={CheckCircle} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <DeviceStatusCard status={orientationCaptured} label="Orientation Captured" icon={CheckCircle} />
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6} mt={4}>
          <Paper elevation={0} sx={{
            p: 4, borderRadius: 4, mb: 4,
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            border: '1px solid #bae6fd'
          }}>
            <Typography variant="h5" fontWeight="600" color="primary" sx={{ mb: 3 }}>
              Test Instructions
            </Typography>
            {["When you start walking press \"Let's Go\" Button", "To finish the Session press \"Stop Recording\""]
              .map((text, idx) => (
                <Typography key={idx} variant="body1" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <Box component="span" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'warning.main', mr: 2 }} />
                  {text}
                </Typography>
              ))}
          </Paper>

          <Box display="flex" gap={3} flexWrap="wrap" mb={4}>
            <Button
              variant="contained"
              color={isRecording ? 'error' : 'success'}
              size="large"
              onClick={() => {
                setIsRecording(!isRecording);
                if (!isRecording) setRecordingTime(0);
              }}
              startIcon={isRecording ? <Stop /> : <PlayArrow />}
              sx={{
                px: 4, py: 2, borderRadius: 3,
                background: isRecording
                  ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                  : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                boxShadow: isRecording
                  ? '0 8px 25px rgba(239, 68, 68, 0.4)'
                  : '0 8px 25px rgba(34, 197, 94, 0.4)',
                fontSize: '1.1rem', fontWeight: 700,
                '&:hover': {
                  background: isRecording
                    ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
                    : 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              {isRecording ? 'Stop Recording' : "Let's Go"}
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={() => setActiveStep(1)}
              startIcon={<ArrowBack />}
              sx={{
                px: 4, py: 2, borderRadius: 3,
                borderWidth: 2, fontSize: '1.1rem', fontWeight: 600,
                '&:hover': { borderWidth: 2, transform: 'translateY(-2px)' }
              }}
            >
              Back to Setup
            </Button>
          </Box>

          {isRecording && (
            <Paper elevation={0} sx={{
              p: 3, mt: 4, borderRadius: 4,
              background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
              border: '1px solid #fca5a5'
            }}>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <FiberManualRecord sx={{ color: '#ef4444', fontSize: 16, animation: 'pulse 1s infinite' }} />
                <Typography variant="h6" fontWeight="600" color="error.dark">
                  Recording Active
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="700" color="error.dark" sx={{ mb: 1 }}>
                {formatTime(recordingTime)}
              </Typography>
              <Typography variant="body2" color="error.dark" fontWeight="500">
                Session Duration
              </Typography>
            </Paper>
          )}
        </Grid>

        <Grid item xs={12} md={6} mt={4}>
          <VideoCard title="Live Monitor" subtitle="Gait analysis view" aspectRatio="6/5" />
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

export default StepStartTest;