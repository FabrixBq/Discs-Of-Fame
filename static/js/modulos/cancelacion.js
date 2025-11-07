class ModuloCancelacion {
    constructor() {
        // Este módulo no necesita inicialización especial
    }

    cargar(contenedor) {
        contenedor.innerHTML = this.obtenerHTML();
        this.configurarEventos();
    }

    obtenerHTML() {
        return `
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
    }

    configurarEventos() {
        const rentalIdInput = document.getElementById("rental-id-input");
        const searchBtn = document.getElementById("search-rental-btn");
        const confirmBtn = document.getElementById("confirm-rental-btn");
        const closePopupBtn = document.getElementById("close-popup-btn");

        searchBtn.addEventListener("click", () => this.buscarRenta(rentalIdInput.value));
        confirmBtn.addEventListener("click", () => this.confirmarCancelacion(rentalIdInput.value));
        closePopupBtn.addEventListener("click", () => this.cerrarPopup());
        
        document.getElementById("search-popup").addEventListener("click", (e) => {
            if (e.target === e.currentTarget) this.cerrarPopup();
        });
    }

   async buscarRenta(searchValue) {
    if (!searchValue) return alert("Ingrese un ID de renta válido.");

    try {
        const response = await fetch(`/rentas/${searchValue}`);
        if (!response.ok) throw new Error("Renta no encontrada");
        
        const data = await response.json();
        this.mostrarResultadosBusqueda([data]); // lo pasamos como lista para mantener la estructura
    } catch (error) {
        console.error("Error al buscar renta:", error);
        alert("No se encontró la renta o ocurrió un error.");
    }
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

    //confirmar cancelacion
    async confirmarCancelacion(rentalId) {
    if (!rentalId) return;

    try {
        const response = await fetch(`/rentas/${rentalId}`);
        const data = await response.json();

        if (!response.ok) {
            alert(data.error || "No se encontró la renta");
            return;
        }

        // Mostrar los datos reales en el ticket
        this.mostrarTicketCancelacion(data);

    } catch (error) {
        console.error("Error al obtener datos de la renta:", error);
        alert("Error al conectar con el servidor");
    }
}


    mostrarTicketCancelacion(data) {
        const ticketContainer = document.getElementById("cancellation-ticket-container");

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
            // Aquí iría la confirmación final con el backend
            ticketContainer.innerHTML = "";
            document.getElementById("rental-id-input").value = "";
        });
    }
}