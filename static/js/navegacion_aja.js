// Botones principales
const btn_renta = document.getElementById("btn-renta");
const btn_cancelacion = document.getElementById("bton-cancelacion");
const btn_devolucion = document.getElementById("bton-devolucion");
const btn_listas = document.getElementById("bton-listas");
const btn_ganancias = document.getElementById("bton-ganancias");
const btn_cerrar = document.getElementById("bton-cerrar");

// Opciones del menú "Listas"
const op_renta_clientes = document.getElementById("op_RC");
const op_dvds_no_devueltos = document.getElementById("DVDnd");
const op_dvds_mas_rentados = document.getElementById("DVDmr");

// Variables globales
let opcion_lista = 0;
const opciones = [
  { id: "op_RC", valor: 1 },
  { id: "DVDnd", valor: 2 },
  { id: "DVDmr", valor: 3 },
];

function formulario_renta() {
  contenido.innerHTML = `
  <div id="modulo-renta">
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
          </div>

          <!-- Contenedor del ticket -->
          <div id="ticket-container"></div>
        </div>
      </div>

      <div class="acciones">
        <button id="confirmar" class="btn-confirmar">Confirmar renta</button>
        <button id="limpiar" class="btn-limpiar">Limpiar Formulario</button>
      </div>
    </div>
  </div>

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  `;

  //  Eventos locales del módulo
  const btnLimpiar = document.getElementById("limpiar");
  btnLimpiar.addEventListener("click", limpiarFormularioRenta);

  const btnConfirmar = document.getElementById("confirmar");
  btnConfirmar.addEventListener("click", validarYMostrarTicket);
}

function formulario_cancelacion() {
  contenido.innerHTML = `
  <div id="modulo-cancelacion">
    <div class="cancelacion-container">
      <div class="cancelacion-form">
        <h2 class="cancelacion-title">Cancelación de renta:</h2>
        <p class="cancelacion-subtitle">Ingrese el ID de renta</p>

        <div class="cancelacion-input-group">
          <input 
            type="text" 
            id="rental-id-input" 
            class="cancelacion-input"
            placeholder="Ingrese ID de renta..." 
          />
          <button id="search-rental-btn" class="btn-search-rental"><i class="fas fa-search"></i></button>
          <button id="confirm-rental-btn" class="btn-confirm-rental"><i class="fas fa-plus"></i></button>
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
            <tbody id="search-results-body"></tbody>
          </table>
        </div>
        <button id="close-popup-btn" class="btn-close-popup">Cerrar</button>
      </div>
    </div>
  </div>

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  `;


  const rentalIdInput = document.getElementById("rental-id-input");
  const searchBtn = document.getElementById("search-rental-btn");
  const confirmBtn = document.getElementById("confirm-rental-btn");
  const ticketContainer = document.getElementById("cancellation-ticket-container");
  const searchPopup = document.getElementById("search-popup");
  const closePopupBtn = document.getElementById("close-popup-btn");
  const searchResultsBody = document.getElementById("search-results-body");

  /* --- Buscar renta (abre popup) --- */
  searchBtn.addEventListener("click", () => {
    const searchValue = rentalIdInput.value.trim();
    const filteredResults = buscarRentas(searchValue);

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
        </tr>`
      )
      .join("");

    document.querySelectorAll(".search-result-row").forEach((row) => {
      row.addEventListener("click", () => {
        rentalIdInput.value = row.dataset.rentalId;
        searchPopup.classList.remove("active");
      });
    });

    searchPopup.classList.add("active");
  });

  closePopupBtn.addEventListener("click", () => searchPopup.classList.remove("active"));
  searchPopup.addEventListener("click", (e) => {
    if (e.target === searchPopup) searchPopup.classList.remove("active");
  });

  /* --- Confirmar cancelación --- */
  confirmBtn.addEventListener("click", () => {
    const rentalId = rentalIdInput.value.trim();
    const mockData = mockRentalData.find((item) => item.id.toString() === rentalId);
    if (!mockData) return;

    rentalData = { ...mockData, rental_id: rentalId };
    mostrarTicketCancelacion(rentalData);
  });

  /* --- Mostrar ticket --- */
  function mostrarTicketCancelacion(data) {
    ticketContainer.innerHTML = `
      <div class="cancelacion-ticket">
        <p><strong>Cliente:</strong> ${data.cliente}</p>
        <p><strong>Película:</strong> ${data.pelicula}</p> 
        <p><strong>Empleado:</strong> ${data.empleado}</p>
        <p><strong>Renta:</strong> ${data.renta}</p>
        <p><strong>Devolución:</strong> ${data.devolucion}</p>
        <p><strong>Costo:</strong> ${data.costo}</p>
        <div class="cancelacion-ticket-actions">
          <button id="cancel-operation-btn" class="btn-cancel-operation"><i class="fas fa-times"></i></button>
          <button id="confirm-cancellation-btn" class="btn-confirm-cancellation"><i class="fas fa-check"></i></button>
        </div>
      </div>`;

    document.getElementById("cancel-operation-btn").addEventListener("click", () => {
      ticketContainer.innerHTML = "";
    });

    document.getElementById("confirm-cancellation-btn").addEventListener("click", () => {
      ticketContainer.innerHTML = "";
      rentalIdInput.value = "";
      rentalData = {};
    });
  }
}//acabado formulario cancelacion

function formulario_devolucion() {
  contenido.innerHTML = `
  <div id="modulo-devolucion">
    <div class="devolucion-container">
      <div class="devolucion-form">
         <h2 class="devolucion-title">Devolución de renta:</h2>
         <p class="devolucion-subtitle">Ingrese el ID de renta</p>

        <div class="devolucion-input-group">
          <input 
            type="text" 
            id="rental-id-input" 
            class="devolucion-input"
            placeholder="Ingrese ID de renta..." 
          />
          <button id="search-rental-btn" class="btn-search-rental"><i class="fas fa-search"></i></button>
          <button id="confirm-rental-btn" class="btn-confirm-rental"><i class="fas fa-plus"></i></button>
        </div>
      </div>

      <div id="devolucion-ticket-container" class="devolucion-ticket-container"></div>
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
            <tbody id="search-results-body"></tbody>
          </table>
        </div>
        <button id="close-popup-btn" class="btn-close-popup">Cerrar</button>
      </div>
    </div>
  </div>

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  `;

  const rentalIdInput = document.getElementById("rental-id-input");
  const searchBtn = document.getElementById("search-rental-btn");
  const confirmBtn = document.getElementById("confirm-rental-btn");
  const ticketContainer = document.getElementById("devolucion-ticket-container");
  const searchPopup = document.getElementById("search-popup");
  const closePopupBtn = document.getElementById("close-popup-btn");
  const searchResultsBody = document.getElementById("search-results-body");

  /* --- Buscar renta (abre popup) --- */
  searchBtn.addEventListener("click", () => {
    const searchValue = rentalIdInput.value.trim();
    const filteredResults = buscarRentas(searchValue);

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
        </tr>`
      )
      .join("");

    document.querySelectorAll(".search-result-row").forEach((row) => {
      row.addEventListener("click", () => {
        rentalIdInput.value = row.dataset.rentalId;
        searchPopup.classList.remove("active");
      });
    });

    searchPopup.classList.add("active");
  });

  closePopupBtn.addEventListener("click", () => searchPopup.classList.remove("active"));
  searchPopup.addEventListener("click", (e) => {
    if (e.target === searchPopup) searchPopup.classList.remove("active");
  });

  /* --- Confirmar devolución --- */
  confirmBtn.addEventListener("click", () => {
    const rentalId = rentalIdInput.value.trim();
    const mockData = mockRentalData.find((item) => item.id.toString() === rentalId);
    if (!mockData) return;

    // Simula actualización de la fecha de devolución a la actual
    const fechaActual = new Date().toLocaleString();

    const updatedData = {
      ...mockData,
      devolucion: fechaActual, // se actualiza la devolución con la fecha actual
    };

    mostrarTicketDevolucion(updatedData);
  });

  /* --- Mostrar ticket --- */
  function mostrarTicketDevolucion(data) {
    const ticketContainer = document.getElementById("devolucion-ticket-container");

    ticketContainer.innerHTML = `
      <div class="devolucion-ticket">
        <p><strong>Cliente:</strong> ${data.cliente}</p>
        <p><strong>Película:</strong> ${data.pelicula}</p> 
        <p><strong>Empleado:</strong> ${data.empleado}</p>
        <p><strong>Fecha de renta:</strong> ${data.renta}</p>
        <p><strong>Fecha de devolución:</strong> ${data.devolucion}</p>
        <p><strong>Costo:</strong> ${data.costo}</p>
        <div class="devolucion-ticket-actions">
          <button id="cancel-operation-btn" class="btn-cancel-operation"><i class="fas fa-times"></i></button>
          <button id="confirm-devolucion-btn" class="btn-confirm-devolucion"><i class="fas fa-check"></i></button>
        </div>
      </div>`;

    document.getElementById("cancel-operation-btn").addEventListener("click", () => {
      ticketContainer.innerHTML = "";
    });

    document.getElementById("confirm-devolucion-btn").addEventListener("click", () => {
      ticketContainer.innerHTML = "";
    });
  }
}

function listas() {
  if (opcion_lista === 1) {
    contenido.innerHTML = `
    <div id="modulo-listas" class="tabla-container">
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
            <tr><td>001</td><td>Juan Pérez</td><td>Avengers</td><td>2024-01-15</td><td>2024-01-20</td><td>Devuelto</td></tr>
          </tbody>
        </table>
      </div>
    </div>`;
  }
}//aqui termina listas

// Limpiar formulario de renta
function limpiarFormularioRenta() {
  const campos = document.querySelectorAll("#modulo-renta input, #modulo-renta select");
  campos.forEach((el) => {
    if (el.tagName === "SELECT") el.selectedIndex = 0;
    else el.value = "";
  });
}

// Validar y mostrar ticket de renta
function validarYMostrarTicket() {
  const cliente = document.getElementById("cliente").value.trim();
  const pelicula = document.getElementById("pelicula").value.trim();
  const empleado = document.getElementById("empleado").value;
  const fechaRenta = document.getElementById("fechaRenta").value;
  const fechaDevolucion = null; // Siempre null hasta que se devuelva la película

  if (!cliente || !pelicula || !empleado || !fechaRenta ) {// fechaDevolucion sera siempre null hasta que se devuelva la pelicula
    crearTicket(false, { mensaje: "Debes llenar todos los campos." });
    return;
  }

  crearTicket(true, {
    cliente,
    pelicula,
    empleado,
    fechaRenta: new Date(fechaRenta).toLocaleString(),
    fechaDevolucion: "Pendiente",
  });
}

function crearTicket(exito, datos) {
  const contenedor = document.getElementById("ticket-container");
  contenedor.innerHTML = "";

  const ticket = document.createElement("div");
  ticket.className = `ticket-cuadro ${exito ? "exito" : "error"}`;

  ticket.innerHTML = exito
    ? `
      <h3>Confirmar renta</h3>
      <p><strong>Cliente:</strong> ${datos.cliente}</p>
      <p><strong>Película:</strong> ${datos.pelicula}</p>
      <p><strong>Empleado:</strong> ${datos.empleado}</p>
      <p><strong>Fecha de renta:</strong> ${datos.fechaRenta}</p>
      <p><strong>Fecha de devolución:</strong> ${datos.fechaDevolucion}</p>
      <div class="ticket-btns">
        <button class="btn-palomita"><i class="fa fa-check"></i></button>
        <button class="btn-tacha"><i class="fa fa-times"></i></button>
      </div>`
    : `
      <p class="ticket-msg">Error: ${datos.mensaje}</p>
      <div class="ticket-btns">
        <button class="btn-tacha"><i class="fa fa-times"></i></button>
      </div>`;

  contenedor.appendChild(ticket);

  const btnPalomita = ticket.querySelector(".btn-palomita");
  const btnTacha = ticket.querySelector(".btn-tacha");
  if (btnPalomita) btnPalomita.addEventListener("click", () => { ticket.remove(); limpiarFormularioRenta(); });
  if (btnTacha) btnTacha.addEventListener("click", () => ticket.remove());
}


btn_renta.addEventListener("click", formulario_renta);
btn_cancelacion.addEventListener("click", formulario_cancelacion);
btn_devolucion.addEventListener("click", formulario_devolucion);
btn_ganancias.addEventListener("click", () => {});

opciones.forEach((opcion) => {
  document.getElementById(opcion.id).addEventListener("click", () => {
    opcion_lista = opcion.valor;
    listas();
  });
});

/* === Datos globales reutilizables para la tabla de busquedas */
let rentalData = {
  rental_id: null,
  cliente_atendido: null,
  pelicula_rentada: null,
  empleado_que_atendio: null,
  dia_de_renta: null,
  dia_de_devolucion: null,
  costo: null,
};

/* --- Base de datos simulada (mock) --- */
const mockRentalData = [
  { id: 1, cliente: "Juan Pérez", pelicula: "The Matrix", empleado: "Emma", renta: "2024-01-10", devolucion: "2024-01-17", costo: "$4.99" },
    { id: 2, cliente: "María García", pelicula: "Inception", empleado: "Carlos", renta: "2024-02-12", devolucion: "2024-02-19", costo: "$5.50" },
    { id: 3, cliente: "Luis López", pelicula: "Interstellar", empleado: "Sofía", renta: "2024-03-01", devolucion: "2024-03-08", costo: "$6.00" },
    { id: 4, cliente: "Ana Martínez", pelicula: "Avatar", empleado: "Miguel", renta: "2024-04-15", devolucion: "2024-04-22", costo: "$7.25" },
    { id: 5, cliente: "Pedro Sánchez", pelicula: "Titanic", empleado: "Laura", renta: "2024-05-20", devolucion: "2024-05-27", costo: "$5.75" },
    { id: 1, cliente: "Juan Pérez", pelicula: "The Matrix", empleado: "Emma", renta: "2024-01-10", devolucion: "2024-01-17", costo: "$4.99" },
    { id: 2, cliente: "María García", pelicula: "Inception", empleado: "Carlos", renta: "2024-02-12", devolucion: "2024-02-19", costo: "$5.50" },
    { id: 3, cliente: "Luis López", pelicula: "Interstellar", empleado: "Sofía", renta: "2024-03-01", devolucion: "2024-03-08", costo: "$6.00" }
  ];


/* === Función común de búsqueda (reutilizable para cancelacion y devolucion) === */
function buscarRentas(searchValue) {
  return searchValue
    ? mockRentalData.filter((item) => item.id.toString().includes(searchValue))
    : mockRentalData;
}