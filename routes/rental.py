from flask import Blueprint, jsonify
from database import get_connection

# Define el Blueprint para rental
rental_bp = Blueprint('rental_bp', __name__, url_prefix='/rentas')

@rental_bp.route('/', methods=['GET'])

def get_rentas():
    conn = get_connection()

    if not conn:
        return jsonify({"error": "No se pudo conectar a la base de datos"}), 500
    
    cur = conn.cursor()
    cur.execute("SELECT c.customer_id AS id_cliente, c.first_name || ' ' || c.last_name AS nombre, f.title AS pelicula, r.rental_date AS fecha_renta, r.return_date AS fecha_devolucion, CASE WHEN r.return_date IS NULL THEN 'En Renta' ELSE 'Devuelto' END AS estado FROM rental r JOIN customer c ON r.customer_id = c.customer_id JOIN inventory i ON r.inventory_id = i.inventory_id JOIN film f ON i.film_id = f.film_id ORDER BY r.rental_date DESC;")

    rows = cur.fetchall()
    
    cur.close()
    conn.close()

    rentas = []
    for row in rows:
        rentas.append({
            "id_cliente": row[0],
            "nombre": row[1],
            "pelicula": row[2],
            "fecha_renta": str(row[3]),
            "fecha_devolucion": str(row[4]) if row[4] else None,
            "estado": row[5]
        })
    return jsonify(rentas)

