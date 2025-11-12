# Discs-Of-Fame
Desarrollo de aplicación de renta de DVD's
Aplicación web desarrollada con Flask y PostgreSQL para la gestión de clientes, películas y rentas del catálogo DVD Rental.
El proyecto está completamente dockerizado para facilitar su ejecución en cualquier entorno.

# Requisitos previos
Antes de iniciar, asegúrate de tener instalados:
- Docker Desktop
- Docker Compose
- Git si vas a clonar el repositorio (opcional).

# Clonar el repositorio
git clone https://github.com/FabrixBq/Discs-Of-Fame.git
cd Discs-Of-Fame

# Construcción y ejecución con Docker
- Para levantar los contenedores (base de datos y aplicación Flask): docker-compose up --build

# El comando realizará lo siguiente:
- Construir la imagen de la app usando el Dockerfile.
- Crear los contenedores definidos en docker-compose.yml:
  - dvdrental-db: base de datos PostgreSQL con el esquema dvdrental.
  - discs-of-fame-app: aplicación Flask.
- Exponer los puertos:

# Restaurar la base de datos (solo la primera vez):
- Para restaurar la base de datos: Get-Content restore.sql -Raw | docker exec -i dvdrental-db psql -U postgres -d dvdrental
  - App: http://localhost:5000
  - PostgreSQL: localhost:5432

# Acceder a la aplicación
- Una vez que los contenedores estén corriendo, abre tu navegador y visita: http://localhost:5000

# Comandos útiles:
- Detener contenedores: docker-compose down
- Ver logs en tiempo real:	docker-compose logs -f
- Reconstruir imágenes:	docker-compose up --build --force-recreate
- Acceder al contenedor de la app	docker: exec -it discs-of-fame-app bash
- Acceder a la base de datos:	docker exec -it dvdrental-db psql -U postgres -d dvdrental

# Créditos
Proyecto desarrollado por:
- Fabricio Becerra Quezada
- Laura Sofía Ornelas Valenzuela
- Ariadne Lizett Macias Campos
