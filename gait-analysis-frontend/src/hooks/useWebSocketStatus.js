// // File: hooks/useWebSocketStatus.js
// import { useEffect, useState, useRef } from 'react';
// import SockJS from 'sockjs-client';
// import Stomp from 'stompjs';

// const WEBSOCKET_URL = 'http://localhost:8080/ws'; // Update this to your actual backend URL

// const useWebSocketStatus = () => {
//   const [deviceAlive, setDeviceAlive] = useState(false);
//   const [calibrationStatus, setCalibrationStatus] = useState(null);
//   const [orientationCaptured, setOrientationCaptured] = useState(false);
//   const [sensorData, setSensorData] = useState(null);
//   const [connectionStatus, setConnectionStatus] = useState('disconnected'); // 'connecting', 'connected', 'disconnected', 'error'

//   const clientRef = useRef(null);

//   useEffect(() => {
//     let isComponentMounted = true;

//     const connectWebSocket = () => {
//       if (!isComponentMounted) return;

//       setConnectionStatus('connecting');
      
//       const socket = new SockJS(WEBSOCKET_URL);
//       const stompClient = Stomp.over(socket);
      
//       // Disable debug logging in production
//       stompClient.debug = process.env.NODE_ENV === 'development' ? console.log : null;
      
//       clientRef.current = stompClient;

//       stompClient.connect(
//         {}, 
//         () => {
//           if (!isComponentMounted) return;
          
//           console.log('✅ WebSocket connected');
//           setConnectionStatus('connected');

//           // Subscribe to various topics
//           stompClient.subscribe('/user/topic/status/alive', (msg) => {
//             if (!isComponentMounted) return;
//             try {
//               const body = JSON.parse(msg.body);
//               console.log('📡 Device Alive:', body);
//               setDeviceAlive(true);
//             } catch (error) {
//               console.error('Error parsing alive message:', error);
//             }
//           });

//           stompClient.subscribe('/user/topic/status/calibration', (msg) => {
//             if (!isComponentMounted) return;
//             try {
//               const body = JSON.parse(msg.body);
//               console.log('📡 Calibration Status:', body);
//               setCalibrationStatus(body);
//             } catch (error) {
//               console.error('Error parsing calibration message:', error);
//             }
//           });

//           stompClient.subscribe('/user/topic/status/orientation', (msg) => {
//             if (!isComponentMounted) return;
//             try {
//               const body = JSON.parse(msg.body);
//               console.log('📡 Orientation Captured:', body);
//               setOrientationCaptured(true);
//             } catch (error) {
//               console.error('Error parsing orientation message:', error);
//             }
//           });

//           stompClient.subscribe('/user/topic/data/sensor', (msg) => {
//             if (!isComponentMounted) return;
//             try {
//               const body = JSON.parse(msg.body);
//               console.log('📡 Sensor Data:', body);
//               setSensorData(body);
//             } catch (error) {
//               console.error('Error parsing sensor data:', error);
//             }
//           });
//         }, 
//         (error) => {
//           if (!isComponentMounted) return;
          
//           console.error('❌ WebSocket error:', error);
//           setConnectionStatus('error');
          
//           // Attempt to reconnect after 3 seconds
//           setTimeout(() => {
//             if (isComponentMounted) {
//               console.log('🔄 Attempting to reconnect...');
//               connectWebSocket();
//             }
//           }, 3000);
//         }
//       );
//     };

//     connectWebSocket();

//     return () => {
//       isComponentMounted = false;
      
//       if (clientRef.current && clientRef.current.connected) {
//         clientRef.current.disconnect(() => {
//           console.log('🔌 WebSocket disconnected');
//         });
//       }
      
//       setConnectionStatus('disconnected');
//     };
//   }, []);

//   // Method to manually send messages
//   const sendMessage = (destination, message) => {
//     if (clientRef.current && clientRef.current.connected) {
//       clientRef.current.send(destination, {}, JSON.stringify(message));
//       return true;
//     }
//     console.warn('WebSocket not connected. Cannot send message.');
//     return false;
//   };

//   return {
//     deviceAlive,
//     calibrationStatus,
//     orientationCaptured,
//     sensorData,
//     connectionStatus,
//     sendMessage,
//     isConnected: connectionStatus === 'connected'
//   };
// };

// export default useWebSocketStatus;



// File: hooks/useWebSocketStatus.js
import { useEffect, useState, useRef } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

// const WEBSOCKET_URL = 'http://localhost:8080/ws';
const WEBSOCKET_URL = `${import.meta.env.VITE_API_BASE_URL}/ws`;

const useWebSocketStatus = (authToken) => {
  const [deviceAlive, setDeviceAlive] = useState(false);
  const [calibrationStatus, setCalibrationStatus] = useState(null);
  const [orientationCaptured, setOrientationCaptured] = useState(false);
  const [sensorData, setSensorData] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  const clientRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const connectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  useEffect(() => {
    let isComponentMounted = true;
    console.log('🔑 Auth Token:', authToken);

    const connectWebSocket = () => {
      if (!isComponentMounted || !authToken) {
        console.log('🚫 Aborting connection: Component unmounted or no auth token');
        return;
      }
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (connectTimeoutRef.current) clearTimeout(connectTimeoutRef.current);

      setConnectionStatus('connecting');
      console.log('🌐 Initiating WebSocket connection...');
      const socket = new SockJS(WEBSOCKET_URL);
      socket.onerror = (error) => console.error('🚨 WebSocket error:', error);
      socket.onclose = () => console.log('🔌 WebSocket closed');
      const stompClient = Stomp.over(socket);
      stompClient.debug = (str) => console.log('STOMP:', str);
      clientRef.current = stompClient;

      const connectHeaders = {
        Authorization: `Bearer ${authToken}`
      };

      connectTimeoutRef.current = setTimeout(() => {
        if (connectionStatus === 'connecting' && isComponentMounted) {
          console.error('⏰ Connection timeout: No CONNECTED frame received. Socket state:', socket.readyState);
          setConnectionStatus('error');
          handleReconnect();
        }
      }, 10000);

      stompClient.connect(
        connectHeaders,
        (frame) => {
          if (!isComponentMounted) return;
          clearTimeout(connectTimeoutRef.current);
          console.log('🔗 WebSocket connected:', frame);
          setConnectionStatus('connected');
          reconnectAttemptsRef.current = 0;

          console.log('📋 Subscribing to topics...');
          stompClient.subscribe('/user/topic/status/alive', (msg) => {
            console.log('📩 Received on /user/topic/status/alive:', msg.body);
            try {
              const body = JSON.parse(msg.body);
              console.log('📡 Device Alive:', body);
              setDeviceAlive(body.status === true);
            } catch (error) {
              console.error('Error parsing device alive message:', error);
            }
          });

          stompClient.subscribe('/user/topic/status/calibration', (msg) => {
            console.log('📩 Received on /user/topic/status/calibration:', msg.body);
            try {
              const body = JSON.parse(msg.body);
              console.log('📡 Calibration Status:', body);
              setCalibrationStatus({
                status: body.status,
                sys: body.sys,
                gyro: body.gyro,
                accel: body.accel,
                mag: body.mag
              });
            } catch (error) {
              console.error('Error parsing calibration message:', error);
            }
          });

          stompClient.subscribe('/user/topic/status/orientation', (msg) => {
            console.log('📩 Received on /user/topic/status/orientation:', msg.body);
            try {
              const body = JSON.parse(msg.body);
              console.log('📡 Orientation Status:', body);
              setOrientationCaptured(body.status === true);
            } catch (error) {
              console.error('Error parsing orientation message:', error);
            }
          });

          stompClient.subscribe('/user/topic/data/sensor', (msg) => {
            console.log('📩 Received on /user/topic/data/sensor:', msg.body);
            try {
              const body = JSON.parse(msg.body);
              console.log('📡 Sensor Data:', body);
              setSensorData(body);
            } catch (error) {
              console.error('Error parsing sensor data:', error);
            }
          });
        },
        (error) => {
          if (!isComponentMounted) return;
          clearTimeout(connectTimeoutRef.current);
          console.error('🚨 Connection error:', error, 'Socket state:', socket.readyState);
          setConnectionStatus('error');
          setDeviceAlive(false);
          setCalibrationStatus(null);
          setOrientationCaptured(false);
          setSensorData(null);

          handleReconnect();
        }
      );
    };

    const handleReconnect = () => {
      if (reconnectAttemptsRef.current < maxReconnectAttempts) {
        const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
        reconnectAttemptsRef.current++;
        console.log(`🔄 Reconnecting in ${delay}ms... Attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts}`);
        reconnectTimeoutRef.current = setTimeout(() => {
          if (isComponentMounted) connectWebSocket();
        }, delay);
      } else {
        setConnectionStatus('failed');
        console.log('❌ Max reconnect attempts reached. Connection failed.');
      }
    };

    if (authToken) {
      connectWebSocket();
    } else {
      setConnectionStatus('disconnected');
      console.log('🚫 No auth token provided. WebSocket not connected.');
    }

    return () => {
      isComponentMounted = false;
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (connectTimeoutRef.current) clearTimeout(connectTimeoutRef.current);
      if (clientRef.current?.connected) {
        clientRef.current.disconnect(() => console.log('🔌 WebSocket disconnected cleanly'));
      }
      setConnectionStatus('disconnected');
    };
  }, [authToken]);

  const sendMessage = (destination, message) => {
    if (clientRef.current?.connected) {
      clientRef.current.send(destination, {}, JSON.stringify(message));
      console.log(`📤 Sent message to ${destination}:`, message);
      return true;
    }
    console.warn('⚠️ Cannot send message: WebSocket not connected');
    return false;
  };

  const reconnect = () => {
    reconnectAttemptsRef.current = 0;
    if (clientRef.current?.connected) {
      clientRef.current.disconnect(() => console.log('🔌 WebSocket disconnected for reconnect'));
    }
    setConnectionStatus('connecting');
    console.log('🔄 Triggering manual reconnect...');
    connectWebSocket();
  };

  const sendHeartbeat = () => sendMessage('/app/heartbeat', { timestamp: Date.now() });

  return {
    deviceAlive,
    calibrationStatus,
    orientationCaptured,
    sensorData,
    connectionStatus,
    sendMessage,
    reconnect,
    sendHeartbeat,
    isConnected: connectionStatus === 'connected',
    isConnecting: connectionStatus === 'connecting',
    hasError: connectionStatus === 'error',
    hasFailed: connectionStatus === 'failed',
    reconnectAttempts: reconnectAttemptsRef.current
  };
};

export default useWebSocketStatus;