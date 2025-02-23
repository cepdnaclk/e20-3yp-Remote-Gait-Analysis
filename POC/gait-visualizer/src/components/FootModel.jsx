import { useRef, useEffect, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { Quaternion, Euler } from "three";

function FootModel() {
  const obj = useLoader(OBJLoader, "/models/foot.obj");
  const footRef = useRef();
  const [quaternionData, setQuaternionData] = useState(new Quaternion(0, 0, 0, 0)); // Default identity quaternion
  const [isConnected, setIsConnected] = useState(false); // WebSocket connection status

  const DEAD_ZONE = 0.005; // Ignore small movements
  const smoothingFactor = 0.25; // Adjust to fine-tune responsiveness

  useEffect(() => {
    let socket;

    const connectWebSocket = () => {
      socket = new WebSocket("wss://8f8nk7hq11.execute-api.eu-north-1.amazonaws.com/POC/");

      socket.onopen = () => {
        console.log("✅ WebSocket Connected");
        setIsConnected(true);
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.sensor_data) {
            let { q0, q1, q2, q3 } = data.sensor_data;

            // Normalize quaternion only if necessary
            const magnitude = Math.sqrt(q0 * q0 + q1 * q1 + q2 * q2 + q3 * q3);
            if (Math.abs(magnitude - 1) > 0.001 && magnitude > 0) {
              q0 /= magnitude;
              q1 /= magnitude;
              q2 /= magnitude;
              q3 /= magnitude;
            }

            //const newQuaternion = new Quaternion(q1, q2, q3, q0);
            const newQuaternion = new Quaternion(q1, q2, q3, q0);

            // Apply dead zone filter to ignore minor changes
            if (Math.abs(q1) > DEAD_ZONE || Math.abs(q2) > DEAD_ZONE || Math.abs(q3) > DEAD_ZONE) {
              setQuaternionData(newQuaternion);
            }
          }
        } catch (error) {
          console.error("❌ Error parsing WebSocket data:", error);
        }
      };

      socket.onerror = (error) => console.error("❌ WebSocket Error:", error);
      
      socket.onclose = () => {
        console.warn("⚠️ WebSocket Disconnected. Reconnecting in 5s...");
        setIsConnected(false);
        setTimeout(connectWebSocket, 5000); // Retry connection after 5 seconds
      };
    };

    connectWebSocket(); // Initial connection

    return () => socket.close();
  }, []);

  // Center model geometry & Apply Initial Rotation
  useEffect(() => {
    obj.traverse((child) => {
      if (child.isMesh) {
        child.geometry.center(); // Centers the model
      }
    });

    if (footRef.current) {
      footRef.current.rotation.set(-Math.PI / 2, 0, Math.PI/ 2); // Rotate 90 degrees along X-axis
      console.log("📍 Model Pivot Position:", footRef.current.position);
    }
  }, [obj]);

  // Apply quaternion rotation with smoothing
  useFrame(() => {
    if (footRef.current) {
      footRef.current.quaternion.slerp(quaternionData, smoothingFactor);
      console.log("📍 Current Position:", footRef.current.position);
      console.log("🔄 Current Rotation (Euler):", footRef.current.rotation);
      console.log("🌀 Current Rotation (Quaternion):", footRef.current.quaternion);
    }
  });

  return (
    <primitive ref={footRef} object={obj} scale={0.2} position={[-2, 0, -1]} />
  );
}

export default FootModel;

