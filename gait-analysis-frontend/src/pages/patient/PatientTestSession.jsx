// File: PatientTestSession.jsx
import React, { useEffect, useState } from 'react';
import { Box, Container } from '@mui/material';
import StepperHeader from '../../components/StepperHeader';
import StepCalibration from '../../components/StepCalibration';
import StepWearDevice from '../../components/StepWearDevice';
import StepStartTest from '../../components/StepStartTest';
import useGaitTestState from '../../hooks/useGaitTestState';
import useWebSocketStatus from '../../hooks/useWebSocketStatus';
import sendCommand from '../../utils/sendCommand';
import formatTime from '../../utils/formatTime';

const PatientTestSession = () => {
  const wsStatus = useWebSocketStatus();
  const [sessionId, setSessionId] = useState(null);

  const {
    activeStep,
    setActiveStep,
    deviceStatus,
    isCalibrating,
    calibrationProgress,
    startCalibration,
    captureOrientation,
    isRecording,
    setIsRecording,
    recordingTime,
    setRecordingTime,
    setDeviceStatus,
    setCalibrationProgress,
    setOrientationCaptured
  } = useGaitTestState({
    deviceAliveWS: wsStatus.deviceAlive,
    calibrationStatusWS: wsStatus.calibrationStatus,
    orientationCapturedWS: wsStatus.orientationCaptured
  });

  // Automatically trigger calibration check if device is alive
  useEffect(() => {
    if (wsStatus.deviceAlive) {
      sendCommand('check_calibration');
    }
  }, [wsStatus.deviceAlive]);

  // Move to step 2 once calibration is completed
  useEffect(() => {
    if (deviceStatus.deviceCalibrated && activeStep === 0) {
      setTimeout(() => {
        setActiveStep(1);
      }, 1000);
    }
  }, [deviceStatus.deviceCalibrated]);

  // Move to step 3 once orientation is captured
  useEffect(() => {
    if (wsStatus.orientationCaptured && activeStep === 1) {
      setTimeout(() => {
        setActiveStep(2);
      }, 1000);
    }
  }, [wsStatus.orientationCaptured]);

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', py: 4 }}>
      <Container maxWidth="xl">
        <StepperHeader activeStep={activeStep} />

        {activeStep === 0 && (
          <StepCalibration
            deviceStatus={deviceStatus}
            isCalibrating={isCalibrating}
            calibrationProgress={calibrationProgress}
            startCalibration={startCalibration}
            setActiveStep={setActiveStep}
            orientationCaptured={wsStatus.orientationCaptured}
          />
        )}

        {activeStep === 1 && (
          <StepWearDevice
            deviceStatus={deviceStatus}
            setActiveStep={setActiveStep}
            captureOrientation={() => {
              sendCommand('capture_orientation');
            }}
            orientationCaptured={wsStatus.orientationCaptured}
          />
        )}

        {activeStep === 2 && (
          <StepStartTest
            deviceStatus={deviceStatus}
            isRecording={isRecording}
            setIsRecording={setIsRecording}
            recordingTime={recordingTime}
            setRecordingTime={setRecordingTime}
            formatTime={formatTime}
            setActiveStep={setActiveStep}
            orientationCaptured={wsStatus.orientationCaptured}
            sessionId={sessionId}
            setSessionId={setSessionId}
          />
        )}
      </Container>
    </Box>
  );
};

export default PatientTestSession;
