from flask import Blueprint, jsonify, request
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

#obtencion de renta por id
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

# Búsqueda de clientes (para seleccionar en el módulo de renta)
@rental_bp.route('/clientes', methods=['GET'])
def buscar_clientes():
    from flask import request  # puedes ponerlo arriba también
    q = request.args.get('q', '').strip()
    conn = get_connection()

    if not conn:
        return jsonify({"error": "No se pudo conectar a la base de datos"}), 500

    cur = conn.cursor()

    try:
        if q == '':
            # Si no se pasa parámetro, trae los primeros 50 clientes
            cur.execute("""
                SELECT customer_id, store_id, first_name, last_name, email, address_id
                FROM customer
                ORDER BY customer_id
                LIMIT 50;
            """)
        elif q.isdigit():
            # Si es un número, busca por ID exacto
            cur.execute("""
                SELECT customer_id, store_id, first_name, last_name, email, address_id
                FROM customer
                WHERE customer_id = %s;
            """, (int(q),))
        else:
            # Si es texto, busca por coincidencia en nombre o apellido
            like_q = f"%{q}%"
            cur.execute("""
                SELECT customer_id, store_id, first_name, last_name, email, address_id
                FROM customer
                WHERE (first_name || ' ' || last_name) ILIKE %s
                OR first_name ILIKE %s
                OR last_name ILIKE %s
                ORDER BY customer_id
                LIMIT 100;
            """, (like_q, like_q, like_q))

        rows = cur.fetchall()
        clientes = []
        for r in rows:
            clientes.append({
                "customer_id": r[0],
                "store_id": r[1],
                "first_name": r[2],
                "last_name": r[3],
                "email": r[4],
                "address_id": r[5],
                "nombre_completo": f"{r[2]} {r[3]}"
            })

        return jsonify(clientes)
    except Exception as e:
        print("Error en buscar_clientes:", e)
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

@rental_bp.route("/movies", methods=["GET"])
def buscar_peliculas():
    q = request.args.get("q", "").strip()
    conn = get_connection()
    if not conn:
        return jsonify({"error": "No se pudo conectar a la base de datos"}), 500

    cur = conn.cursor()

    # 🔍 Consulta películas con datos de inventario, tienda y categoría
    query = """
        SELECT
            i.inventory_id,
            f.film_id,
            f.title AS film_name,
            s.store_id,
            a.address AS store_address,
            c.name AS category
        FROM inventory i
        JOIN film f ON i.film_id = f.film_id
        JOIN store s ON i.store_id = s.store_id
        JOIN address a ON s.address_id = a.address_id
        JOIN film_category fc ON f.film_id = fc.film_id
        JOIN category c ON fc.category_id = c.category_id
        WHERE 
        LOWER(f.title) LIKE LOWER(%s)
        OR CAST(i.inventory_id AS TEXT) LIKE %s
        ORDER BY f.title
        LIMIT 30;
         """
    cur.execute(query, (f"%{q}%", f"%{q}%"))
    data = cur.fetchall()

    cur.close()
    conn.close()

    # convertir a JSON
    peliculas = [
        {
            "inventory_id": row[0],
            "film_id": row[1],
            "film_name": row[2],
            "store_id": row[3],
            "store_address": row[4],
            "category": row[5],
        }
        for row in data
    ]

    return jsonify(peliculas)

#agregar clientes
@rental_bp.route("/clientes", methods=["POST"])
def crear_cliente():
    from flask import request
    conn = get_connection()

    if not conn:
        return jsonify({"error": "No se pudo conectar a la base de datos"}), 500

    data = request.get_json()
    store_id = data.get("store_id")
    first_name = data.get("first_name")
    last_name = data.get("last_name")
    email = data.get("email")
    address_id = data.get("address_id")

    if not all([store_id, first_name, last_name, email, address_id]):
        return jsonify({"error": "Faltan campos obligatorios"}), 400

    cur = conn.cursor()

    try:
        # Insertar nuevo cliente
        query = """
            INSERT INTO customer (store_id, first_name, last_name, email, address_id, activebool, create_date)
            VALUES (%s, %s, %s, %s, %s, TRUE, CURRENT_DATE)
            RETURNING customer_id;
        """
        cur.execute(query, (store_id, first_name, last_name, email, address_id))
        new_id = cur.fetchone()[0]
        conn.commit()

        return jsonify({
            "success": True,
            "message": "Cliente creado exitosamente",
            "customer_id": new_id
        }), 201
    except Exception as e:
        conn.rollback()
        print("Error al crear cliente:", e)
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()
