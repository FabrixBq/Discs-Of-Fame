from flask import Blueprint, jsonify
from database import get_connection

# Define el Blueprint para devolucion
devolucion_bp = Blueprint('devolucion_bp', __name__, url_prefix='/devolucion')

@devolucion_bp.route('/', methods=['GET'])

def get_devolucion():
    conn = get_connection()

    if not conn:
        return jsonify({"error": "No se pudo conectar a la base de datos"}), 500
    
    cur = conn.cursor()
    cur.execute("SELECT c.customer_id AS id_cliente, c.first_name || ' ' || c.last_name AS nombre, f.title AS pelicula, r.devolucionl_date AS fecha_devolucion, r.return_date AS fecha_devolucion, CASE WHEN r.return_date IS NULL THEN 'En devolucion' ELSE 'Devuelto' END AS estado FROM devolucionl r JOIN customer c ON r.customer_id = c.customer_id JOIN inventory i ON r.inventory_id = i.inventory_id JOIN film f ON i.film_id = f.film_id ORDER BY r.devolucionl_date DESC;")

    rows = cur.fetchall()
    
    cur.close()
    conn.close()

    devolucion = [] #diccionario, extrae los datos necesarios de la base de datos
    for row in rows:
        devolucion.append({
            "id_cliente": row[0],
            "nombre": row[1],
        })
    return jsonify(devolucion)