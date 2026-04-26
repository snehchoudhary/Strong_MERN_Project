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

// const ElevationChart = () => {
//   const { fileDataICE } = useContext(FileContext);
//   const navigate = useNavigate();

//   console.log('ElevationChart fileDataICE:', fileDataICE);

//   const xKey = 'Chainage (m)';
//   const yKey1 = 'Elevation (m)';
//   const yKey2 = 'Water Holdup (ABBL)';

//   // Clean and trim column headers (just in case)
//   let cleanData = fileDataICE.map(row => {
//     const cleaned = {};
//     Object.keys(row).forEach(key => {
//       cleaned[key.trim()] = row[key];
//     });
//     return cleaned;
//   });

//   // Sort cleanData by Chainage (m) numerically ascending
//   cleanData = cleanData.sort((a, b) => Number(a[xKey]) - Number(b[xKey]));

//   const elevationValues = cleanData.map(row => ({ x: Number(row[xKey]), y: Number(row[yKey1]) }));
//   const hlValues = cleanData.map(row => ({ x: Number(row[xKey]), y: Number(row[yKey2]) }));

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
//         data: hlValues,
//         fill: false,
//         borderColor: '#FF00FF',
//         backgroundColor: '#FF00FF',
//         tension: 0.4,
//         yAxisID: 'y1', //Secondary Axis
//         pointRadius: 4,
//         borderWidth: 0,
//         showLine: false,
//         pointHoverRadius: 5,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     mainAspectRation: false,
//     plugins: {
//       title: {
//         display: true,
//         text: `Elevation & HL vs Chainage`,
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
//       },
//       y: {
//         display: true,
//         position: 'left',
//         title: {
//           display: true,
//           text: yKey1,  //Elevation
//         },
//       },

//       y1: {
//         display: true,
//         position: 'right',
//         title: {
//           display: true,
//           text: yKey2, //HL
//         },
//         grid: {
//           drawOnChartArea: false,  //avoids overlaps of grid lines
//         },
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
//       <h2>Liquid Hold-Up</h2>
//       {fileDataICE.length > 0 ? <Line data={chartData} options={options} /> :null}

//        {/* Button to show chunks */}

//       <div style={{ marginTop: '2rem', marginBottom: '1rem' }}>
//         <button style={{fontSize: '18px', cursor: 'pointer'}} onClick={() => {
//           const input = prompt('Enter chunk size in meters: ');
//           if (input && !isNaN(input)) {
//             window.open(`/rolledUp-chunks?chunk=${input}`, '_blank');
//           }
//         }}>
//           Show Section-wise Charts
//         </button>
//       </div>
//   </div>
//   );
// };

// export default ElevationChart;





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
  Legend,
);

// Helper function to parse numbers safely
const parseNumber = (val) => {
  if (val === undefined || val === null) return null;
  let cleaned = val.toString().trim().replace(/,/g, "");
  let num = Number(cleaned);
  return isNaN(num) ? null : num;
};

const ElevationChart = () => {
  const { fileDataICE } = useContext(FileContext);

  // ✅ Clean + filter + sort by chainage
  const filteredData = Array.isArray(fileDataICE)
    ? fileDataICE
        .filter(
          (row) =>
            parseNumber(row["Chainage (m)"]) !== null &&
            parseNumber(row["Elevation (m)"]) !== null &&
            parseNumber(row["HL (Abbls)"]) !== null
        )
        .sort(
          (a, b) =>
            parseNumber(a["Chainage (m)"]) -
            parseNumber(b["Chainage (m)"])
        )
    : [];



  // Elevation points (with rounded chainage)
  const elevationPoints = filteredData.map((row) => ({
    x: Number(parseNumber(row["Chainage (m)"]).toFixed(2)),
    y: parseNumber(row["Elevation (m)"]),
  }));

  // Water holdup points (with rounded chainage)
  const waterHoldUpPoints = filteredData.map((row) => ({
    x: Number(parseNumber(row["Chainage (m)"]).toFixed(2)),
    y: parseNumber(row["HL (Abbls)"]),
  }));

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
        label: "HL (Abbls)",
        data: waterHoldUpPoints,
        borderColor: "#1c95e6",
        backgroundColor: "#1c95e6",
        yAxisID: "y2",
        fill: false,
        pointRadius: 4,
        borderWidth: 0,
        showLine: false,
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: { mode: "index", intersect: false },
    stacked: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Elevation & Water HoldUp vs Chainage" },
    },
    scales: {
      x: {
        type: "linear",
        title: { display: true, text: "Chainage (m)" },
        ticks: {
          stepSize: 100, // ✅ you can adjust (e.g., 50, 200)
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
        title: { display: true, text: "HL (Abbls)" },
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
      <h2>Liquid HoldUp</h2>
      
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
              window.open(`/rolledUp-chunks?chunk=${input}`, "_blank");
            }
          }}
        >
          Show Section-wise Charts
        </button>
      </div>
    </div>
  );
};

export default ElevationChart;

