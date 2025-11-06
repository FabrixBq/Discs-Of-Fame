class ModuloRenta {
    constructor() {
        // Este modulo no necesita inicializacion especial
    }

    cargar(contenedor) {
        contenedor.innerHTML = this.obtenerHTML();
        this.configurarEventos();
    }

    obtenerHTML() {
        return `
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

        <!-- Popup nuevo cliente -->
  <div id="popup-cliente" class="popup-overlay">
    <div class="popup-content">
      <h3>Datos del nuevo cliente</h3>
      <hr class="separator-horizontal">

      <form class="form-container">
        <!-- Columna izquierda -->
        <div class="form-column left-column">
          <div class="form-group">
            <label for="store-id">Store ID</label>
            <input type="text" id="store-id" placeholder="">
          </div>

          <div class="form-group">
            <label for="first-name">First Name</label>
            <input type="text" id="first-name" placeholder="">
          </div>

          <div class="form-group">
            <label for="last-name">Last Name</label>
            <input type="text" id="last-name" placeholder="">
          </div>
        </div>

        <div class="separator-vertical"></div>

        <!-- Columna derecha -->
        <div class="form-column right-column">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" placeholder="">
          </div>

          <div class="form-group">
            <label for="address-id">Address ID</label>
            <input type="text" id="address-id" placeholder="">
          </div>
        </div>
      </form>

      <div class="popup-buttons">
        <button type="button" id="guardarCliente" class="btn-confirmar">Guardar</button>
        <button type="button" id="cerrarPopupCliente" class="btn-cancelar">Cancelar</button>
      </div>
    </div>
  </div>

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        `;
    }

    configurarEventos() {
        const btnLimpiar = document.getElementById("limpiar");
        const btnConfirmar = document.getElementById("confirmar");
        
        btnLimpiar.addEventListener("click", () => this.limpiarFormulario());
        btnConfirmar.addEventListener("click", () => this.validarYMostrarTicket());

        //popup cliente
        const popup = document.getElementById("popup-cliente");
        const btnAdd = document.querySelector(".btn-add");
        const btnCerrarPopup = document.getElementById("cerrarPopupCliente");
        const btnGuardarCliente = document.getElementById("guardarCliente");

        // Abrir popup
        btnAdd.addEventListener("click", () => popup.classList.add("active"))

         // Cerrar popup (botón cancelar)
        btnCerrarPopup.addEventListener("click", () => popup.classList.remove("active"))

       // Cerrar popup ( si se hace clic fuera)
       popup.addEventListener("click", (e) => {
      if (e.target === popup) popup.classList.remove("active")
    })

     // Guardar cliente
      btnGuardarCliente.addEventListener("click", () => {
      const storeId = document.getElementById("store-id").value.trim()
      const nombre = document.getElementById("first-name").value.trim()
      const apellido = document.getElementById("last-name").value.trim()
      const email = document.getElementById("email").value.trim()
      const direccion = document.getElementById("address-id").value.trim()

      if (!storeId || !nombre || !apellido || !email || !direccion) {
        alert("Todos los campos son obligatorios")
        return
      }

      // Muestra el nombre completo en el campo cliente
      document.getElementById("cliente").value = `${nombre} ${apellido}`
      popup.classList.remove("active")
    })

    }

    limpiarFormulario() {
        const campos = document.querySelectorAll("#modulo-renta input, #modulo-renta select");
        campos.forEach((el) => {
            if (el.tagName === "SELECT") el.selectedIndex = 0;
            else el.value = "";
        });
    }

    validarYMostrarTicket() {
        const cliente = document.getElementById("cliente").value.trim();
        const pelicula = document.getElementById("pelicula").value.trim();
        const empleado = document.getElementById("empleado").value;
        const fechaRenta = document.getElementById("fechaRenta").value;

        if (!cliente || !pelicula || !empleado || !fechaRenta) {
            this.crearTicket(false, { mensaje: "Debes llenar todos los campos." });
            return;
        }

        this.crearTicket(true, {
            cliente,
            pelicula,
            empleado,
            fechaRenta: new Date(fechaRenta).toLocaleString(),
            fechaDevolucion: "Pendiente",
        });
    }

    crearTicket(exito, datos) {
        const contenedor = document.getElementById("ticket-container");
        contenedor.innerHTML = "";

        const ticket = document.createElement("div");
        ticket.className = `ticket-cuadro ${exito ? "exito" : "error"}`;
        ticket.innerHTML = this.obtenerHTMLTicket(exito, datos);
        contenedor.appendChild(ticket);

        this.configurarEventosTicket(ticket);
    }

    obtenerHTMLTicket(exito, datos) {
        if (exito) {
            return `
                <h3>Confirmar renta</h3>
                <p><strong>Cliente:</strong> ${datos.cliente}</p>
                <p><strong>Película:</strong> ${datos.pelicula}</p>
                <p><strong>Empleado:</strong> ${datos.empleado}</p>
                <p><strong>Fecha de renta:</strong> ${datos.fechaRenta}</p>
                <p><strong>Fecha de devolución:</strong> ${datos.fechaDevolucion}</p>
                <div class="ticket-btns">
                    <button class="btn-palomita"><i class="fa fa-check"></i></button>
                    <button class="btn-tacha"><i class="fa fa-times"></i></button>
                </div>`;
        } else {
            return `
                <p class="ticket-msg">Error: ${datos.mensaje}</p>
                <div class="ticket-btns">
                    <button class="btn-tacha"><i class="fa fa-times"></i></button>
                </div>`;
        }
    }

    configurarEventosTicket(ticket) {
        const btnPalomita = ticket.querySelector(".btn-palomita");
        const btnTacha = ticket.querySelector(".btn-tacha");
        
        if (btnPalomita) {
            btnPalomita.addEventListener("click", () => { 
                ticket.remove(); 
                this.limpiarFormulario(); 
            });
        }
        if (btnTacha) {
            btnTacha.addEventListener("click", () => ticket.remove());
        }
    }
}