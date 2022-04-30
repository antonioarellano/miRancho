class Traslado:
    def __init__(self, vehiculos, hato):
        self._vehiculos = vehiculos
        self._hato = hato
    def getTamanio(self):
        return len(self._hato)
    def f(self, cromosoma):
        fitness = 0 
        hato = cromosoma._x[:]
        vehiculos = cromosoma._y[:]
        vueltas = 1
        viaje = vehiculos[:]
        for animal in hato:
            for truck in viaje:
                if(animal  < truck):
                    truck =- animal
                    fitness =+ animal
                    pass
                else:
                    if(len(viaje)-1 == viaje.index(truck)):
                        vueltas +=1
                        fitness =- truck
                        viaje = vehiculos[:]
        return int(fitness/vueltas)/10

