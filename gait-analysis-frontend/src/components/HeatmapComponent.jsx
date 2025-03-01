import React, { useEffect, useRef } from "react";
import heatmap from "heatmap.js"; // Import Heatmap.js

const HeatmapComponent = ({ data }) => {
  const heatmapContainer = useRef(null); // Reference to the container element

  useEffect(() => {

    console.log("Data fetched or component mounted");

    if (!data || data.length === 0) {
        console.log("No data for heatmap");


        return;
    }

    // check structure of data
    console.log("Heatmap Data Received:", data);

    // Initialize the heatmap
    const heatmapInstance = heatmap.create({
      container: heatmapContainer.current, // Set the container for the heatmap
      radius: 50, // Radius of the circles in the heatmap
      maxOpacity: 0.6,
      minOpacity: 0.2,
      blur: 0.85, // Blur intensity of the heatmap
    });

    // Set the data for the heatmap
    heatmapInstance.setData({
      max: 100, // Maximum value for the pressure (this can be adjusted dynamically)
      min: 0,   // Minimum value for the pressure
      data: data, // The data points to display on the heatmap
    });

    return () => {
      // Cleanup the heatmap instance when the component unmounts
      // heatmapInstance.destroy();
      if (heatmapInstance) {

        heatmapInstance.setData({
            max: 0,
            min: 0,
            data: [],
        });
      }
    };
  }, [data]); // Re-render if the data changes

  return (
    <div
      ref={heatmapContainer}
      style={{
        width: "100%",  // Adjust the size of the heatmap container
        height: "500px", // Adjust the size of the heatmap container
        position: "relative",
        backgroundColor: "#f0f0f0", // Background color of the container
      }}
    ></div>
  );
};

export default HeatmapComponent;
