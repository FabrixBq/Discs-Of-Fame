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
                    <tbody>
                        <tr><td>001</td><td>Juan Pérez</td><td>Avengers</td><td>2024-01-15</td><td>2024-01-20</td><td>Devuelto</td></tr>
                        <tr><td>002</td><td>María García</td><td>Inception</td><td>2024-02-10</td><td>2024-02-17</td><td>Devuelto</td></tr>
                    </tbody>
                </table>
            </div>
        </div>`;
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