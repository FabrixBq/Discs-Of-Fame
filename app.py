from flask import Flask, render_template
from routes.listas.clientes import clientes_bp
from routes.dvds import dvds_bp
#from routes.rental import rental_bp
from routes.modulos.staff import staff_bp
from routes.modulos.cancelacion import cancelacion_bp
from routes.modulos.devolucion import devolucion_bp
from routes.modulos.renta import renta_bp

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

# Registrar rutas (Blueprints)
app.register_blueprint(clientes_bp)
app.register_blueprint(dvds_bp)
#app.register_blueprint(rental_bp)
app.register_blueprint(staff_bp)
app.register_blueprint(renta_bp)
app.register_blueprint(devolucion_bp)
app.register_blueprint(cancelacion_bp)  

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)