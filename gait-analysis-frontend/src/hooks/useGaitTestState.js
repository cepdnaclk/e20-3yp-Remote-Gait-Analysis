/* File: hooks/useGaitTestState.js */
import { useState, useEffect } from 'react';

const useGaitTestState = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [deviceStatus, setDeviceStatus] = useState({
    deviceAlive: true,
    deviceCalibrated: false,
  });
  const [orientationCaptured, setOrientationCaptured] = useState(false);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrationProgress, setCalibrationProgress] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const startCalibration = () => {
    setIsCalibrating(true);
    setCalibrationProgress(0);

    const interval = setInterval(() => {
      setCalibrationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCalibrating(false);
          setDeviceStatus(prev => ({ ...prev, deviceCalibrated: true }));
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const captureOrientation = () => {
    setOrientationCaptured(true);
    setTimeout(() => {
      setActiveStep(2);
    }, 1500);
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
    orientationCaptured,
    captureOrientation,
    isRecording,
    setIsRecording,
    recordingTime,
    setRecordingTime
  };
};

export default useGaitTestState;
