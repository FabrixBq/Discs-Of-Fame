from flask import Blueprint, jsonify
from database import get_connection

cancelacion_bp = Blueprint('cancelacion_bp', __name__, url_prefix='/cancelacion')

# Obtener detalles de una renta por ID (para ver antes de cancelar)
@cancelacion_bp.route('/<int:rental_id>', methods=['GET'])
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
