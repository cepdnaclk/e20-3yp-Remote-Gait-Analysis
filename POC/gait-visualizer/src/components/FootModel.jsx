import { useRef, useEffect, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { Quaternion, Vector3 } from "three";

const FootModel = () => {
  const footRef = useRef();
  const obj = useLoader(OBJLoader, "/models/foot.obj");
  const [targetQuat, setTargetQuat] = useState(new Quaternion());
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  // Configuration
  const MODEL_SCALE = 0.2;
  const POSITION = [0, -1, 0];
  const SMOOTHING_FACTOR = 0.4;
  const CORRECTION_QUAT = new Quaternion().setFromAxisAngle(
    new Vector3(1, 0, 0),
    -Math.PI / 2
  );

  const connectWebSocket = () => {
    wsRef.current = new WebSocket("wss://8f8nk7hq11.execute-api.eu-north-1.amazonaws.com/POC/");

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

        // Process quaternion data
        const { q0, q1, q2, q3 } = sensor_data;
        const norm = Math.sqrt(q0 ** 2 + q1 ** 2 + q2 ** 2 + q3 ** 2);
        
        const rawQuat = new Quaternion(
          q1 / norm,
          q2 / norm,
          q3 / norm,
          q0 / norm
        );

        const adjustedQuat = CORRECTION_QUAT.clone().multiply(rawQuat);
        setTargetQuat(adjustedQuat);

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
        }, 5000);
      }
    };
  };

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
  }, []);

  // Model initialization
  useEffect(() => {
    obj.traverse((child) => {
      if (child.isMesh) {
        child.geometry.center();
        child.geometry.computeVertexNormals();
      }
    });
  }, [obj]);

  // Smooth rotation updates
  useFrame(() => {
    if (footRef.current) {
      footRef.current.quaternion.slerp(targetQuat, SMOOTHING_FACTOR);
    }
  });

  return (
    <primitive
      ref={footRef}
      object={obj}
      scale={MODEL_SCALE}
      position={POSITION}
      rotation={[-Math.PI / 2, 0, 0]}
    />
  );
};

export default FootModel;