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
  const { fsrData } = useWebSocket(WS_URL);

  // Generate distinct colors for 16 sensors
  const lineColors = Array.from({ length: 16 }, (_, i) =>
    `hsl(${(i * 360) / 16}, 75%, 50%)` // Adjusted to be visible on white background
  );

  return (
    <ResponsiveContainer>
      <LineChart
        data={fsrData}
        margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
      >
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke="#e0e0e0" // Light gray grid
        />
        
        <XAxis
          dataKey="time"
          tick={{ fill: '#000000', fontSize: 12 }} // Black text
          tickFormatter={(unixTime) => 
            new Date(unixTime * 1000).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })
          }
          label={{ value: 'Time', position: 'bottom', fill: '#000000', }}
        />

        <YAxis
          //domain={[dataMin => Math.floor(dataMin - 5), dataMax => Math.ceil(dataMax + 10)]}
          domain={[dataMin => Math.max(-5, Math.floor(dataMin - 5)), dataMax => Math.ceil(dataMax + 10)]}
          // ticks={(fsrData && fsrData.length > 0) ? [
          //   Math.min(0, Math.floor(Math.min(...fsrData.map(d => Math.min(...Object.values(d).filter(v => typeof v === 'number')))) - 10)),
          //   0,
          //   Math.ceil(Math.max(...fsrData.map(d => Math.max(...Object.values(d).filter(v => typeof v === 'number')))) + 10)
          // ] : [0]}
          
          tick={{ fill: '#000000' }} // Black text
          label={{ value: 'Pressure (N)', angle: -90, position: 'left', fill: '#000000' }}
        />

        <Tooltip
          contentStyle={{
            backgroundColor: '#ffffff', // White background
            border: '1px solid #ddd',
            borderRadius: '6px'
          }}
          labelFormatter={(unixTime) => 
            new Date(unixTime * 1000).toLocaleTimeString()
          }
        />
        
        <Legend 
          wrapperStyle={{ paddingTop: 10 }}
          formatter={(value) => (
            <span style={{ color: '#000000' }}>{value.replace('_', ' ')}</span>
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
              animationDuration={0}
              activeDot={{
                r: 5,
                fill: lineColors[i],
                stroke: '#000000',
                strokeWidth: 2
              }}
            />
          );
        })}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RealTimeGraph;
