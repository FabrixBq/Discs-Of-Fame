class modulo_gStaff {
    constructor() {
        //Vacío
    }

    cargar(contenedor) {
        contenedor.innerHTML = this.obtenerHTML();
        this.cargarDatos();
    }

    obtenerHTML() {
        return `
        <div id="modulo-staff" class="tabla-container">
            <div class="tabla-scroll">
                <table id="tabla-staff" class="tabla-rentas">
                    <thead>
                        <tr>
                            <th>ID Empleado</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>ID Tienda</th>
                            <th>Última Actualización</th>
                            <th>Ganancias</th>
                        </tr>
                    </thead>
                    <tbody id="staff-tbody">
                        <!-- Los datos se cargarán aquí con JavaScript -->
                    </tbody>
                </table>
            </div>
        </div>`;
    }

    async cargarDatos() {
        try {
            console.log('Haciendo fetch a /staff/...');
            const response = await fetch('/staff/');
            console.log('Response status:', response.status);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const staffs = await response.json();
            console.log('Datos recibidos:', staffs);

            const tbody = document.getElementById('staff-tbody');
            if (staffs.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6">No hay datos de staff</td></tr>';
                return;
            }

            tbody.innerHTML = staffs.map(staff => `
            <tr>
                <td>${staff.staff_id}</td>
                <td>${staff.empleado}</td>
                <td>${staff.email}</td>
                <td>${staff.store_id}</td>
                <td>${staff.last_update}</td>
                <td>$${staff.ganancias}</td>
            </tr>
        `).join('');

        } catch (error) {
            console.error('Error cargando staff:', error);
            const tbody = document.getElementById('staff-tbody');
            tbody.innerHTML = `<tr><td colspan="6">Error: ${error.message}</td></tr>`;
        }
    }
}