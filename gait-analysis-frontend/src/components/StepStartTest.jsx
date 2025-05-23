/* File: components/StepStartTest.jsx */
import React from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Paper, Chip, Button, Alert
} from '@mui/material';
import {
  PlayArrow, Stop, ArrowBack, Wifi, Battery90, SignalCellularAlt, FiberManualRecord
} from '@mui/icons-material';

const StepStartTest = ({
  isRecording,
  recordingTime,
  formatTime,
  setIsRecording,
  setRecordingTime,
  setActiveStep
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
          width: 64, height: 64, background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
          borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center',
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

      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <Paper elevation={0} sx={{
            aspectRatio: '16/9', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, mb: 3,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)', color: 'white'
          }}>
            <Box textAlign="center" p={4}>
              <Box sx={{
                width: 100, height: 100, borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3,
                boxShadow: '0 8px 30px rgba(59, 130, 246, 0.5)'
              }}>
                <SignalCellularAlt sx={{ fontSize: 48 }} />
              </Box>
              <Typography variant="h4" fontWeight="700" gutterBottom>
                Real Time Gait Analysis
              </Typography>
              {isRecording ? (
                <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
                  <FiberManualRecord sx={{ color: '#ef4444', fontSize: 16, animation: 'pulse 1s infinite' }} />
                  <Typography variant="h5" fontWeight="600">
                    Recording: {formatTime(recordingTime)}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="h6" color="grey.400">
                  Press start to begin recording
                </Typography>
              )}
            </Box>
          </Paper>

          <Alert severity="warning" sx={{
            borderRadius: 3, border: '1px solid #fbbf24',
            background: 'linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)',
            '& .MuiAlert-icon': { fontSize: '2rem' }
          }}>
            <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
              Test Instructions
            </Typography>
            {["When you start walking press \"Let's Go\" Button", "To finish the Session press \"Stop Recording\""].map((text, idx) => (
              <Typography key={idx} variant="body1" sx={{ mb: idx === 0 ? 1 : 0, display: 'flex', alignItems: 'center' }}>
                <Box component="span" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'warning.main', mr: 2 }} />
                {text}
              </Typography>
            ))}
          </Alert>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper elevation={0} sx={{
            p: 3, mb: 3, borderRadius: 3,
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            border: '1px solid #bae6fd'
          }}>
            <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
              Device Status
            </Typography>
            {[
              { label: 'Connection', icon: <Wifi />, value: 'Connected' },
              { label: 'Battery', icon: <Battery90 />, value: '90%' },
              { label: 'Signal', icon: <SignalCellularAlt />, value: 'Strong' }
            ].map(({ label, icon, value }, idx) => (
              <Box key={idx} display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="body1" fontWeight="500">{label}</Typography>
                <Chip icon={icon} label={value} color="success" size="small" sx={{ borderRadius: 2, fontWeight: 600 }} />
              </Box>
            ))}
          </Paper>

          <Box display="flex" flexDirection="column" gap={3}>
            <Button
              variant="contained"
              color={isRecording ? 'error' : 'success'}
              size="large"
              fullWidth
              onClick={() => {
                setIsRecording(!isRecording);
                if (!isRecording) setRecordingTime(0);
              }}
              startIcon={isRecording ? <Stop /> : <PlayArrow />}
              sx={{
                py: 3, borderRadius: 3,
                background: isRecording
                  ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                  : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                boxShadow: isRecording
                  ? '0 8px 30px rgba(239, 68, 68, 0.3)'
                  : '0 8px 30px rgba(34, 197, 94, 0.3)',
                fontSize: '1.2rem', fontWeight: 700,
                '&:hover': {
                  background: isRecording
                    ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
                    : 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: isRecording
                    ? '0 12px 40px rgba(239, 68, 68, 0.4)'
                    : '0 12px 40px rgba(34, 197, 94, 0.4)'
                }
              }}
            >
              {isRecording ? 'Stop Recording' : "Let's Go"}
            </Button>

            <Button
              variant="outlined"
              size="large"
              fullWidth
              onClick={() => setActiveStep(1)}
              startIcon={<ArrowBack />}
              sx={{
                py: 2, borderRadius: 3,
                borderWidth: 2, fontSize: '1.1rem', fontWeight: 600,
                '&:hover': { borderWidth: 2, transform: 'translateY(-2px)' }
              }}
            >
              Back to Setup
            </Button>
          </Box>

          {isRecording && (
            <Paper elevation={0} sx={{
              p: 3, mt: 3, borderRadius: 3,
              background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
              border: '1px solid #fca5a5'
            }}>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <FiberManualRecord sx={{ color: '#ef4444', fontSize: 16, animation: 'pulse 1s infinite' }} />
                <Typography variant="h6" fontWeight="600" color="error.dark">
                  Recording Active
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight="700" color="error.dark" sx={{ mb: 1 }}>
                {formatTime(recordingTime)}
              </Typography>
              <Typography variant="body2" color="error.dark" fontWeight="500">
                Session Duration
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

export default StepStartTest;
