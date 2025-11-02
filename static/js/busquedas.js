// Funciones de búsqueda compartidas entre módulos

function buscarRentas(searchValue, datos) {
    return searchValue
        ? datos.filter((item) => item.id.toString().includes(searchValue))
        : datos;
}

function buscarClientes(searchValue, clientes) {
    return searchValue
        ? clientes.filter((item) => 
            item.nombre.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.id.toString().includes(searchValue)
          )
        : clientes;
}

function buscarPeliculas(searchValue, peliculas) {
    return searchValue
        ? peliculas.filter((item) => 
            item.titulo.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.genero.toLowerCase().includes(searchValue.toLowerCase())
          )
        : peliculas;
}