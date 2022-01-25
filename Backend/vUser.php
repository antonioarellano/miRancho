<?php
    $dato = $_GET['u'];
    require ('dConn.php');

    $conexion = mysqli_connect($host,$user,$pass, $bd);
    if (mysqli_connect_errno()){
        echo "Error al conectar BDD";
        exit();
    }
    mysqli_set_charset($conexion, 'utf8');

    $sql = 'CALL vUSER(?);';
    $resultado = mysqli_prepare($conexion,$sql);
    // i int,  s string, f float 
    $ok = mysqli_stmt_bind_param($resultado,'s',$dato);
    $ok = mysqli_stmt_execute($resultado);
    if ($ok == false){
        echo 'Error al consultar';
    }else{
        $ok = mysqli_stmt_bind_result($resultado,$param1);
        while(mysqli_stmt_fetch($resultado)){
            echo $param1;
        }
        
    }
    mysqli_stmt_close($resultado);
?>