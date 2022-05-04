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
        $sql = 'CALL gMTW(?);';
        $resultado = mysqli_prepare($conexion,$sql);
        $ok = mysqli_stmt_bind_param($resultado,'s',$id);
        $ok = mysqli_stmt_execute($resultado);
        if ($ok == false){
            echo 'Error al consultar';
        }else{
            $ok = mysqli_stmt_bind_result($resultado,$tabla,$mtw);
            $timestamps = array();
            while(mysqli_stmt_fetch($resultado)){
                switch($tabla){
                    case 1:
                        $timestamps = array_merge($timestamps,['hato'=>$mtw]);
                        break;
                    case 2:
                        $timestamps = array_merge($timestamps,['sanitarios'=>$mtw]);
                        break;
                    case 3:
                        $timestamps = array_merge($timestamps,['ctl_animal'=>$mtw]);
                        break;
                    case 4:
                        $timestamps = array_merge($timestamps,['cria'=>$mtw]);
                        break;
                    case 5:
                        $timestamps = array_merge($timestamps,['embarazo'=>$mtw]);
                        break;
                    case 6:
                        $timestamps = array_merge($timestamps,['pesajes'=>$mtw]);
                        break;
                    case 7:
                        $timestamps = array_merge($timestamps,['predio'=>$mtw]);
                        break;
                    case 8:
                        $timestamps = array_merge($timestamps,['predio_animal'=>$mtw]);
                        break;
                    case 9:
                        $timestamps = array_merge($timestamps,['perfil'=>$mtw]);
                        break;
                    case 10:
                        $timestamps = array_merge($timestamps,['transferencia'=>$mtw]);
                        break;
                    case 11:
                        $timestamps = array_merge($timestamps,['vacunas'=>$mtw]);
                        break;
                    case 12:
                        $timestamps = array_merge($timestamps,['vac_animal'=>$mtw]);
                        break;
                    default:
                        break;
                }
                
            }
            echo json_encode($timestamps);
        }
        mysqli_stmt_close($resultado);
    }else{
        echo "Sesion invalida";
    }
?>     