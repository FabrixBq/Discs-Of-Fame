from flask import Blueprint, jsonify
from database import get_connection
from datetime import datetime

devolucion_bp = Blueprint('devolucion_bp', __name__, url_prefix='/api/devolucion')

@devolucion_bp.route('/<int:rental_id>/confirmar', methods=['PUT'])
def confirmar_devolucion(rental_id):
    conn = get_connection()
    if not conn:
        return jsonify({"error": "No se pudo conectar a la base de datos"}), 500

    cur = conn.cursor()

    # 1.-Verificar si la renta existe y si ya tiene return_date
    cur.execute("""
        SELECT return_date 
        FROM rental
        WHERE rental_id = %s;
    """, (rental_id,))
    renta = cur.fetchone()

    if not renta:
        cur.close()
        conn.close()
        return jsonify({"error": "Renta no encontrada"}), 404

    return_date = renta[0]
    if return_date is not None:
        cur.close()
        conn.close()
        return jsonify({"error": "Esta renta ya fue devuelta"}), 400

    # 2️.-Actualizar la fecha de devolución
    fecha_actual = datetime.now()
    cur.execute("""
        UPDATE rental
        SET return_date = %s
        WHERE rental_id = %s;
    """, (fecha_actual, rental_id))
    conn.commit()

    cur.close()
    conn.close()

    # 3️.-Responder con confirmación
    return jsonify({
        "mensaje": f"Devolución registrada correctamente para rental_id {rental_id}",
        "fecha_devolucion": fecha_actual.strftime("%Y-%m-%d %H:%M:%S")
    })
