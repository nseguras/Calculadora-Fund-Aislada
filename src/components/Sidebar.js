// src/components/Sidebar.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import status from '../status'; // Importar el archivo de estado

const Sidebar = () => {
  const [hoveredLink, setHoveredLink] = useState(null);

  const sidebarStyle = {
    width: '240px',
    height: '100vh',
    backgroundColor: '#f9f9f9',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
  };

  const navLinkStyle = {
    color: '#333',
    padding: '10px',
    borderRadius: '5px',
    transition: 'background 0.3s ease',
  };

  const navLinkHoverStyle = {
    backgroundColor: '#e9e9e9',
  };

  const handleMouseEnter = (link) => {
    setHoveredLink(link);
  };

  const handleMouseLeave = () => {
    setHoveredLink(null);
  };

  return (
    <div style={sidebarStyle}>
      <Nav defaultActiveKey="/home" className="flex-column">
        <Nav.Link
          as={Link}
          to="/flexdesign"
          style={
            hoveredLink === 'flexdesign'
              ? { ...navLinkStyle, ...navLinkHoverStyle }
              : navLinkStyle
          }
          onMouseEnter={() => handleMouseEnter('flexdesign')}
          onMouseLeave={handleMouseLeave}
        >
          Diseño Flexión Simple
          {status.flexDesign && <strong> - Work in Progress</strong>} {/* Mostrar mensaje si está en trabajo */}
        </Nav.Link>
        <Nav.Link
          as={Link}
          to="/rebarembed"
          style={
            hoveredLink === 'rebarembed'
              ? { ...navLinkStyle, ...navLinkHoverStyle }
              : navLinkStyle
          }
          onMouseEnter={() => handleMouseEnter('rebarembed')}
          onMouseLeave={handleMouseLeave}
        >
          Largo de Desarrollo Barras
          {status.rebarEmbed && <strong> - Work in Progress</strong>} {/* Mostrar mensaje si está en trabajo */}
        </Nav.Link>
        <Nav.Link
          as={Link}
          to="/spectreplot"
          style={
            hoveredLink === 'spectreplot'
              ? { ...navLinkStyle, ...navLinkHoverStyle }
              : navLinkStyle
          }
          onMouseEnter={() => handleMouseEnter('spectreplot')}
          onMouseLeave={handleMouseLeave}
        >
          Espectro de diseño NCh2369
          {status.spectrePlot && <strong> - Work in Progress</strong>} {/* Mostrar mensaje si está en trabajo */}
        </Nav.Link>
      </Nav>
      <Nav.Link
          as={Link}
          to="/verifound"
          style={
            hoveredLink === 'verifound'
              ? { ...navLinkStyle, ...navLinkHoverStyle }
              : navLinkStyle
          }
          onMouseEnter={() => handleMouseEnter('verifound')}
          onMouseLeave={handleMouseLeave}
        >
          Verificación de Fundaciones 1D
          {status.verifound && <strong> - Work in Progress</strong>} {/* Mostrar mensaje si está en trabajo */}
        </Nav.Link>
    </div>
  );
};

export default Sidebar;
