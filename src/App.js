import React from "react";
import { Routes, Route } from "react-router-dom"; // React Router
import Home from "./components/Home"; // Componente Home
import CustomHeader from "./components/CustomHeader"; // CustomHeader
import Sidebar from "./components/Sidebar"; // Barra lateral
import FlexDesign from "./components/flexdesign/FlexDesign"; // Componente FlexDesign
import RebarEmbed from "./components/rebarembed/RebarEmbed"; // Componente RebarEmbed
import SpectrePlot from "./components/sprectreplot/SpectrePlot"; // Componente SpectrePlot
import WorkInProgress from "./components/WorkInProgress"; // Página de trabajo en progreso
import Foundation1D from "./components/foundation1D/Foundation1D"; // Componente VeriFound
import Interactdg from "./components/interactdg/Interactdg"; // Componente InteractDG
import Library from "./components/library/Library"; // Componente Library
import Slenderness from "./components/slenderness/Slenderness";
import Points2D from "./components/points2D/Points2D";

import status from "./status"; // Importar estado de trabajo

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
              element={
                status.spectrePlot ? <WorkInProgress /> : <SpectrePlot />
              }
            />
            <Route
              path="/foundation1D"
              element={
                status.foundation1D ? <WorkInProgress /> : <Foundation1D />
              }
            />
            <Route
              path="/interactdg"
              element={status.interactdg ? <WorkInProgress /> : <Interactdg />}
            />
            <Route
              path="/slenderness"
              element={
                status.slenderness ? <WorkInProgress /> : <Slenderness />
              }
            />
            <Route
              path="/points2D"
              element={status.points2D ? <WorkInProgress /> : <Points2D />}
            />
            <Route
              path="/library"
              element={status.library ? <WorkInProgress /> : <Library />}
            />
            <Route path="/" element={<Home />} /> {/* Ruta por defecto */}
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
