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

// const PressureChange = () => {
//   const { fileDataICE } = useContext(FileContext);
//   const navigate = useNavigate();

//   //console.log('PressureChange fileDataICE:', fileDataICE);

//   const xKey = 'Chainage (m)';
//   const yKey1 = 'Elevation (m)';
//   const yKey2 = 'Pressure change';

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
//   const pressureValues = cleanData.map(row => ({ x: Number(row[xKey]), y: Number(row[yKey2]) }));

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
//         label: `${yKey2}`,
//         data: pressureValues,
//         fill: false,
//         borderColor: '#24db0f',
//         backgroundColor: '#24db0f',
//         tension: 0.4,
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
//         text: `Elevation & Pressure Change vs Chainage`,
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
//           text: yKey2, //Pressure Change
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
//       <h2>Pressure Drop</h2>
//       {fileDataICE.length > 0 ? <Line data={chartData} options={options} /> :null}

//        {/* Button to show chunks */}

//       <div style={{ marginTop: '2rem', marginBottom: '1rem' }}>
//         <button style={{fontSize: '18px', cursor: 'pointer'}} onClick={() => {
//           const input = prompt('Enter chunk size in meters: ');
//           if (input && !isNaN(input)) {
//             window.open(`/pressureChange-chunks?chunk=${input}`, '_blank');
//           }
//         }}>
//           Show Section-wise Charts
//         </button>
//       </div>
//   </div>
//   );
// };

// export default PressureChange;




import React from "react";
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
import { useContext } from "react";
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
// ... imports same rahenge

const PressureDrop = () => {
  const { fileDataICE } = useContext(FileContext);

  const parseNumber = (val) => {
    if (val === undefined || val === null) return null;
    let cleaned = val.toString().trim().replace(/,/g, "");
    let num = Number(cleaned);
    return isNaN(num) ? null : num;
  };

  const filteredData = Array.isArray(fileDataICE)
    ? fileDataICE.filter(
        (row) =>
          parseNumber(row["Chainage (m)"]) !== null &&
          parseNumber(row["Elevation (m)"]) !== null &&
          parseNumber(row["Pressure change"]) !== null
      )
    : [];

  // Instead of labels, we give x,y pairs
  const elevationPoints = filteredData.map((row) => ({
    x: parseNumber(row["Chainage (m)"]),
    y: parseNumber(row["Elevation (m)"]),
  })).filter(point =>
    !isNaN(point.x) &&
    !isNaN(point.y) &&
    point.x !== 0 // Starting 0 chainage skip
  );

  console.log("Elevation Points:", elevationPoints);
  console.log("Sample Elevation Points:", elevationPoints.slice(0, 10));

  const pressurePoints = filteredData.map((row) => ({
    x: parseNumber(row["Chainage (m)"]),
    y: parseNumber(row["Pressure change"]),
  })) .filter(point =>
    !isNaN(point.x) &&
    !isNaN(point.y) &&
    point.x !== 0
  );

  console.log("Pressure Points:", pressurePoints);
  console.log("Sample Pressure Points:", pressurePoints.slice(0, 10));

  const data = {
    datasets: [
      {
        label: "Elevation (m)",
        data: elevationPoints,
        borderColor: "black",
        backgroundColor: "black",
        yAxisID: "y1",
        fill: false,
        spanGaps: false,
        tension: 0.4,
        pointRadius: 0,
        borderwidth: 2,
        showLines: false
      },
      {
        label: "Pressure Change",
        data: pressurePoints,
        borderColor: "#24db0f",
        backgroundColor: "#24db0f",
        // borderDash: [5, 5],
        yAxisID: "y2",
        fill: false,
        spanGaps: false,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
        showLines: false,
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: { mode: "index", intersect: false },
    stacked: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Elevation & Pressure Change vs Chainage" },
    },
    scales: {
      x: {
        type: "linear",
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
        title: { display: true, text: "Pressure Change" },
      },
    },
  };

  return (
    <div style={{ maxWidth: '100%', margin: '21px auto', padding: '2rem', backgroundColor: '#ffffff', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
      <h2>Pressure Drop</h2>
      {Array.isArray(fileDataICE) && fileDataICE.length > 0 ? (
        <Line data={data} options={options} />
      ) : (
        <p>No data available</p>
      )}

       {/* Button to show chunks */}

       <div style={{ marginTop: '2rem', marginBottom: '1rem' }}>
        <button style={{fontSize: '18px', cursor: 'pointer'}} onClick={() => {
           const input = prompt('Enter chunk size in meters: ');
           if (input && !isNaN(input)) {
             window.open(`/pressureDrop-chunks?chunk=${input}`, '_blank');
           }
         }}>
           Show Section-wise Charts
         </button>
    </div>
    </div>
  );
};

export default PressureDrop;




