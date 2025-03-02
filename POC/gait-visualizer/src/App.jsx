import { useState } from 'react';
import Button from '@mui/material/Button';
import Scene from "./components/Scene";
import RealTimeGraph from "./components/RealTimeGraph";
import YawRealTimeGraph from "./components/YawRealTimeGraph";

function App() {
  const [activeGraph, setActiveGraph] = useState('angles');

  return (
    <div style={{ 
      display: "flex", 
      width: "100vw", 
      height: "100vh",
      backgroundColor : "white"
    }}>
      {/* Left Column - Controls and Graphs */}
      <div style={{ 
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        gap: "20px"
      }}>
        {/* Button Group */}
        <div style={{ 
          display: "flex",
          gap: "10px",
          justifyContent: "center",
          marginBottom: "20px"
        }}>
          <Button
            variant={activeGraph === 'angles' ? 'contained' : 'outlined'}
            onClick={() => setActiveGraph('angles')}
            color="primary"
          >
            Angles
          </Button>
          <Button
            variant={activeGraph === 'pressure' ? 'contained' : 'outlined'}
            onClick={() => setActiveGraph('pressure')}
            color="secondary"
          >
            Pressure
          </Button>
        </div>

        {/* Graph Container */}
        <div style={{
          flex: 1,
          backgroundColor: "white",
          borderRadius: "10px",
          padding: "20px",
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.47)'
        }}>
          {activeGraph === 'angles' ? (
            <YawRealTimeGraph />
          ) : (
            <RealTimeGraph />
          )}
        </div>
      </div>

      {/* Right Column - 3D Model */}
      <div style={{ 
        flex: 1,
        backgroundColor : "rgba(1, 1, 1, 0.81)"
      }}>
        <Scene />
      </div>
    </div>
  );
}

export default App;