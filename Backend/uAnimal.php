<?php
    require ('JsonWebToken.php');
    require('bearerToken.php');
    require ('dConn.php');

    $arete = $_POST['arete']; 
    $type = $_POST['type']; 
    $word = $_POST['word']; 
   
    $tkn = getBearerToken();
    if(Auth::Check($tkn)){
        $conexion = mysqli_connect($host,$user,$pass, $bd);
        if (mysqli_connect_errno()){
            echo "Error al conectar BDD";
            exit();
        }
        mysqli_set_charset($conexion, 'utf8mb4');
        switch($type){
            case 'name':
                $sql = 'CALL uANIMAL_NAME(?,?);';
                break;
            case 'sex':
                $sql = 'CALL uANIMAL_SEX(?,?);';
                break;
            case 'nac':
                $sql = 'CALL uANIMAL_NAC(?,?);';
                break;
            case 'race':
                $sql = 'CALL uANIMAL_RACE(?,?);';
                break;
            case 'color':
                $sql = 'CALL uANIMAL_COLOR(?,?);';
                break;
            case 'owner':
                $sql = 'CALL uANIMAL_OWNER(?,?);';
                break;
            default:
                break;
        }
        $resultado = mysqli_prepare($conexion,$sql);
        // i int,  s string, f float 
        $ok = mysqli_stmt_bind_param($resultado,'ss',$arete,$word);
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