import Scene from "./components/Scene";
import RealTimeGraph from "./components/RealTimeGraph"; // Import the graph

function App() {
  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
      {/* Left Section (Real-Time Graphs) */}
      <div style={{ flex: 1, backgroundColor: "white", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ width: "90%", height: "90%", backgroundColor: "white", borderRadius: "10px", padding: "10px" }}>
          <RealTimeGraph />
        </div>
      </div>

      {/* Right Section (3D Foot Model) */}
      <div style={{ flex: 1 }}>
        <Scene />
      </div>
    </div>
  );
}

export default App;
