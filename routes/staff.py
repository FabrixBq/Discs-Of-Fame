from flask import Blueprint, jsonify
from database import get_connection

# Define el Blueprint para staff
staff_bp = Blueprint('staff_bp', __name__, url_prefix='/staff')

@staff_bp.route('/', methods=['GET'])

def listar_staff():
    conn = get_connection()
    if not conn:
        return jsonify({"error": "No se pudo conectar a la base de datos"}), 500

    cur = conn.cursor()
    cur.execute("SELECT staff_id, first_name, last_name, address_id, email, store_id, active, username, last_update FROM staff;")
    rows = cur.fetchall()
    cur.close()
    conn.close()

    staffs = []
    for row in rows:
        staffs.append({
            "staff_id": row[0],
            "first_name": row[1],
            "last_name": row[2],
            "address_id": row[3],
            "email": row[4],
            "store_id": row[5],
            "active": row[6],
            "username": row[7],
            "last_update": str(row[8])
        })
    return jsonify(staffs)