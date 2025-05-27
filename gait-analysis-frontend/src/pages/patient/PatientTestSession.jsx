
import React, { useEffect, useState } from 'react';
import { Box, Container, Card, CardContent, Typography } from '@mui/material';
import StepperHeader from '../../components/StepperHeader';
import StepCalibration from '../../components/StepCalibration';
import StepWearDevice from '../../components/StepWearDevice';
import StepStartTest from '../../components/StepStartTest';
import useGaitTestState from '../../hooks/useGaitTestState';
import { connectWebSocket , disconnectWebSocket } from '../../services/websocketService';
import sendCommand from '../../utils/sendCommand';
import formatTime from '../../utils/formatTime';

const PatientTestSession = () => {
  const token = localStorage.getItem("token");

  const [deviceAlive, setDeviceAlive] = useState(false);
  const [calibrationStatus, setCalibrationStatus] = useState(null);
  const [orientationCaptured, setOrientationCaptured] = useState(false);
  const [sensorData, setSensorData] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [calibrationRequested, setCalibrationRequested] = useState(false);


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
  } = useGaitTestState({
    deviceAliveWS: deviceAlive,
    calibrationStatusWS: calibrationStatus,
    orientationCapturedWS: orientationCaptured,
    calibrationRequested 
  });

  const steps = ['Calibration', 'Wear Device', 'Start Test'];

  // ✅ Hook up the working WebSocket
  useEffect(() => {
    if (!token) {
      console.warn('⚠️ No auth token found.');
      return;
    }

    connectWebSocket(token, {
      onDeviceAlive: (data) => setDeviceAlive(data.status === true),

      onCalibration: (data) => {
        setCalibrationStatus(data);

        // ✅ Only update calibration progress if user has started calibration
        if (calibrationRequested) {
          setCalibrationStatus(data);
        } else {
          // Device just sent a calibration snapshot
          if (data.status === true) {
            // Optional: show "Device is calibrated" in UI
          }
        }
      },

      onOrientation: (data) => setOrientationCaptured(data.status === true),
      onSensorData: (data) => setSensorData(data),
    });


    return () => disconnectWebSocket();
  }, [token]);

  useEffect(() => {
    if (deviceAlive) sendCommand('check_calibration');
  }, [deviceAlive]);

  useEffect(() => {
    if (deviceStatus.deviceCalibrated && activeStep === 0) {
      setTimeout(() => setActiveStep(1), 1000);
    }
  }, [deviceStatus.deviceCalibrated]);

  useEffect(() => {
    if (orientationCaptured && activeStep === 1) {
      setTimeout(() => setActiveStep(2), 1000);
    }
  }, [orientationCaptured]);

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', py: 4 }}>
      <Container maxWidth="xl">
        <Card elevation={0} sx={{
          mb: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <CardContent sx={{ p: 3 }}>
            <Box textAlign="center" mb={3}>
              <Typography variant="h4" fontWeight="700" sx={{
                mb: 1,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Gait Analysis Test Session
              </Typography>
              <Typography variant="body1" color="text.secondary" fontWeight="400">
                Follow the steps below to conduct your gait analysis test
              </Typography>
            </Box>
            <StepperHeader steps={steps} activeStep={activeStep} />
          </CardContent>
        </Card>

        {activeStep === 0 && (
          <StepCalibration
            deviceStatus={deviceStatus}
            isCalibrating={isCalibrating}
            calibrationProgress={calibrationProgress}
            startCalibration={startCalibration}
            setActiveStep={setActiveStep}
            orientationCaptured={orientationCaptured}
            calibrationRequested={calibrationRequested}
            setCalibrationRequested={setCalibrationRequested}
          />
        )}

        {activeStep === 1 && (
          <StepWearDevice
            deviceStatus={deviceStatus}
            setActiveStep={setActiveStep}
            orientationCaptured={orientationCaptured}
            captureOrientation={async () => {
                  await sendCommand('capture_orientation');
                  await new Promise((r) => setTimeout(r, 1000)); // wait for capture to complete
                  await sendCommand('start_streaming');
                  await new Promise((r) => setTimeout(r, 700)); // wait before proceeding
                  setActiveStep(2); // go to Start Test
                }}
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
            orientationCaptured={orientationCaptured}
            sessionId={sessionId}
            setSessionId={setSessionId}
          />
        )}
      </Container>
    </Box>
  );
};

export default PatientTestSession;
