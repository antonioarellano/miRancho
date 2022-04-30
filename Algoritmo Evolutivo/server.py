from flask import Flask, request, jsonify
import traslado
import AG

app = Flask(__name__)

@app.route("/traslado", methods=['GET'])
def main():
    args = request.args
    hato = args.get('h')
    vehiculos = args.get('v')
    if None not in (hato, vehiculos):
        trasladoGanadero = traslado.Traslado(vehiculos,hato)
        ag = AG.AG(20,vehiculos,hato,trasladoGanadero.getTamanio(), 30, trasladoGanadero)
        ag.run()
        solucion = ag.getSolucion()
        return jsonify({'hato':solucion._x,'vehiculos':solucion._y})
    else:
        return 0
if __name__ == '__main__':
    app.run(host='0.0.0.0')