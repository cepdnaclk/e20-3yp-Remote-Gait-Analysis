import { useState, useEffect } from "react";

const useWebSocket = (url) => {
  const [sensorData, setSensorData] = useState([]);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let socket;
    let reconnectTimeout;
    const MAX_DATA_POINTS = 30;

    const connect = () => {
      socket = new WebSocket(url);

      socket.onopen = () => console.log("🟢 WebSocket Connected");
      
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (!data?.sensor_data) return;

          const newEntry = {
            time: data.timestamp, // Keep as numeric timestamp
            ...data.sensor_data
          };

          setSensorData(prev => {
            // Throttle updates to max 10Hz (100ms between updates)
            if (prev.length > 0 && (newEntry.time - prev[prev.length-1].time) < 0.1) {
              return prev;
            }
            
            const updated = [...prev, newEntry];
            // Keep array length constrained for performance
            return updated.slice(-MAX_DATA_POINTS);
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
      if (socket) socket.close();
    };
  }, [url, retryCount]);

  return sensorData;
};

export default useWebSocket;