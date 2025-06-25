import React, { useMemo, useState, useEffect } from "react";
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

// Generate colors once outside component
const lineColors = Array.from(
  { length: 16 },
  (_, i) => `hsl(${(i * 360) / 16}, 75%, 50%)`
);

const RealTimeGraphV2 = ({ sensorData }) => {
  const [fsrData, setFsrData] = useState([]);

  // Add useEffect to build historical FSR data
  useEffect(() => {
    if (sensorData) {
      // Convert sensorData to fsrData format
      const fsrEntry = {
        time: sensorData.timestamp / 1000, // Convert to seconds if needed
      };

      // Add FSR values (convert from fsr_1 to FSR_1 format)
      for (let i = 1; i <= 16; i++) {
        fsrEntry[`FSR_${i}`] = sensorData[`fsr_${i}`] || 0;
      }

      // Maintain historical data (last 30 entries)
      setFsrData((prevData) => [...prevData.slice(-(30 - 1)), fsrEntry]);
    }
  }, [sensorData]);

  // Memoize the LineChart with useMemo to avoid unnecessary recalculations
  const memoizedChart = useMemo(
    () => (
      <LineChart
        data={fsrData}
        margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />

        <XAxis
          dataKey="time"
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
          domain={[
            (dataMin) => Math.max(-5, Math.floor(dataMin - 5)),
            (dataMax) => Math.ceil(dataMax + 10),
          ]}
          tick={{ fill: "#000000" }}
          label={{
            value: "Pressure (N)",
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
          labelFormatter={(unixTime) =>
            new Date(unixTime * 1000).toLocaleTimeString()
          }
        />

        <Legend
          wrapperStyle={{ paddingTop: 10 }}
          formatter={(value) => (
            <span style={{ color: "#000000" }}>{value.replace("_", " ")}</span>
          )}
        />

        {Array.from({ length: 16 }, (_, i) => {
          const fsrKey = `FSR_${i + 1}`;
          return (
            <Line
              key={fsrKey}
              type="monotone"
              dataKey={fsrKey}
              stroke={lineColors[i]}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
              activeDot={{
                r: 5,
                fill: lineColors[i],
                stroke: "#000000",
                strokeWidth: 2,
              }}
            />
          );
        })}
      </LineChart>
    ),
    [fsrData]
  );

  return (
    <ResponsiveContainer width="100%" height="100%">
      {memoizedChart}
    </ResponsiveContainer>
  );
};

export default React.memo(RealTimeGraphV2);
