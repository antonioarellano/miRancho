<?php
    require ('JsonWebToken.php');
    require ('dConn.php');
    $u =$_GET['u'];
    $p =$_GET['p'];
    $conexion = mysqli_connect($host,$user,$pass, $bd);
    if (mysqli_connect_errno()){
        echo "Error al conectar BDD";
    }
    $sql = 'CALL aUSER(?,?)';
    $resultado = mysqli_prepare($conexion,$sql);
    $ok = mysqli_stmt_bind_param($resultado,'ss',$u,$p);
    $ok = mysqli_stmt_execute($resultado);
    if ($ok == false){
        echo 'Error al consultar';
    }else{
        $ok = mysqli_stmt_bind_result($resultado,$id);
        while(mysqli_stmt_fetch($resultado)){
            echo (Auth::SignIn($id));
        }
    }
    mysqli_stmt_close($resultado);
?>
