// import React, { useContext } from 'react';
// import { FileContext } from './FileContext';
// import { useLocation } from 'react-router-dom';
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

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// const AvgHL_Chunks = () => {
//   const { fileDataICE } = useContext(FileContext);
//   const query = new URLSearchParams(useLocation().search);
//   const chunkSize = parseInt(query.get('chunk') || '500');

//   const filtered = fileDataICE.filter(
//     (item) =>
//       item['Chainage (m)'] &&
//       item['Elevation (m)'] &&
//       item['CONSOLIDATED HL AVERAGE (BBLS)'] &&
//       item['DEx'] !== undefined &&
//       !isNaN(item['Chainage (m)']) &&
//       !isNaN(item['Elevation (m)']) &&
//       !isNaN(item['CONSOLIDATED HL AVERAGE (BBLS)'])
//   );

//   console.log('Filtered AvgHL data length:', filtered.length);

//   const maxDist = Math.max(...filtered.map(row => Number(row['Chainage (m)'])));
//   const chunks = [];

//   for (let start = 0; start < maxDist; start += chunkSize) {
//     const end = start + chunkSize;
//     const chunk = filtered.filter(row =>
//       Number(row['Chainage (m)']) >= start &&
//       Number(row['Chainage (m)']) < end
//     );

//     console.log(`Chunk from ${start} to ${end} length:`, chunk.length);

//       if (chunk.length > 0) {
//       const dataOn = chunk.map(item => ({ x: Number(item['Chainage (m)']), y: Number(item['Elevation (m)']) }));
//       const dataOff = chunk.map(item => ({ x: Number(item['Chainage (m)']), y: Number(item['CONSOLIDATED HL AVERAGE (BBLS)']) }));
//       const dataDEx = chunk.map(item => ({ x: Number(item['Chainage (m)']), y: Number(item['DEx']) }));

//       console.log('dataOn:', dataOn);
//       console.log('dataOff:', dataOff);
//       console.log('dataDEx:', dataDEx);

//       chunks.push({
//         title: `${start}m - ${end}m`,
//         data: {
//           datasets: [
//             {
//               label: 'Elevation (m)',
//               data: dataOn,
//               borderColor: 'rgba(1, 6, 6, 1)',
//               backgroundColor: 'rgba(1, 6, 6, 1)',
//               tension: 0.4,
//               fill: false,
//               yAxisID: 'y',  //Primary Y-Axis
//               pointRadius: 0,
//             },
//             {
//               label: 'CONSOLIDATED HL AVERAGE (BBLS)',
//               data: dataOff,
//               borderColor: '#FF00FF',
//               backgroundColor: '#FF00FF',
//               tension: 0.4,
//               fill: false,
//               yAxisID: 'y1', //Secondary Y-Axis
//               pointRadius: 0,
//             },
//             {
//               label: 'DEx',
//               data: dataDEx,
//               borderColor: '#FFA500',
//               backgroundColor: '#FFA500',
//               tension: 0.4,
//               fill: false,
//               yAxisID: 'y1', //Secondary Y-Axis
//               pointRadius: 0,
//             },
//           ],
//         },
//         options: {
//           responsive: true,
//           plugins: {
//             legend: {
//               position: 'top',
//             },
//             title: {
//               display: true,
//               text: `Elevation, Average HL & DEx vs Chainage (${start}m - ${end}m)`
//             },
//           },
//           scales: {
//             x: {
//               type: 'linear',
//               position: 'bottom',
//               title: {
//                 display: true,
//                 text: 'Chainage (m)',
//               },
//             },
//             y: {
//               type: 'linear',
//               display: true,
//               position: 'left',
//               title: {
//                 display: true,
//                 text: 'Elevation (m)',
//               },
//             },
//             y1: {
//               type: 'linear',
//               display: true,
//               position: 'right',
//               title: {
//                 display: true,
//                 text: 'Average HL & DEx',
//               },
//               grid: {
//                 drawOnChartArea: false,
//               },
//             },
//           },
//         },
//       });
//     }
//   }

//   return (
//     <div style={{ padding: '2rem' }}>
//       <h2>Section-wise Charts of Average HL for (Every {chunkSize}m)</h2>
//       {chunks.map((chunk, i) => (
//         <div key={i} style={{
//           marginBottom: '2rem',
//           border: '1px solid #ccc',
//           borderRadius: '8px',
//           boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
//           backgroundColor: '#fff'
//         }}>
//           <h3>{chunk.title}</h3>
//           <Line data={chunk.data} options={chunk.options} />
//         </div>
//       ))}
//     </div>
//   );
// };

// export default AvgHL_Chunks;



import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
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

const AvgHL_Chunks = () => {
  const { fileDataICE } = useContext(FileContext);
  const query = new URLSearchParams(useLocation().search);
  const chunkSize = parseInt(query.get("chunk") || "500");

  // ✅ Filter only valid numeric rows
  const filtered = fileDataICE.filter(
    (item) =>
      item["Chainage (m)"] &&
      item["HL>AVG HL"] &&
      item["Elevation (m)"] &&
      !isNaN(item["Chainage (m)"]) &&
      !isNaN(item["HL>AVG HL"]) &&
      !isNaN(item["Elevation (m)"])
  );

  if (filtered.length === 0) {
    return <p>No valid data found in file.</p>;
  }

  const maxDist = Math.max(
    ...filtered.map((row) => Number(row["Chainage (m)"]))
  );
  const chunks = [];

  for (let start = 0; start < maxDist; start += chunkSize) {
    const end = start + chunkSize;
    const chunk = filtered.filter(
      (row) =>
        Number(row["Chainage (m)"]) >= start &&
        Number(row["Chainage (m)"]) < end
    );

    if (chunk.length > 0) {
      const labels = chunk.map((item) =>
        Number(item["Chainage (m)"]).toFixed(2)
      );
      const avgHL = chunk.map((item) => Number(item["HL>AVG HL"]));
      const elevation = chunk.map((item) => Number(item["Elevation (m)"]));
      const dexValues = chunk
        .map((item) => Number(item["DEx"]))
        .filter((val) => !isNaN(val));

      const data = {
        labels,
        datasets: [
          {
            label: "Elevation (m)",
            data: elevation,
            borderColor: "black",
            backgroundColor: "black",
            yAxisID: "y",
            pointRadius: 0,
            borderWidth: 2,
            tension: 0.4,
          },
          {
            label: "Avg HL",
            data: avgHL,
            borderColor: "red",
            backgroundColor: "red",
            yAxisID: "y1",
            pointRadius: 3,
            borderWidth: 0,
          },
        ],
      };

      // ✅ Create annotations for all DEx values in this chunk
      const annotations = {};
      dexValues.forEach((dex, idx) => {
        annotations[`dex-${idx}`] = {
          type: "line",
          xMin: dex.toFixed(2),
          xMax: dex.toFixed(2),
          borderColor: "green",
          borderWidth: 2,
          label: {
            content: "DEx",
            enabled: true,
            position: "start",
          },
        };
      });

      const options = {
        responsive: true,
        interaction: {
          mode: "index",
          intersect: false,
        },
        stacked: false,
        plugins: {
          title: {
            display: true,
            text: `Elevation vs Chainage with Avg HL & DEx`,
          },
          annotation: { annotations },
        },
        scales: {
          x: {
            title: { display: true, text: "Chainage (m)" },
          },
          y: {
            type: "linear",
            display: true,
            position: "left",
            title: { display: true, text: "Elevation (m)" },
          },
          y1: {
            type: "linear",
            display: true,
            position: "right",
            grid: { drawOnChartArea: false },
            title: { display: true, text: "Avg HL" },
          },
        },
      };

      chunks.push({ title: `${start}m - ${end}m`, data, options });
    }
  }

  return (
    <div>
      {chunks.map((chunk, idx) => (
        <div key={idx} style={{ marginBottom: "40px" }}>
          <h3>{chunk.title}</h3>
          <Line data={chunk.data} options={chunk.options} />
        </div>
      ))}
    </div>
  );
};

export default AvgHL_Chunks;

