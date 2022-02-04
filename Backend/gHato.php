<?php
    require ('JsonWebToken.php');
    require ('dConn.php');

    $tkn = $_GET['t'];
    if(Auth::Check($tkn)){
        $id = Auth::GetData($tkn);

        $conexion = mysqli_connect($host,$user,$pass, $bd);
        if (mysqli_connect_errno()){
            echo "Error al conectar BDD";
            exit();
        }
        mysqli_set_charset($conexion, 'utf8mb4');
        $sql = 'CALL gANIMALS(?);';
        $resultado = mysqli_prepare($conexion,$sql);
        $ok = mysqli_stmt_bind_param($resultado,'s',$id);
        if ($ok == false){
            echo 'Error al consultar';
        }else{
            $ok = mysqli_stmt_bind_result($resultado,$arete,$nombre);
            while(mysqli_stmt_fetch($resultado)){
                echo $arete ." ". $nombre . ",";
            }
        }
        mysqli_stmt_close($resultado);
    }else{
        echo "Sesion invalida";
    }
?>     