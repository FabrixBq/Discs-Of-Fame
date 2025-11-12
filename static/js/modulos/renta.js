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
                                <button class="btn-lupaMov"><i class="fa fa-search"></i></button>
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

  <!--popup ver clientes existentes-->
              <div id="search-popupCos" class="search-popup">
                <div class="search-popup-content">
                    <h3 class="search-popup-title">Clientes Actuales</h3>
                    <div class="search-popup-table-container">
                        <table class="search-popup-table">
                            <thead>
                                <tr>
                                    <th>Cliente ID</th>
                                    <th>Store ID</th>
                                    <th>Nombre</th>
                                    <th>Apellido</th>
                                    <th>Email</th>
                                    <th>Addres ID</th>
                                </tr>
                            </thead>
                            <tbody id="search-results-body"></tbody>
                        </table>
                    </div>
                    <button id="cerrarPopupClienteBusqueda" class="btn-close-popup">Cerrar</button>
                </div>
            </div>
        </div>

      <!--popup ver peliculas existentes-->
              <div id="search-popupMov" class="search-popup">
                <div class="search-popup-content" id="search-popup-contentMov">
                    <h3 class="search-popup-title">Peliculas Actuales</h3>
                    <div class="search-popup-table-container">
                        <table class="search-popup-table">
                            <thead>
                                <tr>
                                    <th>Inventory ID</th>
                                    <th>Film ID</th>
                                    <th>Film Name</th>
                                    <th>Store ID</th>
                                    <th>Store Address</th>
                                    <th>Category</th>
                                </tr>
                            </thead>
                            <tbody id="search-results-bodyMov"></tbody>
                        </table>
                    </div>
                    <button id="cerrarPopupMovieBusqueda" class="btn-close-popup">Cerrar</button>
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
        const btnLupaC = document.querySelector(".btn-lupa");
        const btnLupaMov = document.querySelector(".btn-lupaMov");

        const btnCerrarPopup = document.getElementById("cerrarPopupCliente");
        const btnGuardarCliente = document.getElementById("guardarCliente");
      

        // Abrir popup
        btnAdd.addEventListener("click", () => popup.classList.add("active"))
        btnLupaC.addEventListener("click", () => this.abrirPopupBusquedaClientes());
        btnLupaMov.addEventListener("click", () => this.abrirPopupBusquedaMovies());
         // Cerrar popup (botón cancelar)
        btnCerrarPopup.addEventListener("click", () => popup.classList.remove("active"))
        

       // Cerrar popup ( si se hace clic fuera)
       popup.addEventListener("click", (e) => {
      if (e.target === popup) popup.classList.remove("active")
    })

     // Guardar cliente
btnGuardarCliente.addEventListener("click", async () => {
  const storeId = document.getElementById("store-id").value.trim();
  const nombre = document.getElementById("first-name").value.trim();
  const apellido = document.getElementById("last-name").value.trim();
  const email = document.getElementById("email").value.trim();
  const direccion = document.getElementById("address-id").value.trim();

  if (!storeId || !nombre || !apellido || !email || !direccion) {
    alert("Todos los campos son obligatorios");
    return;
  }

  try {
    const response = await fetch("/rentas/clientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        store_id: storeId,
        first_name: nombre,
        last_name: apellido,
        email: email,
        address_id: direccion,
      }),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      // Aquí actualizamos el input cliente con el ID nuevo
      document.getElementById("cliente").value = result.customer_id;
      alert(result.message);

      // Cerrar popup
      popup.classList.remove("active");

      // Limpiar formulario del popup
      document.querySelectorAll("#popup-cliente input").forEach(i => i.value = "");
    } else {
      alert(result.error || "No se pudo crear el cliente");
    }
  } catch (error) {
    console.error("Error al crear cliente:", error);
    alert("Error al conectar con el servidor");
  }
});
    }

    abrirPopupBusquedaClientes() {
    const popupCos = document.getElementById("search-popupCos");
    const btnCerrarCos = document.getElementById("cerrarPopupClienteBusqueda");
    const popupContent = popupCos.querySelector(".search-popup-content");

    popupCos.classList.add("active");

    // Evita que los clics dentro del contenido cierren el popup
    popupContent.addEventListener("click", (e) => e.stopPropagation());

    // Cerrar con botón o clic fuera
    btnCerrarCos.addEventListener("click", () => popupCos.classList.remove("active"));
    popupCos.addEventListener("click", (e) => {
        if (e.target === popupCos) popupCos.classList.remove("active");
    });

    const q = document.getElementById("cliente").value.trim();
    this.buscarClientes(q);
}


    // función principal que hace fetch al backend
    async buscarClientes(q) {
        try {
            // encodeURIComponent y permitimos vacío
            const response = await fetch(`/rentas/clientes?q=${encodeURIComponent(q)}`);
            const data = await response.json();
                if (!response.ok) {
                    console.error(data);
                    alert(data.error || "Error al buscar clientes");
                    return;
                }
                this.mostrarResultadosClientes(data);
            } catch (err) {
                console.error("Error en buscarClientes:", err);
                alert("Error al buscar clientes.");
            }
        }

    // llenar la tabla del popup con los resultados
    mostrarResultadosClientes(resultados) {
        const tbody = document.getElementById("search-results-body");
        tbody.innerHTML = resultados.map(item => this.obtenerFilaCliente(item)).join("");
        this.configurarEventosResultadoClientes();
        }
    
    // crear la fila HTML para cada cliente
    obtenerFilaCliente(item) {
        return `
            <tr class="search-client-row" data-customer-id="${item.customer_id}">
                <td>${item.customer_id}</td>
                <td>${item.store_id}</td>
                <td>${item.first_name}</td>
                <td>${item.last_name}</td>
                <td>${item.email}</td>
                <td>${item.address_id}</td>
            </tr>
        `;
    }
  
    // Cuando el usuario haga click sobre una fila, rellenar el campo cliente con el ID y cerrar popup
    configurarEventosResultadoClientes() {
    const popupCos = document.getElementById("search-popupCos");

    document.querySelectorAll(".search-client-row").forEach(row => {
        row.addEventListener("click", (e) => {
            e.stopPropagation(); // evita que el clic llegue al overlay
            const customerId = row.dataset.customerId;

            // Mostrar solo el ID en el campo visible
            document.getElementById("cliente").value = customerId;

            // Guardar también en input oculto (si existe)
            const hiddenInput = document.getElementById("cliente-id");
            if (hiddenInput) hiddenInput.value = customerId;

            // Cerrar el popup
            popupCos.classList.remove("active");
        });
    });
}

    abrirPopupBusquedaMovies() {
    const popupMov = document.getElementById("search-popupMov");
    const btnCerrarMov = document.getElementById("cerrarPopupMovieBusqueda");
    const popupContent = popupMov.querySelector("#search-popup-contentMov");


    popupMov.classList.add("active");

    // Evita que los clics dentro del contenido cierren el popup
    popupContent.addEventListener("click", (e) => e.stopPropagation());
    // Cerrar con botón o clic fuera
    btnCerrarMov.addEventListener("click", () => popupMov.classList.remove("active"));
    popupMov.addEventListener("click", (e) => {
        if (e.target === popupMov) popupMov.classList.remove("active");
    });
    //obtiene el valor del input de pelicula
    const q = document.getElementById("pelicula").value.trim();
    this.buscarMovies(q);

    }

    // función principal que hace fetch al backend
    async buscarMovies(q) {
        try {
            // encodeURIComponent y permitimos vacío
            const response = await fetch(`/rentas/movies?q=${encodeURIComponent(q)}`);
            const data = await response.json();
                if (!response.ok) {
                    console.error(data);
                }
                this.mostrarResultadosMovies(data);
            } catch (err) {
                console.error("Error en buscarMovies:", err);
                alert("Error al buscar películas.");
            }
        }
    
    // llenar la tabla del popup con los resultados
    mostrarResultadosMovies(resultados) {
        const tbody = document.getElementById("search-results-bodyMov");
        tbody.innerHTML = resultados.map(item => this.obtenerFilaMovie(item)).join("");
        this.configurarEventosResultadoMovies();
        }
    
    // crear la fila HTML para cada película
    obtenerFilaMovie(item) {
        return `
            <tr class="search-movie-row" data-inventory-id="${item.inventory_id}">
                <td>${item.inventory_id}</td>
                <td>${item.film_id}</td>
                <td>${item.film_name}</td>
                <td>${item.store_id}</td>
                <td>${item.store_address}</td>
                <td>${item.category}</td>
            </tr>
        `;
    }
    // Cuando el usuario haga click sobre una fila, rellenar el campo película con el ID y cerrar popup
    configurarEventosResultadoMovies() {
    const popupMov = document.getElementById("search-popupMov");

    // Remueve listeners previos para evitar duplicados
    document.querySelectorAll(".search-movie-row").forEach(row => {
        row.replaceWith(row.cloneNode(true)); // limpia listeners
    });

    // Reasigna listeners a los nuevos nodos
    document.querySelectorAll(".search-movie-row").forEach(row => {
        row.addEventListener("click", (e) => {
            e.stopPropagation(); // evita que el overlay también reciba el clic
            const inventoryId = row.dataset.inventoryId;

            // Muestra el inventory_id en el input visible
            document.getElementById("pelicula").value = inventoryId;

            //input oculto
            const hiddenInput = document.getElementById("pelicula-id");
            if (hiddenInput) hiddenInput.value = inventoryId;

            // Cierra el popup
            popupMov.classList.remove("active");
        });
    });
}

//-- Funciones de renta --


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
        // Obtener datos de la renta desde los inputs
        btnPalomita.addEventListener("click", async () => {
        const customerId = document.getElementById("cliente").value.trim();
        const inventoryId = document.getElementById("pelicula").value.trim();
        const empleadoNombre = document.getElementById("empleado").value;
        const fechaRenta = document.getElementById("fechaRenta").value;
        
        // Convertir el nombre del empleado a su ID (para la correcta referencia)
        let staffId = null;
        if (empleadoNombre === "Mike Hillyer") staffId = 1;
        else if (empleadoNombre === "Jon Stephens") staffId = 2;
        
         // Validar nuevamente, ya se valido antes de crear el ticket pero es buena práctica
        if (!customerId || !inventoryId || !staffId || !fechaRenta) {
            alert("Faltan datos para registrar la renta");
            return;
        }

        try {
            // Enviar al backend
            const response = await fetch("/rentas/nueva", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    rental_date: fechaRenta,
                    inventory_id: inventoryId,
                    customer_id: customerId,
                    staff_id: staffId
                }),
            });

             // registra todo para depuración de errores
              console.log("HTTP status:", response.status, response.statusText);

             const result = await response.json();  // <-- puede lanzar si no hay JSON
             console.log("Respuesta JSON del servidor:", result);

            if (response.ok && result.success) {
                alert(`Renta registrada correctamente (ID: ${result.rental_id})`);
                ticket.remove();
                this.limpiarFormulario();
            } else {
                alert("Error al registrar la renta: " + (result.error || result.message || "desconocido"));
            }
        } catch (err) {
            console.error("Error en fetch /rentas/nueva:", err);
            alert("Error al conectar con el servidor o procesar la respuesta. Mira la consola.");
        }
        
            });
    } if (btnTacha) {
            btnTacha.addEventListener("click", () => ticket.remove());
        }
    }
}
