import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import useWebSocket from "../hooks/useWebSocket";

const WS_URL = "wss://8f8nk7hq11.execute-api.eu-north-1.amazonaws.com/POC/";

const RealTimeGraph = () => {
  const sensorData = useWebSocket(WS_URL);

  // Generate distinct colors for 16 sensors
  const generateLineColor = (index) => {
    const hue = (index * 360) / 16;
    return `hsl(${hue}, 75%, 50%)`;
  };

  return (
    <div style={{ width: '100%', height: '90vh', margin: '0 auto' }}>
      <ResponsiveContainer>
        <LineChart
          data={sensorData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#666" />
          <XAxis
            dataKey="time"
            tickFormatter={(unixTime) => 
              new Date(unixTime * 1000).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })
            }
            label={{
              value: 'Time',
              position: 'bottom',
              offset: 0
            }}
          />
          <YAxis
            domain={[-50, 50]}
            label={{
              value: 'Pressure Value',
              angle: -90,
              position: 'left'
            }}
          />
          <Tooltip
            labelFormatter={(unixTime) => 
              `Time: ${new Date(unixTime * 1000).toLocaleTimeString()}`
            }
          />
          <Legend
            wrapperStyle={{ paddingTop: 20 }}
            formatter={(value) => value.replace('_', ' ')}
          />
          
          {Array.from({ length: 16 }, (_, i) => {
            const fsrKey = `FSR_${i + 1}`;
            return (
              <Line
                key={fsrKey}
                type="monotone"
                dataKey={fsrKey}
                stroke={generateLineColor(i)}
                strokeWidth={1.5}
                dot={false}
                isAnimationActive={true}
                animationDuration={0}
                activeDot={{
                  r: 4,
                  fill: generateLineColor(i),
                  strokeWidth: 0
                }}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RealTimeGraph;