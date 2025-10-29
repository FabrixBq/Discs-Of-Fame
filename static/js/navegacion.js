const contenido = document.getElementById('contenido'); // Objeto de cuadro de contenido
//Objetos de variables de HTML
const btn_renta = document.getElementById('btn-renta');
const btn_cancelacion = document.getElementById('bton-cancelacion');
const btn_devolucion = document.getElementById('bton-devolucion');
const btn_listas = document.getElementById('bton-listas');
const btn_ganancias = document.getElementById('bton-ganancias');
const btn_cerrar = document.getElementById('bton-cerrar');
const op_renta_clientes = document.getElementById('op_RC');
const op_dvds_no_devueltos = document.getElementById('DVDnd');
const op_dvds_mas_rentados = document.getElementById('DVDmr');

//Variables
let opcion_lista = 0;

const opciones = [
    {id: 'op_RC', valor: 1},
    {id: 'DVDnd', valor: 2},
    {id: 'DVDmr', valor: 3}
];

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
function listas(){
  if (opcion_lista==1){//Rentas por cliente
    contenido.innerHTML = `
      <div class="tabla-container">
        <div class="busqueda-container">
          <input type="text" class="busqueda-input" placeholder="Buscar cliente...">
        </div>
        <div class="tabla-scroll">
          <table class="tabla-rentas">
            <thead>
              <tr>
                <th>ID Cliente</th>
                <th>Nombre</th>
                <th>Película</th>
                <th>Fecha Renta</th>
                <th>Fecha Devolución</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>001</td>
                <td>Juan Pérez</td>
                <td>Avengers: Endgame</td>
                <td>2024-01-15</td>
                <td>2024-01-20</td>
                <td>Devuelto</td>
              </tr>
              <tr>
                <td>002</td>
                <td>María García</td>
                <td>The Dark Knight</td>
                <td>2024-01-16</td>
                <td>2024-01-25</td>
                <td>Pendiente</td>
              </tr>
              <tr>
                <td>003</td>
                <td>Carlos López</td>
                <td>Inception</td>
                <td>2024-01-17</td>
                <td>2024-01-22</td>
                <td>Devuelto</td>
              </tr>
              <!-- Más filas se agregarán dinámicamente -->
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
  if (opcion_lista==2){//dvds no devueltos
    // Código para DVDs no devueltos
  }
  if (opcion_lista==3){//dvds mas rentados
    // Código para DVDs más rentados
  }
}

//Acciones
opciones.forEach(opcion => {
    document.getElementById(opcion.id).addEventListener('click', function() {
        opcion_lista = opcion.valor;
        console.warn(" " + opcion_lista);
        listas();
    });
});

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
//btn_listas.addEventListener('click', lista_aja);