<?php
    $id = $_GET['u'];
    require ('dConn.php');
    
    $conexion = mysqli_connect($host,$user,$pass, $bd);
    if (mysqli_connect_errno()){
        echo "Error al conectar BDD";
        exit();
    }
    mysqli_set_charset($conexion, 'utf8mb4');
    $sql = 'CALL gPREDIOS(?);';
    $resultado = mysqli_prepare($conexion,$sql);
    $ok = mysqli_stmt_bind_param($resultado,'s',$id);
    $ok = mysqli_stmt_execute($resultado);
    if ($ok == false){
        echo 'Error al consultar';
    }else{
        $ok = mysqli_stmt_bind_result($resultado,$name,$agua,$pasto);
        while(mysqli_stmt_fetch($resultado)){
            echo $name .",". $agua . ",".$pasto.".";
        }
        
    }
    mysqli_stmt_close($resultado);
?>