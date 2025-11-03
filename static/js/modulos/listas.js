class ModuloListas {
    constructor() {
        this.opcionLista = 0;
    }

    setOpcionLista(opcion) {
        this.opcionLista = opcion;
    }

    cargar(contenedor) {
        contenedor.innerHTML = this.obtenerHTML();
        this.configurarEventos();

        // Si la opción actual es "Rentas por Cliente", cargar los datos
        if (this.opcionLista === 1) {
            this.cargarRentasClientes();
        } else if (this.opcionLista === 2) {
            this.cargarDVDsNoDevueltos();
        } else if (this.opcionLista === 3) {
            this.cargarDVDsMasRentados();
        }
    }

    obtenerHTML() {
        // Según la opcion seleccionada, mostrar diferente contenido
        switch(this.opcionLista) {
            case 1:
                return this.obtenerHTMLRentaClientes();
            case 2:
                return this.obtenerHTMLDVDsNoDevueltos();
            case 3:
                return this.obtenerHTMLDVDsMasRentados();
            default:
                return '<div class="mensaje-vacio">Selecciona una opción del menú Listas</div>';
        }
    }

    obtenerHTMLRentaClientes() {
        return `
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
                    <tbody id="rentas-tbody">
                        <!-- Cargar datos aquí dinámicamente -->
                    </tbody>
                </table>
            </div>
        </div>`;
    }

    async cargarRentasClientes() {
        try {
            console.log("Haciendo fetch a /rentas/...");
            const response = await fetch('/rentas/');
            console.log('Response status:', response.status);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const rentas = await response.json();
            console.log(rentas);

            const tbody = document.getElementById('rentas-tbody');
            if (rentas.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6">No hay datos de rentas</td></tr>';
                return;
            }

            tbody.innerHTML = rentas.map(renta => `
                <tr>
                    <td>${renta.id_cliente}</td>
                    <td>${renta.nombre}</td>
                    <td>${renta.pelicula}</td>
                    <td>${renta.fecha_renta}</td>
                    <td>${renta.fecha_devolucion}</td>
                    <td>${renta.estado}</td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Error al cargar las rentas de clientes:', error);
        }
    }

    obtenerHTMLDVDsNoDevueltos() {
        return `
        <div id="modulo-listas" class="tabla-container">
            <div class="busqueda-container">
                <input id="busqueda_input" type="text" class="busqueda-input" placeholder="Buscar DVD...">
            </div>
            <div class="tabla-scroll">
                <table id="tabla-dvds" class="tabla-rentas">
                    <thead>
                        <tr>
                            <th>ID DVD</th>
                            <th>Película</th>
                            <th>Cliente</th>
                            <th>Fecha Renta</th>
                            <th>Días de Retraso</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>DVD-005</td><td>Interstellar</td><td>Luis López</td><td>2024-03-01</td><td>5 días</td></tr>
                    </tbody>
                </table>
            </div>
        </div>`;
    }

    obtenerHTMLDVDsMasRentados() {
        return `
        <div id="modulo-listas" class="tabla-container">
            <div class="busqueda-container">
                <input id="busqueda_input" type="text" class="busqueda-input" placeholder="Buscar película...">
            </div>
            <div class="tabla-scroll">
                <table id="tabla-populares" class="tabla-rentas">
                    <thead>
                        <tr>
                            <th>Película</th>
                            <th>Veces Rentada</th>
                            <th>Género</th>
                            <th>Última Renta</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>The Matrix</td><td>15</td><td>Ciencia Ficción</td><td>2024-05-20</td></tr>
                        <tr><td>Inception</td><td>12</td><td>Ciencia Ficción</td><td>2024-05-18</td></tr>
                    </tbody>
                </table>
            </div>
        </div>`;
    }

    async cargarDVDsNoDevueltos() {
        // Aquí se haría una petición al backend para obtener los datos reales
        console.log("Cargar datos de DVDs No Devueltos");
    }

    async cargarDVDsMasRentados() {
        // Aquí se haría una petición al backend para obtener los datos reales
        console.log("Cargar datos de DVDs Más Rentados");
    }

    configurarEventos() {
        const busquedaInput = document.getElementById("busqueda_input");
        if (busquedaInput) {
            busquedaInput.addEventListener("input", (e) => {
                this.filtrarTabla(e.target.value);
            });
        }
    }

    filtrarTabla(textoBusqueda) {
        // Con Flask, aqui se haria una peticion al backend con el filtro
        console.log("Filtrar tabla:", textoBusqueda, "opción:", this.opcionLista);
    }
}