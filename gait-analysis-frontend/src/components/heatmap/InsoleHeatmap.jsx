import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import useWebSocket from "../../../../POC/gait-visualizer/src/hooks/useWebSocket";

// Styled components
const HeatmapContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(2),
}));

const HeatmapTitle = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  marginBottom: theme.spacing(2),
}));

const GridContainer = styled(Box)(() => ({
  position: "relative",
  marginBottom: "1.5rem",
}));

const ColorCell = styled(Box)(({ color }) => ({
  position: "absolute",
  backgroundColor: color,
  opacity: 0.8,
}));

const ColorLegend = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: "500px",
  marginBottom: theme.spacing(2),
}));

const LegendBar = styled(Box)(() => ({
  display: "flex",
  height: "2rem",
  marginBottom: "0.25rem",
}));

const LegendLabel = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
}));

const SensorReading = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.shape.borderRadius,
}));

const SensorColorIndicator = styled(Box)(({ color }) => ({
  height: "1rem",
  marginBottom: "0.25rem",
  backgroundColor: color,
}));

const InsoleHeatmap = ({
  websocketUrl = "wss://8f8nk7hq11.execute-api.eu-north-1.amazonaws.com/POC/",
  debug = true,
}) => {
  // Grid dimensions
  const ROWS = 58;
  const COLS = 17;
  const CELL_SIZE = 14; // Square cells

  // Calculate actual dimensions
  const WIDTH = COLS * CELL_SIZE;
  const HEIGHT = ROWS * CELL_SIZE;

  // Updated sensor positions as provided
  const sensorPositions = [
    [30, 5], // FSR1
    [38, 6], // FSR2
    [49, 13], // FSR3
    [49, 8], // FSR4
    [21, 4], // FSR5
    [13, 3], // FSR6
    [6, 3], // FSR7
    [5, 10], // FSR8
    [13, 8], // FSR9
    [38, 10], // FSR10
    [30, 9], // FSR11
    [21, 9], // FSR12
    [38, 14], // FSR13
    [30, 14], // FSR14
    [21, 15], // FSR15
    [13, 13], // FSR16
  ];

  // Get FSR data from WebSocket
  const { fsrData } = useWebSocket(websocketUrl);

  // State for the interpolated grid
  const [grid, setGrid] = useState([]);

  // State for current sensor values
  const [sensorValues, setSensorValues] = useState(Array(16).fill(0));

  // Debug logging for fsrData when it changes
  useEffect(() => {
    if (debug && fsrData.length > 0) {
      console.log("🔍 FSR Data Array:", fsrData);
      console.log("🔍 Latest FSR Data:", fsrData[fsrData.length - 1]);
    }
  }, [fsrData, debug]);

  // Update sensor values when new FSR data arrives
  useEffect(() => {
    if (fsrData.length > 0) {
      // Get the most recent FSR data
      const latestData = fsrData[fsrData.length - 1];

      // Extract FSR values and normalize to expected range (0-4095)
      const newSensorValues = Array(16).fill(0);

      for (let i = 1; i <= 16; i++) {
        const key = `FSR_${i}`;
        if (key in latestData) {
          // Convert your FSR values to the expected range
          // Adjust this conversion based on your actual value ranges
          let value = latestData[key];

          // Handle negative values (assuming they're errors/noise)
          if (value < 0) value = 0;

          // Scale value to 0-4095 range (adjust multiplier based on your data)
          // This example assumes your values are small decimals between 0-10
          const scaledValue = Math.min(4095, Math.floor((value * 4095) / 10));
          newSensorValues[i - 1] = scaledValue;

          if (debug) {
            console.log(`🔍 ${key}: raw=${value}, scaled=${scaledValue}`);
          }
        }
      }

      if (debug) {
        console.log("🔍 Processed Sensor Values:", newSensorValues);
      }

      setSensorValues(newSensorValues);
    }
  }, [fsrData, debug]);

  // Function to map a value (0-4095) to a color with smooth gradient
  const getColor = (value) => {
    // Clamp the value between 0 and 4095
    const clampedValue = Math.max(0, Math.min(4095, value));

    // Define the color ranges with gradients
    if (clampedValue < 1024) {
      // Blue to Green (0-1023)
      const ratio = clampedValue / 1023;
      return `rgb(0, ${Math.floor(255 * ratio)}, ${
        255 - Math.floor(255 * ratio)
      })`;
    } else if (clampedValue < 2048) {
      // Green to Yellow (1024-2047)
      const ratio = (clampedValue - 1024) / 1023;
      return `rgb(${Math.floor(255 * ratio)}, 255, 0)`;
    } else if (clampedValue < 3072) {
      // Yellow to Orange (2048-3071)
      const ratio = (clampedValue - 2048) / 1023;
      return `rgb(255, ${255 - Math.floor(90 * ratio)}, 0)`;
    } else {
      // Orange to deeper Orange/Red (3072-4095)
      const ratio = (clampedValue - 3072) / 1023;
      return `rgb(255, ${165 - Math.floor(100 * ratio)}, 0)`;
    }
  };

  // Function to perform radial interpolation
  const interpolateGrid = () => {
    // Initialize an empty grid with all zeros
    const newGrid = Array(ROWS)
      .fill()
      .map(() => Array(COLS).fill(0));

    // For each cell in the grid
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        let totalWeight = 0;
        let weightedSum = 0;

        // Calculate influence from each sensor using inverse distance weighting
        for (let i = 0; i < sensorPositions.length; i++) {
          const [sensorRow, sensorCol] = sensorPositions[i];
          const sensorValue = sensorValues[i];

          // Calculate Euclidean distance
          const distance = Math.sqrt(
            Math.pow(row - sensorRow, 2) + Math.pow(col - sensorCol, 2)
          );

          // Avoid division by zero and set a maximum influence distance
          const weight = distance < 0.1 ? 100 : 1 / Math.pow(distance, 2);

          totalWeight += weight;
          weightedSum += sensorValue * weight;
        }

        // Assign the weighted average to the cell
        newGrid[row][col] = weightedSum / totalWeight;
      }
    }

    // Ensure exact sensor values at sensor positions
    for (let i = 0; i < sensorPositions.length; i++) {
      const [row, col] = sensorPositions[i];
      newGrid[row][col] = sensorValues[i];
    }

    return newGrid;
  };

  // Update grid when sensor values change
  useEffect(() => {
    setGrid(interpolateGrid());
  }, [sensorValues]);

  // Scale and adapt the insole SVG path to our grid
  const getInsolePath = () => {
    // Original SVG path dimensions
    const originalWidth = 224;
    const originalHeight = 741;

    // Scale the path to fit within our grid
    const scaleX = WIDTH / originalWidth;
    const scaleY = HEIGHT / originalHeight;

    // SVG path from your input, preserving the shape but scaled to fit the grid
    return `
      M ${19 * scaleX} ${46 * scaleY}
      C ${34.1626 * scaleX} ${14.1781 * scaleY}, ${47.4478 * scaleX} ${
      3.8681 * scaleY
    }, ${81 * scaleX} ${1 * scaleY}
      C ${125.412 * scaleX} ${11.3017 * scaleY}, ${150.303 * scaleX} ${
      18.3106 * scaleY
    }, ${194 * scaleX} ${125 * scaleY}
      C ${223.772 * scaleX} ${199.113 * scaleY}, ${228.702 * scaleX} ${
      246.794 * scaleY
    }, ${218 * scaleX} ${342 * scaleY}
      C ${205.839 * scaleX} ${403.557 * scaleY}, ${201.911 * scaleX} ${
      436.715 * scaleY
    }, ${201 * scaleX} ${493 * scaleY}
      V ${609 * scaleY}
      C ${202.757 * scaleX} ${660.133 * scaleY}, ${202.5 * scaleX} ${
      689.5 * scaleY
    }, ${183 * scaleX} ${723 * scaleY}
      C ${168.466 * scaleX} ${736.263 * scaleY}, ${157.984 * scaleX} ${
      739.653 * scaleY
    }, ${136 * scaleX} ${740 * scaleY}
      C ${109.972 * scaleX} ${739.012 * scaleY}, ${101.529 * scaleX} ${
      736.337 * scaleY
    }, ${91 * scaleX} ${730 * scaleY}
      C ${65.2181 * scaleX} ${712.188 * scaleY}, ${61.704 * scaleX} ${
      677.955 * scaleY
    }, ${59 * scaleX} ${609 * scaleY}
      C ${60.2919 * scaleX} ${600.969 * scaleY}, ${53.9474 * scaleX} ${
      531.11 * scaleY
    }, ${51 * scaleX} ${504 * scaleY}
      C ${48.0526 * scaleX} ${476.89 * scaleY}, ${38 * scaleX} ${
      409 * scaleY
    }, ${38 * scaleX} ${409 * scaleY}
      L ${12 * scaleX} ${287 * scaleY}
      C ${1.42862 * scaleX} ${230.947 * scaleY}, ${-0.0453712 * scaleX} ${
      203.548 * scaleY
    }, ${0.999998 * scaleX} ${158 * scaleY}
      C ${1.58591 * scaleX} ${111.929 * scaleY}, ${4.55316 * scaleX} ${
      87.054 * scaleY
    }, ${19 * scaleX} ${46 * scaleY}
      Z
    `;
  };

  // Determine if we have real data or not
  const hasData = fsrData.length > 0;

  // Get timestamp for display
  const getTimestamp = () => {
    if (fsrData.length > 0) {
      const latestData = fsrData[fsrData.length - 1];
      // Convert Unix timestamp to readable date/time
      const date = new Date(latestData.time * 1000);
      return date.toLocaleTimeString();
    }
    return "No data";
  };

  // Debug button to log current state
  const handleDebugClick = () => {
    if (debug) {
      console.log("🔍 Debug Info:");
      console.log("🔍 FSR Data:", fsrData);
      console.log("🔍 Current Sensor Values:", sensorValues);
      console.log(
        "🔍 Grid Size:",
        grid.length > 0 ? `${grid.length}x${grid[0].length}` : "Empty"
      );
    }
  };

  return (
    <HeatmapContainer>
      <HeatmapTitle variant="h5">Insole Pressure Heatmap</HeatmapTitle>

      {!hasData && (
        <Typography variant="body2" color="error" sx={{ mb: 2 }}>
          Waiting for FSR data from WebSocket...
        </Typography>
      )}

      {hasData && (
        <Typography variant="body2" sx={{ mb: 2 }}>
          Last update: {getTimestamp()}
          {debug && (
            <Box
              component="button"
              onClick={handleDebugClick}
              sx={{
                ml: 2,
                border: "1px solid #ccc",
                borderRadius: "4px",
                p: "4px 8px",
                backgroundColor: "#f5f5f5",
                cursor: "pointer",
              }}
            >
              Log Debug Info
            </Box>
          )}
        </Typography>
      )}

      <GridContainer sx={{ width: WIDTH, height: HEIGHT }}>
        {/* Container for clipping and masking */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          {/* Insole shape mask to clip the heatmap */}
          <svg
            width="100%"
            height="100%"
            style={{ position: "absolute", top: 0, left: 0 }}
          >
            <defs>
              <clipPath id="insolePath">
                <path d={getInsolePath()} />
              </clipPath>
            </defs>
          </svg>

          {/* Grid cells with clipping applied */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              clipPath: "url(#insolePath)",
            }}
          >
            {grid.length > 0 &&
              grid.map((row, rowIndex) => (
                <React.Fragment key={`row-${rowIndex}`}>
                  {row.map((value, colIndex) => (
                    <ColorCell
                      key={`${rowIndex}-${colIndex}`}
                      color={getColor(value)}
                      sx={{
                        left: colIndex * CELL_SIZE,
                        top: rowIndex * CELL_SIZE,
                        width: CELL_SIZE,
                        height: CELL_SIZE,
                      }}
                    />
                  ))}
                </React.Fragment>
              ))}
          </Box>
        </Box>

        {/* SVG outline of the insole */}
        <svg
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >
          <path d={getInsolePath()} fill="none" stroke="#333" strokeWidth="2" />

          {/* Display sensor positions */}
          {sensorPositions.map(([row, col], index) => (
            <circle
              key={index}
              cx={col * CELL_SIZE + CELL_SIZE / 2}
              cy={row * CELL_SIZE + CELL_SIZE / 2}
              r={CELL_SIZE / 3}
              stroke="#000"
              strokeWidth="2"
              fill="none"
            />
          ))}
        </svg>
      </GridContainer>

      <ColorLegend>
        <Typography variant="h6" sx={{ fontWeight: "medium", mb: 1 }}>
          Pressure Distribution
        </Typography>
        <LegendBar>
          {Array(40)
            .fill()
            .map((_, i) => (
              <Box
                key={i}
                sx={{
                  flexGrow: 1,
                  backgroundColor: getColor(i * (4095 / 39)),
                }}
              />
            ))}
        </LegendBar>
        <LegendLabel>
          <Typography variant="caption">0</Typography>
          <Typography variant="caption">1023</Typography>
          <Typography variant="caption">2047</Typography>
          <Typography variant="caption">3071</Typography>
          <Typography variant="caption">4095</Typography>
        </LegendLabel>
      </ColorLegend>

      <Box sx={{ mt: 3, width: "100%", maxWidth: "500px" }}>
        <Typography variant="h6" sx={{ fontWeight: "medium", mb: 1 }}>
          Sensor Readings
        </Typography>
        <Grid container spacing={1}>
          {sensorValues.map((value, index) => (
            <Grid item xs={3} key={index}>
              <SensorReading>
                <SensorColorIndicator color={getColor(value)} />
                <Typography variant="caption">
                  FSR{index + 1}: {value}
                </Typography>
              </SensorReading>
            </Grid>
          ))}
        </Grid>
      </Box>
    </HeatmapContainer>
  );
};

export default InsoleHeatmap;
