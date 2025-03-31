import React from 'react';
import { Routes, Route } from 'react-router-dom'; // React Router
import Home from './components/Home'; // Componente Home
import CustomHeader from './components/CustomHeader'; // CustomHeader
import Sidebar from './components/Sidebar'; // Barra lateral
import FlexDesign from './components/flexdesign/FlexDesign'; // Componente FlexDesign
import RebarEmbed from './components/rebarembed/RebarEmbed'; // Componente RebarEmbed
import SpectrePlot from './components/sprectreplot/SpectrePlot'; // Componente SpectrePlot
import WorkInProgress from './components/WorkInProgress'; // Página de trabajo en progreso
import VeriFound from './components/verifound/VeriFound'; // Componente VeriFound

import status from './status'; // Importar estado de trabajo

function App() {
  return (
    <>
      <CustomHeader /> {/* Bloque superior */}
      <div className="d-flex">
        <Sidebar /> {/* Barra lateral */}
        <div className="container-fluid">
          <Routes>
            <Route 
              path="/flexdesign" 
              element={status.flexDesign ? <WorkInProgress /> : <FlexDesign />} 
            />
            <Route 
              path="/rebarembed" 
              element={status.rebarEmbed ? <WorkInProgress /> : <RebarEmbed />} 
            />
            <Route 
              path="/spectreplot" 
              element={status.spectrePlot ? <WorkInProgress /> : <SpectrePlot />} 
            />
            <Route 
              path="/verifound" 
              element={status.verifound ? <WorkInProgress /> : <VeriFound />}
            />
            <Route path="/" element={<Home />} /> {/* Ruta por defecto */}
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
