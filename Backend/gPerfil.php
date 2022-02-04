<?php
    require ('JsonWebToken.php');
    require ('dConn.php');

    $tkn = $_SERVER['Authorization'];
    echo ($tkn);
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
        if ($ok == false){
            echo 'Error al consultar';
        }else{
            $ok = mysqli_stmt_bind_result($resultado,$username,$name,$address,$mail);
            while(mysqli_stmt_fetch($resultado)){
                $usr->type = 'Usuario';
                $usr->data = $username
                $nm->type = 'Nombre';
                $nm->data = $name;
                $adr->type = 'Domicilio';
                $adr->data = $address
                $ml->type = 'Correo electrónico';
                $ml->data = $mail
                $perfil =  array ($usr,$nm,$adr,$ml);
                $myJSON = json_encode($perfil);
                echo $myJSON;
            }
        }
        mysqli_stmt_close($resultado);
    }else{
        echo "Sesion invalida";
    }
?>     