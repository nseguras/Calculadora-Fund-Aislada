import React, { useState, useEffect } from 'react';
import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import flexDesignImage from './img/flexdesign_img.png'; // Importa la imagen
import './FlexDesign.css'; // Importa los estilos (si los tienes)
import APIconfig from '../../config';  // Importamos la configuración

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

const API_URL = APIconfig.API_URL_FLEXDESIGN;

const FlexDesign = () => {
  const [formData, setFormData] = useState({
    M_u: 9,
    h: 500,
    b: 400,
    eps_u: 0.003, // Valor fijo
    Es: 200000, // Valor fijo
    fy: 420,
    fc: 30,
    rec: 50,
  });

  const [data, setData] = useState({
    As_req: 0,
    cantidad: 0,
    FU: {},
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseFloat(value),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((jsonData) => setData(jsonData))
      .catch((error) => {
        console.error('Error:', error);
        alert('Ocurrió un error al calcular. Revisa la consola.');
      });
  };

  function ScatterChart({ jsonData }) {
    const [chartData, setChartData] = useState({
      datasets: [],
    });
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
      // Asegúrate de que jsonData y jsonData.FU existan y FU sea un objeto no vacío
      if (
        jsonData &&
        jsonData.FU &&
        typeof jsonData.FU === 'object' &&
        Object.keys(jsonData.FU).length > 0
      ) {
        const fuData = jsonData.FU; // El diccionario con los datos

        // 1. Extraer los valores de FU para normalización
        const fuValues = Object.values(fuData);
        const maxFu = Math.max(...fuValues);
        const minFu = Math.min(...fuValues); // Útil si quieres escalar entre min y max

        // 2. Preparar constantes para tamaño y transparencia
        const tamanoMinimo = 2;
        const tamanoMaximo = 30; // Rango mucho más amplio
        const transparenciaMinima = 0.1; // Más transparente
        const transparenciaMaxima = 1.0;

        // 3. Crear los dataPoints iterando sobre el objeto FU
        const dataPoints = Object.entries(fuData)
          .map(([key, fuValue]) => {
            // Parsear la clave "(n, d)" para obtener x e y
            const match = key.match(/\((\d+),\s*(\d+)\)/);
            if (!match) {
              console.warn(`Clave inválida encontrada: ${key}`);
              return null; // O manejar el error como prefieras
            }
            const nbarras = parseInt(match[1], 10); // Coordenada X
            const dbarras = parseInt(match[2], 10); // Coordenada Y

            // Normalizar el valor de FU (entre 0 y 1)
            // Evita división por cero si maxFu es 0 o si minFu == maxFu
            const normalizedFu =
              maxFu > 0 && maxFu !== minFu
                ? (fuValue - minFu) / (maxFu - minFu)
                : maxFu > 0
                ? 1
                : 0; // Si todos son iguales o max es 0

            // Calcular tamaño y transparencia basados en el FU normalizado
            const radio =
              tamanoMinimo + normalizedFu * (tamanoMaximo - tamanoMinimo);
            const transparencia =
              transparenciaMinima +
              normalizedFu * (transparenciaMaxima - transparenciaMinima);
            const color = `rgba(0, 60, 113, ${transparencia})`; // Azul con transparencia variable

            return {
              x: nbarras,
              y: dbarras,
              r: radio, // 'r' define el radio del punto directamente
              backgroundColor: color,
              originalFU: fuValue, // Almacena el valor original para el tooltip
            };
          })
          .filter((point) => point !== null); // Filtrar puntos nulos si hubo errores de parseo

        console.log('dataPoints: ', dataPoints); // Para revisar el formato

        // 4. Configurar los datos para el gráfico
        setChartData({
          datasets: [
            {
              label: 'Combinaciones (nº barras, Ø barras)', // Etiqueta más descriptiva
              data: dataPoints,
              // No necesitas pointRadius ni pointBackgroundColor aquí,
              // ya que 'r' y 'backgroundColor' están definidos por punto en 'data'.
              // borderColor: 'rgba(54, 162, 235, 0.5)', // Opcional: un borde ligero
              // borderWidth: 1, // Opcional
            },
          ],
        });

        // 5. Configurar las opciones del gráfico
        setChartOptions({
          scales: {
            x: {
              title: {
                display: true,
                text: 'Número de Barras (n)',
              },
              beginAtZero: true, // Empezar eje X en 0
            },
            y: {
              title: {
                display: true,
                text: 'Diámetro de Barras (d) [mm]', // Asumiendo que 'd' está en mm
              },
              beginAtZero: true, // Empezar eje Y en 0
            },
          },
          plugins: {
            legend: {
              display: false, // Ocultar leyenda si solo hay un dataset es razonable
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  // Acceder al dataPoint actual
                  const dataPoint = context.dataset.data[context.dataIndex];
                  if (dataPoint) {
                    // Mostrar X, Y y el FU original almacenado
                    return `(${dataPoint.x}, ${
                      dataPoint.y
                    }mm): FU = ${dataPoint.originalFU.toFixed(3)}`; // Formatear FU
                  }
                  return ''; // Caso de error
                },
              },
            },
          },
          responsive: true,
          maintainAspectRatio: false,
        });
      } else {
        // Si no hay datos válidos, limpiar el gráfico
        setChartData({ datasets: [] });
        // Podrías también mostrar un mensaje indicando que no hay datos
      }
    }, [jsonData]); // El efecto se ejecuta cuando jsonData cambia

    return (
      // Asegúrate que el contenedor tenga dimensiones definidas para que el canvas se muestre
      <div
        style={{
          position: 'relative',
          width: '95%',
          height: '500px',
          margin: 'auto',
        }}
      >
        {chartData.datasets.length > 0 ? (
          <Scatter data={chartData} options={chartOptions} />
        ) : (
          <p>
            Presiona el botón <i>Calcular</i> para mostrar los resultados.
          </p> // Mensaje alternativo
        )}
      </div>
    );
  }

  return (
    <div>
      {/* container 1 grande */}
      <div className="containerFD1">
        {/* header */}
        <div className="title-sectionFD">
          <i>
            <h1>Cálculo Flexión Simple</h1>
          </i>
        </div>
        <div className="content-section">
          {/* container del form */}
          <div className="form-containerFD">
            <h2>
              <i>Parámetros de Diseño</i>
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="form-groupFD">
                <label htmlFor="M_u">Momento Último [tonf-m]:</label>
                <input
                  type="number"
                  id="M_u"
                  name="M_u"
                  step="0.01"
                  value={formData.M_u}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="h">Altura "h" de la sección [mm]:</label>
                <input
                  type="number"
                  id="h"
                  name="h"
                  step="0.01"
                  value={formData.h}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="b">Ancho "b" de la sección [mm]:</label>
                <input
                  type="number"
                  id="b"
                  name="b"
                  step="0.01"
                  value={formData.b}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="fy">
                  Tensión de fluencia del acero, fy [MPa]:
                </label>
                <input
                  type="number"
                  id="fy"
                  name="fy"
                  step="0.01"
                  value={formData.fy}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="fc">Grado del hormigón:</label>
                <select
                  id="fc"
                  name="fc"
                  value={formData.fc}
                  onChange={handleChange}
                  required
                >
                  <option value="20">G20</option>
                  <option value="25">G25</option>
                  <option value="30">G30</option>
                  <option value="35">G35</option>
                  <option value="40">G40</option>
                </select>
                <label htmlFor="rec">
                  Recubrimiento al centro de la barra [mm]:
                </label>
                <input
                  type="number"
                  id="rec"
                  name="rec"
                  step="0.01"
                  value={formData.rec}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit">
                <i>
                  <b>Calcular</b>
                </i>
              </button>
            </form>
          </div>
          <div className="image-containerFD">
            <h2>
              <i>Sección</i>
            </h2>
            <img id="FD-image" src={flexDesignImage} alt="FlexDesign" />
          </div>
        </div>
      </div>

      {/* container 2 */}
      <div className="containerFD2">
        <section id="results-sectionFD">
          <h2>
            <i>Resultados</i>
          </h2>
          <div id="resultadosGeneralesFD">
            <p>
              <strong>Área de acero requerida (As):</strong>{' '}
              <span id="asReq">{data.As_req.toFixed(2)}</span> mm²
            </p>
          </div>

          <h3>
            <i>Factores de Utilización</i>
          </h3>
          <div className="graph-containerFD">
            {data && <ScatterChart jsonData={data} />}
          </div>
        </section>
      </div>

    </div>
  );
};

export default FlexDesign;
