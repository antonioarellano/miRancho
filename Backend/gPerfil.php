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
        $sql = 'CALL gPERFIL(?);';
        $resultado = mysqli_prepare($conexion,$sql);
        $ok = mysqli_stmt_bind_param($resultado,'s',$id);
        $ok = mysqli_stmt_execute($resultado);
        if ($ok == false){
            echo 'Error al consultar';
        }else{
            $ok = mysqli_stmt_bind_result($resultado,$username,$name,$address,$mail);
            
            while(mysqli_stmt_fetch($resultado)){
                $perfil = array(['id'=>'username','value'=>$username],['id'=>'name','value'=>$name],['id'=>'address','value'=>$address],['id'=>'mail','value'=>$mail]);
            }
            echo json_encode($perfil);
        }
        mysqli_stmt_close($resultado);
    }else{
        echo "Sesion invalida";
    }
?>     