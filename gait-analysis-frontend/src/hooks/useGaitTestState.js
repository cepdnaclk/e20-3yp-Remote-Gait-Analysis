// File: hooks/useGaitTestState.js
import { useState, useEffect } from 'react';

const useGaitTestState = ({ deviceAliveWS, calibrationStatusWS, orientationCapturedWS }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [deviceStatus, setDeviceStatus] = useState({
    deviceAlive: false,
    deviceCalibrated: false,
    orientationCaptured: false
  });

  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrationProgress, setCalibrationProgress] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  useEffect(() => {
    setDeviceStatus(prev => ({ ...prev, deviceAlive: deviceAliveWS }));
  }, [deviceAliveWS]);

  useEffect(() => {
    if (calibrationStatusWS) {
      const { status, sys, gyro, accel, mag } = calibrationStatusWS;
      const average = (sys + gyro + accel + mag) / 4;

      setIsCalibrating(!status);
      setCalibrationProgress(Math.round((average / 3) * 100)); // assuming each component max is 3

      if (status) {
        setDeviceStatus(prev => ({ ...prev, deviceCalibrated: true }));
      }
    }
  }, [calibrationStatusWS]);

  useEffect(() => {
    setDeviceStatus(prev => {
      const updated = { ...prev, orientationCaptured: orientationCapturedWS };
      if (orientationCapturedWS) {
        setActiveStep(2);
      }
      return updated;
    });
  }, [orientationCapturedWS]);

  const startCalibration = () => {
    setIsCalibrating(true);
    setCalibrationProgress(0);
  };

  const captureOrientation = () => {
    // Intentionally left empty – now handled by WebSocket listener
  };

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  return {
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
    setRecordingTime
  };
};

export default useGaitTestState;
