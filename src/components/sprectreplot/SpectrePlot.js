import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto'; // Importa Chart.js
import './SpectrePlot.css'; // Importa los estilos (si los tienes)
import APIconfig from '../../config';  // Importamos la configuración

const API_URL = APIconfig.API_URL_SPECTREPLOT; 

function SpectrePlot() {
  const [selectedNorm, setSelectedNorm] = useState('');
  const [formData, setFormData] = useState({
    ZS: '',
    Tsuelo: '',
    R: '',
    xi: '',
  });
  const [chartData, setChartData] = useState(null);
  const chartRef = useRef(null); // Referencia al elemento canvas
  const chartInstance = useRef(null); // Referencia a la instancia del gráfico

  // Define las opciones de los campos del formulario según la norma
  const normOptions = {
    2003: [
      {
        label: 'Zona Sísmica',
        type: 'select',
        id: 'ZS',
        options: ['1', '2', '3'],
        value: '1',
      },
      {
        label: 'Tipo de suelo',
        type: 'select',
        id: 'Tsuelo',
        options: ['I', 'II', 'III'],
      },
      {
        label: 'Factor de modificación de la respuesta (R)',
        type: 'select',
        id: 'R',
        options: ['1.0', '2.0', '3.0', '4.0', '5.0'],
      },
      {
        label: 'Razón de amortiguamiento (ξ)',
        type: 'select',
        id: 'xi',
        options: ['0.02', '0.03', '0.05'],
      },
    ],
    2023: [
      {
        label: 'Zona Sísmica',
        type: 'select',
        id: 'ZS',
        options: ['1', '2', '3'],
      },
      {
        label: 'Tipo de suelo',
        type: 'select',
        id: 'Tsuelo',
        options: ['A', 'B', 'C', 'D'],
      },
      {
        label: 'Factor de modificación de la respuesta (R)',
        type: 'select',
        id: 'R',
        options: [
          '1.0',
          '1.5',
          '2.0',
          '2.5',
          '3.0',
          '3.5',
          '4.0',
          '4.5',
          '5.0',
        ],
      },
      {
        label: 'Razón de amortiguamiento (ξ)',
        type: 'select',
        id: 'xi',
        options: ['0.02', '0.03', '0.05'],
      },
    ],
  };

  // Función para bajar resolución de los datos entregados (para compatibilidad con software)
  const lttbDownsample = (data, threshold) => {
    if (!data || threshold <= 0) return {};

    const xValues = Object.keys(data)
      .map(parseFloat)
      .sort((a, b) => a - b);
    const yValues = xValues.map((x) => data[x]); // Obtener los valores de Y en el orden de X

    const dataLength = xValues.length;
    if (threshold >= dataLength || dataLength === 0) {
      const result = {};
      xValues.forEach((x) => (result[x] = data[x]));
      return result;
    }

    const sampled = {};
    const bucketSize = (dataLength - 2) / (threshold - 2);

    let a = 0;
    sampled[xValues[0]] = data[xValues[0]]; // Siempre incluir el primer punto

    for (let i = 0; i < threshold - 2; i++) {
      let avgX = 0;
      let avgY = 0;
      let avgRangeStart = Math.floor((i + 1) * bucketSize) + 1;
      let avgRangeEnd = Math.floor((i + 2) * bucketSize) + 1;
      avgRangeEnd = Math.min(avgRangeEnd, dataLength);

      let avgRangeLength = avgRangeEnd - avgRangeStart;

      for (; avgRangeStart < avgRangeEnd; avgRangeStart++) {
        avgX += xValues[avgRangeStart];
        avgY += yValues[avgRangeStart];
      }
      avgX /= avgRangeLength;
      avgY /= avgRangeLength;

      let pointAX = xValues[a];
      let pointAY = yValues[a];

      let maxArea = -1;
      let nextA = 0;

      for (
        let rangeOffs = Math.floor((i + 1) * bucketSize) + 1;
        rangeOffs < avgRangeEnd;
        rangeOffs++
      ) {
        let pointCX = xValues[rangeOffs];
        let pointCY = yValues[rangeOffs];

        let area =
          Math.abs(
            (pointAX - avgX) * (pointCY - pointAY) -
              (pointAX - pointCX) * (avgY - pointAY)
          ) * 0.5; //Area del triangulo
        if (area > maxArea) {
          maxArea = area;
          nextA = rangeOffs;
        }
      }

      sampled[xValues[nextA]] = data[xValues[nextA]];
      a = nextA;
    }

    sampled[xValues[dataLength - 1]] = data[xValues[dataLength - 1]]; // Siempre incluir el último punto

    return sampled;
  };

  //Función para descargar datos como txt

  const downloadDataAsTxt = (data) => {
    const downsampledData = lttbDownsample(data, 50);
    if (!downsampledData) return;

    const xValues = Object.keys(downsampledData);
    // let content = 'X Values\tY Values\n';
    let content = '';

    for (let i = 0; i < xValues.length; i++) {
      const x = xValues[i];
      const y = downsampledData[x]; // Usa downsampledData[x] para obtener el valor de Y
      if (y !== undefined) {
        // Verifica si y es undefined
        content += `${x}; ${y}\n`;
      } else {
        console.warn(`Valor Y es undefined para X = ${x}`); // Log para diagnóstico
      }
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chart_data.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Función para manejar el cambio de la norma seleccionada
  const handleNormChange = (event) => {
    setSelectedNorm(event.target.value);
    setFormData({
      // Resetear el formulario al cambiar la norma
      ZS: '',
      Tsuelo: '',
      R: '',
      xi: '',
    });
    setChartData(null); // Limpiar los datos del gráfico al cambiar la norma
  };

  // Función para manejar los cambios en los campos del formulario
  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      function_type: selectedNorm,
      ZS: parseFloat(formData.ZS),
      Tsuelo: formData.Tsuelo,
      R: parseFloat(formData.R),
      xi: parseFloat(formData.xi),
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      setChartData(responseData); // Actualiza el estado con los datos del gráfico
      //createChart(responseData); // Crea o actualiza el gráfico
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  // Effect para crear o actualizar el gráfico cuando cambian los datos
  useEffect(() => {
    if (chartData) {
      const chartDataFormatted = {
        labels: Object.keys(chartData),
        datasets: [
          {
            label: 'Espectro de Diseño',
            data: Object.values(chartData),
            backgroundColor: '#003C71',
            borderColor: '#003C71',
            borderWidth: 3,
            pointStyle: false,
          },
        ],
      };
      const chartOptions = {
        scales: {
          y: {
            beginAtZero: true,
            suggestedMax: Math.max(...Object.values(chartData)) + 0.05,
            title: {
              display: true,
              text: 'Sa [g]',
            },
            grid: {
              color: 'rgba(200, 200, 200, 0.8)',
              lineWidth: 1,
              drawBorder: true,
              drawOnChartArea: true,
              drawTicks: true,
            },
          },
          x: {
            min: 0,
            max: 200,
            title: {
              display: true,
              text: 'Período, T [s]',
            },
            grid: {
              color: 'rgba(200, 200, 200, 0.8)',
              lineWidth: 1,
              drawBorder: true,
              drawOnChartArea: true,
              drawTicks: true,
            },
            ticks: {
              stepSize: 50,
            },
          },
        },
      };

      const ctx = chartRef.current.getContext('2d');
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: chartDataFormatted,
        options: chartOptions,
      });
    }
  }, [chartData]);

  return (
    <div className="containerSP">
      <div className="title-sectionSP">
        <i>
          <h1>Espectro de diseño NCh2369</h1>
        </i>
      </div>
      <div className="form-sectionSP">
        <div className="norm-selectorSP">
          <h2>
            <i>Seleccionar Norma</i>
          </h2>
          <select
            id="norm-select"
            value={selectedNorm}
            onChange={handleNormChange}
          >
            <option value="" disabled>
              Seleccione una norma
            </option>
            <option value="2003">Norma 2003</option>
            <option value="2023">Norma 2023</option>
          </select>
        </div>
        {selectedNorm && (
          <div className="form-containerSP">
            <i>
              <h2>Parámetros</h2>
            </i>
            <form id="spectreForm" onSubmit={handleSubmit}>
              <div className="form-fields-containerSP">
                {normOptions[selectedNorm].map((field) => (
                  <div className="form-groupSP" key={field.id}>
                    <label htmlFor={field.id}>{field.label}:</label>
                    {field.type === 'select' ? (
                      <select
                        id={field.id}
                        name={field.id}
                        value={formData[field.id]}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="" disabled>
                          Seleccionar
                        </option>
                        {field.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : null}
                  </div>
                ))}
              </div>
              <button type="submit">Calcular</button>
            </form>
          </div>
        )}
      </div>

      {chartData && (
        <section id="results-sectionSP">
          <i>
            <h2>Resultados</h2>
          </i>
          <div className="graph-containerSP">
            <canvas id="myChart" ref={chartRef}></canvas>
          </div>
          <button
            id="downloadButtonSP"
            onClick={() => downloadDataAsTxt(chartData)}
          >
            Descargar Datos
          </button>
        </section>
      )}
    </div>
  );
}

export default SpectrePlot;
