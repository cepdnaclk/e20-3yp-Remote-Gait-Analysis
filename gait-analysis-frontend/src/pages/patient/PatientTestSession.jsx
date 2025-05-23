/* File: pages/patient/PatientTestSession.jsx */
import React from 'react';
import { Box, Container, Card, CardContent, Typography } from '@mui/material';
import useGaitTestState from '../../hooks/useGaitTestState';
import StepperHeader from '../../components/StepperHeader';
import StepCalibration from '../../components/StepCalibration';
import StepWearDevice from '../../components/StepWearDevice';
import StepStartTest from '../../components/StepStartTest';
import formatTime from '../../utils/formatTime';

const steps = ['Calibrate Device', 'Wear Device', 'Start Test'];

const PatientTestSession = () => {
  const gaitState = useGaitTestState();

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', py: 4 }}>
      <Container maxWidth="xl">
        <Card elevation={0} sx={{
          mb: 4,
          borderRadius: 4,
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <CardContent sx={{ p: 4 }}>
            <Box textAlign="center" mb={4}>
              <Typography variant="h3" fontWeight="700" sx={{
                mb: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Gait Analysis Test Session
              </Typography>
              <Typography variant="h6" color="text.secondary" fontWeight="400">
                Follow the steps below to conduct your gait analysis test
              </Typography>
            </Box>
            <StepperHeader steps={steps} activeStep={gaitState.activeStep} />
          </CardContent>
        </Card>

        {gaitState.activeStep === 0 && (
          <StepCalibration
            deviceStatus={gaitState.deviceStatus}
            isCalibrating={gaitState.isCalibrating}
            calibrationProgress={gaitState.calibrationProgress}
            startCalibration={gaitState.startCalibration}
            setActiveStep={gaitState.setActiveStep}
          />
        )}

        {gaitState.activeStep === 1 && (
          <StepWearDevice
            orientationCaptured={gaitState.orientationCaptured}
            setActiveStep={gaitState.setActiveStep}
            captureOrientation={gaitState.captureOrientation}
          />
        )}

        {gaitState.activeStep === 2 && (
          <StepStartTest
            isRecording={gaitState.isRecording}
            recordingTime={gaitState.recordingTime}
            formatTime={formatTime}
            setIsRecording={gaitState.setIsRecording}
            setRecordingTime={gaitState.setRecordingTime}
            setActiveStep={gaitState.setActiveStep}
          />
        )}
      </Container>
    </Box>
  );
};

export default PatientTestSession;
