/* File: components/StepWearDevice.jsx */
import React from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Paper, Button, CircularProgress
} from '@mui/material';
import { ArrowBack, Videocam, Wifi, CheckCircle } from '@mui/icons-material';
import DeviceStatusCard from './DeviceStatusCard';
import VideoCard from './VideoCard';
import sendCommand from '../utils/sendCommand';

const StepWearDevice = ({ orientationCaptured, setActiveStep, deviceStatus , captureOrientation }) => (
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
          background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
          borderRadius: 3,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 30px rgba(34, 197, 94, 0.3)'
        }}>
          <Videocam sx={{ color: 'white', fontSize: 32 }} />
        </Box>
        <Box>
          <Typography variant="h4" fontWeight="700" sx={{ mb: 1 }}>
            Step 2: Wear Your Device
          </Typography>
          <Typography variant="h6" color="text.secondary" fontWeight="400">
            Position the device correctly and get ready for the test
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
              <DeviceStatusCard status={orientationCaptured} label="Orientation Captured" icon={CheckCircle} />
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
              Setup Instructions
            </Typography>
            {["Wear your device and get comfortable", "When you are relaxed and ready click \"I'm Ready\"", "We will prepare your session for the gait analysis"].map((text, idx) => (
              <Typography key={idx} variant="body1" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Box component="span" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'info.main', mr: 2 }} />
                {text}
              </Typography>
            ))}
          </Paper>

          <Box display="flex" gap={3} flexWrap="wrap" mt={5} alignItems="flex-end">
            <Button
              variant="outlined"
              size="large"
              onClick={() => setActiveStep(0)}
              startIcon={<ArrowBack />}
              sx={{
                minWidth: 150, py: 2, px: 4, borderRadius: 3,
                borderWidth: 2, fontSize: '1.1rem', fontWeight: 600,
                '&:hover': { borderWidth: 2, transform: 'translateY(-2px)' }
              }}
            >
              Back
            </Button>
            {/* <Button
              variant="contained"
              size="large"
              onClick={async () => {
                await sendCommand('capture_orientation');
              }}
              disabled={orientationCaptured}
              sx={{
                minWidth: 200, py: 2, px: 4, borderRadius: 3,
                background: orientationCaptured
                  ? 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)'
                  : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                boxShadow: orientationCaptured
                  ? '0 8px 30px rgba(148, 163, 184, 0.3)'
                  : '0 8px 30px rgba(34, 197, 94, 0.3)',
                fontSize: '1.1rem', fontWeight: 600,
                '&:hover': {
                  background: orientationCaptured
                    ? 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)'
                    : 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                  transform: orientationCaptured ? 'none' : 'translateY(-2px)'
                }
              }}
            >
              {orientationCaptured ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
                  Processing...
                </>
              ) : (
                "I'm Ready"
              )}
            </Button> */}

              <Button
                  variant="contained"
                  size="large"
                  onClick={captureOrientation} // ✅ uses prop
                  disabled={orientationCaptured}
                  sx={{
                    minWidth: 200, py: 2, px: 4, borderRadius: 3,
                    background: orientationCaptured
                      ? 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)'
                      : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                    boxShadow: orientationCaptured
                      ? '0 8px 30px rgba(148, 163, 184, 0.3)'
                      : '0 8px 30px rgba(34, 197, 94, 0.3)',
                    fontSize: '1.1rem', fontWeight: 600,
                    '&:hover': {
                      background: orientationCaptured
                        ? 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)'
                        : 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                      transform: orientationCaptured ? 'none' : 'translateY(-2px)'
                    }
                  }}
                >
                  {orientationCaptured ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
                      Processing...
                    </>
                  ) : (
                    "I'm Ready"
                  )}
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} lg={4}>
          <VideoCard title="Device Placement Guide" subtitle="Learn proper positioning" aspectRatio="4/5" />
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

export default StepWearDevice;
