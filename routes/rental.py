from flask import Blueprint, jsonify
from database import get_connection

# Define el Blueprint para rental
rental_bp = Blueprint('rental_bp', __name__, url_prefix='/rentas')

#SOLO CODIGO PRUEBA
@rental_bp.route('/', methods=['GET'])

def get_rentas():
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

def listar_inventarios():
    conn = get_connection()
    if not conn:
        return jsonify({"error": "No se pudo conectar a la base de datos"}), 500
    
    cur = conn.cursor()
    cur.execute("SELECT inventory_id, film_id, store_id, last_update FROM inventory;")
    rows = cur.fetchall()
    cur.close()
    conn.close()

    inventario = []
    for row in rows:
        inventario.append({
            "inventory_id": row[0],
            "film_id": row[1],
            "store_id": row[2],
            "last_update": str(row[3])
        })

    return jsonify(inventario)