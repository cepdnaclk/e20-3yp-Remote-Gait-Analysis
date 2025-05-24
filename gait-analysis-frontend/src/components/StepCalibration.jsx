/* File: components/StepCalibration.jsx */
import React from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Paper, Button, CircularProgress, Chip, LinearProgress
} from '@mui/material';
import { Replay, ArrowForward, Wifi, CheckCircle, SignalCellularAlt } from '@mui/icons-material';
import DeviceStatusCard from './DeviceStatusCard';
import VideoCard from './VideoCard';

const StepCalibration = ({
  deviceStatus,
  isCalibrating,
  calibrationProgress,
  startCalibration,
  setActiveStep,
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
          width: 64, height: 64, background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 30px rgba(59, 130, 246, 0.3)'
        }}>
          <Replay sx={{ color: 'white', fontSize: 32 }} />
        </Box>
        <Box>
          <Typography variant="h4" fontWeight="700" sx={{ mb: 1 }}>
            Step 1: Calibrate Your Device
          </Typography>
          <Typography variant="h6" color="text.secondary" fontWeight="400">
            Ensure your device is properly calibrated before starting the test
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} sx={{ mb: 2 }}>
          <Typography variant="h5" fontWeight="600" sx={{ mb: 3 }}>
            Device Status
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <DeviceStatusCard status={deviceStatus.deviceAlive} label="Device Alive" icon={Wifi} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <DeviceStatusCard status={deviceStatus.deviceCalibrated} label="Device Calibrated" icon={CheckCircle} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <DeviceStatusCard status={deviceStatus.orientationCaptured} label="Orientation Captured" icon={CheckCircle} />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} lg={8}>
          <Paper elevation={0} sx={{
            p: 4, borderRadius: 4,
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            border: '1px solid #bae6fd'
          }}>
            <Typography variant="h5" fontWeight="600" color="primary" sx={{ mb: 3 }}>
              Calibration Instructions
            </Typography>
            {["Position your device firmly for few seconds", "Tilt your device 45° and hold for a few seconds, repeat for 90°", "Follow the video instructions for proper calibration"].map((text, idx) => (
              <Typography key={idx} variant="body1" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Box component="span" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main', mr: 2 }} />
                {text}
              </Typography>
            ))}
          </Paper>

        
          <Box width="100%" mt={5}  /*linear progress bar*/ >
            <Paper elevation={0} sx={{
              p: 2.5, borderRadius: 3,
              background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
              border: '1px solid #bbf7d0'
            }}>
              <Box display="flex" justifyContent="space-between" mb={1.5}>
                <Typography variant="body1" fontWeight="600">Calibration Progress</Typography>
                <Typography variant="body1" fontWeight="600" color="success.main">{calibrationProgress}%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={calibrationProgress} sx={{
                height: 8, borderRadius: 4, bgcolor: 'rgba(34, 197, 94, 0.1)',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  borderRadius: 4
                }
              }} />
            </Paper>
          </Box>

          <Box display="flex" gap={3} flexWrap="wrap" mt={5} alignItems="flex-end">
            <Button
              variant="contained"
              size="large"
              onClick={startCalibration}
              disabled={isCalibrating}
              startIcon={isCalibrating ? <CircularProgress size={20} color="inherit" /> : <Replay />}
              sx={{
                minWidth: 220, py: 2, px: 4, borderRadius: 3,
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                boxShadow: '0 8px 30px rgba(59, 130, 246, 0.3)',
                fontSize: '1.1rem', fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(59, 130, 246, 0.4)'
                }
              }}
            >
              {isCalibrating ? 'Calibrating...' : 'Start Calibration'}
            </Button>
            {deviceStatus.deviceCalibrated && (
              <Button
                variant="contained"
                color="success"
                size="large"
                onClick={() => setActiveStep(1)}
                endIcon={<ArrowForward />}
                sx={{
                  minWidth: 180, py: 2, px: 4, borderRadius: 3,
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  boxShadow: '0 8px 30px rgba(34, 197, 94, 0.3)',
                  fontSize: '1.1rem', fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 40px rgba(34, 197, 94, 0.4)'
                  }
                }}
              >
                Next Step
              </Button>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} lg={4}>
          <VideoCard title="Calibration Tutorial" subtitle="Watch the step-by-step guide" aspectRatio="4/5" />
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

export default StepCalibration;

