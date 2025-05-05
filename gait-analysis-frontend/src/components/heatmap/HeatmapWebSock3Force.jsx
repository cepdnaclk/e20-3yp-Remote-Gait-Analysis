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

const HeatmapWebSock3Force = () => {
  // ==============================================
  // CONFIGURABLE PARAMETERS - EASY TO MODIFY
  // ==============================================
  const CONFIG = {
    // Pressure range
    pressureRange: {
      min: 0,
      max: 10,
    },
    // Color thresholds (values and corresponding colors)
    colorThresholds: [
      { value: 0, color: { r: 0, g: 0, b: 255 } }, // Blue
      { value: 1, color: { r: 0, g: 255, b: 0 } }, // Green
      { value: 4, color: { r: 255, g: 255, b: 0 } }, // Yellow
      { value: 10, color: { r: 255, g: 165, b: 0 } }, // Orange
    ],
    // Grid dimensions
    grid: {
      rows: 58,
      cols: 17,
      cellSize: 5,
    },
    // Gait phase detection thresholds
    gaitPhase: {
      minPressure: 0.5, // Minimum total pressure to detect stance phase
    },
  };
  // ==============================================

  const { fsrData } = useWebSocket(
    "wss://8f8nk7hq11.execute-api.eu-north-1.amazonaws.com/POC/"
  );

  // Grid dimensions
  const { rows: ROWS, cols: COLS, cellSize: CELL_SIZE } = CONFIG.grid;

  // Calculate actual dimensions
  const WIDTH = COLS * CELL_SIZE;
  const HEIGHT = ROWS * CELL_SIZE;

  // Sensor positions remain the same
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

  // Initial sensor values
  const [sensorValues, setSensorValues] = useState(Array(16).fill(0));

  // State for the interpolated grid
  const [grid, setGrid] = useState([]);

  // Phase label state
  const [phaseLabel, setPhaseLabel] = useState("Waiting for data");

  // Function to map a value to a color with smooth gradient using the configurable thresholds
  const getColor = (value) => {
    // Clamp the value between min and max
    const { min, max } = CONFIG.pressureRange;
    const clampedValue = Math.max(min, Math.min(max, value));

    // Find the appropriate color segment
    for (let i = 1; i < CONFIG.colorThresholds.length; i++) {
      const prevThreshold = CONFIG.colorThresholds[i - 1];
      const nextThreshold = CONFIG.colorThresholds[i];

      if (clampedValue <= nextThreshold.value) {
        // Calculate the ratio within this segment
        const range = nextThreshold.value - prevThreshold.value;
        const ratio =
          range === 0 ? 0 : (clampedValue - prevThreshold.value) / range;

        // Interpolate between the two colors
        const r = Math.floor(
          prevThreshold.color.r +
            ratio * (nextThreshold.color.r - prevThreshold.color.r)
        );
        const g = Math.floor(
          prevThreshold.color.g +
            ratio * (nextThreshold.color.g - prevThreshold.color.g)
        );
        const b = Math.floor(
          prevThreshold.color.b +
            ratio * (nextThreshold.color.b - prevThreshold.color.b)
        );

        return `rgb(${r}, ${g}, ${b})`;
      }
    }

    // If we're beyond the last threshold, return the last color
    const lastColor =
      CONFIG.colorThresholds[CONFIG.colorThresholds.length - 1].color;
    return `rgb(${lastColor.r}, ${lastColor.g}, ${lastColor.b})`;
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

  // Update sensor values from WebSocket data
  useEffect(() => {
    console.log(fsrData);
    if (fsrData && fsrData.length > 0) {
      // Get the latest FSR readings
      const latestData = fsrData[fsrData.length - 1];

      // Log the incoming data for debugging
      console.log("Latest FSR data:", latestData);

      // Create a new array with the values from FSR_1 to FSR_16
      const newValues = Array(16)
        .fill(0)
        .map((_, index) => {
          const sensorKey = `FSR_${index + 1}`;
          // Convert value to number
          let value = Number(latestData[sensorKey] || 0);

          // Handle negative values by setting them to 0
          if (value < 0) value = 0;

          // Use the value directly in the 0-10 range
          return value;
        });

      // Update sensor values
      setSensorValues(newValues);

      // Determine gait phase based on pressure pattern
      const totalPressure = newValues.reduce((sum, val) => sum + val, 0);
      const heelPressure =
        newValues[0] + newValues[1] + newValues[2] + newValues[3];
      const midPressure =
        newValues[4] + newValues[5] + newValues[10] + newValues[11];
      const toePressure =
        newValues[6] + newValues[7] + newValues[14] + newValues[15];

      // Simple gait phase detection based on pressure distribution
      if (totalPressure < CONFIG.gaitPhase.minPressure) {
        setPhaseLabel("Swing Phase (No Pressure)");
      } else if (heelPressure > midPressure && heelPressure > toePressure) {
        setPhaseLabel("Heel Strike");
      } else if (midPressure > heelPressure && midPressure > toePressure) {
        setPhaseLabel("Midfoot Loading");
      } else if (toePressure > midPressure && toePressure > heelPressure) {
        setPhaseLabel("Toe Push-off");
      } else {
        setPhaseLabel("Pressure Detected");
      }
    }
  }, [fsrData]);

  // Update grid when sensor values change
  useEffect(() => {
    setGrid(interpolateGrid());
  }, [sensorValues]);

  // Generate legend labels based on color thresholds
  const generateLegendLabels = () => {
    return CONFIG.colorThresholds.map((threshold) => (
      <Typography key={threshold.value} variant="caption">
        {threshold.value}
      </Typography>
    ));
  };

  return (
    <HeatmapContainer>
      <HeatmapTitle variant="h5">Insole Pressure Heatmap</HeatmapTitle>

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
        <Typography variant="body2" align="center" sx={{ mb: 1 }}>
          {phaseLabel}
        </Typography>
        <LegendBar>
          {Array(40)
            .fill()
            .map((_, i) => {
              const value = i * (CONFIG.pressureRange.max / 39);
              return (
                <Box
                  key={i}
                  sx={{
                    flexGrow: 1,
                    backgroundColor: getColor(value),
                  }}
                />
              );
            })}
        </LegendBar>
        <LegendLabel>{generateLegendLabels()}</LegendLabel>
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
                  FSR{index + 1}: {value.toFixed(2)}
                </Typography>
              </SensorReading>
            </Grid>
          ))}
        </Grid>
      </Box>
    </HeatmapContainer>
  );
};

export default HeatmapWebSock3Force;
