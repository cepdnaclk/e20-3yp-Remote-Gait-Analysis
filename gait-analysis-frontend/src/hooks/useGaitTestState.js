// File: hooks/useGaitTestState.js
import { useState, useEffect } from 'react';

const useGaitTestState = ({ deviceAliveWS, calibrationStatusWS, orientationCapturedWS , calibrationRequested }) => {
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


// useEffect(() => {
//   if (calibrationStatusWS) {
//     const { status, sys, gyro, accel, mag } = calibrationStatusWS;

//     if (calibrationRequested) {
//       let progress = 0;
//       if (gyro === 3) progress += 25;
//       if (mag === 3) progress += 25;
//       if (sys > 0) progress += 25;
//       if (accel > 0) progress += 25;

//       setCalibrationProgress(progress);
//       setIsCalibrating(!status);

//       if (status) {
//         setDeviceStatus(prev => ({ ...prev, deviceCalibrated: true }));
//       }
//     }
//   }
// }, [calibrationStatusWS, calibrationRequested]);

useEffect(() => {
  if (calibrationStatusWS) {
    const { status, sys, gyro, accel, mag } = calibrationStatusWS;

    // 🔁 Determine progress based on backend rules
    let progress = 0;
    if (gyro >0) progress += 25;
    if (mag >0) progress += 25;
    if (sys >0) progress += 25;
    if (accel >0) progress += 25;

    // ✅ Always show progress, even if calibration hasn't been started
    setCalibrationProgress(progress);

    // ✅ Case: device is already calibrated even before user action
    if (status && !calibrationRequested) {
      setDeviceStatus(prev => ({ ...prev, deviceCalibrated: true }));
      setIsCalibrating(false); // ensure button stays enabled
      return;
    }

    // ✅ Case: calibration in progress (only if user clicked start)
    if (calibrationRequested) {
      setIsCalibrating(!status);
      if (status) {
        setDeviceStatus(prev => ({ ...prev, deviceCalibrated: true }));
      }
    }
  }
}, [calibrationStatusWS, calibrationRequested]);




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
