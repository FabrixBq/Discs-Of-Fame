from flask import Flask
#from routes.clientes import clientes_bp
#from routes.dvds import dvds_bp
from routes.rental import rental_bp
#from routes.staff import staff_bp

app = Flask(__name__)

# Registrar rutas (Blueprints)
#app.register_blueprint(clientes_bp)
#app.register_blueprint(dvds_bp)
app.register_blueprint(rental_bp)
#app.register_blueprint(staff_bp)

if __name__ == '__main__':
    app.run(debug=True)
