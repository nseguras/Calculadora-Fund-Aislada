import React, { useState, useCallback, useEffect } from 'react';
import './RebarEmbed.css'; // Importa los estilos
import APIconfig from '../../config';  // Importamos la configuración

const API_URL = APIconfig.API_URL_REBAREMBED; 

function RebarEmbed() {
  const [formData, setFormData] = useState({
    tipo: 'corrugado',
    diam: '8',
    fy: '420',
    fc: '30',
    spac: '',
    rec: '',
    lda: '1.0',
    psi_e: '1.5',
    psi_t: '1.3',
    psi_c: '0.7',
    psi_r: '0.8',
  });
  const [RebarEmbed, setRebarEmbed] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const enviarDatos = useCallback(() => {
    const { spac, rec } = formData;

    if (!spac || !rec || parseFloat(spac) <= 0 || parseFloat(rec) <= 0) {
      alert(
        'Los valores de espaciamiento y recubrimiento deben ser mayores a 0.'
      );
      return;
    }

    const data = {
      tipo: formData.tipo,
      diam: parseFloat(formData.diam),
      fy: parseFloat(formData.fy),
      fc: parseFloat(formData.fc),
      spac: parseFloat(spac),
      rec: parseFloat(rec),
      lda: parseFloat(formData.lda),
      psi_e: parseFloat(formData.psi_e),
      psi_t: parseFloat(formData.psi_t),
      psi_c: parseFloat(formData.psi_c),
      psi_r: parseFloat(formData.psi_r),
    };

    const json1 = JSON.stringify(data);

    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: json1,
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text);
          });
        }
        return response.json();
      })
      .then((data) => {
        setErrorMessage('');
        setRebarEmbed(`Largo de desarrollo Ld = ${data.l_d} mm`);
      })
      .catch((error) => {
        setRebarEmbed('');
        setErrorMessage(`Error: ${error.message}`);
        console.error('Error:', error);
      });
  }, [formData]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        enviarDatos();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enviarDatos]);

  return (
    <div className="containerRE">
      <div className="title-sectionRE">
        <i>
          <h1>Largo de Desarrollo en Barras</h1>
        </i>
      </div>
      <div className="form-containerRE">
        <form id="rebarForm">
          <div className="form-fields-containerRE">
            <label htmlFor="tipo">Tipo de barra</label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleInputChange}
            >
              <option value="corrugado">Barra corrugada, recta</option>
              <option value="hook">Barra corrugada, con gancho</option>
              <option value="head">Barra corrugada, con cabeza</option>
              <option value="elscorr">
                Barra corrugada electrosoldada, recta
              </option>
            </select>

            <label htmlFor="diam">Diámetro de barra [mm]</label>
            <select
              id="diam"
              name="diam"
              value={formData.diam}
              onChange={handleInputChange}
            >
              <option value="8">8</option>
              <option value="10">10</option>
              <option value="12">12</option>
              <option value="16">16</option>
              <option value="18">18</option>
              <option value="22">22</option>
              <option value="25">25</option>
              <option value="36">36</option>
            </select>

            <label htmlFor="fy">Calidad del acero</label>
            <select
              id="fy"
              name="fy"
              value={formData.fy}
              onChange={handleInputChange}
            >
              <option value="420">A630-420H</option>
            </select>

            <label htmlFor="fc">Grado del hormigón</label>
            <select
              id="fc"
              name="fc"
              value={formData.fc}
              onChange={handleInputChange}
            >
              <option value="20">G20</option>
              <option value="25">G25</option>
              <option value="30">G30</option>
              <option value="35">G35</option>
              <option value="40">G40</option>
            </select>

            <label htmlFor="spac">Espaciamiento [mm]</label>
            <input
              type="number"
              id="spac"
              name="spac"
              placeholder="Ingresar Valor"
              min="0"
              value={formData.spac}
              onChange={handleInputChange}
            />

            <label htmlFor="rec">Recubrimiento [mm]</label>
            <input
              type="number"
              id="rec"
              name="rec"
              placeholder="Ingresar Valor"
              min="0"
              value={formData.rec}
              onChange={handleInputChange}
            />

            <label htmlFor="lda">λ [--]</label>
            <select
              id="lda"
              name="lda"
              value={formData.lda}
              onChange={handleInputChange}
            >
              <option value="1.0">Concreto de peso normal, 1.0</option>
              <option value="0.75">Concreto de peso liviano, 0.75</option>
            </select>

            <label htmlFor="psi_e">Ψe [--] (epóxico)</label>
            <select
              id="psi_e"
              name="psi_e"
              value={formData.psi_e}
              onChange={handleInputChange}
            >
              <option value="1.5">Con recubrimiento epóxico, 1.5</option>
              <option value="1.2">Con recubrimiento epóxico, 1.2</option>
              <option value="1.0">Sin recubrimiento epóxico, 1.0</option>
            </select>

            <label htmlFor="psi_t">Ψt [--] (ubicación)</label>
            <select
              id="psi_t"
              name="psi_t"
              value={formData.psi_t}
              onChange={handleInputChange}
            >
              <option value="1.3">
                Más de 300 mm de concreto fresco colocado bajo el refuerzo
                horizontal, 1.3
              </option>
              <option value="1.0">Otro, 1.0</option>
            </select>

            <label htmlFor="psi_c">Ψc [--] (recubrimiento)</label>
            <select
              id="psi_c"
              name="psi_c"
              value={formData.psi_c}
              onChange={handleInputChange}
            >
              <option value="0.7">0.7</option>
              <option value="1.0">1.0</option>
            </select>

            <label htmlFor="psi_r">Ψr [--] (confinamiento del refuerzo)</label>
            <select
              id="psi_r"
              name="psi_r"
              value={formData.psi_r}
              onChange={handleInputChange}
            >
              <option value="0.8">0.8</option>
              <option value="1.0">1.0</option>
            </select>
          </div>
        </form>
        <button id="myButton" onClick={enviarDatos}>
          Calcular
        </button>
      </div>

      <p
        id="l_d"
        className={
          errorMessage ? 'bold-text error' : RebarEmbed ? 'bold-text' : ''
        }
      >
        {errorMessage || RebarEmbed}
      </p>
    </div>
  );
}

export default RebarEmbed;
