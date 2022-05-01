import copy
from random import random
import numpy as np

class Cromosoma:
    def __init__(self,x,y):
        self._x= x
        self._y= y

class Individuo:
    def __init__(self, alelos, x, y):
        self._alelos = alelos
        self._cromosoma = Cromosoma(x,y)
        self._fitness = 0

class AG:
    def __init__(self, cantidad_individuos, vehiculos, hato, tamano_gen, generaciones, problema):
        ## Opciones de algoritmo
        self._cantidad_individuos = cantidad_individuos
        self._tamano_gen = tamano_gen
        self._generaciones = generaciones
        self._problema = problema
        ## Datos de entrada
        self._hato = hato
        self._vehiculos = vehiculos
        ## Cada animal en la transferencia representa un alelo
        self._alelos = len(hato)

        self._individuos = np.array([])

    def run(self):
        self.crearIndividuos()
        self._mejor_historico = self._individuos[0]
        generacion = 0
        while generacion < self._generaciones:
            self.evaluaIndividuos()
            hijos = np.array([])
            while len(hijos) < len(self._individuos):
                padre1 = self.ruleta()
                padre2 = self.ruleta()
                while padre1 == padre2:
                    padre2 = self.ruleta()
                h1, h2 = self.cruza(self._individuos[padre1], self._individuos[padre2])
                hijos = np.append(hijos, [h1])
                hijos = np.append(hijos, [h2])
            self.mutacion(hijos)
            self._individuos = np.copy(hijos)
            self._individuos[np.random.randint(len(self._individuos))] = copy.deepcopy(self._mejor_historico)
            
            generacion += 1

    def mergeSecuencia(self,secuencia):
        acomodo = secuencia[:]
        tam = len(acomodo)
        for i in range(0,tam):
            idx = np.random.randint(0,tam-1)
            tem = acomodo[i]
            acomodo[i] = acomodo[idx]
            acomodo[idx] = tem
        return acomodo
    def crearIndividuos(self):
        for i in range(self._cantidad_individuos):
            cromosomaX = self.mergeSecuencia(self._hato)
            cromosomaY = self.mergeSecuencia(self._vehiculos)
            individuo = Individuo(self._alelos,cromosomaX,cromosomaY)
            self._individuos = np.append(self._individuos, [individuo])

    def evaluaIndividuos(self):
        for i in self._individuos:
            i._fitness = self._problema.f(i._cromosoma)
            if i._fitness > self._mejor_historico._fitness:
                self._mejor_historico = copy.deepcopy(i)

    def ruleta(self):
        f_sum = np.sum([i._fitness for i in self._individuos])
        if f_sum == 0:
            return np.random.randint(len(self._individuos))
        else:
            r = np.random.randint(f_sum + 1)
            k = 0
            F = self._individuos[k]._fitness
            while F < r:
                k += 1
                F += self._individuos[k]._fitness
            return k


    def cruza(self, i1, i2):
        h1 = copy.deepcopy(i1)
        h2 = copy.deepcopy(i2)
        
        s = int((self._alelos)/2)
        h1._cromosoma._x = i1._cromosoma._x[0:s]
        h2._cromosoma._x = i2._cromosoma._x[0:s]
        tem1 = i1._cromosoma._x[s:self._alelos]
        tem2 = i2._cromosoma._x[s:self._alelos]
        
        for i in range(0,(len(tem1)-1)):
            if(i2._cromosoma._x.index(tem1[i]) > i2._cromosoma._x.index(tem1[i+1])):
                aux = tem1[i+1]
                tem1[i+1] =tem1[i]
                tem1[i] = aux
        for i in range(0,(len(tem2)-1)):
            if(i1._cromosoma._x.index(tem2[i]) > i1._cromosoma._x.index(tem2[i+1])):
                aux = tem2[i+1]
                tem2[i+1] = tem2[i]
                tem2[i] = aux
        h1._cromosoma._x.extend(tem1)
        h2._cromosoma._x.extend(tem2)
        return (h1,h2)

    def mutacion(self, hijos):
        for h in hijos:
            #Y
            p = np.random.randint(0,len(h._cromosoma._y))
            y = np.random.randint(0,len(h._cromosoma._y))
            if(y == p):
                y = np.random.randint(0,len(h._cromosoma._y))
            tem = h._cromosoma._y[p]
            h._cromosoma._y[p] =  h._cromosoma._y[y]
            h._cromosoma._y[y] = tem
            #X
            p = np.random.randint(0,len(h._cromosoma._x))
            y = np.random.randint(0,len(h._cromosoma._x))
            if(y == p):
                y = np.random.randint(0,len(h._cromosoma._x))
            tem = h._cromosoma._x[p]
            h._cromosoma._x[p] =  h._cromosoma._x[y]
            h._cromosoma._x[y] = tem

    def getSolucion(self):
        return self._mejor_historico._cromosoma