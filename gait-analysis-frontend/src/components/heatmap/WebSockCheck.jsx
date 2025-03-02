import React from "react";
import useWebSocket from "../../../../POC/gait-visualizer/src/hooks/useWebSocket";

const HeatmapWebSock3Force = () => {
  // Configuration parameters - easy to modify
  const CONFIG = {
    // FSR value ranges and colors
    fsr: {
      min: 0,
      max: 10,
      ranges: [
        { min: 0, max: 2, color: "bg-blue-500" },
        { min: 3, max: 6, color: "bg-green-500" },
        { min: 7, max: 10, color: "bg-yellow-500" },
        { min: 11, max: Infinity, color: "bg-orange-500" },
      ],
    },
    // WebSocket configuration
    websocket: {
      url: "wss://8f8nk7hq11.execute-api.eu-north-1.amazonaws.com/POC/",
    },
  };

  // Function to normalize FSR values to the correct range
  const normalizeFsrValue = (value) => {
    // Handle negative values
    if (value < 0) return 0;
    // Otherwise keep within range
    return Math.min(Math.max(value, CONFIG.fsr.min), CONFIG.fsr.max);
  };

  // Function to get color based on FSR value
  const getFsrColor = (value) => {
    const normalizedValue = normalizeFsrValue(value);
    for (const range of CONFIG.fsr.ranges) {
      if (normalizedValue >= range.min && normalizedValue <= range.max) {
        return range.color;
      }
    }
    return "bg-gray-300"; // Default color if no range matches
  };

  const { fsrData, imuData } = useWebSocket(CONFIG.websocket.url);

  return (
    <div className="p-4 border rounded shadow-sm">
      <h2 className="text-xl font-bold mb-4">WebSocket Data Check</h2>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">Connection Status:</h3>
        <div className="flex items-center mt-2">
          <div
            className={`w-4 h-4 rounded-full mr-2 ${
              fsrData.length > 0 || imuData ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
          <span>
            {fsrData.length > 0 || imuData ? "Data Received" : "No Data"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* FSR Data Section */}
        <div className="border p-3 rounded">
          <h3 className="text-lg font-semibold mb-2">FSR Data</h3>
          {fsrData.length > 0 ? (
            <div>
              <p className="mb-2">
                Last updated: {new Date().toLocaleTimeString()}
              </p>
              <p className="mb-2">Total entries: {fsrData.length}</p>
              <div className="overflow-auto max-h-40">
                <pre className="text-xs">
                  {JSON.stringify(fsrData.slice(-1)[0], null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No FSR data received yet...</p>
          )}
        </div>

        {/* IMU Data Section */}
        <div className="border p-3 rounded">
          <h3 className="text-lg font-semibold mb-2">IMU Data</h3>
          {imuData ? (
            <div>
              <p className="mb-2">
                Last updated: {new Date().toLocaleTimeString()}
              </p>
              <div className="overflow-auto max-h-40">
                <pre className="text-xs">
                  {JSON.stringify(imuData, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No IMU data received yet...</p>
          )}
        </div>
      </div>

      {/* FSR Range Configuration Display */}
      <div className="mt-4 mb-4 p-3 border rounded bg-gray-50">
        <h3 className="text-lg font-semibold mb-2">FSR Range Configuration</h3>
        <div className="grid grid-cols-4 gap-2">
          {CONFIG.fsr.ranges.map((range, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className={`w-full h-6 ${range.color} rounded mb-1`}></div>
              <span className="text-xs">
                {range.min} - {range.max === Infinity ? "∞" : range.max}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Raw Data Table with color-coding */}
      {fsrData.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Last 5 FSR Readings</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr>
                  <th className="border p-2">Time</th>
                  {Object.keys(fsrData[0])
                    .filter((key) => key !== "time")
                    .map((key) => (
                      <th key={key} className="border p-2">
                        {key}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {fsrData.slice(-5).map((entry, idx) => (
                  <tr key={idx}>
                    <td className="border p-2">
                      {entry.time?.toFixed(6) || "N/A"}
                    </td>
                    {Object.keys(entry)
                      .filter((key) => key !== "time")
                      .map((key) => {
                        const rawValue = entry[key];
                        const normalizedValue = normalizeFsrValue(rawValue);
                        return (
                          <td
                            key={key}
                            className={`border p-2 ${getFsrColor(rawValue)}`}
                          >
                            {normalizedValue?.toFixed(2) || "N/A"}
                          </td>
                        );
                      })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Console logger for debugging */}
      {fsrData.length > 0 && !window._loggedData && (
        <div style={{ display: "none" }}>
          {console.log("Latest FSR Data:", fsrData.slice(-1)[0])}
          {console.log("Latest IMU Data:", imuData)}
          {(window._loggedData = true)}
        </div>
      )}
    </div>
  );
};

export default HeatmapWebSock3Force;
