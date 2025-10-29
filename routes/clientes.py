from flask import Blueprint, jsonify
from database import get_connection

# Definir el blueprint para clientes
clientes_bp = Blueprint('clientes_bp', __name__, url_prefix='/clientes')

@clientes_bp.route('/', methods=['GET'])

def listar_clientes():
    conn = get_connection()
    if not conn:
        return jsonify({"error": "No se pudo conectar a la base de datos"}), 500

    cur = conn.cursor()
    cur.execute("SELECT customer_id, store_id, first_name, last_name, email, address_id, activebool, create_date, last_update FROM customer;")
    rows = cur.fetchall()
    cur.close()
    conn.close()

    clientes = []
    for row in rows:
        clientes.append({
            "customer_id": row[0],
            "store_id": row[1],
            "first_name": row[2],
            "last_name": row[3],
            "email": row[4],
            "address_id": row[5],
            "activebool": row[6],
            "create_date": str(row[7]),
            "last_update": str(row[8]) if row[8] else None
        })
    return jsonify(clientes)

def listar_direcciones():
    conn = get_connection()
    if not conn:
        return jsonify({"error": "No se pudo conectar a la base de datos"}), 500
    
    cur = conn.cursor()
    cur.execute("SELECT address_id, address, address2, district, city_id, postal_code, phone, last_update FROM address;")
    rows = cur.fetchall()
    cur.close()
    conn.close()

    direcciones = []
    for row in rows:
        direcciones.append({
            "address_id": row[0],
            "address": row[1],
            "address2": row[2],
            "district": row[3],
            "city_id": row[4],
            "postal_code": row[5],
            "phone": row[6],
            "last_update": str(row[7])
        })
    return jsonify(direcciones)