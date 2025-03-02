import { useState, useEffect, useRef, useCallback } from "react";

const useWebSocketGraph = (url) => {
  const [fsrData, setFsrData] = useState([]);
  const [imuData, setImuData] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Use refs to avoid unnecessary re-renders
  const fsrDataRef = useRef([]);
  const lastUpdateTimeRef = useRef(0);
  const socketRef = useRef(null);

  // Configuration constants
  const MAX_HISTORY = 30;
  const UPDATE_THRESHOLD_MS = 100; // Throttle to 10Hz

  // Memoized update function to prevent recreation on each render
  const updateData = useCallback((newData) => {
    setFsrData(newData);
    fsrDataRef.current = newData;
  }, []);

  useEffect(() => {
    let reconnectTimeout;

    const connect = () => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.close();
      }

      socketRef.current = new WebSocket(url);

      socketRef.current.onopen = () => console.log("🟢 WebSocket Connected");

      socketRef.current.onmessage = (event) => {
        try {
          const { sensor_data, timestamp } = JSON.parse(event.data);
          if (!sensor_data) return;

          // Throttle updates based on time
          const currentTime = Date.now();
          if (currentTime - lastUpdateTimeRef.current < UPDATE_THRESHOLD_MS) {
            return;
          }
          lastUpdateTimeRef.current = currentTime;

          // Process FSR Data (for graph) - only extract needed properties
          const fsrEntry = {
            time: timestamp,
          };

          // Only process FSR keys (avoid unnecessary object operations)
          for (let i = 1; i <= 16; i++) {
            const key = `FSR_${i}`;
            if (key in sensor_data) {
              fsrEntry[key] = sensor_data[key];
            }
          }

          // Update FSR data more efficiently
          const newFsrData = [
            ...fsrDataRef.current.slice(-(MAX_HISTORY - 1)),
            fsrEntry,
          ];
          updateData(newFsrData);

          // Process IMU Data (for 3D model) - only if needed
          setImuData({
            timestamp,
            orientation: {
              yaw: sensor_data.yaw,
              pitch: sensor_data.pitch,
              roll: sensor_data.roll,
              quaternion: [
                sensor_data.q0,
                sensor_data.q1,
                sensor_data.q2,
                sensor_data.q3,
              ],
            },
            acceleration: {
              x: sensor_data.ax,
              y: sensor_data.ay,
              z: sensor_data.az,
            },
            gyro: {
              x: sensor_data.gx,
              y: sensor_data.gy,
              z: sensor_data.gz,
            },
          });
        } catch (error) {
          console.error("WebSocket parse error:", error);
        }
      };

      socketRef.current.onerror = (error) =>
        console.error("🔴 WebSocket Error:", error);

      socketRef.current.onclose = () => {
        console.log("🟠 WebSocket Disconnected");
        socketRef.current = null;

        reconnectTimeout = setTimeout(() => {
          setRetryCount((c) => c + 1);
        }, 5000);
      };
    };

    connect();

    return () => {
      clearTimeout(reconnectTimeout);
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [url, retryCount, updateData]);

  return { fsrData, imuData };
};

export default useWebSocketGraph;
