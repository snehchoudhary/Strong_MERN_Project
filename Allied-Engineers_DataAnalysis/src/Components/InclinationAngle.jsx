
// import React, { useContext } from "react";
// import { Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { FileContext } from "./FileContext";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

// // Helper function to parse numbers safely
// const parseNumber = (val) => {
//   if (val === undefined || val === null) return null;
//   let cleaned = val.toString().trim().replace(/,/g, "");
//   let num = Number(cleaned);
//   return isNaN(num) ? null : num;
// };

// // Helper to find the right column name from possible variations
// const findColumn = (row, possibleNames) => {
//   const keys = Object.keys(row);
//   for (let name of possibleNames) {
//     const match = keys.find((key) => key.toLowerCase().trim() === name.toLowerCase().trim());
//     if (match) return match;
//   }
//   return null;
// };

// const InclinationAngleChart = () => {
//   const { fileDataICE } = useContext(FileContext);

//   const filteredData = Array.isArray(fileDataICE)
//     ? fileDataICE.filter(
//         (row) =>
//           parseNumber(row["Chainage (m)"]) !== null &&
//           parseNumber(row["Elevation (m)"]) !== null
//       )
//     : [];

//   // Dynamically resolve column keys
//   const elevationProfileKey =
//     filteredData.length > 0
//       ? findColumn(filteredData[0], [
//           "elevation profile angles",
//           "elevation_profile_angles",
//           "Elevation profile angle",
//         ])
//       : null;

//   const dgCriticalKey =
//     filteredData.length > 0
//       ? findColumn(filteredData[0], [
//           "dg critical angle",
//           "dg_critical_angle",
//           "DG critical angle",
//         ])
//       : null;

//   // Elevation Points
//   const elevationPoints = filteredData
//     .map((row) => ({
//       x: parseNumber(row["Chainage (m)"]),
//       y: parseNumber(row["Elevation (m)"]),
//     }))
//     .filter(
//       (point) =>
//         !isNaN(point.x) && !isNaN(point.y) && point.x !== 0 // Skip chainage 0
//     );

//   // DG Critical Points
//   const dgCriticalPoints =
//     dgCriticalKey !== null
//       ? filteredData
//           .map((row) => ({
//             x: parseNumber(row["Chainage (m)"]),
//             y: parseNumber(row[dgCriticalKey]),
//           }))
//           .filter(
//             (point) =>
//               !isNaN(point.x) && !isNaN(point.y) && point.x !== 0
//           )
//       : [];

//   // Elevation Profile Points
//   const elevationProfilePoints =
//     elevationProfileKey !== null
//       ? filteredData
//           .map((row) => ({
//             x: parseNumber(row["Chainage (m)"]),
//             y: parseNumber(row[elevationProfileKey]),
//           }))
//           .filter(
//             (point) =>
//               !isNaN(point.x) && !isNaN(point.y) && point.x !== 0
//           )
//       : [];


//       console.log("ElevationProfileKey:", elevationProfilePoints);
// console.log("DG Critical Key:", dgCriticalPoints);

//   const data = {
//     datasets: [
//       {
//         label: "Elevation (m)",
//         data: elevationPoints,
//         borderColor: "black",
//         backgroundColor: "black",
//         yAxisID: "y1",
//         fill: false,
//         spanGaps: false,
//         pointRadius: 0,
//         borderWidth: 2,
      
//       },
//       {
//         label: "DG critical angle",
//         data: dgCriticalPoints,
//         borderColor: "#24db0f",
//         backgroundColor: "#24db0f",
//         yAxisID: "y2",
//         fill: false,
//         spanGaps: false,
//         pointRadius: 2,
//         borderWidth: 0,
//         showLine: false,
//       },
//       {
//         label: "Elevation profile angle",
//         data: elevationProfilePoints,
//         borderColor: "red",
//         backgroundColor: "red",
//         yAxisID: "y2",
//         fill: false,
//         spanGaps: false,
//         pointRadius: 2,
//         borderWidth: 0,
//         showLine: false,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     interaction: { mode: "index", intersect: false },
//     stacked: false,
//     plugins: {
//       legend: { position: "top" },
//       title: {
//         display: true,
//         text: "Elevation & Inclination Angles vs Chainage",
//       },
//     },
//     scales: {
//       x: {
//         type: "linear",
//         title: { display: true, text: "Chainage (m)" },
//       },
//       y1: {
//         type: "linear",
//         display: true,
//         position: "left",
//         title: { display: true, text: "Elevation (m)" },
//       },
//       y2: {
//         type: "linear",
//         display: true,
//         position: "right",
//         grid: { drawOnChartArea: false },
//         title: {
//           display: true,
//           text: "DG Critical Angle & Elevation Profile Angle",
//         },
//       },
//     },
//   };


//   console.log("X values:", elevationProfilePoints.map(d => d.x));
// console.log("Y values:", elevationProfilePoints.map(d => d.value));


//   return (
//     <div
//       style={{
//         maxWidth: "100%",
//         margin: "21px auto",
//         padding: "2rem",
//         backgroundColor: "#ffffff",
//         borderRadius: "10px",
//         boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
//       }}
//     >
//       <h2>Inclination Angle</h2>
//       {Array.isArray(fileDataICE) && fileDataICE.length > 0 ? (
//         <Line data={data} options={options} />
//       ) : (
//         <p>No data available</p>
//       )}

//       {/* Button to show chunks */}
//       <div style={{ marginTop: "2rem", marginBottom: "1rem" }}>
//         <button
//           style={{ fontSize: "18px", cursor: "pointer" }}
//           onClick={() => {
//             const input = prompt("Enter chunk size in meters: ");
//             if (input && !isNaN(input)) {
//               window.open(`/inclinationAngle-chunks?chunk=${input}`, "_blank");
//             }
//           }}
//         >
//           Show Section-wise Charts
//         </button>
//       </div>
//     </div>
//   );
// };

// export default InclinationAngleChart;




import React, { useContext } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { FileContext } from "./FileContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Helper function to parse numbers safely
const parseNumber = (val) => {
  if (val === undefined || val === null) return null;
  let cleaned = val.toString().trim().replace(/,/g, "");
  let num = Number(cleaned);
  return isNaN(num) ? null : num;
};

// Helper to find the right column name from possible variations
const findColumn = (row, possibleNames) => {
  const keys = Object.keys(row);
  for (let name of possibleNames) {
    const match = keys.find(
      (key) => key.toLowerCase().trim() === name.toLowerCase().trim()
    );
    if (match) return match;
  }
  return null;
};

const InclinationAngleChart = () => {
  const { fileDataICE } = useContext(FileContext);

  // clean + filter
  const cleanData = Array.isArray(fileDataICE)
    ? fileDataICE.map((row) => {
        const cleaned = {};
        Object.keys(row).forEach((key) => {
          cleaned[key.trim()] = row[key];
        });
        return cleaned;
      })
    : [];

  const validData = cleanData
    .filter(
      (row) =>
        parseNumber(row["Chainage (m)"]) !== null &&
        parseNumber(row["Elevation (m)"]) !== null
    )
    .sort(
      (a, b) => parseNumber(a["Chainage (m)"]) - parseNumber(b["Chainage (m)"])
    );

  // Column keys
  const elevationProfileKey =
    validData.length > 0
      ? findColumn(validData[0], [
          "elevation profile angles",
          "elevation_profile_angles",
          "Elevation profile angle",
        ])
      : null;

  const dgCriticalKey =
    validData.length > 0
      ? findColumn(validData[0], [
          "dg critical angle",
          "dg_critical_angle",
          "DG critical angle",
        ])
      : null;

  // Labels (X axis = chainage)
  const labels = validData.map((row) =>
    parseNumber(row["Chainage (m)"]).toFixed(2)
  );

  // Data arrays for each dataset
  const elevationValues = validData.map((row) =>
    parseNumber(row["Elevation (m)"])
  );

  const dgCriticalValues =
    dgCriticalKey !== null
      ? validData.map((row) => parseNumber(row[dgCriticalKey]))
      : [];

  const elevationProfileValues =
    elevationProfileKey !== null
      ? validData.map((row) => parseNumber(row[elevationProfileKey]))
      : [];

  const data = {
    labels,
    datasets: [
      {
        label: "Elevation (m)",
        data: elevationValues,
        borderColor: "black",
        backgroundColor: "black",
        yAxisID: "y1",
        pointRadius: 0,
        borderWidth: 2,
      },
       {
        label: "DG Critical Angle",
        data: dgCriticalValues,
        borderColor: "#24db0f",
        backgroundColor: "#24db0f",
        yAxisID: "y2",
        pointRadius: 0,
        borderWidth: 2,
      },
      // {
      //   label: "DG critical angle",
      //   data: dgCriticalValues,
      //   borderColor: "#24db0f",
      //   backgroundColor: "#24db0f",
      //   yAxisID: "y2",
      //   pointRadius: 0,
      //   borderWidth: 2,
      //   showLine: false,
      // },
      // {
      //   label: "Elevation profile angle",
      //   data: elevationProfileValues,
      //   borderColor: "red",
      //   backgroundColor: "red",
      //   yAxisID: "y2",
      //   pointRadius: 0,
      //   borderWidth: 2,
        
      // },

      {
        label: "Elevation Profile Angle",
        data: elevationProfileValues,
        borderColor: "red",
        backgroundColor: "red",
        yAxisID: "y2",
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: { mode: "index", intersect: false },
    stacked: false,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Elevation & Inclination Angles vs Chainage",
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Chainage (m)" },
      },
      y1: {
        type: "linear",
        display: true,
        position: "left",
        title: { display: true, text: "Elevation (m)" },
      },
      y2: {
        type: "linear",
        display: true,
        position: "right",
        grid: { drawOnChartArea: false },
        title: {
          display: true,
          text: "DG Critical Angle & Elevation Profile Angle",
        },
      },
    },
  };

  return (
    <div
      style={{
        maxWidth: "100%",
        margin: "21px auto",
        padding: "2rem",
        backgroundColor: "#ffffff",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
      }}
    >
      <h2>Inclination Angle</h2>
      {validData.length > 0 ? (
        <Line data={data} options={options} />
      ) : (
        <p>No data available</p>
      )}

           {/* Button to show chunks */}
      <div style={{ marginTop: "2rem", marginBottom: "1rem" }}>
        <button
          style={{ fontSize: "18px", cursor: "pointer" }}
          onClick={() => {
            const input = prompt("Enter chunk size in meters: ");
            if (input && !isNaN(input)) {
              window.open(`/elevationprofile-chunks?chunk=${input}`, "_blank");
            }
          }}
        >
          Show Section-wise Charts
        </button>
      </div>
    </div>
  );
};

export default InclinationAngleChart;

