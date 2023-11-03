<?php
class Traslado {
    private $_vehiculos;
    private $_hato;

    public function __construct($vehiculos, $hato) {
        $this->_vehiculos = $vehiculos;
        $this->_hato = $hato;
    }

    public function getTamanio() {
        return count($this->_hato);
    }

    public function f($cromosoma) {
        $fitness = 0;
        $hato = $cromosoma->_x;
        $vehiculos = $cromosoma->_y;
        $vueltas = 1;
        $viaje = $vehiculos;
        
        foreach ($hato as $animal) {
            foreach ($viaje as $key => $truck) {
                if ($animal <= $truck) {
                    $truck -= $animal;
                    $fitness += $animal;
                    $viaje[$key] = $truck;
                } else {
                    if ($key === count($viaje) - 1) {
                        $vueltas++;
                        $fitness -= $truck;
                        $viaje = $vehiculos;
                    }
                }
            }
        }

        return intval($fitness / $vueltas) / 10;
    }
}

?>