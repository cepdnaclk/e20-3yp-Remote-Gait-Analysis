import React, { useMemo, useCallback, useRef, useEffect } from "react";
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
import useWebSocketGraph from "../hooks/useWebSocketGraph";

const WS_URL = "wss://8f8nk7hq11.execute-api.eu-north-1.amazonaws.com/POC/";
const MAX_HISTORY = 30;

// Predefined line colors for angle data
const lineColors = {
  yaw: "#8884d8",
  pitch: "#82ca9d",
  roll: "#ffc658",
};

const YawRealTimeGraph = () => {
  const { imuData } = useWebSocketGraph(WS_URL);
  const angleHistoryRef = useRef([]);
  const [angleHistory, setAngleHistory] = React.useState([]);

  // Use a ref to track the last update time to reduce state updates
  const lastUpdateTimeRef = useRef(0);

  // More efficient update function that uses batch processing
  const updateAngleHistory = useCallback((newData) => {
    // Only update state if we have meaningful changes (throttle)
    const currentTime = Date.now();
    if (currentTime - lastUpdateTimeRef.current < 100) {
      // 10Hz update rate
      return;
    }

    lastUpdateTimeRef.current = currentTime;

    // Update the ref and state in one go
    const newHistory = [
      ...angleHistoryRef.current.slice(-(MAX_HISTORY - 1)),
      newData,
    ];
    angleHistoryRef.current = newHistory;
    setAngleHistory(newHistory);
  }, []);

  // Process imuData changes with debouncing
  useEffect(() => {
    if (imuData?.orientation) {
      updateAngleHistory(imuData);
    }
  }, [imuData, updateAngleHistory]);

  // Memoize the chart to prevent unnecessary re-renders
  const memoizedChart = useMemo(
    () => (
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
            `${value?.toFixed(2)}°`,
            name.replace("orientation.", ""),
          ]}
          labelFormatter={(timestamp) =>
            new Date(timestamp * 1000).toLocaleTimeString([], {
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
          stroke={lineColors.yaw}
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
          stroke={lineColors.pitch}
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
          stroke={lineColors.roll}
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    ),
    [angleHistory]
  );

  return (
    <ResponsiveContainer width="100%" height="100%">
      {memoizedChart}
    </ResponsiveContainer>
  );
};

export default React.memo(YawRealTimeGraph);
