import psycopg2
import os
from dotenv import load_dotenv

# Carga las variables del archivo .env
load_dotenv()

def get_connection():
    try:
        connection = psycopg2.connect(
            host=os.getenv("DB_HOST", "localhost"),
            database=os.getenv("DB_NAME", "renta_dvd"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASS"),
            port=os.getenv("DB_PORT", "5432") 
        )
        print("Conexión exitosa!")
        return connection
    except Exception as ex:
        print("Error al conectar con la base de datos:", ex)
        return None

# Prueba rápida
if __name__ == "__main__":
    conn = get_connection()
    if conn:
        conn.close()
