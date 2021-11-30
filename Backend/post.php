<?php
    $dato = $_POST['dato'];
    $dato1 = $_POST['dato1'];
    require ('dConn.php');

    $conexion = mysqli_connect($host,$user,$pass);
    if (mysqli_connect_errno()){
        echo "Error al conectar BDD";
        exit();
    }
    mysqli_select_db($conexion,$db) or die ('No se encuentra BD');
    mysqli_set_charset($conexion, 'utf8');

    $sql = 'SELECT * FROM (?,?,?)';
    $resultado = mysqli_prepare($conexion,$sql);
    // i int,  s string, f float 
    $ok = mysqli_stmt_bind_param($resultado,'si',$dato,$dato1);
    $ok = mysqli_stmt_execute($resultado);
    if ($ok == false){
        echo '0';
    }else{
        echo '1'
        
    }
    mysqli_stmt_close($resultado);
?>