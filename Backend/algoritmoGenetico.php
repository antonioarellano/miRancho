<?php
class Cromosoma {
    public $_x;
    public $_y;

    public function __construct($x, $y) {
        $this->_x = $x;
        $this->_y = $y;
    }
}

class Individuo {
    public $_alelos;
    public $_cromosoma;
    public $_fitness;

    public function __construct($alelos, $x, $y) {
        $this->_alelos = $alelos;
        $this->_cromosoma = new Cromosoma($x, $y);
        $this->_fitness = 0;
    }
}

class AG {
    private $_cantidad_individuos;
    private $_tamano_gen;
    private $_generaciones;
    private $_problema;
    private $_hato;
    private $_vehiculos;
    private $_alelos;
    private $_individuos;
    private $_mejor_historico;

    public function __construct($cantidad_individuos, $vehiculos, $hato, $tamano_gen, $generaciones, $problema) {
        $this->_cantidad_individuos = $cantidad_individuos;
        $this->_tamano_gen = $tamano_gen;
        $this->_generaciones = $generaciones;
        $this->_problema = $problema;
        $this->_hato = $hato;
        $this->_vehiculos = $vehiculos;
        $this->_alelos = count($hato);
        $this->_individuos = [];
    }

    public function run() {
        $this->crearIndividuos();
        $this->_mejor_historico = $this->_individuos[0];
        $generacion = 0;
        while ($generacion < $this->_generaciones) {
            $this->evaluaIndividuos();
            $hijos = [];
            while (count($hijos) < count($this->_individuos)) {
                $padre1 = $this->ruleta();
                $padre2 = $this->ruleta();
                while ($padre1 == $padre2) {
                    $padre2 = $this->ruleta();
                }
                list($h1, $h2) = $this->cruza($this->_individuos[$padre1], $this->_individuos[$padre2]);
                $hijos[] = $h1;
                $hijos[] = $h2;
            }
            $this->mutacion($hijos);
            $this->_individuos = $hijos;
            $this->_individuos[array_rand($this->_individuos)] = clone $this->_mejor_historico;
            $generacion++;
        }
    }

    public function mergeSecuencia($secuencia) {
        $acomodo = $secuencia;
        $tam = count($acomodo);
        for ($i = 0; $i < $tam; $i++) {
            $idx = mt_rand(0, $tam - 1);
            $tem = $acomodo[$i];
            $acomodo[$i] = $acomodo[$idx];
            $acomodo[$idx] = $tem;
        }
        return $acomodo;
    }

    public function crearIndividuos() {
        for ($i = 0; $i < $this->_cantidad_individuos; $i++) {
            $cromosomaX = $this->mergeSecuencia($this->_hato);
            $cromosomaY = $this->mergeSecuencia($this->_vehiculos);
            $individuo = new Individuo($this->_alelos, $cromosomaX, $cromosomaY);
            $this->_individuos[] = $individuo;
        }
    }

    public function evaluaIndividuos() {
        foreach ($this->_individuos as $i) {
            $i->_fitness = $this->_problema->f($i->_cromosoma);
            if ($i->_fitness > $this->_mejor_historico->_fitness) {
                $this->_mejor_historico = clone $i;
            }
            
        }
    }

    public function ruleta() {
        $f_sum = array_sum(array_map(function ($i) {
            return $i->_fitness;
        }, $this->_individuos));
        if ($f_sum == 0) {
            return mt_rand(0, count($this->_individuos) - 1);
        } else {
            $r = mt_rand(0, $f_sum);
            $k = 0;
            $F = $this->_individuos[$k]->_fitness;
            while ($F < $r) {
                $k++;
                $F += $this->_individuos[$k]->_fitness;
            }
            return $k;
        }
    }

    public function cruza($i1, $i2) {
        $h1 = clone $i1;
        $h2 = clone $i2;
        $s = (int)($this->_alelos / 2);
        $h1->_cromosoma->_x = array_slice($i1->_cromosoma->_x, 0, $s);
        $h2->_cromosoma->_x = array_slice($i2->_cromosoma->_x, 0, $s);
        $tem1 = array_slice($i1->_cromosoma->_x, $s);
        $tem2 = array_slice($i2->_cromosoma->_x, $s);

        for ($i = 0; $i < count($tem1) - 1; $i++) {
            if (array_search($tem1[$i], $i2->_cromosoma->_x) > array_search($tem1[$i + 1], $i2->_cromosoma->_x)) {
                $aux = $tem1[$i + 1];
                $tem1[$i + 1] = $tem1[$i];
                $tem1[$i] = $aux;
            }
        }

        for ($i = 0; $i < count($tem2) - 1; $i++) {
            if (array_search($tem2[$i], $i1->_cromosoma->_x) > array_search($tem2[$i + 1], $i1->_cromosoma->_x)) {
                $aux = $tem2[$i + 1];
                $tem2[$i + 1] = $tem2[$i];
                $tem2[$i] = $aux;
            }
        }

        $h1->_cromosoma->_x = array_merge($h1->_cromosoma->_x, $tem1);
        $h2->_cromosoma->_x = array_merge($h2->_cromosoma->_x, $tem2);
        return [$h1, $h2];
    }

    public function mutacion($hijos) {
        foreach ($hijos as $h) {
            // Y
            $p = mt_rand(0, count($h->_cromosoma->_y) - 1);
            $y = mt_rand(0, count($h->_cromosoma->_y) - 1);
            if ($y == $p) {
                $y = mt_rand(0, count($h->_cromosoma->_y) - 1);
            }
            $tem = $h->_cromosoma->_y[$p];
            $h->_cromosoma->_y[$p] = $h->_cromosoma->_y[$y];
            $h->_cromosoma->_y[$y] = $tem;
            // X
            $p = mt_rand(0, count($h->_cromosoma->_x) - 1);
            $y = mt_rand(0, count($h->_cromosoma->_x) - 1);
            if ($y == $p) {
                $y = mt_rand(0, count($h->_cromosoma->_x) - 1);
            }
            $tem = $h->_cromosoma->_x[$p];
            $h->_cromosoma->_x[$p] = $h->_cromosoma->_x[$y];
            $h->_cromosoma->_x[$y] = $tem;
        }
    }

    public function getSolucion() {
        return $this->_mejor_historico->_cromosoma;
    }
    
}

?>