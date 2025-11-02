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
    cur.execute("SELECT s.staff_id, s.first_name || ' ' || s.last_name AS empleado, s.email, s.store_id, s.last_update, SUM(p.amount) AS total_ganancias FROM payment p JOIN staff s ON p.staff_id = s.staff_id GROUP BY s.staff_id, empleado ORDER BY total_ganancias DESC")
    
    rows = cur.fetchall()
    
    cur.close()
    conn.close()

    staffs = []
    for row in rows:
        staffs.append({
            "staff_id": row[0],
            "empleado": row[1],
            "email": row[2],
            "store_id": row[3],
            "last_update": str(row[4]),
            "ganancias": row[5]
        })
    
    print(f"Datos a enviar: {staffs}")
    return jsonify(staffs)