<?php 

require 'algoritmoGenetico.php';
require 'translado.php';

$hato = isset($_GET['h']) ? $_GET['h'] : null;
$vehiculos =  isset($_GET['v']) ? $_GET['v'] : null;


if ($hato !== null && $vehiculos !== null) {
    $hato = explode(',', $hato);
    $vehiculos = explode(',', $vehiculos);

    foreach ($hato as $i => $valor) {
        $hato[$i] = intval($valor);
    }

    foreach ($vehiculos as $i => $valor) {
        $vehiculos[$i] = intval($valor);
    }

    $trasladoGanadero = new Traslado($vehiculos, $hato);
    $ag = new AG(20, $vehiculos, $hato, $trasladoGanadero->getTamanio(), 30, $trasladoGanadero);
    $ag->run();
    $solucion = $ag->getSolucion();
    echo json_encode(['hato' => $solucion->_x, 'vehiculos' => $solucion->_y]);
} else {
    echo '0';
}

?>