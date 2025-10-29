from flask import Blueprint, jsonify
from database import get_connection

# Define el Blueprint para dvds
dvds_bp = Blueprint('dvds_bp', __name__, url_prefix='/dvds')

@dvds_bp.route('/', methods=['GET'])

def listar_dvds():
    conn = get_connection()
    if not conn:
        return jsonify({"error": "No se pudo conectar a la base de datos"}), 500

    cur = conn.cursor()
    cur.execute("SELECT film_id, title, description, release_year, language_id, rental_duration, rental_rate, length, replacement_cost, rating, last_update FROM film;")
    rows = cur.fetchall()
    cur.close()
    conn.close()

    dvds = []
    for row in rows:
        dvds.append({
            "film_id": row[0],
            "title": row[1],
            "description": row[2],
            "release_year": row[3],
            "language_id": row[4],
            "rental_duration": row[5],
            "rental_rate": str(row[6]),
            "length": row[7],
            "replacement_cost": str(row[8]),
            "rating": row[9],
            "last_update": str(row[10])
        })
    return jsonify(dvds)