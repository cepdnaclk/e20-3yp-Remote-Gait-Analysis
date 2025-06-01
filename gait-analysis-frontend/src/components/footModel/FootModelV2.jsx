import { useRef, useEffect, useMemo, useCallback } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { Quaternion, Matrix4 } from "three";

const FootModelV2 = ({ sensorData }) => {
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
  // const COORDINATE_CORRECTION = useMemo(() => {
  //   // This matrix transforms from BNO055 (Z-up) to Three.js (Y-up)
  //   // It rotates -90 degrees around X to move Z-up to Y-up
  //   const correctionMatrix = new Matrix4().makeRotationX(-Math.PI / 2);
  //   const correctionQuat = new Quaternion().setFromRotationMatrix(
  //     correctionMatrix
  //   );
  //   return correctionQuat;
  // }, []);

  const COORDINATE_CORRECTION = useMemo(() => {
    // Step 1: Transform from BNO055 (Z-up) to Three.js (Y-up)
    const bnoToThreeJs = new Matrix4().makeRotationX(-Math.PI / 2);

    // Step 2: Account for sensor mounting (rotated 90° clockwise around X when worn)
    // Since it's clockwise, we need -90° (negative rotation)
    const mountingOffset = new Matrix4().makeRotationX(-Math.PI / 2);

    // Combine transformations: apply mounting offset first, then coordinate conversion
    const combinedMatrix = new Matrix4().multiplyMatrices(
      mountingOffset,
      bnoToThreeJs
    );
    const correctionQuat = new Quaternion().setFromRotationMatrix(
      combinedMatrix
    );

    return correctionQuat;
  }, []);

  const footRef = useRef();
  const obj = useLoader(OBJLoader, "/models/foot.obj");

  // Use ref instead of state for better performance
  const targetQuatRef = useRef(new Quaternion());

  // Update rotation from sensorData prop
  useEffect(() => {
    if (sensorData && sensorData.q0 !== undefined) {
      const { q0, q1, q2, q3 } = sensorData;

      // BNO055 quaternion format is (w, x, y, z)
      const sensorQuat = new Quaternion(q1, q2, q3, q0);

      // Apply coordinate system correction
      const adjustedQuat = new Quaternion().multiplyQuaternions(
        COORDINATE_CORRECTION,
        sensorQuat
      );

      // Update target quaternion
      targetQuatRef.current.copy(adjustedQuat);
    }
  }, [sensorData, COORDINATE_CORRECTION]);

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

export default FootModelV2;
