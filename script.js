// ### FUNCIONES DE LA INTERFAZ DE USUARIO

 // Evento de clic para el botón de ayuda
document.getElementById('btnAyuda').addEventListener('click', function() {
    // Abrir la página de ayuda en una nueva ventana o pestaña
    window.open('ayuda.html', '_blank');
});


// ### FUNCIONES ESCENCIALES PARA EL CÁLCULO DE FUNDACIONES AISLADAS


// Función para calcular el factor de seguridad al volcamiento
function calcularFactorSeguridadVolcamiento(axial, ancho, altura, resistencia) {
    // Calcular el momento de volcamiento
    let momentoVolcamiento = axial * ancho / 2;

    // Calcular el momento resistente
    let momentoResistente = resistencia * altura / 2;

    // Calcular el factor de seguridad al volcamiento
    let factorSeguridad = momentoResistente / momentoVolcamiento;

    return factorSeguridad;
}

// Función para calcular el factor de seguridad al deslizamiento
function calcularFactorSeguridadDeslizamiento(axial, coeficienteFriccion, resistencia) {
    // Calcular la fuerza de fricción
    let fuerzaFriccion = coeficienteFriccion * axial;

    // Calcular el factor de seguridad al deslizamiento
    let factorSeguridad = resistencia / fuerzaFriccion;

    return factorSeguridad;
}

// Función para manejar el envío del formulario
function handleSubmit(event) {
    event.preventDefault();

    // Obtener los valores del formulario
    let axial = parseFloat(document.getElementById('axial').value);
    let ancho = parseFloat(document.getElementById('ancho').value);
    let altura = parseFloat(document.getElementById('altura').value);
    let resistencia = parseFloat(document.getElementById('resistencia').value);
    let coeficienteFriccion = parseFloat(document.getElementById('coeficiente-friccion').value);

    // Calcular los factores de seguridad
    let factorSeguridadVolcamiento = calcularFactorSeguridadVolcamiento(axial, ancho, altura, resistencia);
    let factorSeguridadDeslizamiento = calcularFactorSeguridadDeslizamiento(axial, coeficienteFriccion, resistencia);

    // Mostrar los resultados
    mostrarResultados(factorSeguridadVolcamiento, factorSeguridadDeslizamiento);
}

// Función para mostrar los resultados en la interfaz
function mostrarResultados(factorSeguridadVolcamiento, factorSeguridadDeslizamiento) {
    document.getElementById('resultado-volcamiento').innerText = factorSeguridadVolcamiento.toFixed(2);
    document.getElementById('resultado-deslizamiento').innerText = factorSeguridadDeslizamiento.toFixed(2);
}

// Asociar la función handleSubmit al evento submit del formulario
document.getElementById('calculo-form').addEventListener('submit', handleSubmit);



// Función para dibujar el rectángulo con Two.js y mostrarlo en un div
function dibujarRectangulo(ancho, altura) {
    
    // Crear un lienzo Two.js
    var two = new Two();

    // Obtener el contenedor
    var contenedor = document.getElementById('figure-container');

    // Calcular las coordenadas del rectángulo para centrarlo
    var x = (contenedor.offsetWidth - ancho) / 2;
    var y = (contenedor.offsetHeight - altura) / 2;

    // Dibujar el rectángulo con Two.js
    var rectangulo = two.makeRectangle(x + ancho / 2, y + altura / 2, ancho, altura);
    rectangulo.fill = 'red'; // Cambiar el color a rojo


    // Renderizar el lienzo
    two.update();

    // Obtener la representación SVG del rectángulo
    var svgString = two.renderer.domElement.outerHTML;

    // Mostrar la figura en el div
    document.getElementById('figure-container').innerHTML = svgString;
}

// Asociar la función dibujarRectangulo al evento input de los campos de ancho y altura
document.getElementById('ancho').addEventListener('input', function() {
    var ancho = parseFloat(document.getElementById('ancho').value);
    var altura = parseFloat(document.getElementById('altura').value);
    dibujarRectangulo(ancho, altura);
});
document.getElementById('altura').addEventListener('input', function() {
    var ancho = parseFloat(document.getElementById('ancho').value);
    var altura = parseFloat(document.getElementById('altura').value);
    dibujarRectangulo(ancho, altura);
});


var ancho = 500;
var altura = 200;
dibujarRectangulo(ancho, altura);





