import React from 'react';
import { Button, NativeBaseProvider, Box, Input, FormControl, VStack} from 'native-base';


// Navegacion de Inicio
export const LogIn = ({navigation}) => {
    const [user, setUser] = React.useState({});
    const [pass, setPass] = React.useState({});
    const Iuser = () => {
        return (
            <VStack><FormControl isRequired>
                <FormControl.Label>Nombre de Usuario</FormControl.Label>
                <Input 
                    p={2} 
                    placeholder='Usuario'
                    onChangeText={(value) => setUser({ ...user, name: value })}
                />
                <FormControl.ErrorMessage>Elija un usuario diferente!</FormControl.ErrorMessage>
            </FormControl></VStack>
        );
    }
    const Ipass = () => {
        return (
            <VStack><FormControl isRequired>
                <FormControl.Label>Contraseña</FormControl.Label>
                <Input 
                    p={2} 
                    placeholder='Contraseña'
                    onChangeText={(value) => setPass({ ...pass, name: value })}
                />
                <FormControl.ErrorMessage>Elija una contraseña mas fuerte!</FormControl.ErrorMessage>
            </FormControl></VStack>
        );
    }
    const Blogin = () => {
        return <Button onPress={() => console.log("Entrando...")}>Entrar</Button>
    }
    const BsignIn = () => {
        return <Button onPress={() => navigation.navigate('singin')}>No tengo cuenta</Button>
    }
    return(
        <NativeBaseProvider>
            <Box>
                <Iuser/>
                <Ipass/>
                <Blogin/>
            </Box>
            <Box>
                <BsignIn/>
            </Box>
        </NativeBaseProvider>
    );
}

export const SingIn = ({navigation}) => {
    const [user, setUser] = React.useState({});
    const [pass, setPass] = React.useState({});
    const [name, setName] = React.useState({});
    const [adress, setAdress] = React.useState({});
    const [tlp, setTlp] = React.useState({});

    const Iuser = () => {
        return (
            <VStack><FormControl isRequired>
                <FormControl.Label>Nombre de Usuario</FormControl.Label>
                <Input 
                    p={2} 
                    placeholder='Usuario'
                    onChangeText={(value) => setUser({ ...user, name: value })}
                />
                <FormControl.ErrorMessage>Elija un usuario diferente!</FormControl.ErrorMessage>
            </FormControl></VStack>
        );
    }
    const Ipass = () => {
        return (
            <VStack><FormControl isRequired>
                <FormControl.Label>Contraseña</FormControl.Label>
                <Input 
                    p={2} 
                    placeholder='Contraseña'
                    onChangeText={(value) => setPass({ ...pass, name: value })}
                />
                <FormControl.ErrorMessage>Elija una contraseña mas fuerte!</FormControl.ErrorMessage>
            </FormControl></VStack>
        );
    }
    const Iname = () => {
        return (
            <VStack><FormControl isRequired>
                <FormControl.Label>Nombre Completo</FormControl.Label>
                <Input 
                    p={2} 
                    placeholder='Nombre'
                    onChangeText={(value) => setName({ ...name, name: value })}
                />
                <FormControl.ErrorMessage>Escriba su nombre completo!</FormControl.ErrorMessage>
            </FormControl></VStack>
        );
    }
    const Iadress = () => {
        return(
        <VStack><FormControl isRequired>
            <FormControl.Label>Domicilio</FormControl.Label>
            <Input 
                p={2} 
                placeholder='Domicilio'
                onChangeText={(value) => setAdress({ ...adress, name: value })}
            />
            <FormControl.ErrorMessage>Escriba calle y número de domicilio!</FormControl.ErrorMessage>
        </FormControl></VStack>
        );
    }
    const Iphone = () => {
        return (
        <VStack><FormControl isRequired>
            <FormControl.Label>Teléfono</FormControl.Label>
            <Input 
                p={2} 
                placeholder='Teléfono'
                onChangeText={(value) => setTlp({ ...tlp, name: value })}
            />
            <FormControl.ErrorMessage>Ingrese su número a 10 digitos!</FormControl.ErrorMessage>
        </FormControl></VStack>
        );
    }
    const Register = () => {
        //Validar
        
    }
    const Bregister = () => {
        return <Button onPress={Register}>Registrar</Button>
    }
    return (
        <NativeBaseProvider>
            <Iuser/>
            <Ipass/>
            <Iname/>
            <Iadress/>
            <Iphone/>
            <Bregister/>
        </NativeBaseProvider>
    );
}


// Navegacion principal