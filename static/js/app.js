// Archivo principal, inicializa la aplicacion
document.addEventListener('DOMContentLoaded', function() {
    // Crear la instancia de navegacion
    const navegacion = new Navegacion();
    
    // Registrar todos los modulos
    navegacion.registrarModulo('renta', new ModuloRenta());
    navegacion.registrarModulo('cancelacion', new ModuloCancelacion());
    navegacion.registrarModulo('devolucion', new ModuloDevolucion());
    navegacion.registrarModulo('listas', new ModuloListas());   
 //   navegacion.registrarModulo('ganancias', new ModuloGStaff()); 
    
    console.log('Aplicación inicializada - Módulos registrados');
});