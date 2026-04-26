import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import FileUploader from './Components/FileUpload';
import { FileContext, FileProvider } from './Components/FileContext';
import Navbar from './Components/Navbar'
import Footer from './Components/footer';

//XLI CHart Chart Import
import ChartSelector from './Components/chartSelector';
import CPCIPS_Chunks from './Components/CP_CIPS_Chunk';
import ACVG_Chunks from './Components/ACVG_Chunk';
import ACPSP_Chunks from './Components/ACPSP_Chunk';
import DOC_Chunks from './Components/DOC_Chunk';
import DCVG_Chunks from './Components/DCVG_Chunk';
import Attenuation_Chunks from './Components/Attenuation_Chunk';
import ACVG_mvChunk from './Components/ACVG_mvChunk';
import CurrentDensity_Chunk from './Components/CurrentDensity_Chunk';

//IC Chunk ChartImport
import ChartSelector_ICE from './Components/ChartSelector_ICE';
import Elevation_Chunks from './Components/Elevation_chunk';
// import ElevationProfile_Chunks from './Components/ElevationProfile_Chunk';
import CR_Chunk from './Components/CR_Chunk';
import Consolidated_CR_Chunk from './Components/Consolidate_CR_Chunk'
import WallLoss_Chunk from './Components/WallLoss_Chunk';
import PressureDrop_Chunks from './Components/PressureChange_Chunk';
import TemperatureDrop_Chunks from './Components/TemperatureChange_Chunk';
import VelocityProfile_Chunk from './Components/Velocity_Chunk';
import InclinationAngle_Chunks from './Components/InclinationAngle_Chunk';
import FlowRegime_Chunks from './Components/FlowRegime_Chunk';
import AvgHL_Chunks from './Components/AvgHL_Chunk';

import MapTilerPolyline from './Components/MapWithPolyline';


function App() {

  const [markers, setMarkers] = useState([]);

  console.log('Markers:', markers); // Debug log to check markers array

  return (
    <FileProvider>
      <Router>
        <AppContent markers={markers} setMarkers={setMarkers} />
      </Router>
      <Footer/>
    </FileProvider>
  );
}

const AppContent = ({ markers, setMarkers }) => {
  const location = useLocation();

  return (
    <>
      <Navbar />
    
     
      <FileUploader setMarkers={setMarkers} />
        {location.pathname === "/" && <MapTilerPolyline />}

      <Routes>
        {/* ✅ Main page */}
        <Route
          path="/"
          element={
            <div>
              <ChartSelector />
              <ChartSelector_ICE />
            </div>
          }
        />
        {/* ✅ Chunk pages for each chart type */}
        {/*XLI Routes*/}
        <Route path="/cpcips-chunks" element={<CPCIPS_Chunks />} />
        <Route path="/acvg-chunks" element={<ACVG_Chunks />} />
        <Route path="/acpsp-chunks" element={<ACPSP_Chunks />} />
        <Route path="/doc-chunks" element={<DOC_Chunks />} />
        <Route path="/dcvg-chunks" element={<DCVG_Chunks />} />
        <Route path="/attenuation-chunks" element={<Attenuation_Chunks />} />
        <Route path="/acvg_mv-chunks" element={<ACVG_mvChunk />} />
        <Route path="/currentDensity-chunks" element={<CurrentDensity_Chunk />} />
        <Route path="/rolledUp-chunks" element={<Elevation_Chunks />} />

        {/*IC Routes*/}
        <Route path="/cr-chunks" element={<CR_Chunk />} />
{/*         <Route path="/consolidated_cr-chunks" element={<Consolidated_CorrosionRate />} /> */}
        <Route path="/consolidated_cr-chunks" element={<Consolidated_CR_Chunk />} />

        <Route path="/loss-chunks" element={<WallLoss_Chunk />} />
        <Route path="/pressureDrop-chunks" element={<PressureDrop_Chunks />} />
        <Route path="/temperatureDrop-chunks" element={<TemperatureDrop_Chunks />} />
      <Route path="/velocityProfile-chunks" element={<VelocityProfile_Chunk/>} />
{/*       <Route path="/elevationprofile-chunks" element={<ElevationProfile_Chunks/>} /> */}
       <Route path="/flowregime-chunks" element={<FlowRegime_Chunks/>} />
       <Route path="/avghl-chunks" element={<AvgHL_Chunks/>} />
          <Route path="/elevationprofile-chunks" element={<InclinationAngle_Chunks/>} />
        
      </Routes>
    </>
  );
};

export default App;
