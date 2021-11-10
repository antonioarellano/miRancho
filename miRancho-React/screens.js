import React from 'react';
import { Button, NativeBaseProvider, Box, Input, FormControl, VStack, Checkbox, Link, Switch, Select, Radio, ScrollView, Divider, Center, Container, Flex} from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';
import { UserContext } from './UserContext';
import moment from 'moment'
import { backgroundColor } from 'styled-system';
// Navegacion de Inicio //

//Screen LogIn
export const LogIn = ({navigation}) => {
    const [data, setData] = React.useState({});
    const [errors, setError] = React.useState({});
    const setUser = React.useContext(UserContext);
    const getUser = async () => {
        console.log(data.user,data.pass)
        return data.user;
    }
    const handleLogin = () => {
        navigation.navigate('rancho')
        //Validar
        /* 
        console.log("validando")
        if (data.user === undefined || data.user === ''){
            setError({...errors,user:'Se necesita un usuario'})
            return false;
        }   
        if (data.pass === undefined || data.pass === ''){
            setError({...errors,pass:'Se necesita una contraseña'})
            return false;
        }
        const user = getUser();
         
        setUser(user);
        */
        //Peticion HTTP
        // Establece el user de context
        
    }
   
    return(
        < Box justifyContent='center'  flex= {1}>
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
            <Button colorScheme='success' onPress={() => navigation.navigate('rancho')}>Entrar</Button>
            <Divider my={3}/>
            <Button colorScheme='teal' variant = 'outline' onPress={() => navigation.navigate('singin')}>No tengo cuenta</Button>
        </Box>
    );
}
//Screen SignIn
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
        <Box justifyContent='center'  flex= {1}>
            <VStack><FormControl isRequired isInvalid={'user' in errors}>
                <FormControl.Label>Nombre de Usuario (Se sugiere usar la CURP)</FormControl.Label>
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
        </Box>
    );
}
//Screen Terms
export const Terms = ({navigation}) => {
    return(
        <NativeBaseProvider>
            <Box>
                Aqui estan los terminos y condiciones jeje
            </Box>
        </NativeBaseProvider>
    );
}

// Navegacion "Rancho" //

//Screen Ganado
var animal = {
    arete:'',
    nombre:'',
    sexo:'',
    fecha:new Date(),
    raza:'',
    color:'',
    predio:'',
}
export const Ganado = ({navigation}) => {
    const [key, setKey] = React.useState({type:'arete',word:''})
    const [data,setData] = React.useState(animal)
    const [errors, setErrors] = React.useState({})
    const user = React.useContext(UserContext)
    return (
        <ScrollView>
            <Box bg="#DEDDDA" rounded="lg" borderColor="#9A9996" borderWidth={2}>
                <VStack alignItems="center" space={4}>
                    <FormControl isInvalid={'search' in errors}>
                        <FormControl.Label>Busqueda</FormControl.Label>
                            <Select
                                selectedValue={key.type}
                                mt={1}
                                onValueChange={(itemValue) => setKey({...key, type:itemValue})}
                            >
                                <Select.Item label="Nombre" value="nombre" />
                                <Select.Item label="Arete" value="arete" />
                            </Select>
                    
                            <Input 
                                placeholder={key.type}
                                onChangeText={(value) => setkey({...key, word:value})}
                            />
                            {'key' in errors ?
                            <FormControl.ErrorMessage _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>{errors.key}</FormControl.ErrorMessage>:
                                <FormControl.HelperText _text={{fontSize: 'xs'}}>Diferenciar MAYUS de MINUS</FormControl.HelperText>
                            }
                            <Button colorScheme="teal" >Buscar</Button>
                    </FormControl>
                </VStack>
            </Box>
            <Divider my={5} />
            <Box>
                <VStack><FormControl isInvalid={'arete' in errors}>
                    <FormControl.Label>Arete</FormControl.Label>
                    <Input
                        placeholder={data.arete}
                        //onChangeText = {(value) => setData({...data, arete:value})}
                    />
                    {'arete' in errors ?
                    <FormControl.ErrorMessage _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>{errors.arete}</FormControl.ErrorMessage>:
                        <FormControl.HelperText _text={{fontSize: 'xs'}}>Diferenciar MAYUS de MINUS</FormControl.HelperText>
                    }
                </FormControl></VStack>

                <VStack><FormControl isInvalid={'nombre' in errors}>
                    <FormControl.Label>Nombre</FormControl.Label>
                    <Input
                        placeholder={data.nombre}
                        onChangeText = {(value) => setData({...data, nombre:value})}
                    />
                    {'nombre' in errors ?
                    <FormControl.ErrorMessage _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>{errors.nombre}</FormControl.ErrorMessage>:
                        <FormControl.HelperText _text={{fontSize: 'xs'}}>Diferenciar MAYUS de MINUS</FormControl.HelperText>
                    }
                </FormControl></VStack>

                <VStack><FormControl isInvalid={'sexo' in errors}>
                    <FormControl.Label>Sexo</FormControl.Label>
                        <Radio.Group

                        name="sexo"
                        accessibilityLabel="sexo"
                        value={data.sexo}
                        onChange={(nextValue) => {
                            setData({...data, sexo:nextValue})
                        }}
                        >
                            <Radio value="M" my={1}>
                                Masculino
                            </Radio>
                            <Radio value="F" my={1}>
                                Femenino
                            </Radio>
                        </Radio.Group>
                        <FormControl.ErrorMessage _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>{errors.sexo}</FormControl.ErrorMessage>
                </FormControl></VStack>

                <VStack>
                    <DateTimePicker value={data.fecha} onChange={(event, selectedDate) => setData({...data, fecha:selectedDate})} />
                </VStack>

                <VStack><FormControl isInvalid={'raza' in errors}>
                    <FormControl.Label>Raza</FormControl.Label>
                    <Input
                        placeholder={data.raza}
                        onChangeText = {(value) => setData({...data, raza:value})}
                    />
                    {'raza' in errors ?
                    <FormControl.ErrorMessage _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>{errors.raza}</FormControl.ErrorMessage>:
                        <FormControl.HelperText _text={{fontSize: 'xs'}}>Diferenciar MAYUS de MINUS</FormControl.HelperText>
                    }
                </FormControl></VStack>


                <VStack><FormControl isInvalid={'color' in errors}>
                    <FormControl.Label>Color</FormControl.Label>
                    <Input
                        placeholder={data.color}
                        onChangeText = {(value) => setData({...data, color:value})}
                    />
                    {'color' in errors ?
                    <FormControl.ErrorMessage _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>{errors.color}</FormControl.ErrorMessage>:
                        <FormControl.HelperText _text={{fontSize: 'xs'}}>Diferenciar MAYUS de MINUS</FormControl.HelperText>
                    }
                </FormControl></VStack>


                <VStack><FormControl isInvalid={'predio' in errors}>
                    <FormControl.Label>Predio</FormControl.Label>
                    <Input
                        placeholder={data.predio}
                        onChangeText = {(value) => setData({...data, predio:value})}
                    />
                    {'predio' in errors ?
                    <FormControl.ErrorMessage _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>{errors.predio}</FormControl.ErrorMessage>:
                        <FormControl.HelperText _text={{fontSize: 'xs'}}>Diferenciar MAYUS de MINUS</FormControl.HelperText>
                    }
                </FormControl></VStack>

                <Center>
                <Divider my={1}/>
                <Button.Group > 
                    <Button colorScheme="success">Crear</Button>
                    <Button colorScheme="warning">Actualizar</Button>
                    <Button colorScheme="danger">Eliminar</Button>
                </Button.Group>
                </Center>
                <Divider my={2}/>
                <Button.Group colorScheme="info" direction="column" variant="outline">
                    <Button >Registro de vacunación</Button>
                    <Button >Control Reproductivo</Button>
                    <Button >Historial de pesajes</Button>
                    <Button >Control Sanitario</Button>
                </Button.Group>
                
            </Box>
        </ScrollView>
    );
}
//Screen Vacunas
var vacuna = {
    codigo:'',
    nombre:'',
    fecha: new Date(),
}
export const Vacunas = ({navigation }) => {
    const [key, setKey] = React.useState({type:'arete',word:''})
    const [data,setData] = React.useState(vacuna)
    const [errors, setErrors] = React.useState({})
    const user = React.useContext(UserContext)
    return (
        <NativeBaseProvider>


            <VStack alignItems="center" space={4}>
                <Select
                    selectedValue={key.type}
                    placeholder="Busqueda"
                    mt={1}
                    onValueChange={(itemValue) => setKey({...key, type:itemValue})}
                >
                    <Select.Item label="Nombre" value="nombre" />
                    <Select.Item label="Fecha" value="fecha" />
                </Select>
                <FormControl>
                    <FormControl.Label>Busqueda</FormControl.Label>
                        <Input 
                            placeholder={key}
                            onChangeText={(value) => setkey({...key, word:value})}
                        />
                        {'key' in errors ?
                        <FormControl.ErrorMessage _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>{errors.key}</FormControl.ErrorMessage>:
                            <FormControl.HelperText _text={{fontSize: 'xs'}}>Diferenciar MAYUS de MINUS</FormControl.HelperText>
                        }
                </FormControl>
                <Button >Buscar</Button>
            </VStack>

            <VStack><FormControl isInvalid={'codigo' in errors}>
                <FormControl.Label>Codigo</FormControl.Label>
                <Input
                    placeholder='Codigo'
                    onChangeText={(value) => setData({...data, codigo:value})}
                />
            </FormControl></VStack>
            <VStack><FormControl isInvalid={'nombre' in errors}>
                <FormControl.Label>Codigo</FormControl.Label>
                <Input
                    placeholder='Nombre'
                    onChangeText={(value) => setData({...data, nombre:value})}
                />
            </FormControl></VStack>
            <VStack><FormControl isInvalid={'fecha' in errors}>
                <FormControl.Label>Fecha</FormControl.Label>
                <DatePicker selected={data.fecha} onChange={(date) => setData({...data, fecha:date})} />
                {'fecha' in errors ?
                <FormControl.ErrorMessage _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>{errors.fecha}</FormControl.ErrorMessage>:
                    <FormControl.HelperText _text={{fontSize: 'xs'}}>Diferenciar MAYUS de MINUS</FormControl.HelperText>
                }
            </FormControl></VStack>
            <VStack>
                <Button>Crear</Button>
                <Button>Actualizar</Button>
                <Button>Borrar</Button>
            </VStack>

        </NativeBaseProvider>
    );

}

//Screen Sanitario
var ctlSanitario = {
    codigo:'',
    nombre:'',
    fecha: new Date(),
}
export const ControlSan = ({navigation}) =>{
    const [key, setKey] = React.useState({type:'nombre',word:''})
    const [data,setData] = React.useState(ctlSanitario)
    const [errors, setErrors] = React.useState({})
    const user = React.useContext(UserContext)
    return (
        <NativeBaseProvider>

            <VStack alignItems="center" space={4}>
                <Select
                    selectedValue={key.type}
                    minWidth="200"
                    placeholder="Busqueda"
                    mt={1}
                    onValueChange={(itemValue) => setKey({...key, type:itemValue})}
                >
                    <Select.Item label="Nombre" value="nombre" />
                    <Select.Item label="Fecha" value="fecha" />
                </Select>
                <FormControl>
                    <FormControl.Label>Busqueda</FormControl.Label>
                        <Input 
                            placeholder={key.type}
                            onChangeText={(value) => setkey({...key, word:value})}
                        />
                        {'key' in errors ?
                        <FormControl.ErrorMessage _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>{errors.key}</FormControl.ErrorMessage>:
                            <FormControl.HelperText _text={{fontSize: 'xs'}}>Diferenciar MAYUS de MINUS</FormControl.HelperText>
                        }
                </FormControl>
                <Button >Buscar</Button>
            </VStack>

            <VStack><FormControl isInvalid={'codigo' in errors}>
                <FormControl.Label>Codigo</FormControl.Label>
                <Input
                    placeholder='Codigo'
                    onChangeText={(value) => setData({...data, codigo:value})}
                />
            </FormControl></VStack>
            <VStack><FormControl isInvalid={'nombre' in errors}>
                <FormControl.Label>Codigo</FormControl.Label>
                <Input
                    placeholder='Nombre'
                    onChangeText={(value) => setData({...data, nombre:value})}
                />
            </FormControl></VStack>
            <VStack><FormControl isInvalid={'fecha' in errors}>
                <FormControl.Label>Fecha</FormControl.Label>
                <DatePicker selected={data.fecha} onChange={(date) => setData({...data, fecha:date})} />
                {'fecha' in errors ?
                <FormControl.ErrorMessage _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>{errors.fecha}</FormControl.ErrorMessage>:
                    <FormControl.HelperText _text={{fontSize: 'xs'}}>Diferenciar MAYUS de MINUS</FormControl.HelperText>
                }
            </FormControl></VStack>
            <VStack>
                <Button>Crear</Button>
                <Button>Actualizar</Button>
                <Button>Borrar</Button>
            </VStack>

        </NativeBaseProvider>
    );
}

//Screen Control Reproductivo
var embarazo = {
    codigo:'',
    inicio: new Date(),
    fin: new Date(),
}
export const ControlRep = ({navigation}) => {
    <NativeBaseProvider>

        <VStack alignItems="center" space={4}>
            <Select
                selectedValue={key.type}
                minWidth="200"
                placeholder="Busqueda"
                mt={1}
                onValueChange={(itemValue) => setKey({...key, type:itemValue})}
            >
                <Select.Item label="Arete" value="codigo" />
                <Select.Item label="Fecha" value="fecha" />
            </Select>
            <FormControl>
                <FormControl.Label>Busqueda</FormControl.Label>
                    <Input 
                        placeholder={key}
                        onChangeText={(value) => setkey({...key, word:value})}
                    />
                    {'key' in errors ?
                    <FormControl.ErrorMessage _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>{errors.key}</FormControl.ErrorMessage>:
                        <FormControl.HelperText _text={{fontSize: 'xs'}}>Diferenciar MAYUS de MINUS</FormControl.HelperText>
                    }
            </FormControl>
            <Button >Buscar</Button>
        </VStack>

        <VStack><FormControl isInvalid={'codigo' in errors}>
            <FormControl.Label>Codigo</FormControl.Label>
            <Label value={data.codigo}/>
        </FormControl></VStack>

        <VStack><FormControl isInvalid={'inicio' in errors}>
            <FormControl.Label>Fecha de inicio</FormControl.Label>
            <DatePicker selected={data.inicio} onChange={(date) => setData({...data, inicio:date})} />
            {'inicio' in errors ?
            <FormControl.ErrorMessage _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>{errors.inicio}</FormControl.ErrorMessage>:
                <FormControl.HelperText _text={{fontSize: 'xs'}}>Verificar fecha</FormControl.HelperText>
            }
        </FormControl></VStack>

        <VStack><FormControl isInvalid={'fin' in errors}>
            <FormControl.Label>Fecha de fin</FormControl.Label>
            <DatePicker selected={data.fecha} onChange={(date) => setData({...data, fin:date})} />
            {'fin' in errors ?
            <FormControl.ErrorMessage _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>{errors.fin}</FormControl.ErrorMessage>:
                <FormControl.HelperText _text={{fontSize: 'xs'}}>Verificar fecha</FormControl.HelperText>
            }
        </FormControl></VStack>
        <VStack>
            <Button>Crear</Button>
            <Button>Actualizar</Button>
            <Button>Borrar</Button>
        </VStack>
    </NativeBaseProvider>
}

//Screen Pesajes

var peso = {
    codigo:'',
    arete:'',
    fecha: new Date(),
    kg:0.0,
}
export const Pesaje = ({navigation}) => {
    const [key, setKey] = React.useState({type:'nombre',word:''})
    const [data,setData] = React.useState(ctlSanitario)
    const [errors, setErrors] = React.useState({})
    const user = React.useContext(UserContext)
    return (
        <NativeBaseProvider>

            <VStack alignItems="center" space={4}>
                <Select
                    selectedValue={key.type}
                    minWidth="200"
                    placeholder="Busqueda"
                    mt={1}
                    onValueChange={(itemValue) => setKey({...key, type:itemValue})}
                >
                    <Select.Item label="Peso" value="peso" />
                    <Select.Item label="Fecha" value="fecha" />
                </Select>
                <FormControl>
                    <FormControl.Label>Busqueda</FormControl.Label>
                        <Input 
                            placeholder={key.type}
                            onChangeText={(value) => setkey({...key, word:value})}
                        />
                        {'key' in errors ?
                        <FormControl.ErrorMessage _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>{errors.key}</FormControl.ErrorMessage>:
                            <FormControl.HelperText _text={{fontSize: 'xs'}}>Diferenciar MAYUS de MINUS</FormControl.HelperText>
                        }
                </FormControl>
                <Button >Buscar</Button>
            </VStack>

            <VStack><FormControl isInvalid={'codigo' in errors}>
                <FormControl.Label>Codigo</FormControl.Label>
                <Label value={data.codigo}/>
            </FormControl></VStack>
            <VStack><FormControl isInvalid={'arete' in errors}>
                <FormControl.Label>Arete</FormControl.Label>
                <Input
                    placeholder='Arete'
                    onChangeText={(value) => setData({...data, arete:value})}
                />
            </FormControl></VStack>
            <VStack><FormControl isInvalid={'fecha' in errors}>
                <FormControl.Label>Fecha</FormControl.Label>
                <DatePicker selected={data.fecha} onChange={(date) => setData({...data, fecha:date})} />
                {'fecha' in errors ?
                <FormControl.ErrorMessage _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>{errors.fecha}</FormControl.ErrorMessage>:
                    <FormControl.HelperText _text={{fontSize: 'xs'}}>Diferenciar MAYUS de MINUS</FormControl.HelperText>
                }
            </FormControl></VStack>
            <VStack><FormControl isInvalid={'peso' in errors}>
                <FormControl.Label>Peso</FormControl.Label>
                <Input
                    placeholder='Peso'
                    keyboardType='numeric'
                    onChangeText={(value) => setData({...data, peso:value})}
                />
            </FormControl></VStack>
            <VStack>
                <Button>Crear</Button>
                <Button>Actualizar</Button>
                <Button>Borrar</Button>
            </VStack>

        </NativeBaseProvider>
    );
}

//Screen Predios
var predio = {
    nombre:'',
    extension: 0.0,
    agua: true,
    pasto: true,
}
export const Predio = ( {navitagion}) => {
    const [key, setKey] = React.useState({type:'nombre',word:''})
    const [data,setData] = React.useState(vacuna)
    const [errors, setErrors] = React.useState({})
    const user = React.useContext(UserContext)
    return (
        <NativeBaseProvider>

            <VStack alignItems="center" space={4}>
                <FormControl>
                    <FormControl.Label>Nombre</FormControl.Label>
                        <Input 
                            placeholder={key.type}
                            onChangeText={(value) => setkey({...key, word:value})}
                        />
                        {'key' in errors ?
                        <FormControl.ErrorMessage _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>{errors.key}</FormControl.ErrorMessage>:
                            <FormControl.HelperText _text={{fontSize: 'xs'}}>Diferenciar MAYUS de MINUS</FormControl.HelperText>
                        }
                </FormControl>
                <Button >Buscar</Button>
            </VStack>

            <VStack><FormControl isInvalid={'nombre' in errors}>
                <FormControl.Label>Nombre</FormControl.Label>
                <Input
                    placeholder='Nombre'
                    onChangeText={(value) => setData({...data, nombre:value})}
                />
            </FormControl></VStack>
            <VStack><FormControl isInvalid={'extension' in errors}>
                <FormControl.Label>Extension </FormControl.Label>
                <Input
                    placeholder='Extension en hectareas'
                    onChangeText={(value) => setData({...data, extension:value})}
                />
            </FormControl></VStack>
            <VStack>
                <Switch onToggle={()=> setData({...data, agua:!agua})}/>
            </VStack>
            <VStack>
                <Switch onToggle={()=> setData({...data, pasto:!pasto})}/>
            </VStack>
            <VStack>
                <Button>Crear</Button>
                <Button>Actualizar</Button>
                <Button>Borrar</Button>
            </VStack>

        </NativeBaseProvider>
    );
}
//Screen Configuracion
export const Configuracion = ({navigation}) => {

}