// import React, { useContext } from 'react';
// import { FileContext } from './FileContext';
// import { Line } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import annotationPlugin from 'chartjs-plugin-annotation';
// import {useNavigate} from 'react-router-dom';


// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   annotationPlugin
// );

// const FlowRegimeChart = () => {
//   const { fileDataICE } = useContext(FileContext);
//   const navigate = useNavigate();

// //   console.log('ElevationChart fileDataICE:', fileDataICE);

//   const xKey = 'Chainage (m)';
//   const yKey1 = 'Elevation (m)';
//   const yKey2 = 'FLOW REGIME';

//   // Clean and trim column headers (just in case)
//   const cleanData = fileDataICE.map(row => {
//     const cleaned = {};
//     Object.keys(row).forEach(key => {
//       cleaned[key.trim()] = row[key];
//     });
//     return cleaned;
//   });

//   const elevationValues = cleanData.map(row => ({ x: Number(row[xKey]), y: Number(row[yKey1]) }));
//   const flowRegimeValues = cleanData.map(row => ({ x: Number(row[xKey]), y: Number(row[yKey2]) }));

//   const chartData = {
//     datasets: [
//       {
//         label: `${yKey1} `,
//         data: elevationValues,
//         fill: false,
//         borderColor: 'rgba(1, 6, 6, 1)',
//         backgroundColor: 'rgba(1, 6, 6, 1)',
//         tension: 0.4,
//         yAxisID: 'y', //Primary Axis
//         pointRadius: 0,
//       },

//       {
//         label: `${yKey2} `,
//         data: flowRegimeValues,
//         fill: false,
//         borderColor: '#FF00FF',
//         backgroundColor: '#FF00FF',
//         stepped: 'middle',
//         tension: 0,
//         yAxisID: 'y1', //Secondary Axis
//         pointRadius: 0,
        
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     mainAspectRation: false,
//     plugins: {
//       title: {
//         display: true,
//         text: `Elevation & Flow Regime vs Chainage`,
//       },
//       legend: {
//         display: true,
//       },
//     },

//     scales: {
//       x: {
//         type: 'linear',
//         position: 'bottom',
//         title: {
//           display: true,
//           text: xKey,
//         },
//         grid: {
//           color: '#e0e0e0',
//         },
//       },
//       y: {
//         display: true,
//         position: 'left',
//         title: {
//           display: true,
//           text: yKey1,  //Elevation
//         },
//         grid: {
//           color: '#f0f0f0',
//         },
//       },

//       y1: {
//         display: true,
//         position: 'right',
//         title: {
//           display: true,
//           text: yKey2, //Flow Regime
//         },
//         grid: {
//           drawOnChartArea: false,  //avoids overlaps of grid lines
//           color: '#f0f0f0',
//         },
//         min: Math.min(...flowRegimeValues.map(p => p.y)) - 0.5,
//         max: Math.max(...flowRegimeValues.map(p => p.y)) + 0.5,
//       },
//     },
//   };

//   return (
//     <div style = {{ maxWidth: '100%',
//       margin: '21px auto',
//       padding: '2rem',
//       backgroundColor: '#ffffff',
//       borderRadius: '10px',
//       boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
//     }}>
//       <h2>Flow Regime</h2>
//       {fileDataICE.length > 0 ? <Line data={chartData} options={options} /> :null}

//        {/* Button to show chunks */}

//       <div style={{ marginTop: '2rem', marginBottom: '1rem' }}>
//         <button style={{fontSize: '18px', cursor: 'pointer'}} onClick={() => {
//           const input = prompt('Enter chunk size in meters: ');
//           if (input && !isNaN(input)) {
//             window.open(`/flowRegime-chunks?chunk=${input}`, '_blank');
//           }
//         }}>
//           Show Section-wise Charts
//         </button>
//       </div>
//   </div>
//   );
// };

// export default FlowRegimeChart;




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

const FlowRegime = () => {
  const { fileDataICE } = useContext(FileContext);

  // ✅ filter + sort by chainage
  const filteredData = Array.isArray(fileDataICE)
    ? fileDataICE
        .filter(
          (row) =>
            parseNumber(row["Chainage (m)"]) !== null &&
            parseNumber(row["Elevation (m)"]) !== null &&
            parseNumber(row["Flow regime"]) !== null
        )
        .sort(
          (a, b) =>
            parseNumber(a["Chainage (m)"]) -
            parseNumber(b["Chainage (m)"])
        )
    : [];

  // Elevation points with rounded chainage
  const elevationPoints = filteredData
    .map((row) => ({
      x: Number(parseNumber(row["Chainage (m)"]).toFixed(2)),
      y: parseNumber(row["Elevation (m)"]),
    }))
    .filter((point) => !isNaN(point.x) && !isNaN(point.y) && point.x !== 0);

  // Flow regime points with rounded chainage
  const flowRegimePoints = filteredData
    .map((row) => ({
      x: Number(parseNumber(row["Chainage (m)"]).toFixed(2)),
      y: parseNumber(row["Flow regime"]),
    }))
    .filter((point) => !isNaN(point.x) && !isNaN(point.y) && point.x !== 0);

  const data = {
    datasets: [
      {
        label: "Elevation (m)",
        data: elevationPoints,
        borderColor: "black",
        backgroundColor: "black",
        yAxisID: "y1",
        fill: false,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: "Flow regime",
        data: flowRegimePoints,
        borderColor: "red",
        backgroundColor: "red",
        borderDash: [5, 5],
        yAxisID: "y2",
        fill: false,
        pointRadius: 4,
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: { mode: "index", intersect: false },
    stacked: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Elevation & Flow Regime vs Chainage" },
    },
    scales: {
      x: {
        type: "linear",
        title: { display: true, text: "Chainage (m)" },
        ticks: {
          stepSize: 100, // ✅ adjust if needed (50, 200 etc.)
        },
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
        title: { display: true, text: "Flow Regime" },
        min: 1.8,
        max: 3.4,
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
      <h2>Flow Regime</h2>
      {filteredData.length > 0 ? (
        <Line data={data} options={options} />
      ) : (
        <p>No data available</p>
      )}

      {/* Section-wise charts button */}
      <div style={{ marginTop: "2rem", marginBottom: "1rem" }}>
        <button
          style={{ fontSize: "18px", cursor: "pointer" }}
          onClick={() => {
            const input = prompt("Enter chunk size in meters: ");
            if (input && !isNaN(input)) {
              window.open(`/flowregime-chunks?chunk=${input}`, "_blank");
            }
          }}
        >
          Show Section-wise Charts
        </button>
      </div>
    </div>
  );
};

export default FlowRegime;

