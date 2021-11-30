<?php
    $dato = $_GET['dato'];
    require ('dConn.php');

    $conexion = mysqli_connect($host,$user,$pass);
    if (mysqli_connect_errno()){
        echo "Error al conectar BDD";
        exit();
    }
    mysqli_select_db($conexion,$db) or die ('No se encuentra BD');
    mysqli_set_charset($conexion, 'utf8');

    $sql = 'SELECT * FROM ';
    $resultado = mysqli_prepare($conexion,$sql);
    // i int,  s string, f float 
    $ok = mysqli_stmt_bind_param($resultado,'s',$dato);
    $ok = mysqli_stmt_execute($resultado);
    if ($ok == false){
        echo 'Error al consultar';
    }else{
        $ok = mysqli_stmt_bind_result($resultado,$param1, $param2);
        while(mysqli_stmt_fetch($resultado)){
            echo $par1 . $param2 ;
        }
        
    }
    mysqli_stmt_close($resultado);
?>