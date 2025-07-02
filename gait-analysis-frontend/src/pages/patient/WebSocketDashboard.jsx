import React, { useEffect } from 'react';
//import { connectWebSocket, disconnectWebSocket } from './websocketService';
//import { connectWebSocket, disconnectWebSocket } from '../../services/websocketService';
import { connectWebSocket, disconnectWebSocket } from '@services/websocketService.js';


const WebSocketDashboard = () => {
  const authToken = localStorage.getItem('token');

  useEffect(() => {
    if (authToken) {
      connectWebSocket(authToken, {
        onDeviceAlive: (data) => console.log('📶 Device Alive:', data),
        onCalibration: (data) => console.log('🎯 Calibration:', data),
        onOrientation: (data) => console.log('🧭 Orientation:', data),
        onSensorData: (data) => console.log('📊 Sensor Data:', data),
      });
    } else {
      console.warn('⚠️ No auth token found in localStorage!');
    }

    return () => disconnectWebSocket();
  }, [authToken]);

  return <div>Listening for real-time updates...</div>;
};

export default WebSocketDashboard;
