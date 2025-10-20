from flask import Blueprint, jsonify
from database import get_connection

rental_bp = Blueprint('rental_bp', __name__, url_prefix='/rentas')
#SOLO CODIGO PRUEBA
@rental_bp.route('/', methods=['GET'])
def listar_rentas():
    conn = get_connection()
    if not conn:
        return jsonify({"error": "No se pudo conectar a la base de datos"}), 500

    cur = conn.cursor()
    cur.execute("SELECT rental_id, rental_date, inventory_id, return_date, staff_id, last_update FROM rental;")
    rows = cur.fetchall()
    cur.close()
    conn.close()

    rentas = []
    for row in rows:
        rentas.append({
            "rental_id": row[0],
            "rental_date": str(row[1]),
            "inventory_id": row[2],
            "return_date": str(row[3]) if row[3] else None,
            "staff_id": row[4],
            "last_update": str(row[5])
        })
    return jsonify(rentas)
