// File: hooks/useWebSocketStatus.js
import { useEffect, useState, useRef } from 'react';
import SockJS from 'sockjs-client';
import { CompatClient, Stomp } from '@stomp/stompjs';

const WEBSOCKET_URL = '/ws';

const useWebSocketStatus = () => {
  const [deviceAlive, setDeviceAlive] = useState(false);
  const [calibrationStatus, setCalibrationStatus] = useState(null); // { sys, gyro, accel, mag, status }
  const [orientationCaptured, setOrientationCaptured] = useState(false);
  const [sensorData, setSensorData] = useState(null); // full sensor payload

  const clientRef = useRef(null);

  useEffect(() => {
    const socket = new SockJS(WEBSOCKET_URL);
    const stompClient = Stomp.over(socket);
    clientRef.current = stompClient;

    stompClient.connect({}, () => {
      console.log('✅ WebSocket connected');

      stompClient.subscribe('/user/topic/status/alive', (msg) => {
        const body = JSON.parse(msg.body);
        console.log('📡 Device Alive:', body);
        setDeviceAlive(true);
      });

      stompClient.subscribe('/user/topic/status/calibration', (msg) => {
        const body = JSON.parse(msg.body);
        console.log('📡 Calibration Status:', body);
        setCalibrationStatus(body);
      });

      stompClient.subscribe('/user/topic/status/orientation', (msg) => {
        const body = JSON.parse(msg.body);
        console.log('📡 Orientation Captured:', body);
        setOrientationCaptured(true);
      });

      stompClient.subscribe('/user/topic/data/sensor', (msg) => {
        const body = JSON.parse(msg.body);
        console.log('📡 Sensor Data:', body);
        setSensorData(body);
      });
    }, (err) => {
      console.error('❌ WebSocket error:', err);
    });

    return () => {
      if (clientRef.current && clientRef.current.connected) {
        clientRef.current.disconnect(() => {
          console.log('🔌 WebSocket disconnected');
        });
      }
    };
  }, []);

  return {
    deviceAlive,
    calibrationStatus,
    orientationCaptured,
    sensorData
  };
};

export default useWebSocketStatus;
