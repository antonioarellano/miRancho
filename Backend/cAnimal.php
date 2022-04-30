<?php
    $arete = $_POST['a'];  
    $nombre = $_POST['n']; 
    $nac = $_POST['b'];
    $sexo = $_POST['s'];
    $raza = $_POST['r'];
    $color = $_POST['c'];
    $propietario =$_POST['p'];

    require ('dConn.php');
    if ($user==und)
    $conexion = mysqli_connect($host,$user,$pass, $bd);
    if (mysqli_connect_errno()){
        echo "Error al conectar BDD";
        exit();
    }
    mysqli_set_charset($conexion, 'utf8');

    $sql = 'CALL cANIMAL(?,?,?,?,?,?,?);';
    $resultado = mysqli_prepare($conexion,$sql);
    // i int,  s string, f float 
    $ok = mysqli_stmt_bind_param($resultado,'sssssss',$arete,$nombre,$sexo,$nac,$raza,$color,$propietario);
    $ok = mysqli_stmt_execute($resultado);
    if ($ok == false){
        echo '0';
    }else{
        echo '1'
    }
    mysqli_stmt_close($resultado);
?>