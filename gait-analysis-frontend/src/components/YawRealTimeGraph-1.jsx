// import React, { useState, useEffect } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer
// } from "recharts";
// import useWebSocket from "../hooks/useWebSocket";

// const WS_URL = "wss://8f8nk7hq11.execute-api.eu-north-1.amazonaws.com/POC/";
// const MAX_HISTORY = 30;

// const YawRealTimeGraph = () => {
//   const { imuData } = useWebSocket(WS_URL);
//   const [yawHistory, setYawHistory] = useState([]);

//   useEffect(() => {
//     if (imuData?.orientation?.yaw !== undefined) {
//       setYawHistory(prev => {
//         const newHistory = [...prev, imuData];
//         return newHistory.slice(-MAX_HISTORY);
//       });
//     }
//   }, [imuData]);

//   return (
//     <div style={{
//       width: '100%',
//       height: '85vh',
//       backgroundColor: '#ffffff',
//       borderRadius: '10px',
//       padding: '20px',
//       boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
//     }}>
//       <ResponsiveContainer>
//         <LineChart
//           data={yawHistory}
//           margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
//         >
//           <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />

//           <XAxis
//             dataKey="timestamp"
//             tick={{ fill: '#000000', fontSize: 12 }}
//             tickFormatter={(timestamp) => {
//               const jsTimestamp = timestamp?.toString().length === 10
//                 ? timestamp * 1000
//                 : timestamp;
//               return new Date(jsTimestamp)
//                 .toLocaleTimeString('en-US', {
//                   minute: '2-digit',
//                   second: '2-digit'
//                 });
//             }}
//             label={{ value: 'Time', position: 'bottom', fill: '#000000' }}
//           />

//           <YAxis
//             domain={[0, 360]}
//             tickCount={7}
//             tick={{ fill: '#000000' }}
//             label={{
//               value: 'Yaw (°)',
//               angle: -90,
//               position: 'left',
//               fill: '#000000'
//             }}
//           />

//           <Tooltip
//             contentStyle={{
//               backgroundColor: '#ffffff',
//               border: '1px solid #ddd',
//               borderRadius: '6px'
//             }}
//             labelFormatter={(timestamp) =>
//               new Date(timestamp).toLocaleTimeString([], {
//                 hour: '2-digit',
//                 minute: '2-digit',
//                 second: '2-digit'
//               })
//             }
//           />

//           <Legend wrapperStyle={{ paddingTop: 10 }} />

//           <Line
//             name="Yaw Angle"
//             type="monotone"
//             dataKey="orientation.yaw"
//             stroke="blue"
//             strokeWidth={2}
//             dot={false}
//             isAnimationActive={false}
//             activeDot={{
//               r: 5,
//               fill: "blue",
//               stroke: '#000000',
//               strokeWidth: 2
//             }}
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default YawRealTimeGraph;

// // YawRealTimeGraph.js
// import React, { useState, useEffect } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer
// } from "recharts";
// import useWebSocket from "../hooks/useWebSocket";

// const WS_URL = "wss://8f8nk7hq11.execute-api.eu-north-1.amazonaws.com/POC/";
// const MAX_HISTORY = 30;

// const YawRealTimeGraph = () => {
//   const { imuData } = useWebSocket(WS_URL);
//   const [yawHistory, setYawHistory] = useState([]);

//   useEffect(() => {
//     if (imuData?.orientation?.yaw !== undefined) {
//       setYawHistory(prev => [...prev.slice(-(MAX_HISTORY-1)), imuData]);
//     }
//   }, [imuData]);

//   return (
//     // <div style={{
//     //   width: '100%',
//     //   height: '100%', // Changed to 100%
//     //   backgroundColor: '#ffffff',
//     //   borderRadius: '10px',
//     //   padding: '20px',
//     //   boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
//     // }}>
//       <ResponsiveContainer width="100%" height="100%">
//         {/* Rest of the component remains the same */}
//         {/* <ResponsiveContainer> */}
//         <LineChart
//           data={yawHistory}
//           margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
//         >
//           <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />

//           <XAxis
//             dataKey="timestamp"
//             tick={{ fill: '#000000', fontSize: 12 }}
//             tickFormatter={(timestamp) => {
//               const jsTimestamp = timestamp?.toString().length === 10
//                 ? timestamp * 1000
//                 : timestamp;
//               return new Date(jsTimestamp)
//                 .toLocaleTimeString('en-US', {
//                   minute: '2-digit',
//                   second: '2-digit'
//                 });
//             }}
//             label={{ value: 'Time', position: 'bottom', fill: '#000000' }}
//           />

//           <YAxis
//             domain={[0, 360]}
//             tickCount={7}
//             tick={{ fill: '#000000' }}
//             label={{
//               value: 'Yaw (°)',
//               angle: -90,
//               position: 'left',
//               fill: '#000000'
//             }}
//           />

//           <Tooltip
//             contentStyle={{
//               backgroundColor: '#ffffff',
//               border: '1px solid #ddd',
//               borderRadius: '6px'
//             }}
//             labelFormatter={(timestamp) =>
//               new Date(timestamp).toLocaleTimeString([], {
//                 hour: '2-digit',
//                 minute: '2-digit',
//                 second: '2-digit'
//               })
//             }
//           />

//           <Legend wrapperStyle={{ paddingTop: 10 }} />

//           <Line
//             name="Yaw Angle"
//             type="monotone"
//             dataKey="orientation.yaw"
//             stroke="blue"
//             strokeWidth={2}
//             dot={false}
//             isAnimationActive={false}
//             activeDot={{
//               r: 5,
//               fill: "blue",
//               stroke: '#000000',
//               strokeWidth: 2
//             }}
//           />
//         </LineChart>
//       {/* </ResponsiveContainer> */}
//       </ResponsiveContainer>
//     //</div>
//   );
// };

// export default YawRealTimeGraph;

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
// import useWebSocket from "../hooks/useWebSocket";
import useWebSocketGraph from "../hooks/useWebSocketGraph";

const WS_URL = "wss://8f8nk7hq11.execute-api.eu-north-1.amazonaws.com/POC/";
const MAX_HISTORY = 30;

const YawRealTimeGraph = () => {
  const { imuData } = useWebSocketGraph(WS_URL);
  const [angleHistory, setAngleHistory] = useState([]);

  useEffect(() => {
    if (imuData?.orientation) {
      setAngleHistory((prev) => [...prev.slice(-(MAX_HISTORY - 1)), imuData]);
    }
  }, [imuData]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={angleHistory}
        margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />

        <XAxis
          dataKey="timestamp"
          tick={{ fill: "#000000", fontSize: 12 }}
          tickFormatter={(unixTime) =>
            new Date(unixTime * 1000).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
          }
          label={{ value: "Time", position: "bottom", fill: "#000000" }}
        />

        <YAxis
          domain={[-180, 360]}
          tickCount={7}
          tick={{ fill: "#000000" }}
          label={{
            value: "Angle (°)",
            angle: -90,
            position: "left",
            fill: "#000000",
          }}
        />

        <Tooltip
          contentStyle={{
            backgroundColor: "#ffffff",
            border: "1px solid #ddd",
            borderRadius: "6px",
          }}
          formatter={(value, name) => [
            `${value.toFixed(2)}°`,
            name.replace("orientation.", ""),
          ]}
          labelFormatter={(timestamp) =>
            new Date(timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
          }
        />

        <Legend wrapperStyle={{ paddingTop: 10 }} />

        {/* Yaw Line */}
        <Line
          name="Yaw"
          type="monotone"
          dataKey="orientation.yaw"
          stroke="#8884d8"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
          activeDot={{ r: 5 }}
        />

        {/* Pitch Line */}
        <Line
          name="Pitch"
          type="monotone"
          dataKey="orientation.pitch"
          stroke="#82ca9d"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
          activeDot={{ r: 5 }}
        />

        {/* Roll Line */}
        <Line
          name="Roll"
          type="monotone"
          dataKey="orientation.roll"
          stroke="#ffc658"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default YawRealTimeGraph;
