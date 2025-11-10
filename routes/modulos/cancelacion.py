from flask import Blueprint, jsonify
from database import get_connection

cancelacion_bp = Blueprint('cancelacion_bp', __name__, url_prefix='/cancelacion')

# Obtener detalles de una renta por ID (para mostrar en el popup antes de cancelar)
@cancelacion_bp.route('/<int:rental_id>', methods=['GET'])
def get_renta_por_id(rental_id):
    conn = get_connection()
    if not conn:
        return jsonify({"error": "No se pudo conectar a la base de datos"}), 500

    cur = conn.cursor()

    try:
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

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cur.close()
        conn.close()


# Cancelar una renta por ID (elimina payment y rental)
@cancelacion_bp.route('/<int:rental_id>', methods=['DELETE'])
def eliminar_renta(rental_id):
    conn = get_connection()
    if not conn:
        return jsonify({"error": "No se pudo conectar a la base de datos"}), 500

    cur = conn.cursor()

    try:
        # 1️.-Verificar si la renta existe
        cur.execute("SELECT rental_id, return_date FROM rental WHERE rental_id = %s;", (rental_id,))
        renta = cur.fetchone()

        if not renta:
            return jsonify({"error": "Renta no encontrada"}), 404

        # 2️.- Verificar si ya fue devuelta
        if renta[1] is not None:
            return jsonify({"error": "No se puede cancelar una renta que ya fue devuelta."}), 400

        # 3.-Eliminar primero en payment (por la FK)
        cur.execute("DELETE FROM payment WHERE rental_id = %s;", (rental_id,))

        # 4️.- Luego eliminar en rental
        cur.execute("DELETE FROM rental WHERE rental_id = %s;", (rental_id,))

        # 5️.-Verificar si realmente se eliminó algo
        if cur.rowcount == 0:
            conn.rollback()
            return jsonify({"error": "No se eliminó ninguna renta. Verifique el ID."}), 404

        conn.commit()

        return jsonify({
            "success": True,
            "message": f"✅ La renta con ID {rental_id} y su pago asociado fueron eliminados correctamente."
        })

    except Exception as e:
        conn.rollback()
        return jsonify({
            "error": f"Ocurrió un error al intentar cancelar la renta: {str(e)}"
        }), 500

    finally:
        cur.close()
        conn.close()
