import React from 'react';
import { Button, NativeBaseProvider, Box, Input, FormControl, VStack, Checkbox, Link} from 'native-base';


// Navegacion de Inicio
export const LogIn = ({navigation}) => {
    const [data, setData] = React.useState({});
    const [errors, setError] = React.useState({});
    const handleLogin = () => {
        //Validar
        console.log("validando")
        if (data.user === undefined || data.user === ''){
            setError({...errors,user:'Se necesita un usuario'})
            return false;
        }   
        if (data.pass === undefined || data.pass === ''){
            setError({...errors,pass:'Se necesita una contraseña'})
            return false;
        }
        //Peticion HTTP
        console.log(data.user,data.pass)
    }
   
    return(
        <NativeBaseProvider>
            <Box>
                <VStack><FormControl isRequired isInvalid={'user' in errors}>
                        <FormControl.Label>Nombre de Usuario</FormControl.Label>
                        <Input 
                            placeholder='Usuario'
                            onChangeText={(value) => setData({...data, user:value})}
                        />
                        {'user' in errors ?
                        <FormControl.ErrorMessage _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>{errors.user}</FormControl.ErrorMessage>:
                            <FormControl.HelperText _text={{fontSize: 'xs'}}>Diferenciar MAYUS de MINUS</FormControl.HelperText>
                        }
                    
                </FormControl></VStack>
                <VStack>
                    <FormControl isRequired isInvalid={'pass' in errors}>
                        <FormControl.Label>Contraseña</FormControl.Label>
                        <Input 
                            placeholder='Contraseña'
                            type = 'password'
                            onChangeText={(value) => setData({...data, pass:value})}
                        />
                        {'pass' in errors ?
                        <FormControl.ErrorMessage _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>{errors.pass}</FormControl.ErrorMessage>:
                            <FormControl.HelperText _text={{fontSize: 'xs'}}>Diferenciar MAYUS de MINUS</FormControl.HelperText>
                        }
                    </FormControl>
                </VStack>
                <Button onPress={handleLogin}>Entrar</Button>
            </Box>
            <Box>
                <Button onPress={() => navigation.navigate('singin')}>No tengo cuenta</Button>
            </Box>
        </NativeBaseProvider>
    );
}

export const SingIn = ({navigation}) => {
    const [data, setData] = React.useState({});
        // user,name,pass,cpass,address, phone, terms.
    const [errors, setError] = React.useState({});
 
    const HandleRegister = () => {
        if (data.user === undefined ) {
            setError(...errors, {user:'Se necesita usuario'})
            return false;
        }
        if (data.pass === undefined ) {
            setError(...errors, {pass:'Se necesita contraseña'})
            return false;
        }
        if (data.cpass === undefined ) {
            setError(...errors, {pass:'Se necesita confirmar la contraseña'})
            return false;
        }
        if (data.name === undefined ) {
            setError(...errors, {name:'Se necesita el nombre'})
            return false;
        }
        if (data.address === undefined ) {
            setError(...errors, {address:'Se necesita domicilio'})
            return false;
        }
        if (data.phone === undefined ) {
            setError(...errors, {phone:'Se necesita número de celular'})
            return false;
        }
        if (data.terms === undefined ) {
            setError(...errors, {terms:'Se aceptar los términos y condiciones de uso'})
            return false;
        }
        if (data.pass != data.cpass){
            setError(...errors, {pass:'Las contraseñas no coinciden'})
            return false;
        }
        // Comprobar si existe el usuario
        //Comprobar el telefono 
    }
    return (
        <NativeBaseProvider>

            <VStack><FormControl isRequired isInvalid={'user' in errors}>
                <FormControl.Label>Nombre de Usuario</FormControl.Label>
                <Input 
                    p={2} 
                    placeholder='Usuario'
                    onChangeText={(value) => setData(...data, {user: value})}
                />
                {'user' in errors ?
                <FormControl.ErrorMessage _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>{errors.user}</FormControl.ErrorMessage>:
                    <FormControl.HelperText _text={{fontSize: 'xs'}}>Diferenciar MAYUS de MINUS</FormControl.HelperText>
                }
            </FormControl></VStack>

            <VStack><FormControl isRequired isInvalid={'pass' in errors}>
                <FormControl.Label>Contraseña</FormControl.Label>
                <Input 
                    p={2} 
                    placeholder='Contraseña'
                    onChangeText={(value) => setData(...data, {pass:value})}
                    type = 'password'
                />
                <Input
                    p={2}
                    placeholder='Confirmar contraseña'
                    onChangeText={(value)=> setData(...data, {cpass:value})}
                    type = 'password'
                />
                {'pass' in errors ?
                <FormControl.ErrorMessage _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>{errors.pass}</FormControl.ErrorMessage>:
                    <FormControl.HelperText _text={{fontSize: 'xs'}}>Diferenciar MAYUS de MINUS</FormControl.HelperText>
                }
            </FormControl></VStack>
            
            <VStack><FormControl isRequired isInvalid={'name' in errors}>
                <FormControl.Label>Nombre Completo</FormControl.Label>
                <Input 
                    p={2} 
                    placeholder='Nombre'
                    onChangeText={(value) => setData(...data, {name:value})}
                />
                {'name' in errors ?
                <FormControl.ErrorMessage _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>{errors.name}</FormControl.ErrorMessage>:
                    <FormControl.HelperText _text={{fontSize: 'xs'}}>Escriba nombre completo</FormControl.HelperText>
                }
            </FormControl></VStack>

            <VStack><FormControl isRequired isInvalid={'address' in errors}>
            <FormControl.Label>Domicilio</FormControl.Label>
            <Input 
                p={2} 
                placeholder='Domicilio'
                onChangeText={(value) => setData(...data, {address:value})}
            />

            {'address' in errors ?
                <FormControl.ErrorMessage _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>{errors.address}</FormControl.ErrorMessage>:
                    <FormControl.HelperText _text={{fontSize: 'xs'}}>Agregue un domicilio</FormControl.HelperText>
                }
            </FormControl></VStack>
            
            <VStack><FormControl isRequired isInvalid={'phone' in errors}>
                <FormControl.Label>Teléfono</FormControl.Label>
                <Input 
                    p={2} 
                    placeholder='Teléfono'
                    onChangeText={(value) => setData(...data, {phone:value})}
                />
                {'user' in errors ?
                    <FormControl.ErrorMessage _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>{errors.phone}</FormControl.ErrorMessage>:
                        <FormControl.HelperText _text={{fontSize: 'xs'}}>Diferenciar MAYUS de MINUS</FormControl.HelperText>
                    }
            </FormControl></VStack>

            <VStack><FormControl isRequired isInvalid={'terms' in errors}>
                <Checkbox onChange={() => setData(...data, {terms:value})}>
                    Aceptar  
                    <Link onPress={()=>navigation.navigate('terms')}> terminos y condiciones de uso</Link>
                </Checkbox>
                    
            </FormControl></VStack>

            <VStack><Button onPress={HandleRegister}>Registrar</Button></VStack>
        </NativeBaseProvider>
    );
}
export const Terms = ({navigation}) => {
    return(
        <NativeBaseProvider>
            <Box>
                Aqui estan los terminos y condiciones jeje
            </Box>
        </NativeBaseProvider>
    );
}

// Navegacion principal