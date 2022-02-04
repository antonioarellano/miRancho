<?php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
require_once 'vendor/autoload.php';

class Auth
{
    private static $secret_key = 'Fashero';
    private static $encrypt = 'HS256';
    private static $aud = null;

    public static function SignIn($data)
    {
        $time = time();

        $token = array(
            'exp' => $time + (60*60*24*15),
            'user' => $data
        );

        return JWT::encode($token, self::$secret_key,self::$encrypt);
    }

    public static function Check($token)
    {
        if(empty($token))
        {
            return false;
        }
        try{
            $decode = JWT::decode($token, new Key(self::$secret_key,self::$encrypt));
        }catch(Exception $e){
            return false;
        }
        return true;
    }

    public static function GetData($token)
    {
        try{
            $decode = JWT::decode($token, new Key(self::$secret_key,self::$encrypt);
        }catch(Exception $e){
            return false;
        }
        return $decode->token;
    }
}