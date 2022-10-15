<?php
    require ('JsonWebToken.php');
    require('bearerToken.php');
    require ('dConn.php');

    $type = $_POST['type']; 
    $word = $_POST['word']; 
    $tkn = getBearerToken();

    if(Auth::Check($tkn)){
        $id = Auth::GetData($tkn);
        $conexion = mysqli_connect($host,$user,$pass, $bd);
        if (mysqli_connect_errno()){
            echo "Error al conectar BDD";
            exit();
        }
        mysqli_set_charset($conexion, 'utf8mb4');
        switch($type){
            case 'name':
                $sql = 'CALL uUSER_NAME(?,?);';
                break;
            case 'address':
                $sql = 'CALL uUSER_ADDRESS(?,?);';
                break;
            case 'mail':
                $sql = 'CALL uUSER_MAIL(?,?);';
                break;
            case 'pass':
                $sql = 'CALL uUSER_PASS(?,?);';
                break;
            default:
                break;
        }
        $resultado = mysqli_prepare($conexion,$sql);
        // i int,  s string, f float 
        $ok = mysqli_stmt_bind_param($resultado,'ss',$id,$word);
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