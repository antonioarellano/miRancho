<?php
    require ('JsonWebToken.php');
    require('bearerToken.php');
    require ('dConn.php');

    $arete = $_POST['arete']; 
    $nombre = $_POST['name']; 
    $sexo = $_POST['sex']; 
    $nac = $_POST['nac']; 
    $raza = $_POST['race'];
    $color = $_POST['color'];
    
    $tkn = getBearerToken();
    if(Auth::Check($tkn)){
        $id = Auth::GetData($tkn); 
        $conexion = mysqli_connect($host,$user,$pass, $bd);
        if (mysqli_connect_errno()){
            echo "Error al conectar BDD";
            exit();
        }
        mysqli_set_charset($conexion, 'utf8mb4');
        $sql = 'CALL cANIMAL(?,?,?,?,?,?,?);';
        $resultado = mysqli_prepare($conexion,$sql);
        // i int,  s string, f float 
        $ok = mysqli_stmt_bind_param($resultado,'sssssss',$arete,$nombre,$sexo,$nac,$raza,$color,$id);
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