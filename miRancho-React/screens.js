import React, { useEffect } from 'react';
import { Button, NativeBaseProvider, Box, Input, FormControl, VStack, Checkbox, Link, Slider, Select, Radio, ScrollView, Divider, Center, Text, FlatList,Heading, Icon, KeyboardAvoidingView,Alert, IconButton, CloseIcon, Collapse, HStack, Modal,useToast } from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import NetInfo from "@react-native-community/netinfo";
import { Platform } from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import * as action from './ranchoActions';

// CONSTANTES GLOBALES
const api = 'http://192.168.1.250/request/';

  // Navegacion de Inicio //

//Screen LogIn
export const LogIn = ({navigation}) => {
    const dispatch = useDispatch();
    const session = useSelector(state => state.jwt);
    const toast = useToast();
    
    const [cntLogin, setCounter] = React.useState(0);
    const [data, setData] = React.useState({});
    const [errors, setError] = React.useState({});

    React.useEffect(() => {
        if(session != false)
            navigation.navigate('rancho');  
    })
    const HandleLogin = () => {
        if(cntLogin > 10)
            toast.show({ title:'Intente mas tarde',status:'error', description: "Demasiados intentos" })
        else
            NetInfo.fetch().then(state=>{
                if(state.isConnected){
                    setCounter(cntLogin+1);
                    dispatch(action.getSession(data.user, data.pass));
                    if(session == false)
                        toast.show({title:'Credenciales incorrectas',status:'warning', description: "Intente de nuevo"})
                }
                else
                    toast.show({title:'No hay conexión',status:'warning', description: "Intente mas tarde"})
            })
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
            <Divider my={1}/>
            <Button colorScheme='success' onPress={HandleLogin} size = 'lg'>Entrar</Button>
            <Divider my={3}/>
            <Button size = 'md' colorScheme='teal' variant = 'outline' onPress={() => navigation.navigate('recPass')}>Olvide mi contraseña</Button>
            <Divider my={1}/>
            <Button size = 'md' colorScheme='teal' variant = 'outline' onPress={() => navigation.navigate('singin')}>No tengo cuenta</Button>  
        </Box>
    );
}

/// IMPLEMNTAR EL RECAPTCHA DE GOOGLE V2
//Screen SignIn
export const SingIn = ({navigation}) => {
    const toast = useToast();
    const [data, setData] = React.useState({});
        // user,name,pass,cpass,address, mail, terms.
    const [errors, setError] = React.useState({});
    const [terms, setTerms] = React.useState(false);
    const [showModal, setShow] = React.useState(false);
    const [tkn, setTkn] = React.useState('');

    const createUser = async () => {
        try {
            const response = await fetch(
                'https://turancho.com.mx/request/cUser.php', 
                {
                    method: 'POST',
                    body: JSON.stringify(
                        {
                            u:data.user,
                            p:data.pass,
                            n:data.name,
                            a:data.address,
                            m:data.mail
                        }
                    )
                }
            );
            const json = await response.json();
            return json.user;
        } catch (error) {
            return false;
        }
    };
    const verifyUser = async () => {
        try{
            const response = await fetch(api+'vUser.php?u='+data.user);
            const responseTxt = await response.text();
            if(responseTxt < 1){
                delete errors.user;
                setError({...errors});
                return true;
            }
            else{
                setError({...errors, user:'Usuario en uso'});
                return false;
            }

        }catch(error){
            setError({...errors, user:error})
        }
    };
    const verifyMail = async() => {
        try{
            const response = await fetch(api+'vMail.php?m='+data.mail);
            const responseTxt = await response.text();
            if(responseTxt < 1){
                delete errors.mail;
                setError({...errors});
                return true;
            }
            else{
                setError({...errors, mail:'Correo electrónico en uso'});
                return false;
            }

        }catch(error){
            setError({...errors, mail:error})
        }
    };
    function validForm () {
        if (data.user === undefined) {
            setError({...errors, user:'Se necesita usuario'})
            return false;
        }else
            delete errors.user;
        if (data.pass === undefined|| data.cpass === undefined ) {
            setError({...errors, pass:'Se necesita contraseña'})
            return false;
        }else
            delete errors.pass;
        if (data.name === undefined) {
            setError({...errors, name:'Se necesita el nombre'});
            return false;
        }else
            delete errors.name
        if (data.address === undefined) {
            setError({...errors, address:'Se necesita domicilio'});
            return false;
        }else
            delete errors.address
        if (data.mail === undefined) {
            setError({...errors, mail:'Se necesita cuenta de correo electrónico'});
            return false;
        }else
            delete errors.mail
        if (terms === undefined || terms == false) {
            setError({...errors, terms:'Necesitas aceptar los términos y condiciones de uso'});
            return false;
        }else
            delete errors.terms
        if (data.pass != data.cpass){
            setError({...errors, pass:'Las contraseñas no coinciden'})
            return false;
        }else
            delete errors.pass
        return true;
    }
    const HandleRegister = async() =>{
            NetInfo.fetch().then(state => {
                if(state.isConnected){
                    verifyUser().then( validUser =>{
                        if (validUser){
                            verifyMail().then(validMail =>{
                                if(validMail)
                                    setShow(true);
                            });    
                        }
                    }); 
                }else
                    toast({title:'No hay conexión',status:'warning',description:'Se necesita conexion'});
              });
    }
    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "height" : "", Platform.OS === 'web'? "":""} keyboardVerticalOffset={100} >
        <ScrollView>
        <Box justifyContent='center'  flex= {1}>
            <VStack><FormControl isRequired isInvalid={'user' in errors}>
                <FormControl.Label>Nombre de Usuario (Se sugiere usar la CURP)</FormControl.Label>
                <Input 
                    placeholder='Usuario'
                    onChangeText={(value) => setData({...data, user:value})}
                    maxLength={20}
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
                    onChangeText={(value) => setData({...data, pass:value})}
                    type = 'password'
                    
                />
                <Input
                    p={2}
                    placeholder='Confirmar contraseña'
                    onChangeText={(value)=> {setData({...data, cpass:value})}}
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
                    onChangeText={(value) => {setData({...data, name:value})}}
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
                onChangeText={(value) => {setData( {...data,address:value})}}
            />

            {'address' in errors ?
                <FormControl.ErrorMessage _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>{errors.address}</FormControl.ErrorMessage>:
                    <FormControl.HelperText _text={{fontSize: 'xs'}}>Agregue un domicilio</FormControl.HelperText>
                }
            </FormControl></VStack>
            
            <VStack><FormControl isRequired isInvalid={'mail' in errors}>
                <FormControl.Label>Correo electrónico</FormControl.Label>
                <Input 
                    p={2} 
                    keyboardType='email-address'
                    placeholder='Correo'
                    onChangeText={(value) => setData( {...data,mail:value})}
                />
                {'mail' in errors ?
                    <FormControl.ErrorMessage _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>{errors.mail}</FormControl.ErrorMessage>:
                        <FormControl.HelperText _text={{fontSize: 'xs'}}>Diferenciar MAYUS de MINUS</FormControl.HelperText>
                }
            </FormControl></VStack>

            <VStack><FormControl isRequired isInvalid={'terms' in errors}>
                <Checkbox  size = 'md' onChange={(value) => setTerms(value)}>
                    Aceptar 
                    <Link onPress={()=>navigation.navigate('terms')}>  terminos y condiciones de uso</Link>
                </Checkbox>
                {'terms' in errors ?
                    <FormControl.ErrorMessage _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>{errors.terms}</FormControl.ErrorMessage>:
                    <FormControl.HelperText _text={{fontSize: 'xs'}}>Es necesario aceptar</FormControl.HelperText>
                } 
            </FormControl></VStack>
            <Divider my={2}/>
            <Button colorScheme='success' size = 'lg' onPress={HandleRegister}>Registrar</Button>
        </Box>
        <Modal isOpen={showModal} onClose={() => setShow(false)}>
            <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header>Verificar correo electrónico</Modal.Header>
                <Modal.Body size='full'>
                    <FormControl isRequired isInvalid={'token' in errors}>
                        <FormControl.Label>Código de verificación</FormControl.Label>
                        <Input 
                            placeholder='Ingresar código'
                            onChangeText={(value) => setTkn(value)}
                            maxLength={5}
                        />
                        {'token' in errors ?
                        <FormControl.ErrorMessage _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>{errors.token}</FormControl.ErrorMessage>:
                            <FormControl.HelperText _text={{fontSize: 'xs'}}>Si no encuentras el correo revisar SPAM</FormControl.HelperText>
                        }
                    </FormControl>
                </Modal.Body>
                <Modal.Footer>
                    <Button.Group space={2}>
                        <Button variant="ghost" colorScheme="blueGray" size = 'md' onPress={() => {
                        setShowModal(false);
                        }}>
                            Cancelar
                        </Button >
                        <Button onPress={() => {
                        setShowModal(false);
                        }}>
                            Verificar
                        </Button>
                    </Button.Group>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
        </ScrollView>
        </KeyboardAvoidingView>
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
//Screen recoverPass
export const RecPass = ({navigation}) => {
    const [data,setData] = React.useState('');
    return(
        <Box>
            <FormControl>
                <FormControl.Label>Ingrese su usuario</FormControl.Label>
                <Input placeholder = 'Usuario' value = {data} onChangeText= {(value)=>setData(value)}/>
            </FormControl>
            <Button colorScheme='success'>Restablecer contraseña</Button>
        </Box>
    );
}
//Screen newPass
export const newPass = ({navigation}) => {
    const [pass,setPass] = React.useState('');
    const [cPass,setCpass] = React.useState('');
    return (
        <Box>
            
        </Box>
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

export const Hato = ({navigation}) => {
    const tkn = useSelector((state)=>state.jwt);
    return(
        <Text>{tkn}</Text>
    )
}

export const Ganado = ({navigation}) => {
    const [key, setKey] = React.useState({type:'arete',word:''})
    const [data,setData] = React.useState(animal)
    const [errors, setErrors] = React.useState({})
    return (
        <KeyboardAvoidingView keyboardVerticalOffset={100} behavior={Platform.OS === "ios" ? "height" : ""}>
            <ScrollView >
                <Box alignItems="center" bg="#DEDDDA" rounded="lg" borderColor="#9A9996" borderWidth={2}>
                    <FormControl isInvalid={'search' in errors}>
                        <FormControl.Label>Busqueda</FormControl.Label>
                            <Select
                                selectedValue={key.type}
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
                </Box>
                <Divider my={1} />

           
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
                
                <VStack><FormControl isInvalid={'fecha' in errors}>
                    <FormControl.Label>Fecha de nacimiento</FormControl.Label>
                    <DateTimePicker value={data.fecha} onChange={(event, selectedDate) => setData({...data, fecha:selectedDate})} />
                    <FormControl.ErrorMessage>{errors.fecha}</FormControl.ErrorMessage>
                </FormControl></VStack>

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
            </KeyboardAvoidingView>
    );
}
//Screen Vacunas
var vacuna = {
    codigo:'',
    nombre:'',
    fecha: new Date(),
}
export const Vacunas = ({navigation }) => {
    const [key, setKey] = React.useState({type:'nombre',word:''})
    const [data,setData] = React.useState(vacuna)
    const [errors, setErrors] = React.useState({})
    const user = React.useContext(UserContext)
    return (
        <ScrollView>
            <Box bg="#DEDDDA" rounded="lg" borderColor="#9A9996" borderWidth={2}>
                <FormControl>
                    <FormControl.Label>Busqueda</FormControl.Label>
                    <Select
                        selectedValue={key.type}
                        placeholder={key.type}
                        mt={1}
                        onValueChange={(itemValue) => setKey({...key, type:itemValue})}
                    >   
                        <Select.Item label="Nombre" value="nombre" />
                        <Select.Item label="Codigo" value="codigo" />
                    </Select>
                
                    <Input 
                        placeholder={key.type}
                        onChangeText={(value) => setkey({...key, word:value})}
                    />
                    {'key' in errors ?
                    <FormControl.ErrorMessage _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>{errors.key}</FormControl.ErrorMessage>:
                        <FormControl.HelperText _text={{fontSize: 'xs'}}>Diferenciar MAYUS de MINUS</FormControl.HelperText>
                    }
                </FormControl>
                <Button colorScheme='teal'>Buscar</Button>
            </Box>

            <VStack><FormControl isInvalid={'codigo' in errors}>
                <FormControl.Label>Codigo</FormControl.Label>
                <Input
                    placeholder='Codigo'
                    onChangeText={(value) => setData({...data, codigo:value})}
                />
            </FormControl></VStack>

            <VStack><FormControl isInvalid={'nombre' in errors}>
                <FormControl.Label>Nombre</FormControl.Label>
                <Input
                    placeholder='Nombre'
                    onChangeText={(value) => setData({...data, nombre:value})}
                />
            </FormControl></VStack>

            <VStack><FormControl isInvalid={'fecha' in errors}>
                <FormControl.Label>Fecha de aplicación</FormControl.Label>
                <DateTimePicker value={data.fecha} onChange={(event,currentDate) => setData({...data, fecha:currentDate})} />
                <FormControl.ErrorMessage _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>{errors.fecha}</FormControl.ErrorMessage>
            </FormControl></VStack>
            <Button colorScheme='info' variant='outline'>Ver hato vacunado</Button>
            <Divider my={1}/>
            <Center>
                <Button.Group>
                    <Button colorScheme='success'>Crear</Button>
                    <Button colorScheme='warning'>Actualizar</Button>
                    <Button colorScheme='danger'>Borrar</Button>
                </Button.Group>
            </Center>
            
            
        </ScrollView>
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
        <ScrollView>
            <Box bg="#DEDDDA" rounded="lg" borderColor="#9A9996" borderWidth={2}>
                <FormControl>
                    <FormControl.Label>Busqueda</FormControl.Label>
                    <Select
                        selectedValue={key.type}
                        placeholder={key.type}
                        mt={1}
                        onValueChange={(itemValue) => setKey({...key, type:itemValue})}
                    >
                        <Select.Item label="Nombre" value="nombre" />
                        <Select.Item label="Codigo" value="codigo" />
                    </Select>
                    <Input 
                        placeholder={key.type}
                        onChangeText={(value) => setKey({...key, word:value})}
                    />
                </FormControl>
                <Button colorScheme='teal'>Buscar</Button>
            </Box>

            <Box>
                <VStack><FormControl isInvalid={'codigo' in errors}>
                    <FormControl.Label>Codigo</FormControl.Label>
                    <Input
                        placeholder='Codigo'
                        onChangeText={(value) => setData({...data, codigo:value})}
                    />
                </FormControl></VStack>
                <VStack><FormControl isInvalid={'nombre' in errors}>
                    <FormControl.Label>Nombre</FormControl.Label>
                    <Input
                        placeholder='Nombre'
                        onChangeText={(value) => setData({...data, nombre:value})}
                    />
                </FormControl></VStack>
                <VStack><FormControl isInvalid={'fecha' in errors}>
                    <FormControl.Label>Fecha de aplicación</FormControl.Label>
                    <DateTimePicker value={data.fecha} onChange={(evente,currentDate) => setData({...data, fecha:currentDate})} />
                    <FormControl.ErrorMessage _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>{errors.fecha}</FormControl.ErrorMessage>
                </FormControl></VStack>
                <Button colorScheme='info' variant='outline'>Listar hato</Button>
                <Divider my={1}/>
                <Center>
                    <Button.Group>  
                        <Button colorScheme='success'>Crear</Button>
                        <Button colorScheme='warning'>Actualizar</Button>
                        <Button colorScheme='danger'>Borrar</Button>
                    </Button.Group>
                </Center> 
                
                
            </Box>                       
        </ScrollView>
    );
}

//Screen Control Reproductivo
var embarazo = {
    codigo:'',
    inicio: new Date(),
    fin: new Date(),
}
export const ControlRep = ({navigation}) => {
    const [key, setKey] = React.useState({type:'codigo',word:''})
    const [data,setData] = React.useState(embarazo)
    const [errors, setErrors] = React.useState({})
    const user = React.useContext(UserContext)
    return(
        <ScrollView>
            <Box bg="#DEDDDA" rounded="lg" borderColor="#9A9996" borderWidth={2}>
                <FormControl>
                    <FormControl.Label>Busqueda</FormControl.Label>
                    <Select
                        selectedValue={key.type}
                        placeholder="Busqueda"
                        mt={1}
                        onValueChange={(itemValue) => setKey({...key, type:itemValue})}
                    >
                        <Select.Item label="Codigo" value="codigo" />
                        <Select.Item label="Fecha" value="fecha" />
                    </Select>
                
                    <Input 
                        placeholder={key.type}
                        onChangeText={(value) => setkey({...key, word:value})}
                    />
                    {'key' in errors ?
                    <FormControl.ErrorMessage _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>{errors.key}</FormControl.ErrorMessage>:
                        <FormControl.HelperText _text={{fontSize: 'xs'}}>Diferenciar MAYUS de MINUS</FormControl.HelperText>
                    }
                </FormControl>
                <Button colorScheme='teal'>Buscar</Button>
            </Box>

            <VStack><FormControl isInvalid={'codigo' in errors}>
                <FormControl.Label>Codigo</FormControl.Label>
                <Input 
                    value={data.codigo}
                    onChangeText={(value) => {setData({...data, codigo:value})}}
        
                />
                <FormControl.ErrorMessage _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>{errors.codigo}</FormControl.ErrorMessage>
            </FormControl></VStack>

            <VStack><FormControl isInvalid={'inicio' in errors}>
                <FormControl.Label>Fecha de inicio</FormControl.Label>
                <DateTimePicker value={data.inicio} onChange={(event, currentDate) => setData({...data, inicio:currentDate})} />
                <FormControl.ErrorMessage _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>{errors.inicio}</FormControl.ErrorMessage>
            </FormControl></VStack>

            <VStack><FormControl isInvalid={'fin' in errors}>
                <FormControl.Label>Fecha de fin</FormControl.Label>
                <DateTimePicker value={data.fin} onChange={(event, currentDate) => setData({...data, fin:currentDate})} />
                <FormControl.ErrorMessage _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>{errors.fin}</FormControl.ErrorMessage>
            </FormControl></VStack>
            <Center>
                <Button.Group>
                    <Button colorScheme='success'>Crear</Button>
                    <Button colorScheme='warning'>Actualizar</Button>
                    <Button colorScheme='danger'>Borrar</Button>
                </Button.Group>
            </Center>

        </ScrollView>
    );
}

//Screen Pesajes

var peso = {
    codigo:'',
    arete:'',
    fecha: new Date(),
    kg:0.0,
}
export const Pesaje = ({navigation}) => {
    const [key, setKey] = React.useState({type:'Peso',word:''})
    const [data,setData] = React.useState(peso)
    const [errors, setErrors] = React.useState({})
    const user = React.useContext(UserContext)
    return (
        <KeyboardAvoidingView keyboardVerticalOffset={100} behavior={Platform.OS === "ios" ? "height" : ""}>
        <ScrollView>
            <Box bg="#DEDDDA" rounded="lg" borderColor="#9A9996" borderWidth={2}>
                <FormControl>
                    <FormControl.Label>Busqueda</FormControl.Label>
                    <Select
                        selectedValue={key.type}
                        placeholder={key.type}
                        onValueChange={(itemValue) => setKey({...key, type:itemValue})}
                    >
                        <Select.Item label="Peso" value="peso" />
                        <Select.Item label="Fecha" value="fecha" />
                    </Select>
                    <Input 
                        placeholder={key.type}
                        onChangeText={(value) => setkey({...key, word:value})}
                    />
                    {'key' in errors ?
                    <FormControl.ErrorMessage _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>{errors.key}</FormControl.ErrorMessage>:
                        <FormControl.HelperText _text={{fontSize: 'xs'}}>Diferenciar MAYUS de MINUS</FormControl.HelperText>
                    }
                </FormControl>
                <Button colorScheme='teal'>Buscar</Button>
            </Box>

            <VStack><FormControl isInvalid={'codigo' in errors}>
                <FormControl.Label>Codigo</FormControl.Label>
                <Input value={data.codigo} onChangeText={(value)=>setData({...data, codigo:value})}/>
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
                <DateTimePicker value={data.fecha} onChange={(event,currentDate) => setData({...data, fecha:currentDate})} />
                <FormControl.ErrorMessage _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>{errors.fecha}</FormControl.ErrorMessage>
            </FormControl></VStack>
            <VStack><FormControl isInvalid={'peso' in errors}>
                <FormControl.Label>Peso</FormControl.Label>
                <Input
                    placeholder='Peso'
                    keyboardType='numeric'
                    onChangeText={(value) => setData({...data, peso:value})}
                />
            </FormControl></VStack>
            <Center>
            <Button.Group>
                    <Button colorScheme='success'>Crear</Button>
                    <Button colorScheme='warning'>Actualizar</Button>
                    <Button colorScheme='danger'>Borrar</Button>
            </Button.Group>
            </Center>

        </ScrollView>
        </KeyboardAvoidingView>
    );
}

//Screen Predios
var predio = {
    nombre:'',
    extension: 0.0,
    agua: false,
    pasto: false,
}
export const Predio = ( {navitagion}) => {
    const [key, setKey] = React.useState({type:'nombre',word:''})
    const [data,setData] = React.useState(predio)
    const [errors, setErrors] = React.useState({})
    const user = React.useContext(UserContext)
    return (
        <ScrollView>
            <Box bg="#DEDDDA" rounded="lg" borderColor="#9A9996" borderWidth={2}>
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
                <Button colorScheme='teal'>Buscar</Button>
            </Box>

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
                    keyboardType='numeric'
                />
            </FormControl></VStack>
            <Divider my={1}/>
            <Checkbox value={data.agua} size='md' onChange={(value) => setData({...data, agua:value})}>Disponibilidad de agua</Checkbox>
            <Divider my={1}/>
            <Checkbox value={data.pasto} size='md' onChange={(value) => setData({...data, pasto:value})}>Disponibilidad de pasto</Checkbox>
            <Divider my={1}/>
            <Button colorScheme='info' variant='outline' >Listar hato en el predio</Button>
            <Divider my={1}/>
            <Center>
                <Button.Group>
                    <Button colorScheme='success'>Crear</Button>
                    <Button colorScheme='warning'>Actualizar</Button>
                    <Button colorScheme='danger'>Borrar</Button>
                </Button.Group>
            </Center>

        </ScrollView>
    );
}

//Screens "Embarques"
export const newEmbarque = ({navigation}) => {
    const [data,setData] = React.useState({type:'pesos',vehicles:0, units:0});
    const [getUnits, setUnits] = React.useState(false);
    const handleCrear = () => {
        switch(data.type){
            case 'pesos':
                navigation.navigate('setEmbarque',{nUnits:data.units,nVehicles:data.vehicles});
                break;
            case 'nombre':
                navigation.navigate('setEmbarque',{nUnits:0,nVehicles:data.vehicles});
                break;
            default:
                break;
        }
    }
    return(
        <Box bg="#DEDDDA" rounded="lg" borderColor="#9A9996" borderWidth={2}>
            <FormControl>
                <FormControl.Label>Tipo de embarque</FormControl.Label>
                <Select
                    selectedValue={data.type}
                    mt={1}
                    onValueChange={(itemValue) => {
                        setData({...data, type:itemValue});
                        if (itemValue=='nombre')
                            setUnits(true);
                        else
                            setUnits(false);
                    }}
                >
                    <Select.Item label="Agregar por nombre" value="nombre" />
                    <Select.Item label="Agregar pesos" value="pesos" />
                </Select>
            </FormControl>
            <FormControl isDisabled >
                <FormControl.Label>Tamaño de embarque</FormControl.Label>
                <Center>
                    <Text>{data.units}</Text>
                    <Slider defaultValue={data.units} size="sm" colorScheme="white" maxValue={500} onChange={(value) => {setData({...data, units:value})}} width="85%">
                        <Slider.Track bg="white">
                        <Slider.FilledTrack bg="black" />
                        </Slider.Track>
                        <Slider.Thumb borderWidth="0" bg="transparent">
                        <Icon as={MaterialCommunityIcons} name="cow" color="black" size="sm" />
                        </Slider.Thumb>
                    </Slider>
                </Center>
            </FormControl>

            <FormControl>
                <FormControl.Label>Número de vehiculos</FormControl.Label>
                <Center>
                    <Text>{data.vehicles}</Text>
                    <Slider defaultValue={data.units} size="sm" colorScheme="white" maxValue={50}onChange={(value) => {setData({...data, vehicles:value})}} width="85%">
                        <Slider.Track bg="white">
                        <Slider.FilledTrack bg="black" />
                        </Slider.Track>
                        <Slider.Thumb borderWidth="0" bg="transparent">
                        <Icon as={MaterialCommunityIcons} name="truck" color="black" size="sm" />
                        </Slider.Thumb>
                    </Slider>
                </Center>
            </FormControl>
            
            <Divider my={2}/>
            <Button colorScheme="success" onPress={handleCrear}>Crear Embarque</Button>
        </Box>
    );
}
export const setEmbarque = ({route, navigation}) => {
    const {nUnits, nVehicles} = route.params;
    const [show, setShow] = React.useState(true)
    const [vehicles, setVehicles] = React.useState({vehiclesInputs:[]});
    const [units, setUnits] = React.useState({unitInputs:[]});
    let  iUnits= [];
    let iVehicles  = [] ;

    for (var i=0; i<nVehicles; i++){
        iVehicles.push(i);  
    }

    if (nUnits > 0){
        for (var i=0; i<nUnits; i++){
            iUnits.push(i);
        }
    }else{
        //Cargar hato con su ultimo peso
        //Seleccionar de lista
        
    }
    const setVehiculsInputs = (value,index) => {
        let { vehiclesInputs } = vehicles;
        vehiclesInputs[index] = value;
        setVehicles({
            vehiclesInputs,
        });
    }
    const setUnitsInputs = (value,index) => {
        let { unitInputs } = vehicles;
        unitInputs[index] = value;
        setUnits({
            unitInputs,
        });
    }
    return(
        <KeyboardAvoidingView keyboardVerticalOffset={100} behavior={Platform.OS === "ios" ? "height" : ""}>
            <Box> 
                <Collapse isOpen={show}>
                    <Alert variant='outline'>
                      
                        <HStack alignItems="center">
                        <Text  fontSize="md">Utilizar la misma unidad de medida.</Text>

                        <IconButton
                            icon={<CloseIcon size='3' color="coolGray.600" />}
                            onPress={() => setShow(false)}
                        />
                        </HStack>
                    </Alert>
                </Collapse>
                <Box maxH="92%">
                    <Heading>Vehiculos</Heading>
                    <FlatList
                        data={iVehicles}
                        renderItem={({ item, index }) => (
                            <VStack>
                                <Text>{index+1}</Text>
                                <Input placeholder='Capacidad' value={vehicles.vehiclesInputs[index]} onChangeText = {(value)=>{setVehiculsInputs(value,index)}} />
                            </VStack>
                        )}
                        keyExtractor={item => item}
                    />
                    <Heading>Unidades embarcadas</Heading>
                    <FlatList
                        data={iUnits}
                        renderItem={({ item, index }) => (
                            <VStack>
                                <Text>{index+1}</Text>
                                <Input placeholder='Peso' value={units.unitInputs[index]} onChangeText = {(value)=>{setUnitsInputs(value,index)}} />
                            </VStack>
                        )}
                        keyExtractor={item => item}
                    />
                </Box>
                <Button colorScheme='success' >Optimizar embarque</Button>
            </Box>
        </KeyboardAvoidingView>
    );

}
/*

*/
export const getEmbarque = ({navigation}) => {

}
//Screen Configuracion
export const setConfig = ({route, navigation}) => {
    const {type, data} = route.params;
    const [ndata, setData] = React.useState({})
    switch(type){
        case 'Usuario':
            return(
                <Box>
                    <FormControl>
                        <FormControl.Label>Establecer nuevo</FormControl.Label>
                        <Input placeholder = {type} value={ndata} onChangeText = {(value) => setData(value)}/>
                    </FormControl>
                    <Button colorScheme='warning'>Actualizar</Button>
                </Box>
            );
            break;
        case 'Nombre':
            return(
                <Box>
                    <FormControl>
                        <FormControl.Label>Establecer nuevo</FormControl.Label>
                        <Input placeholder = {type} value={ndata} onChangeText = {(value) => setData(value)}/>
                    </FormControl>
                    <Button colorScheme='warning'>Actualizar</Button>
                </Box>
            );
            break;
        case 'Contraseña':
            const [cpass, setPass] = React.useState('')
            return(
                <Box>
                    <FormControl>
                        <FormControl.Label>Establecer nueva</FormControl.Label>
                        <Input placeholder = {type} type='password' value={ndata} onChangeText = {(value) => setData(value)}/>
                        <Input placeholder = 'Confirmar' type='password' value={cpass} onChangeText = {(value) => setPass(value)}/>
                    </FormControl>
                    <Button colorScheme='warning'>Actualizar</Button>
                </Box>
            );
            break;
        case 'Dirección':
            return(
                <Box>
                    <FormControl>
                        <FormControl.Label>Establecer nueva</FormControl.Label>
                        <Input placeholder = {type} value={ndata} onChangeText = {(value) => setData(value)}/>
                    </FormControl>
                    <Button colorScheme='warning'>Actualizar</Button>
                </Box>
            );
            break;
        case 'Teléfono':
            return(
                <Box>
                    <FormControl>
                        <FormControl.Label>Establecer nuevo</FormControl.Label>
                        <Input placeholder = {type} keyboardType='numeric' value={ndata} onChangeText = {(value) => setData(value)}/>
                    </FormControl>
                    <Button colorScheme='warning'>Actualizar</Button>
                </Box>
            );
            break;
    }
}
var perfil = [
    {type:'user',data:'a'},
    {type:'name',data:'n'},
    {type:'pass',data:''},
    {type:'address',data:'s'},
    {type:'phone',data:0},
]
export const Configuracion = ({navigation}) => {
    const tkn = useSelector(state => state.jwt);
    const params = useSelector(state => state.perfil);
    const dispatch = useDispatch();
        // user,name,pass,cpass,address, phone.
    React.useEffect(() => {
        dispatch(action.getPerfil(tkn));
    })
    const [errors, setError] = React.useState({});
    
    return (
        <Box >
            <Box bgColor='#DEDDDA'>
                <Center>
                    <Heading size='sm'>Actualizar datos</Heading>
                </Center>
            </Box>
            <FlatList
                data={params}
                renderItem={({item}) => (
                    <VStack>
                        <Button colorScheme='teal' variant='ghost' onPress = {()=>{navigation.navigate('setConfig',{type:item.type, data:item.data})}}>{item.type}</Button>
                        <Text>{item.data}</Text>
                        <Divider my={1}/>
                    </VStack>
                    
                )}
                keyExtractor={(item) => item.type}
            />
        </Box>
    );
}
