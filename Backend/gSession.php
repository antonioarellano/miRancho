<?php
    require ('JsonWebToken.php');
    require ('dConn.php');
    $u =$_POST['u'];
    $p =$_POST['p'];
    $conexion = mysqli_connect($host,$user,$pass, $bd);
    if (mysqli_connect_errno()){
        echo false;
    }
    $sql = 'CALL aUSER(?,?)';
    $resultado = mysqli_prepare($conexion,$sql);
    $ok = mysqli_stmt_bind_param($resultado,'ss',$u,$p);
    $ok = mysqli_stmt_execute($resultado);
    if ($ok == false){
        echo false;
    }else{
        $ok = mysqli_stmt_bind_result($resultado,$id);
        while(mysqli_stmt_fetch($resultado)){
            echo (Auth::SignIn($id));
        }
    }
    mysqli_stmt_close($resultado);
?>
