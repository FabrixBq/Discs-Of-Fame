from flask import Blueprint, jsonify
from database import get_connection

# Define el Blueprint para rental
renta_bp = Blueprint('renta_bp', __name__, url_prefix='/renta')

@renta_bp.route('/', methods=['GET'])

def get_renta():
    conn = get_connection()

    if not conn:
        return jsonify({"error": "No se pudo conectar a la base de datos"}), 500
    
    cur = conn.cursor()
    cur.execute("SELECT c.customer_id AS id_cliente, c.first_name || ' ' || c.last_name AS nombre, f.title AS pelicula, r.rental_date AS fecha_renta, r.return_date AS fecha_devolucion, CASE WHEN r.return_date IS NULL THEN 'En Renta' ELSE 'Devuelto' END AS estado FROM rental r JOIN customer c ON r.customer_id = c.customer_id JOIN inventory i ON r.inventory_id = i.inventory_id JOIN film f ON i.film_id = f.film_id ORDER BY r.rental_date DESC;")

    rows = cur.fetchall() #Extrae todas las filas
    #rows = cur.fetchone() #Extrae una sola fila
    #rows = cur.fetchmany(10) #Obtiene un numero especifico de filas, en este caso 10
    #El cursor es iterable, si miras que tarda, puedes remplazar estos metodos por un ciclo for y 
    #de ahi hacer las iteracciones necesarias, por ejemplo,añadir los datos en el diccionario
    
    cur.close()
    conn.close()

    renta = [] #diccionario, extrae los datos necesarios de la base de datos
    for row in rows:
        renta.append({
            "id_cliente": row[0],
            "nombre": row[1],
        })
    return jsonify(renta)