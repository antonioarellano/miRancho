<?php
    require ('JsonWebToken.php');
    require('bearerToken.php');
    require ('dConn.php');

    $sanitario = $_POST['sanitario']; 
    $arete = $_POST['arete']; 
    
    $tkn = getBearerToken();
    if(Auth::Check($tkn)){
        $conexion = mysqli_connect($host,$user,$pass, $bd);
        if (mysqli_connect_errno()){
            echo "Error al conectar BDD";
            exit();
        }
        mysqli_set_charset($conexion, 'utf8mb4');
        $sql = 'CALL cCONTROL_ANIMAL(?,?);';
        $resultado = mysqli_prepare($conexion,$sql);
        // i int,  s string, f float 
        $ok = mysqli_stmt_bind_param($resultado,'is',$sanitario,$arete);
        $ok = mysqli_stmt_execute($resultado);
        if ($ok == false){
            echo '0';
        }else{
            echo '1';
        }
        mysqli_stmt_close($resultado);
    }else{
        echo "Sesion invalida";
    }
?>