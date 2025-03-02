import React, { useState, useEffect, useRef, useMemo } from "react";
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
  // Canvas refs
  const heatmapCanvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);

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
      { value: 2, color: { r: 0, g: 255, b: 0 } }, // Green
      { value: 6, color: { r: 255, g: 255, b: 0 } }, // Yellow
      { value: 10, color: { r: 255, g: 165, b: 0 } }, // Orange
    ],
    // Grid dimensions - REDUCED for better performance
    grid: {
      rows: 29, // Reduced from 58
      cols: 9, // Reduced from 17
      cellSize: 10, // Increased from 5
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

  // Store the insole path for reuse
  const insolePathRef = useRef(null);

  // Sensor positions - adjusted for the new grid size
  const sensorPositions = useMemo(() => {
    // Scale factor for converting from old grid to new grid
    const rowScale = 29 / 58; // If changing from 58 to 29 rows
    const colScale = 9 / 17; // If changing from 17 to 9 cols

    return [
      [Math.floor(30 * rowScale), Math.floor(5 * colScale)], // FSR1
      [Math.floor(38 * rowScale), Math.floor(6 * colScale)], // FSR2
      [Math.floor(49 * rowScale), Math.floor(13 * colScale)], // FSR3
      [Math.floor(49 * rowScale), Math.floor(8 * colScale)], // FSR4
      [Math.floor(21 * rowScale), Math.floor(4 * colScale)], // FSR5
      [Math.floor(13 * rowScale), Math.floor(3 * colScale)], // FSR6
      [Math.floor(6 * rowScale), Math.floor(3 * colScale)], // FSR7
      [Math.floor(5 * rowScale), Math.floor(10 * colScale)], // FSR8
      [Math.floor(13 * rowScale), Math.floor(8 * colScale)], // FSR9
      [Math.floor(38 * rowScale), Math.floor(10 * colScale)], // FSR10
      [Math.floor(30 * rowScale), Math.floor(9 * colScale)], // FSR11
      [Math.floor(21 * rowScale), Math.floor(9 * colScale)], // FSR12
      [Math.floor(38 * rowScale), Math.floor(14 * colScale)], // FSR13
      [Math.floor(30 * rowScale), Math.floor(14 * colScale)], // FSR14
      [Math.floor(21 * rowScale), Math.floor(15 * colScale)], // FSR15
      [Math.floor(13 * rowScale), Math.floor(13 * colScale)], // FSR16
    ];
  }, []);

  // Initial sensor values
  const [sensorValues, setSensorValues] = useState(Array(16).fill(0));

  // Phase label state
  const [phaseLabel, setPhaseLabel] = useState("Waiting for data");

  // Precompute weights for interpolation - major performance improvement
  const precomputedWeights = useMemo(() => {
    const weights = [];
    for (let row = 0; row < ROWS; row++) {
      weights[row] = [];
      for (let col = 0; col < COLS; col++) {
        const cellWeights = [];
        let totalWeight = 0;

        for (let i = 0; i < sensorPositions.length; i++) {
          const [sensorRow, sensorCol] = sensorPositions[i];
          // Calculate Euclidean distance
          const distance = Math.sqrt(
            Math.pow(row - sensorRow, 2) + Math.pow(col - sensorCol, 2)
          );
          // Avoid division by zero and set a maximum influence distance
          const weight = distance < 0.1 ? 100 : 1 / Math.pow(distance, 2);
          cellWeights.push(weight);
          totalWeight += weight;
        }

        weights[row][col] = {
          weights: cellWeights,
          totalWeight,
        };
      }
    }
    return weights;
  }, [ROWS, COLS, sensorPositions]);

  // Function to map a value to a color with smooth gradient
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

        return [r, g, b];
      }
    }

    // If we're beyond the last threshold, return the last color
    const lastColor =
      CONFIG.colorThresholds[CONFIG.colorThresholds.length - 1].color;
    return [lastColor.r, lastColor.g, lastColor.b];
  };

  // Return RGB color string for display
  const getRgbString = (colorArray) => {
    return `rgb(${colorArray[0]}, ${colorArray[1]}, ${colorArray[2]})`;
  };

  // Function to perform radial interpolation - optimized version
  const interpolateGrid = () => {
    // Create a typed array for better performance
    const values = new Float32Array(ROWS * COLS);

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const index = row * COLS + col;
        const { weights, totalWeight } = precomputedWeights[row][col];

        let weightedSum = 0;
        for (let i = 0; i < sensorValues.length; i++) {
          weightedSum += sensorValues[i] * weights[i];
        }

        values[index] = weightedSum / totalWeight;
      }
    }

    // Ensure exact sensor values at sensor positions
    for (let i = 0; i < sensorPositions.length; i++) {
      const [row, col] = sensorPositions[i];
      const index = row * COLS + col;
      if (index >= 0 && index < values.length) {
        values[index] = sensorValues[i];
      }
    }

    return values;
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

  // Initialize insole path once
  useEffect(() => {
    insolePathRef.current = new Path2D(getInsolePath());
  }, [WIDTH, HEIGHT]);

  // Update sensor values from WebSocket data
  useEffect(() => {
    if (fsrData && fsrData.length > 0) {
      // Get the latest FSR readings
      const latestData = fsrData[fsrData.length - 1];

      // Create a new array with the values from FSR_1 to FSR_16
      const newValues = Array(16)
        .fill(0)
        .map((_, index) => {
          const sensorKey = `FSR_${index + 1}`;
          // Convert value to number and handle negative values
          return Math.max(0, Number(latestData[sensorKey] || 0));
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

  // Draw the heatmap on canvas - FIXED MASKING ISSUE
  useEffect(() => {
    const heatmapCanvas = heatmapCanvasRef.current;
    const overlayCanvas = overlayCanvasRef.current;

    if (!heatmapCanvas || !overlayCanvas || !insolePathRef.current) return;

    // Get the contexts
    const heatmapCtx = heatmapCanvas.getContext("2d");
    const overlayCtx = overlayCanvas.getContext("2d");

    // Clear canvases
    heatmapCtx.clearRect(0, 0, WIDTH, HEIGHT);
    overlayCtx.clearRect(0, 0, WIDTH, HEIGHT);

    // Draw insole outline on overlay canvas
    overlayCtx.save();
    overlayCtx.strokeStyle = "#333";
    overlayCtx.lineWidth = 2;
    overlayCtx.stroke(insolePathRef.current);
    overlayCtx.restore();

    // Draw sensor positions
    sensorPositions.forEach(([row, col], index) => {
      overlayCtx.save();
      overlayCtx.beginPath();
      overlayCtx.arc(
        col * CELL_SIZE + CELL_SIZE / 2,
        row * CELL_SIZE + CELL_SIZE / 2,
        CELL_SIZE / 3,
        0,
        2 * Math.PI
      );
      overlayCtx.strokeStyle = "#000";
      overlayCtx.stroke();
      overlayCtx.restore();
    });

    // Draw heatmap only if we have sensor values
    if (sensorValues.some((val) => val > 0)) {
      // Get interpolated grid data
      const gridData = interpolateGrid();

      // Create a temporary canvas for drawing the heatmap
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = WIDTH;
      tempCanvas.height = HEIGHT;
      const tempCtx = tempCanvas.getContext("2d");

      // Draw the heatmap on the temporary canvas
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const value = gridData[row * COLS + col];
          const [r, g, b] = getColor(value);

          tempCtx.fillStyle = `rgba(${r},${g},${b},0.8)`;
          tempCtx.fillRect(
            col * CELL_SIZE,
            row * CELL_SIZE,
            CELL_SIZE,
            CELL_SIZE
          );
        }
      }

      // Draw the masked heatmap
      heatmapCtx.save();

      // Important: Clip to the insole path first
      heatmapCtx.beginPath();
      heatmapCtx.clip(insolePathRef.current);

      // Now draw the heatmap only within the clipped area
      heatmapCtx.drawImage(tempCanvas, 0, 0);

      heatmapCtx.restore();
    }
  }, [sensorValues, WIDTH, HEIGHT, ROWS, COLS, CELL_SIZE, sensorPositions]);

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
        {/* Canvas for heatmap */}
        <canvas
          ref={heatmapCanvasRef}
          width={WIDTH}
          height={HEIGHT}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />

        {/* Canvas for overlay (insole outline, sensor positions) */}
        <canvas
          ref={overlayCanvasRef}
          width={WIDTH}
          height={HEIGHT}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
          }}
        />
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
              const colorArray = getColor(value);
              return (
                <Box
                  key={i}
                  sx={{
                    flexGrow: 1,
                    backgroundColor: `rgb(${colorArray[0]}, ${colorArray[1]}, ${colorArray[2]})`,
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
                <SensorColorIndicator color={getRgbString(getColor(value))} />
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
