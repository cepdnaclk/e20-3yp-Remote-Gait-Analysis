import { useState, useEffect } from "react";

const useWebSocket = (url) => {
  const [fsrData, setFsrData] = useState([]);
  const [imuData, setImuData] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let socket;
    let reconnectTimeout;
    const MAX_HISTORY = 30; // Keep last 30 FSR readings

    const connect = () => {
      socket = new WebSocket(url);

      socket.onopen = () => console.log("🟢 WebSocket Connected");

      socket.onmessage = (event) => {
        try {
          const { sensor_data, timestamp } = JSON.parse(event.data);
          if (!sensor_data) return;

          // Process FSR Data (for graph)
          const fsrEntry = {
            time: timestamp,
            ...Object.fromEntries(
              Object.entries(sensor_data)
                .filter(([key]) => key.startsWith("FSR_"))
            )
          };

          setFsrData(prev => {
            // Throttle updates to 10Hz (100ms between updates)
            if (prev.length > 0 && (timestamp - prev[prev.length-1].time < 0.00001)) {
              return prev;
            }
            return [...prev.slice(-(MAX_HISTORY - 1)), fsrEntry];
          });

          // Process IMU Data (for 3D model)
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
                sensor_data.q3
              ]
            },
            acceleration: {
              x: sensor_data.ax,
              y: sensor_data.ay,
              z: sensor_data.az
            },
            gyro: {
              x: sensor_data.gx,
              y: sensor_data.gy,
              z: sensor_data.gz
            }
          });

        } catch (error) {
          console.error("WebSocket parse error:", error);
        }
      };

      socket.onerror = (error) => console.error("🔴 WebSocket Error:", error);

      socket.onclose = () => {
        console.log("🟠 WebSocket Disconnected");
        reconnectTimeout = setTimeout(() => {
          setRetryCount(c => c + 1); // Trigger reconnection
        }, 5000);
      };
    };

    connect();

    return () => {
      clearTimeout(reconnectTimeout);
      socket?.close();
    };
  }, [url, retryCount]);

  return { fsrData, imuData };
};

export default useWebSocket;