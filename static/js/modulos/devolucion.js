class ModuloDevolucion {
    constructor() {
        // Este modulo no necesita inicializacion especial
    }

    cargar(contenedor) {
        contenedor.innerHTML = this.obtenerHTML();
        this.configurarEventos();
    }

    obtenerHTML() {
        return `
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
    }

    configurarEventos() {
        const rentalIdInput = document.getElementById("rental-id-input");
        const searchBtn = document.getElementById("search-rental-btn");
        const confirmBtn = document.getElementById("confirm-rental-btn");
        const closePopupBtn = document.getElementById("close-popup-btn");

        searchBtn.addEventListener("click", () => this.buscarRenta(rentalIdInput.value));
        confirmBtn.addEventListener("click", () => this.confirmarDevolucion(rentalIdInput.value));
        closePopupBtn.addEventListener("click", () => this.cerrarPopup());
        
        document.getElementById("search-popup").addEventListener("click", (e) => {
            if (e.target === e.currentTarget) this.cerrarPopup();
        });
    }

    buscarRenta(searchValue) {
        // Con Flask, aquí harías una petición al backend
        console.log("Buscar renta:", searchValue);
        // const resultados = await api.buscarRentas(searchValue);
        
        // Por ahora simulamos resultados vacíos
        this.mostrarResultadosBusqueda([]);
    }

    mostrarResultadosBusqueda(resultados) {
        const searchResultsBody = document.getElementById("search-results-body");
        
        searchResultsBody.innerHTML = resultados
            .map(item => this.obtenerFilaResultado(item))
            .join("");

        this.configurarEventosResultados();
        this.mostrarPopup();
    }

    obtenerFilaResultado(item) {
        return `
        <tr class="search-result-row" data-rental-id="${item.id}">
            <td>${item.id}</td>
            <td>${item.cliente}</td>
            <td>${item.pelicula}</td>
            <td>${item.empleado}</td>
            <td>${item.renta}</td>
            <td>${item.devolucion}</td>
            <td>${item.costo}</td>
        </tr>`;
    }

    configurarEventosResultados() {
        document.querySelectorAll(".search-result-row").forEach((row) => {
            row.addEventListener("click", () => {
                document.getElementById("rental-id-input").value = row.dataset.rentalId;
                this.cerrarPopup();
            });
        });
    }

    mostrarPopup() {
        document.getElementById("search-popup").classList.add("active");
    }

    cerrarPopup() {
        document.getElementById("search-popup").classList.remove("active");
    }

    confirmarDevolucion(rentalId) {
        if (!rentalId) return;

        // Con Flask, aquí harías la petición de devolución
        console.log("Confirmar devolución:", rentalId);
        // const resultado = await api.devolverRenta(rentalId);
        
        // Por ahora simulamos una respuesta
        this.mostrarTicketDevolucion({
            id: rentalId,
            cliente: "Cliente Ejemplo",
            pelicula: "Película Ejemplo",
            empleado: "Empleado Ejemplo",
            renta: "2024-01-10",
            devolucion: new Date().toLocaleString(),
            costo: "$5.00"
        });
    }

    mostrarTicketDevolucion(data) {
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
            // Aquí iría la confirmación final con el backend
            ticketContainer.innerHTML = "";
            document.getElementById("rental-id-input").value = "";
        });
    }
}