from flask import Blueprint, jsonify
from database import get_connection

# Define el Blueprint para cancelacion
cancelacion_bp = Blueprint('cancelacion_bp', __name__, url_prefix='/cancelacion')

@cancelacion_bp.route('/', methods=['GET'])

def get_cancelacion():
    conn = get_connection()

    if not conn:
        return jsonify({"error": "No se pudo conectar a la base de datos"}), 500
    
    cur = conn.cursor()
    cur.execute("SELECT c.customer_id AS id_cliente, c.first_name || ' ' || c.last_name AS nombre, f.title AS pelicula, r.cancelacionl_date AS fecha_cancelacion, r.return_date AS fecha_devolucion, CASE WHEN r.return_date IS NULL THEN 'En cancelacion' ELSE 'Devuelto' END AS estado FROM cancelacionl r JOIN customer c ON r.customer_id = c.customer_id JOIN inventory i ON r.inventory_id = i.inventory_id JOIN film f ON i.film_id = f.film_id ORDER BY r.cancelacionl_date DESC;")

    rows = cur.fetchall()
    
    cur.close()
    conn.close()

    cancelacion = [] #diccionario, extrae los datos necesarios de la base de datos
    for row in rows:
        cancelacion.append({
            "id_cliente": row[0],
            "nombre": row[1],
        })
    return jsonify(cancelacion)