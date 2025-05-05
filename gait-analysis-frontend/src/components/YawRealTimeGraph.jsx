import React, {
  useMemo,
  useCallback,
  useRef,
  useEffect,
  useState,
} from "react";
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
const UPDATE_INTERVAL = 100; // 10Hz update rate

// Predefined line colors for angle data
const lineColors = {
  yaw: "#8884d8",
  pitch: "#82ca9d",
  roll: "#ffc658",
};

// Pre-define chart configurations to avoid recreating objects on each render
const chartMargin = { top: 20, right: 30, left: 30, bottom: 20 };
const cartesianGridProps = { strokeDasharray: "3 3", stroke: "#e0e0e0" };
const tooltipContentStyle = {
  backgroundColor: "#ffffff",
  border: "1px solid #ddd",
  borderRadius: "6px",
};
const legendWrapperStyle = { paddingTop: 10 };
const timeFormatterOptions = {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
};
const yAxisLabelProps = {
  value: "Angle (°)",
  angle: -90,
  position: "left",
  fill: "#000000",
};
const xAxisLabelProps = {
  value: "Time",
  position: "bottom",
  fill: "#000000",
};
const xAxisTickProps = { fill: "#000000", fontSize: 12 };
const yAxisTickProps = { fill: "#000000" };
const lineProps = {
  strokeWidth: 2,
  dot: false,
  isAnimationActive: false,
  activeDot: { r: 5 },
};

const FootOrientationGraph = () => {
  const { imuData } = useWebSocketGraph(WS_URL);
  const angleHistoryRef = useRef([]);
  const [angleHistory, setAngleHistory] = useState([]);
  const requestIdRef = useRef(null);
  const pendingDataRef = useRef(null);

  // Set up the animation frame based update system
  useEffect(() => {
    const lastUpdateTimeRef = { current: 0 };

    const updateState = (timestamp) => {
      // Check if we have pending data and if enough time has passed since last update
      if (
        pendingDataRef.current &&
        timestamp - lastUpdateTimeRef.current >= UPDATE_INTERVAL
      ) {
        const newHistory = [
          ...angleHistoryRef.current.slice(-(MAX_HISTORY - 1)),
          pendingDataRef.current,
        ];

        angleHistoryRef.current = newHistory;
        setAngleHistory(newHistory);
        lastUpdateTimeRef.current = timestamp;
        pendingDataRef.current = null;
      }

      requestIdRef.current = requestAnimationFrame(updateState);
    };

    requestIdRef.current = requestAnimationFrame(updateState);

    return () => {
      cancelAnimationFrame(requestIdRef.current);
    };
  }, []);

  // Update pending data when new IMU data arrives
  useEffect(() => {
    if (imuData?.orientation) {
      pendingDataRef.current = imuData;
    }
  }, [imuData]);

  // Memoized formatter functions
  const tickFormatter = useCallback(
    (unixTime) =>
      new Date(unixTime * 1000).toLocaleTimeString(
        "en-US",
        timeFormatterOptions
      ),
    []
  );

  const valueFormatter = useCallback(
    (value, name) => [
      `${value?.toFixed(2)}°`,
      name.replace("orientation.", ""),
    ],
    []
  );

  const labelFormatter = useCallback(
    (timestamp) =>
      new Date(timestamp * 1000).toLocaleTimeString([], timeFormatterOptions),
    []
  );

  // Memoize the chart to prevent unnecessary re-renders
  const memoizedChart = useMemo(() => {
    if (angleHistory.length === 0) {
      return <div>Waiting for IMU data...</div>;
    }

    return (
      <LineChart data={angleHistory} margin={chartMargin}>
        <CartesianGrid {...cartesianGridProps} />
        <XAxis
          dataKey="timestamp"
          tick={xAxisTickProps}
          tickFormatter={tickFormatter}
          label={xAxisLabelProps}
        />
        <YAxis
          domain={[-360, 360]}
          tickCount={7}
          tick={yAxisTickProps}
          label={yAxisLabelProps}
        />
        <Tooltip
          contentStyle={tooltipContentStyle}
          formatter={valueFormatter}
          labelFormatter={labelFormatter}
        />
        <Legend wrapperStyle={legendWrapperStyle} />

        {Object.entries({
          Yaw: "orientation.yaw",
          Pitch: "orientation.pitch",
          Roll: "orientation.roll",
        }).map(([name, dataKey]) => (
          <Line
            key={name}
            name={name}
            type="monotone"
            dataKey={dataKey}
            stroke={lineColors[name.toLowerCase()]}
            {...lineProps}
          />
        ))}
      </LineChart>
    );
  }, [angleHistory, tickFormatter, valueFormatter, labelFormatter]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      {memoizedChart}
    </ResponsiveContainer>
  );
};

export default React.memo(FootOrientationGraph);
