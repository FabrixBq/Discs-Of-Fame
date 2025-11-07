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

@rental_bp.route('/<int:rental_id>', methods=['GET'])
def get_renta_por_id(rental_id):
    conn = get_connection()
    if not conn:
        return jsonify({"error": "No se pudo conectar a la base de datos"}), 500

    cur = conn.cursor()
    query = """
        SELECT 
            r.rental_id,
            c.first_name || ' ' || c.last_name AS cliente,
            f.title AS pelicula,
            s.first_name || ' ' || s.last_name AS empleado,
            r.rental_date,
            r.return_date,
            p.amount AS costo
        FROM rental r
        JOIN customer c ON r.customer_id = c.customer_id
        JOIN staff s ON r.staff_id = s.staff_id
        JOIN inventory i ON r.inventory_id = i.inventory_id
        JOIN film f ON i.film_id = f.film_id
        LEFT JOIN payment p ON r.rental_id = p.rental_id
        WHERE r.rental_id = %s;
    """
    cur.execute(query, (rental_id,))
    row = cur.fetchone()

    cur.close()
    conn.close()

    if not row:
        return jsonify({"error": "Renta no encontrada"}), 404

    renta = {
        "id": row[0],
        "cliente": row[1],
        "pelicula": row[2],
        "empleado": row[3],
        "renta": str(row[4]),
        "devolucion": str(row[5]) if row[5] else None,
        "costo": f"${row[6]:.2f}" if row[6] is not None else None
    }

    return jsonify(renta)
