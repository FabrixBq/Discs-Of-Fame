import psycopg2
import os
from dotenv import load_dotenv
from urllib.parse import urlparse

# Carga las variables del archivo .env
load_dotenv()

def get_connection():
    try:
        # Intentar conectar usando DATABASE_URL si está disponible (Para contenedores)
        db_url = os.getenv("DATABASE_URL")
        if db_url:
            result = urlparse(db_url)
            connection = psycopg2.connect(
                host=result.hostname,
                database=result.path[1:],
                user=result.username,
                password=result.password,
                port=result.port
            )
        else:
            # Conexión local usando variables de entorno
            connection = psycopg2.connect(
                host=os.getenv("DB_HOST", "postgres"),
                database=os.getenv("DB_NAME"),
                user=os.getenv("DB_USER"),
                password=os.getenv("DB_PASSWORD"),
                port=os.getenv("DB_PORT", 5432)
            )

        print("Conexión exitosa a PostgreSQL")
        return connection

    except Exception as ex:
        print("Error al conectar con la base de datos:", ex)
        return None

# Prueba rápida
if __name__ == "__main__":
    conn = get_connection()
    if conn:
        conn.close()