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
          <input type="text" id="cliente" placeholder="Buscar cliente...">
          <button class="btn-lupa"><i class="fa fa-search"></i></button>
          <button class="btn-add"><i class="fa fa-plus"></i></button>
        </div>
      </div>

      <div class="campo">
        <label>Película :</label>
        <div class="input-icon">
          <input type="text" id="pelicula" placeholder="Buscar película...">
          <button class="btn-lupa"><i class="fa fa-search"></i></button>
        </div>
      </div>

      <div class="campo">
        <label>Empleado :</label>
        <div class="input-icon">
          <select id="empleado">
            <option value="" disabled selected>Seleccionar empleado...</option>
            <option value="Mike Hillyer">Mike Hillyer</option>
            <option value="Jon Stephens">Jon Stephens</option>
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

      <!-- Contenedor donde aparecerá el ticket -->
      <div id="ticket-container"></div>
    </div>
  </div>

  <div class="acciones">
    <button id="confirmar" class="btn-confirmar">Confirmar renta</button>
    <button id="limpiar" class="btn-limpiar">Limpiar Formulario</button>
  </div>
</div>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
`;

  //botón limpiar formulario
  const btnLimpiar = document.getElementById('limpiar');
  btnLimpiar.addEventListener('click', limpiarFormularioRenta);

  //botón confirmar renta
  const btnConfirmar = document.getElementById('confirmar');
  btnConfirmar.addEventListener('click', validarYMostrarTicket);
}


function formulario_cancelacion(){
    contenido.innerHTML = `
        <div class="cancelacion-container">
            <div class="cancelacion-form">
                <h2 class="cancelacion-title">Cancelacion de renta:</h2>
                <p class="cancelacion-subtitle">Ingrese el ID de renta</p>
                
                <div class="cancelacion-input-group">
                    <input 
                        type="text" 
                        id="rental-id-input" 
                        class="cancelacion-input"
                        placeholder="Ingrese ID de renta..." 
                    />
                    <button id="search-rental-btn" class="btn-search-rental">
                        <i class="fas fa-search"></i>
                    </button>
                    <button id="confirm-rental-btn" class="btn-confirm-rental">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
            
            <div id="cancellation-ticket-container" class="cancelacion-ticket-container"></div>
        </div>
        
        <div id="search-popup" class="search-popup">
            <div class="search-popup-content">
                <h3 class="search-popup-title">Resultados de búsqueda</h3>
                <div class="search-popup-table-container">
                    <table class="search-popup-table">
                        <thead>
                            <tr>
                                <th>Rental ID</th>
                                <th>Cliente</th>
                                <th>Película</th>
                                <th>Empleado</th>
                                <th>Fecha de Renta</th>
                                <th>Fecha de Devolución</th>
                                <th>Costo</th>
                            </tr>
                        </thead>
                        <tbody id="search-results-body">
                        </tbody>
                    </table>
                </div>
                <button id="close-popup-btn" class="btn-close-popup">
                    Cerrar
                </button>
            </div>
        </div>
        
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    `

  // TODO: Replace with actual database query
  let rentalData = {
    rental_id: null,
    cliente_atendido: null,
    pelicula_rentada: null,
    empleado_que_atendio: null,
    dia_de_renta: null,
    dia_de_devolucion: null,
    costo: null,
  }

  const rentalIdInput = document.getElementById("rental-id-input")
  const searchBtn = document.getElementById("search-rental-btn")
  const confirmBtn = document.getElementById("confirm-rental-btn")
  const ticketContainer = document.getElementById("cancellation-ticket-container")
  const searchPopup = document.getElementById("search-popup")
  const closePopupBtn = document.getElementById("close-popup-btn")
  const searchResultsBody = document.getElementById("search-results-body")

  // TODO: remplazar con consulta real a la base de datos
  const mockRentalData = [
  { id: 1, cliente: "Juan Pérez", pelicula: "The Matrix", empleado: "Emma", renta: "2024-01-10", devolucion: "2024-01-17", costo: "$4.99" },
  { id: 2, cliente: "María García", pelicula: "Inception", empleado: "Carlos", renta: "2024-02-12", devolucion: "2024-02-19", costo: "$5.50" },
  { id: 3, cliente: "Luis López", pelicula: "Interstellar", empleado: "Sofía", renta: "2024-03-01", devolucion: "2024-03-08", costo: "$6.00" },
  { id: 4, cliente: "Ana Torres", pelicula: "Pulp Fiction", empleado: "Ricardo", renta: "2024-03-20", devolucion: "2024-03-27", costo: "$5.99" },
  { id: 5, cliente: "Pedro Díaz", pelicula: "Fight Club", empleado: "Clara", renta: "2024-04-05", devolucion: "2024-04-12", costo: "$4.50" },
  { id: 6, cliente: "Laura Hernández", pelicula: "Forrest Gump", empleado: "Emma", renta: "2024-04-10", devolucion: "2024-04-17", costo: "$5.25" },
  { id: 7, cliente: "Diego Ramírez", pelicula: "The Godfather", empleado: "Carlos", renta: "2024-05-01", devolucion: "2024-05-08", costo: "$6.50" },
  { id: 8, cliente: "Carmen Flores", pelicula: "Gladiator", empleado: "Sofía", renta: "2024-05-15", devolucion: "2024-05-22", costo: "$5.10" },
  { id: 9, cliente: "Miguel Ruiz", pelicula: "Titanic", empleado: "Ricardo", renta: "2024-06-01", devolucion: "2024-06-08", costo: "$5.80" },
  { id: 10, cliente: "Patricia Vega", pelicula: "Jurassic Park", empleado: "Clara", renta: "2024-06-12", devolucion: "2024-06-19", costo: "$4.99" },
  // puedes agregar más si quieres probar el scroll
]
  // Search button - muestra popup con resultados de búsqueda
  searchBtn.addEventListener("click", () => {
    const searchValue = rentalIdInput.value.trim()

    // TODO: Replace with actual database query filtering by rental_id
    const filteredResults = searchValue
      ? mockRentalData.filter((item) => item.id.toString().includes(searchValue))
      : mockRentalData

    searchResultsBody.innerHTML = filteredResults
      .map(
        (item) => `
            <tr class="search-result-row" data-rental-id="${item.id}">
                <td>${item.id}</td>
                <td>${item.cliente}</td>
                <td>${item.pelicula}</td>
                <td>${item.empleado}</td>
                <td>${item.renta}</td>
                <td>${item.devolucion}</td>
                <td>${item.costo}</td>
            </tr>
        `,
      )
      .join("")

    // Add click event to each row to select rental ID
    document.querySelectorAll(".search-result-row").forEach((row) => {
      row.addEventListener("click", () => {
        rentalIdInput.value = row.dataset.rentalId
        searchPopup.classList.remove("active")
      })
    })

    searchPopup.classList.add("active")
  })

  // Close popup button
  closePopupBtn.addEventListener("click", () => {
    searchPopup.classList.remove("active")
  })

  // Close popup when clicking outside
  searchPopup.addEventListener("click", (e) => {
    if (e.target === searchPopup) {
      searchPopup.classList.remove("active")
    }
  })

  // Confirm button - valida y muestra ticket de cancelacion
  confirmBtn.addEventListener("click", () => {
    const rentalId = rentalIdInput.value.trim()

    // Validate rental ID is not empty
    if (!rentalId) {
      return
    }

    // TODO: Remplazar con consulta real a la base de datos para validar rental ID
    const isValid = mockRentalData.some((item) => item.id.toString() === rentalId)

    if (!isValid) {
      return
    }

    // TODO: Remplazar con consulta real a la base de datos para obtener datos de la renta
    const mockData = mockRentalData.find((item) => item.id.toString() === rentalId)
    rentalData = {
      rental_id: rentalId,
      cliente_atendido: mockData.cliente,
      pelicula_rentada: mockData.pelicula,
      empleado_que_atendio: "Empleado Demo",
      dia_de_renta: "2024-01-15",
      dia_de_devolucion: "2024-01-22",
      costo: "$5.99",
    }

    mostrarTicketCancelacion(rentalData)
  })

  function mostrarTicketCancelacion(data) {
    ticketContainer.innerHTML = `
            <div class="cancelacion-ticket">
                <p><strong>cliente atendido:</strong> ${data.cliente_atendido || ""}</p>
                <p><strong>pelicula rentada:</strong> ${data.pelicula_rentada || ""}</p>
                <p><strong>Empleado que atendio:</strong> ${data.empleado_que_atendio || ""}</p>
                <p><strong>Dia de Renta:</strong> ${data.dia_de_renta || ""}</p>
                <p><strong>Dia de devolucion:</strong> ${data.dia_de_devolucion || ""}</p>
                <p><strong>costo:</strong> ${data.costo || ""}</p>
                
                <div class="cancelacion-ticket-actions">
                    <button id="cancel-operation-btn" class="btn-cancel-operation">
                        <i class="fas fa-times"></i>
                    </button>
                    <button id="confirm-cancellation-btn" class="btn-confirm-cancellation">
                        <i class="fas fa-check"></i>
                    </button>
                </div>
            </div>
        `

    // X button - remueve ticket sin hacer nada
    document.getElementById("cancel-operation-btn").addEventListener("click", () => {
      ticketContainer.innerHTML = ""
    })

    // Checkmark button - remueve ticket y resetea formulario
    document.getElementById("confirm-cancellation-btn").addEventListener("click", () => {
      // TODO: Remplazar con consulta real a la base de datos para eliminar renta
      // DELETE FROM rental WHERE rental_id = rentalData.rental_id

      ticketContainer.innerHTML = ""
      rentalIdInput.value = ""

      // Aqui reseteamos los datos de la renta
      rentalData = {
        rental_id: null,
        cliente_atendido: null,
        pelicula_rentada: null,
        empleado_que_atendio: null,
        dia_de_renta: null,
        dia_de_devolucion: null,
        costo: null,
      }
    })
  }
}


function formulario_devolucion(){
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
          <input id="busqueda_input" type="text" class="busqueda-input" placeholder="Buscar cliente...">
        </div>
        <div class="tabla-scroll">
          <table id="tabla-rentas" class="tabla-rentas">
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
//mostrar ticket de renta
function validarYMostrarTicket() {
  const cliente = document.getElementById('cliente').value.trim();
  const pelicula = document.getElementById('pelicula').value.trim();
  const empleado = document.getElementById('empleado').value;
  const fechaRenta = document.getElementById('fechaRenta').value;
  const fechaDevolucion = document.getElementById('fechaDevolucion').value;

  if (!cliente || !pelicula || !empleado || !fechaRenta || !fechaDevolucion) {
    crearTicket(false, { mensaje: 'Debes llenar todos los campos.' });
    return;
  }

  const datos = {
    cliente,
    pelicula,
    empleado,
    fechaRenta: new Date(fechaRenta).toLocaleString(),
    fechaDevolucion: new Date(fechaDevolucion).toLocaleString()
  };

  crearTicket(true, datos);
}

//crear ticket de renta con los datos brindados
function crearTicket(exito, datos) {
  const contenedor = document.getElementById('ticket-container');
  contenedor.innerHTML = ''; // limpiar si ya hay uno

  const ticket = document.createElement('div');
  ticket.className = `ticket-cuadro ${exito ? 'exito' : 'error'}`;

  if (!exito) {
    ticket.innerHTML = `
      <p class="ticket-msg">Error: ${datos.mensaje}</p>
      <div class="ticket-btns">
        <button class="btn-tacha"><i class="fa fa-times"></i></button>
      </div>
    `;
  } else {
    ticket.innerHTML = `
      <h3>Confirmar renta</h3>
      <p><strong>Cliente:</strong> ${datos.cliente}</p>
      <p><strong>Película:</strong> ${datos.pelicula}</p>
      <p><strong>Empleado:</strong> ${datos.empleado}</p>
      <p><strong>Fecha de renta:</strong> ${datos.fechaRenta}</p>
      <p><strong>Fecha de devolución:</strong> ${datos.fechaDevolucion}</p>

      <div class="ticket-btns">
        <button class="btn-palomita"><i class="fa fa-check"></i></button>
        <button class="btn-tacha"><i class="fa fa-times"></i></button>
      </div>
    `;
  }

  contenedor.appendChild(ticket);

  // Asignar acciones a botones
  const btnPalomita = ticket.querySelector('.btn-palomita');
  const btnTacha = ticket.querySelector('.btn-tacha');

  if (btnPalomita) {
    btnPalomita.addEventListener('click', () => {
      ticket.remove();
      limpiarFormularioRenta();
    });
  }

  if (btnTacha) {
    btnTacha.addEventListener('click', () => ticket.remove());
  }
}



// Asignar eventos
btn_renta.addEventListener('click', formulario_renta);
btn_cancelacion.addEventListener('click', formulario_cancelacion);
btn_devolucion.addEventListener('click', formulariio_devolucion);
btn_ganancias.addEventListener('click', mostrar_ganancias);
//btn_listas.addEventListener('click', lista_aja);