class Navegacion {
    constructor() {
        this.contenido = document.getElementById("contenido");

        // Botones principales como constantes
        this.btn_renta = document.getElementById("btn-renta");
        this.btn_cancelacion = document.getElementById("bton-cancelacion");
        this.btn_devolucion = document.getElementById("bton-devolucion");
        this.btn_listas = document.getElementById("bton-listas");
        this.btn_ganancias = document.getElementById("bton-ganancias");
        this.btn_cerrar = document.getElementById("bton-cerrar");

        // Opciones del menú "Listas"
        this.op_renta_clientes = document.getElementById("op_RC");
        this.op_dvds_no_devueltos = document.getElementById("DVDnd");
        this.op_dvds_mas_rentados = document.getElementById("DVDmr");

        this.modulos = {};
        this.opcion_lista = 0;
        this.inicializarEventos();
        this.botonActivo = null;

    }

    inicializarEventos() {
        // Botones principales
        this.btn_renta.addEventListener("click", () => {
            this.actualizarBotonActivo(this.btn_renta);
            this.cargarModulo('renta');
        });

        this.btn_cancelacion.addEventListener("click", () => {
            this.actualizarBotonActivo(this.btn_cancelacion);
            this.cargarModulo('cancelacion');
        });

        this.btn_devolucion.addEventListener("click", () => {
            this.actualizarBotonActivo(this.btn_devolucion);
            this.cargarModulo('devolucion');
        });

        this.btn_ganancias.addEventListener("click", () => {
            this.actualizarBotonActivo(this.btn_ganancias);
            this.cargarModulo('ganancias');
        });


        // Opciones del menú listas
        const opciones = [
            { elemento: this.op_renta_clientes, valor: 1 },
            { elemento: this.op_dvds_no_devueltos, valor: 2 },
            { elemento: this.op_dvds_mas_rentados, valor: 3 },
        ];

        opciones.forEach((opcion) => {
            opcion.elemento.addEventListener("click", () => {
                this.opcion_lista = opcion.valor;
                if (this.modulos.listas) {
                    this.modulos.listas.setOpcionLista(this.opcion_lista);
                }
                this.cargarModulo('listas');
            });
        });
    }

    actualizarBotonActivo(nuevoBoton) {
        // Si hay un botón activo anterior, lo restauramos
        if (this.botonActivo) {
            // Solo quitamos la clase si el nuevo botón es diferente
            if (this.botonActivo !== nuevoBoton) {
                this.botonActivo.classList.remove('active-visual');
            }
        }

        // Caso especial: si el nuevo botón es "Listas" pero no se ha elegido una opción, no lo marcamos
        if (nuevoBoton === this.btn_listas && this.opcion_lista === 0) {
            this.botonActivo = null;
            return;
        }

        // Activamos el nuevo botón
        nuevoBoton.classList.add('active-visual');
        this.botonActivo = nuevoBoton;
    }



    registrarModulo(nombre, modulo) {
        this.modulos[nombre] = modulo;
    }

    cargarModulo(nombre) {
        if (this.modulos[nombre]) {
            this.modulos[nombre].cargar(this.contenido);
        } else {
            console.warn(`Módulo ${nombre} no registrado`);
        }
    }

    getOpcionLista() {
        return this.opcion_lista;
    }
}