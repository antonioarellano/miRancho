<?php
    require ('JsonWebToken.php');
    require('bearerToken.php');
    require ('dConn.php');

    $tkn = getBearerToken();

    if(Auth::Check($tkn)){
        $id = Auth::GetData($tkn);
        $conexion = mysqli_connect($host,$user,$pass, $bd);
        if (mysqli_connect_errno()){
            echo "Error al conectar BDD";
            exit();
        }
        mysqli_set_charset($conexion, 'utf8mb4');
        $sql = 'CALL gANIMAL_CONTROL(?);';
        $resultado = mysqli_prepare($conexion,$sql);
        $ok = mysqli_stmt_bind_param($resultado,'s',$id);
        $ok = mysqli_stmt_execute($resultado);
        if ($ok == false){
            echo 'Error al consultar';
        }else{
            $ok = mysqli_stmt_bind_result($resultado,$id,$arete,$ctl);
            $animal_control = array();
            while(mysqli_stmt_fetch($resultado)){
                array_push($animal_control,['id'=>$id,'arete'=>$id,'ctl'=>$ctl,'date'=>$fecha]);
            }
            echo json_encode($animal_control);
        }
        mysqli_stmt_close($resultado);
    }else{
        echo "Sesion invalida";
    }
?>     