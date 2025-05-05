import { useRef, useEffect, useMemo, useCallback } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { Quaternion, Matrix4 } from "three";

const FootModel = () => {
  // Configuration constants
  const CONFIG = useMemo(
    () => ({
      MODEL_SCALE: 0.2,
      POSITION: [0, -1, 0],
      SMOOTHING_FACTOR: 0.9, // Increased from 0.15 to 0.9 for much faster response
      WS_URL: "wss://8f8nk7hq11.execute-api.eu-north-1.amazonaws.com/POC/",
      RECONNECT_DELAY: 5000,
    }),
    []
  );

  // Coordinate system correction
  // BNO055 has Z up, X forward, Y right
  // Three.js has Y up, Z forward, X right
  const COORDINATE_CORRECTION = useMemo(() => {
    // This matrix transforms from BNO055 (Z-up) to Three.js (Y-up)
    // It rotates -90 degrees around X to move Z-up to Y-up
    const correctionMatrix = new Matrix4().makeRotationX(-Math.PI / 2);
    const correctionQuat = new Quaternion().setFromRotationMatrix(
      correctionMatrix
    );
    return correctionQuat;
  }, []);

  const footRef = useRef();
  const obj = useLoader(OBJLoader, "/models/foot.obj");

  // Use ref instead of state for better performance
  const targetQuatRef = useRef(new Quaternion());
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    wsRef.current = new WebSocket(CONFIG.WS_URL);

    wsRef.current.onopen = () => {
      console.log("WebSocket connected");
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };

    wsRef.current.onmessage = (event) => {
      try {
        const { sensor_data } = JSON.parse(event.data);
        if (!sensor_data) return;

        const { q0, q1, q2, q3 } = sensor_data;

        // Skip unnecessary normalization if your sensor data is already reliable
        // If normalization is critical for your application, keep it

        // BNO055 quaternion format is (w, x, y, z)
        const sensorQuat = new Quaternion(q1, q2, q3, q0);

        // Apply coordinate system correction
        const adjustedQuat = new Quaternion().multiplyQuaternions(
          COORDINATE_CORRECTION,
          sensorQuat
        );

        // Update ref directly instead of using setState for better performance
        targetQuatRef.current.copy(adjustedQuat);
      } catch (error) {
        console.error("Data parsing error:", error);
      }
    };

    wsRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    wsRef.current.onclose = () => {
      console.log("WebSocket closed, reconnecting...");
      if (!reconnectTimeoutRef.current) {
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, CONFIG.RECONNECT_DELAY);
      }
    };
  }, [CONFIG, COORDINATE_CORRECTION]);

  // Initialize WebSocket connection
  useEffect(() => {
    connectWebSocket();

    return () => {
      // Cleanup WebSocket and reconnect attempts
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };
  }, [connectWebSocket]);

  // Initialize model - only runs once when obj is loaded
  useEffect(() => {
    obj.traverse((child) => {
      if (child.isMesh) {
        child.geometry.center();
        child.geometry.computeVertexNormals();
      }
    });
  }, [obj]);

  // Apply rotation updates in animation frame
  useFrame(() => {
    if (footRef.current) {
      // Option 1: For super responsive (no smoothing)
      // footRef.current.quaternion.copy(targetQuatRef.current);

      // Option 2: With minimal smoothing for slightly better visual quality
      footRef.current.quaternion.slerp(
        targetQuatRef.current,
        CONFIG.SMOOTHING_FACTOR
      );
    }
  });

  return (
    <primitive
      ref={footRef}
      object={obj}
      scale={CONFIG.MODEL_SCALE}
      position={CONFIG.POSITION}
    />
  );
};

export default FootModel;
