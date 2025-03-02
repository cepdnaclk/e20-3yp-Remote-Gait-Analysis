import { useState, useEffect } from "react";

const useWebSocket = (url) => {
  const [fsrData, setFsrData] = useState([]);
  const [imuData, setImuData] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");

  useEffect(() => {
    let socket;
    let reconnectTimeout;
    let heartbeatInterval;
    const MAX_HISTORY = 30; // Keep last 30 FSR readings
    const RECONNECT_DELAY = Math.min(5000 * Math.pow(1.5, retryCount), 30000); // Exponential backoff with 30s max

    const connect = () => {
      try {
        setConnectionStatus("connecting");
        socket = new WebSocket(url);

        socket.onopen = () => {
          console.log("🟢 WebSocket Connected");
          setConnectionStatus("connected");
          setRetryCount(0); // Reset retry count on successful connection

          // Setup heartbeat to keep connection alive
          heartbeatInterval = setInterval(() => {
            if (socket && socket.readyState === WebSocket.OPEN) {
              socket.send(JSON.stringify({ type: "ping" }));
            }
          }, 30000); // Send ping every 30 seconds
        };

        socket.onmessage = (event) => {
          try {
            const { sensor_data, timestamp } = JSON.parse(event.data);

            // Handle server pong response if needed
            if (event.data === '{"type":"pong"}') {
              return;
            }

            if (!sensor_data) return;

            // Process FSR Data (for graph)
            const fsrEntry = {
              time: timestamp,
              ...Object.fromEntries(
                Object.entries(sensor_data).filter(([key]) =>
                  key.startsWith("FSR_")
                )
              ),
            };

            setFsrData((prev) => {
              // Throttle updates to 10Hz (100ms between updates)
              if (
                prev.length > 0 &&
                timestamp - prev[prev.length - 1].time < 0.1
              ) {
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

        socket.onerror = (error) => {
          console.error("🔴 WebSocket Error:", error);
          setConnectionStatus("error");
        };

        socket.onclose = (event) => {
          setConnectionStatus("disconnected");
          console.log(
            `🟠 WebSocket Disconnected. Code: ${event.code}, Reason: ${
              event.reason || "No reason provided"
            }, Clean: ${event.wasClean}`
          );

          // Clear heartbeat interval
          clearInterval(heartbeatInterval);

          // Attempt to reconnect with exponential backoff
          console.log(
            `Attempting to reconnect in ${RECONNECT_DELAY / 1000} seconds...`
          );
          reconnectTimeout = setTimeout(() => {
            setRetryCount((c) => c + 1); // Trigger reconnection
          }, RECONNECT_DELAY);
        };
      } catch (error) {
        console.error("Error establishing WebSocket connection:", error);
        setConnectionStatus("error");

        // Attempt to reconnect
        reconnectTimeout = setTimeout(() => {
          setRetryCount((c) => c + 1); // Trigger reconnection
        }, RECONNECT_DELAY);
      }
    };

    connect();

    return () => {
      clearTimeout(reconnectTimeout);
      clearInterval(heartbeatInterval);
      if (socket) {
        socket.close();
      }
    };
  }, [url, retryCount]);

  return { fsrData, imuData, connectionStatus };
};

export default useWebSocket;
