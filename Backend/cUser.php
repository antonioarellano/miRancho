<?php
    $user = $_POST['u']; 
    $pass = $_POST['p']; 
    $name = $_POST['n'];
    $address = $_POST['a'];
    $mail = $_POST['m'];
    $clave = random_int(1000,9999);
    require ('dConn.php');
    if ($user==und)
    $conexion = mysqli_connect($host,$user,$pass, $bd);
    if (mysqli_connect_errno()){
        echo "Error al conectar BDD";
        exit();
    }
    mysqli_set_charset($conexion, 'utf8');

    $sql = 'CALL cUSER(?,?,?,?,?,?);';
    $resultado = mysqli_prepare($conexion,$sql);
    // i int,  s string, f float 
    $ok = mysqli_stmt_bind_param($resultado,'sssssi',$user,$pass,$name,$address,$mail,$clave);
    $ok = mysqli_stmt_execute($resultado);
    if ($ok == false){
        echo '0';
    }else{
        echo '1'
    }
    mysqli_stmt_close($resultado);
?>