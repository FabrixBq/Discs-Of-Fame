const contenido = document.getElementById('contenido'); // Objeto de cuadro de contenido
//Objetos de variables
const btn_renta = document.getElementById('btn-renta');
const btn_cancelacion = document.getElementById('bton-cancelacion');
const btn_devolucion = document.getElementById('bton-devolucion');
const btn_listas = document.getElementById('bton-listas');
const btn_ganancias = document.getElementById('bton-ganancias');
const btn_cerrar = document.getElementById('bton-cerrar');


//metodos de navegacion
function formulario_renta(){
    contenido.innerHTML= `
<div class="renta-container">
  <div class="renta-form">
    
    <!-- Columna izquierda -->
    <div class="columna-izquierda">
      <div class="campo">
        <label>Cliente :</label>
        <div class="input-icon">
          <input type="text" placeholder="Buscar cliente...">
          <button class="btn-lupa"><i class="fa fa-search"></i></button>
          <button class="btn-add"><i class="fa fa-plus"></i></button>
        </div>
      </div>

      <div class="campo">
        <label>Película :</label>
        <div class="input-icon">
          <input type="text" placeholder="Buscar película...">
          <button class="btn-lupa"><i class="fa fa-search"></i></button>
        </div>
      </div>

      <div class="campo">
        <label>Empleado :</label>
        <div class="input-icon">
          <select>
            <option value="" disabled selected>Seleccionar empleado...</option>
            <option value="emp1">Mike Hillyer</option>
            <option value="emp2">Jon Stephens</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Separador vertical -->
    <div class="divider"></div>

    <!-- Columna derecha -->
    <div class="columna-derecha">
      <div class="fechas">
        <div class="campo-fecha">
          <label>Día de Renta :</label>
          <input type="datetime-local" class="date-input" id="fechaRenta">
        </div>

        <div class="campo-fecha">
          <label>Día de Devolución :</label>
          <input type="datetime-local" class="date-input" id="fechaDevolucion">
        </div>
      </div>
    </div>
  </div>

  <div class="acciones">
    <button id="confirmar" class="btn-confirmar">Confirmar renta</button>
    <button id="limpiar" class="btn-limpiar">Limpiar Formulario</button>
  </div>
</div>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
`;

    if (!document.querySelector('link[href*="renta.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/static/renta.css';
      document.head.appendChild(link);
    }
  //boton limpiar formulario
  const btnLimpiar = document.getElementById('limpiar');
  btnLimpiar.addEventListener('click', limpiarFormularioRenta);
}




function formulario_cancelacion(){
    contenido.innerHTML= ``;
}

function formulariio_devolucion(){
    //contenido.innerHTML= 'codigo html';
}

function mostrar_ganancias(){
    //contenido.innerHTML= 'codigo html';
}

//solo plantilla AUN NO HAGAN NADA SOBRE ESTE METODO
function lista_aja(){
    //contenido.innerHTML= 'codigo html';
}

function limpiarFormularioRenta() {
  const campos = document.querySelectorAll('.renta-container input, .renta-container select');
  campos.forEach(el => {
    if (el.tagName === 'SELECT') {
      el.selectedIndex = 0; // vuelve al "Seleccionar empleado..."
    } else {
      el.value = ''; // limpia inputs de texto y fecha
    }
  });
}



// Asignar eventos
btn_renta.addEventListener('click', formulario_renta);
btn_cancelacion.addEventListener('click', formulario_cancelacion);
btn_devolucion.addEventListener('click', formulariio_devolucion);
btn_ganancias.addEventListener('click', mostrar_ganancias);
btn_listas.addEventListener('click', lista_aja);

