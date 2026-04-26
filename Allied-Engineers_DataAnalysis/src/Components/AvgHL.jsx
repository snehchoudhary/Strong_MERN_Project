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

// const AvgHLChart = () => {
//   const { fileDataICE } = useContext(FileContext);
//   const navigate = useNavigate();

// //   console.log('ElevationChart fileDataICE:', fileDataICE);

//   const xKey = 'Chainage (m)';
//   const yKey1 = 'Elevation (m)';
//   const yKey2 = 'CONSOLIDATED HL AVERAGE (BBLS)';
//    const yKey3 = 'DEx'



//   // Clean and trim column headers (just in case)
//   const cleanData = fileDataICE.map(row => {
//     const cleaned = {};
//     Object.keys(row).forEach(key => {
//       cleaned[key.trim()] = row[key];
//     });
//     return cleaned;
//   });

//   const elevationValues = cleanData.map(row => ({ x: Number(row[xKey]), y: Number(row[yKey1]) }));
//   const AvgHLValues = cleanData.map(row => ({ x: Number(row[xKey]), y: Number(row[yKey2]) }));
//   // const dExValues = cleanData.map(row => ({ x: Number(row[xKey]), y: Number(row[yKey3]) }));

//   const dExPositions = [...new Set(cleanData.map(row => Number(row[yKey3])))].filter(val => !isNaN(val));


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
//         data: AvgHLValues,
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
//       // {
//       //   label: `${yKey3} `,
//       //   data: dExValues,
//       //   fill: false,
//       //   borderColor: '#FF8C00',
//       //   backgroundColor: '#FF8C00',
//       //   tension: 0.4,
//       //   yAxisID: 'y', //Secondary Axis
//       //   pointRadius: 0,
//       // },
//     ],
//   };

//   const options = {
//     responsive: true,
//     mainAspectRation: false,
//     plugins: {
//       title: {
//         display: true,
//         text: `Elevation & DEx vs Chainage`,
//       },
//       legend: {
//         display: true,
//       },
//       annotation: {
//         annotations: dExPositions.reduce((acc, val, idx) => {
//           acc[`dexLine${idx}`] = {
//             type: 'line',
//             xMin: val,
//             xMax: val,
//             borderColor: 'orange',
//             borderWidth: 2,
//             borderDash: [6,6],
//             label: {
//               display: true,
//               content: 'DEx',
//               rotation: -90,
//               backgroundColor: 'rgba(255,140,0,0.7)',
//               color: 'white',
//               font: {
//                 size: 10
//               }
//             }
//           };
//           return acc;
//         }, {})
//       }
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
//           text: yKey2, //Average HL
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
//       <h2>Liquid HoldUp vs DEx</h2>
//       {fileDataICE.length > 0 ? <Line data={chartData} options={options} /> :null}

//        {/* Button to show chunks */}

//       <div style={{ marginTop: '2rem', marginBottom: '1rem' }}>
//         <button style={{fontSize: '18px', cursor: 'pointer'}} onClick={() => {
//           const input = prompt('Enter chunk size in meters: ');
//           if (input && !isNaN(input)) {
//             window.open(`/avgHL-chunks?chunk=${input}`, '_blank');
//           }
//         }}>
//           Show Section-wise Charts
//         </button>
//       </div>
//   </div>
//   );
// };

// export default AvgHLChart;



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
import annotationPlugin from "chartjs-plugin-annotation";
import { FileContext } from "./FileContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

const AvgHL = () => {
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
          parseNumber(row["HL>AVG HL"]) !== null
      )
    : [];

  // ✅ Round chainage values to 2 decimals for x-axis labels
  const chainageLabels = filteredData.map((row) => {
    const val = parseNumber(row["Chainage (m)"]);
    return val !== null ? val.toFixed(2) : null;
  });

  // Elevation values
  const elevationValues = filteredData.map((row) =>
    parseNumber(row["Elevation (m)"])
  );

  // HL > AVG HL values
  const avgHLValues = filteredData.map((row) =>
    parseNumber(row["HL>AVG HL"])
  );

  // Collect all DEx values from the DEx column
  const dexValues = Array.isArray(fileDataICE)
    ? fileDataICE
        .map((row) => parseNumber(row["DEx"]))
        .filter((val) => val !== null && !isNaN(val))
    : [];

  // Build annotations for all DEx values
  const dexAnnotations = dexValues.reduce((acc, val, idx) => {
    acc[`dexLine${idx}`] = {
      type: "line",
      xMin: val.toFixed(2), // ✅ align with rounded chainage
      xMax: val.toFixed(2),
      borderColor: "green",
      borderWidth: 2,
      label: {
        content: `DEx ${idx + 1}`,
        enabled: true,
        position: "start",
      },
    };
    return acc;
  }, {});

  const data = {
    labels: chainageLabels, // ✅ rounded labels
    datasets: [
      {
        label: "Elevation (m)",
        data: elevationValues,
        borderColor: "black",
        backgroundColor: "black",
        yAxisID: "y1",
        fill: false,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: "HL > AVG HL",
        data: avgHLValues,
        borderColor: "red",
        backgroundColor: "red",
        yAxisID: "y2",
        fill: false,
        pointRadius: 2,
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
      title: { display: true, text: "Elevation & HL>AVG HL & DEx vs Chainage" },
      annotation: { annotations: dexAnnotations },
    },
    scales: {
      x: {
        type: "category", // 👈 treat chainage as categories
        title: { display: true, text: "Chainage (m)" },
        ticks: {
          maxRotation: 90,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: 20,
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
        title: { display: true, text: "AVG HL" },
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
      <h2>Elevation &amp; HL&gt;AVG HL &amp; DEx</h2>

      {Array.isArray(fileDataICE) && fileDataICE.length > 0 ? (
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
              window.open(`/avghl-chunks?chunk=${input}`, "_blank");
            }
          }}
        >
          Show Section-wise Charts
        </button>
      </div>
    </div>
  );
};

export default AvgHL;

