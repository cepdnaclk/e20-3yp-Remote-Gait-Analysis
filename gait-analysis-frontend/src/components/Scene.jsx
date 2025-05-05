import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import FootModel from "./FootModel";

function Scene() {
  return (
    <Canvas camera={{ position: [0, 5, 15], fov: 50 }}>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 5, 2]} intensity={1} />

      {/* Load Foot Model */}
      <FootModel />

      {/* Controls for camera movement */}
      <OrbitControls target={[0, -1, 0]} />
    </Canvas>
  );
}

export default Scene;
