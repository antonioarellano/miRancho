import React from 'react';
import { Button, NativeBaseProvider, Box, Center, FormControl, VStack} from 'native-base';


export const FrmSingIn = () => {
    const [user, setUser] = React.useState({});
    const [pass, setPass] = React.useState({});
    const [name, setName] = React.useState({});
    const [adress, setAdress] = React.useState({});
    const [tlp, setTlp] = React.useState({});
    return (
        <NativeBaseProvider>
            <VStack><FormControl isRequired>
                <FormControl.Label>Nombre de Usuario</FormControl.Label>
                <Input 
                    p={2} 
                    placeholder='Usuario'
                    onChangeText={(value) => setUser({ ...user, name: value })}
                />
                <FormControl.ErrorMessage>Elija un usuario diferente!</FormControl.ErrorMessage>
            </FormControl></VStack>
            <VStack><FormControl isRequired>
                <FormControl.Label>Contraseña</FormControl.Label>
                <Input 
                    p={2} 
                    placeholder='Contraseña'
                    onChangeText={(value) => setPass({ ...pass, name: value })}
                />
                <FormControl.ErrorMessage>Elija una contraseña mas fuerte!</FormControl.ErrorMessage>
            </FormControl></VStack>
            <VStack><FormControl isRequired>
                <FormControl.Label>Nombre Completo</FormControl.Label>
                <Input 
                    p={2} 
                    placeholder='Nombre'
                    onChangeText={(value) => setName({ ...name, name: value })}
                />
                <FormControl.ErrorMessage>Escriba su nombre completo!</FormControl.ErrorMessage>
            </FormControl></VStack>

            <VStack><FormControl isRequired>
                <FormControl.Label>Domicilio</FormControl.Label>
                <Input 
                    p={2} 
                    placeholder='Domicilio'
                    onChangeText={(value) => setAdress({ ...adress, name: value })}
                />
                <FormControl.ErrorMessage>Escriba calle y número de domicilio!</FormControl.ErrorMessage>
            </FormControl></VStack>

            <VStack><FormControl isRequired>
                <FormControl.Label>Teléfono</FormControl.Label>
                <Input 
                    p={2} 
                    placeholder='Teléfono'
                    onChangeText={(value) => setTlp({ ...tlp, name: value })}
                />
                <FormControl.ErrorMessage>Ingrese su número a 10 digitos!</FormControl.ErrorMessage>
            </FormControl></VStack>
        </NativeBaseProvider>
    );
}
export const Home = () => {
    export const User = ()  => {
        return <Input>Usuario</Input>
    }
    export const Pass = () => {
        return <Input>Contraseña</Input>
    } 
    export const Login = () => {
        return <Button onPress={() => console.log("hello world")}>Entrar</Button>
    }
    return(
        <NativeBaseProvider>
            <Box>
                <User/>
                <Pass/>
                <Login/>
            </Box>
        </NativeBaseProvider>
    );
}
export const SigIn = () => {
    return(
        <NativeBaseProvider>
            <Box>
                
            </Box>
        </NativeBaseProvider>
    );
}