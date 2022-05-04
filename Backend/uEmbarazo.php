<?php
    require ('JsonWebToken.php');
    require('bearerToken.php');
    require ('dConn.php');

    $id = $_POST['id']; 
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
            case 'fin':
                $sql = 'CALL uEMBARAZO_FIN(?,?);';
                break;
            case 'inicio':
                $sql = 'CALL uEMBARAZO_INICIO(?,?);';
                break;
            case 'madre':
                $sql = 'CALL uEMBARAZO_MADRE(?,?);';
                break;
            case 'padre':
                $sql = 'CALL uEMBARAZO_PADRE(?,?);';
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