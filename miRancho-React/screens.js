import React, { useEffect } from 'react';
import { Button, NativeBaseProvider, Box, Input, FormControl, VStack, Checkbox, Link, Slider, Select, Radio, ScrollView, Divider, Center, Text, FlatList,Heading, Icon, KeyboardAvoidingView,Alert, IconButton, CloseIcon, Collapse, HStack, Modal,useToast, Pressable, View, AlertDialog, Spinner} from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import NetInfo from "@react-native-community/netinfo";
import { Platform } from 'react-native';
import ReCAPTCHA from "react-google-recaptcha";

import { useDispatch, useSelector } from 'react-redux';
import * as action from './ranchoActions';
import { set } from 'react-native-reanimated';
import { enableScreens } from 'react-native-screens';

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
            navigation.navigate('getData');  
    })
    const HandleLogin = () => {
        if(cntLogin > 10)
            toast.show({ title:'Intente mas tarde',status:'error', description: "Demasiados intentos" })
        else
            NetInfo.fetch().then(state=>{
                if(state.isConnected){
                    setCounter(cntLogin+1);
                    dispatch(action.getSession(data.user, data.pass)).then(s => {
                        if(session === false)
                            toast.show({title:'Credenciales incorrectas',status:'warning', description: "Intente de nuevo"})
                        })
                }
                else
                    toast.show({title:'No hay conexión',status:'warning', description: "Intente mas tarde"})
            })
    }
    return(
        < Box justifyContent='center'  flex= {1}>
            <VStack>
                <FormControl isRequired isInvalid={'user' in errors}>
                    <FormControl.Label>Nombre de Usuario</FormControl.Label>
                    <Input 
                        placeholder='Usuario'
                        onChangeText={(value) => setData({...data, user:value})}
                    />
                    {'user' in errors ?
                    <FormControl.ErrorMessage _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>{errors.user}</FormControl.ErrorMessage>:
                        <FormControl.HelperText _text={{fontSize: 'xs'}}>Diferenciar MAYUS de MINUS</FormControl.HelperText>
                    }
                </FormControl>

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
            const msj = await response.text();
            if (msj < 1)
                navigation.navigate('login');
                
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
        if(captcha == '')
            setError({...errors,captcha:'Es un robot?'})
        else
            delete errors.captcha;    
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
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "height" : ""} keyboardVerticalOffset={100} >
        <ScrollView>
        <Box justifyContent='center'  flex= {1}>
            <VStack>
                <FormControl isRequired isInvalid={'user' in errors}>
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
                </FormControl>

                <FormControl isRequired isInvalid={'pass' in errors}>
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
                </FormControl>
            
                <FormControl isRequired isInvalid={'name' in errors}>
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
                </FormControl>

                <FormControl isRequired isInvalid={'address' in errors}>
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
                </FormControl>
            
                <FormControl isRequired isInvalid={'mail' in errors}>
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
                </FormControl>

                <FormControl isRequired isInvalid={'terms' in errors}>
                    <Checkbox  size = 'md' onChange={(value) => setTerms(value)}>
                        Aceptar 
                        <Link onPress={()=>navigation.navigate('terms')}>  terminos y condiciones de uso</Link>
                    </Checkbox>
                    {'terms' in errors ?
                        <FormControl.ErrorMessage _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>{errors.terms}</FormControl.ErrorMessage>:
                        <FormControl.HelperText _text={{fontSize: 'xs'}}>Es necesario aceptar</FormControl.HelperText>
                    } 
                </FormControl>
                <Divider my={2}/>
                <Button colorScheme='success' size = 'lg' onPress={HandleRegister}>Registrar</Button>
            </VStack>
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

//Screen getData-Rancho
export const GetRancho = ({navigation}) => {
    const tkn = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NTAzOTQ0MTgsInVzZXIiOiJwcnVlYmEifQ.E-GqgWjS4L7YpdOXObgySX4XgwFMyxOqtXtEoxKmEGQ';
    const [show, setShow] = React.useState(false);
    const dispatch = useDispatch();
    const errors = useSelector((state) =>state.errors);
    const toast = useToast();
    const getData = () => {
        NetInfo.fetch().then((state) => { 
            if(state.isConnected)
                dispatch(action.getPerfil(tkn)).then(msj => {
                    if(msj != false)
                        navigation.navigate('rancho');
                    else
                        toast.show({title:'Error con el servidor',status:'warning' ,description:'Intente de nuevo'});
                })
            else
                setShow(true);
        })
    }
    React.useEffect(() => {getData()},[]);
        
    return (
        <Box justifyContent='center'  flex= {1}>
            <VStack justifyContent="center" alignItems="center" space={2}>
                <Spinner color="cyan.500" size='lg' />
                <Heading color="primary.500" fontSize="md">
                    Cargando...
                </Heading>
            </VStack>
            
            <Modal isOpen={show} onClose={()=>{setShow(false)}} bgColor='red.400' >
                <Modal.Content>
                    <Modal.CloseButton/>
                    <Modal.Header> No hay conexion!</Modal.Header>
                    <Modal.Body>
                        Porfavor intente de nuevo, hubo un problema con la red.
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </Box> 
    );
}
// Navegacion "Rancho" //



//Screen Ganado

export const Hato = ({navigation}) => {
    const tkn = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NDYzNDYzNjgsInVzZXIiOiJwcnVlYmEifQ.Un0DPMUCQRtmzqIzx7_eUdXU8cPDoyQuQWlumZmyMY4';
    // useSelector((state)=>state.jwt);
    const hato = useSelector((state)=> state.hato);
    const bkp = useSelector((state) => state.bkpHato);
    const mt = useSelector((state) => state.mtr.hato);
    const dispatch = useDispatch();
    const [search, setSearch] = React.useState('');

    const [show, setShow] = React.useState({animal:false,register:false,delete:false,vac:false,pesaje:false,rep:false,san:false})   
    const [showPop, setPop] = React.useState({name:false,nac:false,date:false,sex:false,race:false,color:false});
    
    const [animal, setAnimal] = React.useState({});
    const [form, setForm] = React.useState({show:false,nac:'YYYY-MM-DD'});
    const [errors, setError] = React.useState({});

    const SexIcon = props =>{
        let { sex } = props;
        if(sex == 'M')
            return <Icon size="xl" as={MaterialCommunityIcons} name='gender-male' color='#62A0EA' width='15%'/>
        else
            return <Icon size="xl" as={MaterialCommunityIcons} name='gender-female' color='#DC8ADD' width='15%'/>
    }

    const filtrar = (search) => {
        var resultado = bkp.filter((animal)=>{
            if(animal.arete.toString().toLowerCase().includes(search.toString().toLowerCase()) || animal.name.toString().toLowerCase().includes(search.toString().toLocaleLowerCase()))
                return animal;
        });
        dispatch(action.setHato(resultado));
    }
    const handleSearch = txt => {
        setSearch(txt);
        filtrar(txt);
    }
    const handleAnimal = (item) =>{
        setAnimal(item);
        setShow(true);
    }
    const handleUpdate =(type) => {
        console.log(type);
    }
    return(
        <View>
            <Box>
                <HStack space={2}>
                    <Input onChangeText={handleSearch} value={search}placeholder="Buscar" variant="filled" width="80%" borderRadius="10" borderWidth="0" InputLeftElement={<Icon ml="2" size="4" color="gray.400" as={<Ionicons name="ios-search" />} />} />
                    <IconButton width='15%' colorScheme='rgb(173, 0, 255)' borderRadius="xl" variant="solid"  size="lg"
                        icon={<Icon  as={MaterialCommunityIcons} name="plus"/>}
                        onPress={()=>setShowReg(true)}
                    />
                </HStack>
                <FlatList data={hato}  renderItem={({item}) => 
                    <Pressable onPress={() => handleAnimal(item)}>
                        <HStack borderBottomWidth="1" space='4' >
                            <Icon size="xl" as={MaterialCommunityIcons} name="cow" width='20%'/>
                            <VStack width="65%">
                                <Heading>{item.arete}</Heading>
                                <Text>{item.name}</Text>
                            </VStack>
                            <SexIcon sex={item.sex}/>
                        </HStack>               
                    </Pressable>
                }
                keyExtractor={item=>item.arete}
                />
                <Text>{mt}</Text>             
            </Box>
            
            <Modal isOpen={show.animal} onClose={() => setShow({...show,animal:false})} size='full'>
                <Modal.Content >
                    <Modal.CloseButton />
                    <Modal.Header alignSelf="center" _text={{fontSize:'xl',Overridden:'bold'}}>{animal.arete}</Modal.Header>
                    <Modal.Body >
                        <VStack >
                            <Pressable onPress={() => setPop({...showPop,name:true})}>
                                <Text fontSize='2xs'>Nombre</Text>
                                <Text fontSize='md'>{animal.name}</Text>
                                <Divider />
                            </Pressable> 
                            <Modal isOpen={showPop.name} onClose={() => setPop({...showPop,name:false})} size='xl'>
                                <Modal.Content >
                                    <Modal.Header alignContent='center'>Actualizar nombre</Modal.Header>
                                    <Modal.Body>
                                        <FormControl>
                                            <Input placeholder='Nuevo nombre' onChangeText={(value)=>{setForm({...form,name:value})}}/>
                                        </FormControl>
                                    </Modal.Body>
                                    <Modal.Footer >
                                        <Button.Group space={2}>
                                            <Button colorScheme="coolGray" variant="ghost" onPress={()=>setPop({...showPop,name:false})}> 
                                                Cancel
                                            </Button>
                                            <Button colorScheme="warning" onPress={()=>handleUpdate('name')}>Actualizar</Button>
                                        </Button.Group>
                                    </Modal.Footer>
                                </Modal.Content>
                            </Modal>

                            <Pressable  onPress={() => setPop({...showPop,nac:true})}>
                                <Text fontSize='2xs'>Nacimiento</Text>
                                <Text fontSize='md'>{animal.nac}</Text>
                                <Divider />
                            </Pressable>        
                            {showPop.nac && (
                                <DateTimePicker
                                    value={new Date(animal.nac)}
                                    mode='date'
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        const f = selectedDate;
                                        const currentDate = f.getFullYear() + "-"+ f.getMonth()+ "-" +f.getDate();
                                        setForm({...form,nac:currentDate});
                                        console.log(currentDate);
                                        setPop({...showPop,nac:false});
                                    }}
                                />
                            )}
                                   
                            <Pressable  onPress={() => setPop({...showPop,sex:true})}>
                                <Text fontSize='2xs'>Sexo</Text>
                                <Text fontSize='md'>{animal.sex}</Text>
                                <Divider />
                            </Pressable>    
                            <Modal isOpen={showPop.sex} onClose={() => setPop({...showPop,sex:false})} size='xl'>                    
                                <Modal.Content >
                                    <Modal.Header alignContent='center'>Actualizar sexo</Modal.Header>
                                    <Modal.Body>
                                        <FormControl>
                                            <Select
                                                selectedValue={form.sex}
                                                onValueChange={(itemValue) => setForm({...form, sex:itemValue})}
                                            >
                                                <Select.Item label="Macho" value="M" />
                                                <Select.Item label="Hembra" value="H" />
                                            </Select>
                                        </FormControl>
                                    </Modal.Body>
                                    <Modal.Footer justifyContent="flex-end">
                                        <Button.Group space={2}>
                                            <Button colorScheme="coolGray" variant="ghost" onPress={()=>setPop({...showPop,sex:false})}> 
                                                Cancel
                                            </Button>
                                            <Button colorScheme="warning" onPress={()=>handleUpdate('sex')}>Actualizar</Button>
                                        </Button.Group>
                                    </Modal.Footer>
                                </Modal.Content>
                            </Modal>

                            <Pressable onPress={() => setPop({...showPop,race:true})}>
                                <Text fontSize='2xs'>Raza</Text>
                                <Text fontSize='md'>{animal.race}</Text>
                                <Divider />
                            </Pressable>    
                            <Modal isOpen={showPop.race} onClose={() => setPop({...showPop,race:false})} size='xl'>
                                <Modal.Content >
                                    <Modal.Header alignContent='center'>Actualizar raza</Modal.Header>
                                    <Modal.Body>
                                        <FormControl>
                                            <Input placeholder='Nueva raza' onChangeText={(value)=>{setForm({...form,race:value})}}/>
                                        </FormControl>
                                    </Modal.Body>
                                    <Modal.Footer justifyContent="flex-end">
                                        <Button.Group space={2}>
                                            <Button colorScheme="coolGray" variant="ghost" onPress={()=>setPop({...showPop,race:false})}> 
                                                Cancel
                                            </Button>
                                            <Button colorScheme="warning" onPress={()=>handleUpdate('race')}>Actualizar</Button>
                                        </Button.Group>
                                    </Modal.Footer>
                                </Modal.Content>
                            </Modal>

                            <Pressable onPress={() => setPop({...showPop,color:true})}>
                                <Text fontSize='2xs'>Color</Text>
                                <Text fontSize='md'>{animal.color}</Text>
                                <Divider />
                            </Pressable>    
                            <Modal isOpen={showPop.color} onClose={() => setPop({...showPop,color:false})} size='xl'>
                                <Modal.Content>
                                    <Modal.Header alignContent='center'>Actualizar color</Modal.Header>
                                    <Modal.Body>
                                        <FormControl>
                                            <Input placeholder='Nuevo color' onChangeText={(value)=>{setForm({...form,color:value})}}/>
                                        </FormControl>
                                    </Modal.Body>
                                    <Modal.Footer justifyContent="flex-end">
                                        <Button.Group space={2}>
                                            <Button colorScheme="coolGray" variant="ghost" onPress={()=>setPop({...showPop,color:false})}> 
                                                Cancel
                                            </Button>
                                            <Button colorScheme="warning" onPress={()=>handleUpdate('color')}>Actualizar</Button>
                                        </Button.Group>
                                    </Modal.Footer>
                                </Modal.Content>
                            </Modal>
                            
                        </VStack>
                        
                        <Button.Group colorScheme="info" my ={2} direction='column'>
                            <HStack space='sm'>
                                <Button colorScheme='rgb(0, 154, 159)' _text={{color:'white'}} leftIcon={<Icon size="md" as={MaterialCommunityIcons} name="dna"/>}>Registros reproductivos</Button>
                                <Button colorScheme='rgb(0, 154, 159)' _text={{color:'white'}} leftIcon={<Icon size="md" as={MaterialCommunityIcons} name="needle"/>}>Vacunas</Button>
                            </HStack>
                            <HStack space='sm'>
                                <Button width='40%' colorScheme='rgb(0, 154, 159)' _text={{color:'white'}} leftIcon={<Icon size="md" as={MaterialCommunityIcons} name="weight"/>}>Pesajes</Button>
                                <Button colorScheme='rgb(0, 154, 159)' _text={{color:'white'}} leftIcon={<Icon size="md" as={MaterialCommunityIcons} name="virus"/>}>Controles sanitarios</Button>
                            </HStack>
                        </Button.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Group space={2}>
                            <Button variant="ghost" colorScheme="blueGray" size = 'md' onPress={() => {setShow(false)}}>
                                Cancelar
                            </Button >
                            <Button size='lg' colorScheme='rgb(255, 37, 0)' _text={{color:'white'}} onPress={() => {setShowDel(true);
                            }}>
                                Borrar
                            </Button>
                        </Button.Group>
                    </Modal.Footer>

                    <AlertDialog  isOpen={show.delete} onClose={()=>setShow({...show,delete:false})}>
                        <AlertDialog.Content>
                            <AlertDialog.CloseButton />
                            <AlertDialog.Header>Borrar animal</AlertDialog.Header>
                            <AlertDialog.Body>
                                Esto borrará todos los datos relacionados con este animal. 
                                Esta acción no es reversible. 
                                Los datos borrados no podrán ser recuperados.
                                ¿Está seguro de esta acción?
                            </AlertDialog.Body>
                            <AlertDialog.Footer>
                                <Button.Group space={2}>
                                <Button variant="unstyled" colorScheme="coolGray" onPress={()=>setShow({...show,delete:false})}>
                                    Cancelar
                                </Button>
                                <Button  size='lg' colorScheme='rgb(255, 37, 0)' _text={{color:'white'}}>
                                    Confirmar 
                                </Button>
                                </Button.Group>
                            </AlertDialog.Footer>
                        </AlertDialog.Content>
                    </AlertDialog>

                    <Modal isOpen={show.vac} onClose={() => setShow({...show,vac:false})} size='full'>
                        <Modal.Content>
                            <Modal.CloseButton/>
                            <Modal.Header>Registros de vacunación</Modal.Header>
                            <Modal.Body>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button.Group space={2}>

                                </Button.Group>
                            </Modal.Footer>    
                        </Modal.Content>
                    </Modal>
                </Modal.Content>
            </Modal>

            <Modal isOpen={show.register} onClose={()=>setShow({...show,register:false})} size='full' >
                <Modal.Content>
                    <Modal.CloseButton/>
                    <Modal.Header alignContent='center'>Registrar animal</Modal.Header>
                    <Modal.Body>
                        <VStack>
                            <FormControl isInvalid={'arete' in errors}>
                                <FormControl.Label>Arete</FormControl.Label>
                                <Input
                                    placeholder='Arete - ID'
                                    onChangeText = {(value) => setForm({...form, arete:value})}
                                />
                                {'arete' in errors ?
                                <FormControl.ErrorMessage _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>{errors.arete}</FormControl.ErrorMessage>:
                                    <FormControl.HelperText _text={{fontSize: 'xs'}}>Diferenciar MAYUS de MINUS</FormControl.HelperText>
                                }
                            </FormControl>
                            <FormControl isInvalid={'nombre' in errors}>
                                <FormControl.Label>Nombre</FormControl.Label>
                                <Input
                                    placeholder='Nombre'
                                    onChangeText = {(value) => setForm({...form, name:value})}
                                />
                                {'nombre' in errors ?
                                <FormControl.ErrorMessage _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>{errors.nombre}</FormControl.ErrorMessage>:
                                    <FormControl.HelperText _text={{fontSize: 'xs'}}>Diferenciar MAYUS de MINUS</FormControl.HelperText>
                                }
                            </FormControl>
                            <FormControl isInvalid={'sexo' in errors}>
                                <FormControl.Label>Sexo</FormControl.Label>
                                    <Radio.Group
                                    name="sexo"
                                    accessibilityLabel="sexo"
                                    value={form.sex}
                                    onChange={(nextValue) => {
                                        setForm({...form, sex:nextValue})
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
                            </FormControl>
                        
                            <FormControl isInvalid={'fecha' in errors}>
                                <FormControl.Label>Fecha de nacimiento</FormControl.Label>
                                <Pressable onPress={()=> setForm({...form,show:true})}>
                                    <Text>{form.nac}</Text>
                                </Pressable>
                                {form.show && (
                                <DateTimePicker
                                    value={new Date()}
                                    mode='date'
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        const f = selectedDate;
                                        const currentDate = f.getFullYear() + "-"+ (f.getMonth()+1) + "-" +f.getDate();
                                        setForm({...form,nac:currentDate,show:false});
                                    }}
                                />
                            )}
                                
                                <FormControl.ErrorMessage>{errors.fecha}</FormControl.ErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={'raza' in errors}>
                                <FormControl.Label>Raza</FormControl.Label>
                                <Input
                                    placeholder='Raza'
                                    onChangeText = {(value) => setForm({...form, race:value})}
                                />
                                {'raza' in errors ?
                                <FormControl.ErrorMessage _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>{errors.raza}</FormControl.ErrorMessage>:
                                    <FormControl.HelperText _text={{fontSize: 'xs'}}>Diferenciar MAYUS de MINUS</FormControl.HelperText>
                                }
                            </FormControl>
                            <FormControl isInvalid={'color' in errors}>
                                <FormControl.Label>Color</FormControl.Label>
                                <Input
                                    placeholder='Color'
                                    onChangeText = {(value) => setForm({...form, color:value})}
                                />
                                {'color' in errors ?
                                <FormControl.ErrorMessage _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>{errors.color}</FormControl.ErrorMessage>:
                                    <FormControl.HelperText _text={{fontSize: 'xs'}}>Diferenciar MAYUS de MINUS</FormControl.HelperText>
                                }
                            </FormControl>
                            <FormControl isInvalid={'predio' in errors}>
                                <FormControl.Label>Predio</FormControl.Label>
                                <Input
                                    placeholder='Predio'
                                    onChangeText = {(value) => setForm({...form, predio:value})}
                                />
                                {'predio' in errors ?
                                <FormControl.ErrorMessage _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>{errors.predio}</FormControl.ErrorMessage>:
                                    <FormControl.HelperText _text={{fontSize: 'xs'}}>Diferenciar MAYUS de MINUS</FormControl.HelperText>
                                }
                            </FormControl>
                        </VStack>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button.Group space={2}>
                            <Button colorScheme="coolGray" variant="ghost" onPress={()=>setShow({...show,register:false})}> 
                                Cancel
                            </Button>
                            <Button size='lg' colorScheme='rgb(0, 247, 255)' _text={{color:'white'}}onPress={()=>handleUpdate('name')}>Crear</Button>
                        </Button.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </View>
    )
}


//Screen Vacunas

export const Vacunas = ({navigation }) => {

    const [form,setForm] = React.useState({});
    const [errors, setErrors] = React.useState({});
    const [show, setShow] = React.useState({vacuna:false,register:false,delete:false,animals:false});
    const [showPop, setPop] = React.useState({id:false,name:false,date:false});
    const [search, setSearch] = React.useState('');
    const [vacuna, setVacuna] = React.useState({id:0,name:'N/A',date:new Date()});

    const mt = useSelector((state) => state.mtr.vacunas);
    const vacunas = useSelector((state)=> state.vacunas);
    const bkp = useSelector((state) => state.bkpVacunas);

    const dispatch = useDispatch();
    
    const filtrar = (search) => {
        var resultado = bkp.filter((vacuna)=>{
            if(vacuna.name.toString().toLowerCase().includes(search.toString().toLowerCase()))
                return vacuna;
        });
        dispatch(action.setVacunas(resultado));
    }
    const handleSearch = txt => {
        setSearch(txt);
        filtrar(txt);
    }
    const handleVacuna = (item) =>{
        setShow({...show,vacuna:true});
    }
    const handleUpdate =(type) => {
        console.log(type);
    }
    return (
        <View>
            <Box>
                <HStack space={2}>
                    <Input onChangeText={handleSearch} value={search}placeholder="Buscar" variant="filled" width="80%" borderRadius="10" borderWidth="0" InputLeftElement={<Icon ml="2" size="4" color="gray.400" as={<Ionicons name="ios-search" />} />} />
                    <IconButton width='15%' colorScheme='rgb(173, 0, 255)' borderRadius="xl" variant="solid"  size="lg"
                        icon={<Icon  as={MaterialCommunityIcons} name="plus"/>}
                        onPress={()=>setShowReg(true)}
                    />
                </HStack>
                <FlatList data={vacunas}  renderItem={({item}) => 
                    <Pressable onPress={() => handleVacuna(item)}>
                        <HStack borderBottomWidth="1" space='4' >
                            <Icon size="xl" as={MaterialCommunityIcons} name="needle" width='20%'/>
                            <VStack width="65%">
                                <Heading>{item.id}</Heading>
                                <Text>{item.name}</Text>
                            </VStack>
                        </HStack>               
                    </Pressable>
                }
                keyExtractor={item=>item.id}
                />
                <Text>{mt}</Text>             
            </Box>

            <Modal isOpen={show.register} onClose={()=>setShow({...show,register:false})}>
                <Modal.Content>
                    <Modal.CloseButton/>
                    <Modal.Header>Registrar vacuna</Modal.Header>
                    <Modal.Body>
                        <VStack>
                            <FormControl isInvalid={'name' in errors}>
                                <FormControl.Label>Nombre</FormControl.Label>
                                <Input
                                    placeholder='Nombre'
                                    onChangeText={(value) => setData({...data, nombre:value})}
                                />
                                {
                                    'name' in errors ? 
                                        <FormControl.ErrorMessage>{errors.name}</FormControl.ErrorMessage>:
                                            <FormControl.HelperText></FormControl.HelperText>
                                }
                            </FormControl>

                            <FormControl isInvalid={'fecha' in errors}>
                                <FormControl.Label>Fecha de aplicación</FormControl.Label>


                            </FormControl>
                        </VStack>
                    </Modal.Body>
                    <Modal.Footer>

                    </Modal.Footer>
                
                    <Modal.Footer>
                        <Button.Group space={2}>
                            <Button variant="ghost" colorScheme="blueGray" size = 'md' onPress={() => {setShow(false)}}>
                                Cancelar
                            </Button >
                            <Button size='lg' colorScheme='rgb(255, 37, 0)' _text={{color:'white'}} onPress={() => {setShowDel(true);
                            }}>
                                Borrar
                            </Button>
                        </Button.Group>
                    </Modal.Footer> 
                </Modal.Content> 
            </Modal>
        </View>
    );

}

//Screen Sanitario
export const Sanitarios= ({navigation}) =>{
    const [form,setForm] = React.useState({});
    const [errors, setErrors] = React.useState({});
    const [show, setShow] = React.useState({sanitario:false,register:false,delete:false,animals:false});
    const [showPop, setPop] = React.useState({id:false,name:false,date:false});
    const [search, setSearch] = React.useState('');
    const [sanitario, setSanitario] = React.useState({id:0,name:'N/A',date:new Date()});

    const mt = useSelector((state) => state.mtr.sanitarios);
    const sanitarios = useSelector((state)=> state.sanitarios);
    const bkp = useSelector((state) => state.bkpSanitarios);

    const dispatch = useDispatch();
    
    const filtrar = (search) => {
        var resultado = bkp.filter((sanitario)=>{
            if(sanitario.name.toString().toLowerCase().includes(search.toString().toLowerCase()))
                return sanitario;
        });
        dispatch(action.setSanitarios(resultado));
    }
    const handleSearch = txt => {
        setSearch(txt);
        filtrar(txt);
    }
    const handleSanitario = (item) =>{
        setShow({...show,sanitario:true});
    }
    const handleUpdate =(type) => {
        console.log(type);
    }
    return (
        <View>
            <Box>
                <HStack space={2}>
                    <Input onChangeText={handleSearch} value={search}placeholder="Buscar" variant="filled" width="80%" borderRadius="10" borderWidth="0" InputLeftElement={<Icon ml="2" size="4" color="gray.400" as={<Ionicons name="ios-search" />} />} />
                    <IconButton width='15%' colorScheme='rgb(173, 0, 255)' borderRadius="xl" variant="solid"  size="lg"
                        icon={<Icon  as={MaterialCommunityIcons} name="plus"/>}
                        onPress={()=>setShowReg(true)}
                    />
                </HStack>
                <FlatList data={sanitarios}  renderItem={({item}) => 
                    <Pressable onPress={() => handleSanitario(item)}>
                        <HStack borderBottomWidth="1" space='4' >
                            <Icon size="xl" as={MaterialCommunityIcons} name="virus" width='20%'/>
                            <VStack width="65%">
                                <Heading>{item.id}</Heading>
                                <Text>{item.name}</Text>
                            </VStack>
                        </HStack>               
                    </Pressable>
                }
                keyExtractor={item=>item.id}
                />
                <Text>{mt}</Text>             
            </Box>

            <Modal isOpen={show.register} onClose={()=>setShow({...show,register:false})}>
                <Modal.Content>
                    <Modal.CloseButton/>
                    <Modal.Header>Registrar Control Sanitario</Modal.Header>
                    <Modal.Body>
                        <VStack>
                            <FormControl isInvalid={'name' in errors}>
                                <FormControl.Label>Nombre</FormControl.Label>
                                <Input
                                    placeholder='Nombre'
                                    onChangeText={(value) => setData({...data, nombre:value})}
                                />
                                {
                                    'name' in errors ? 
                                        <FormControl.ErrorMessage>{errors.name}</FormControl.ErrorMessage>:
                                            <FormControl.HelperText></FormControl.HelperText>
                                }
                            </FormControl>

                            <FormControl isInvalid={'fecha' in errors}>
                                <FormControl.Label>Fecha de aplicación</FormControl.Label>


                            </FormControl>
                        </VStack>
                    </Modal.Body>
                    <Modal.Footer>

                    </Modal.Footer>
                
                    <Modal.Footer>
                        <Button.Group space={2}>
                            <Button variant="ghost" colorScheme="blueGray" size = 'md' onPress={() => {setShow(false)}}>
                                Cancelar
                            </Button >
                            <Button size='lg' colorScheme='rgb(255, 37, 0)' _text={{color:'white'}} onPress={() => {setShowDel(true);
                            }}>
                                Borrar
                            </Button>
                        </Button.Group>
                    </Modal.Footer> 
                </Modal.Content> 
            </Modal>
        </View>
    );
}

//Screen Embarazos

export const Embarazos = ({navigation}) => {
    const [form,setForm] = React.useState({});
    const [errors, setErrors] = React.useState({});
    const [show, setShow] = React.useState({embarazo:false,register:false,delete:false,animals:false});
    const [showPop, setPop] = React.useState({id:false,name:false,inicio:false,fin:false});
    const [search, setSearch] = React.useState('');
    const [embarazo, setEmbarazo] = React.useState({id:0,name:'N/A',inicio:new Date(), fin: new Date()});

    const mt = useSelector((state) => state.mtr.embarazos);
    const embarazos = useSelector((state)=> state.embarazos);
    const bkp = useSelector((state) => state.bkpEmbarazos);

    const dispatch = useDispatch();
    
    const filtrar = (search) => {
        var resultado = bkp.filter((embarazo)=>{
            if(embarazo.name.toString().toLowerCase().includes(search.toString().toLowerCase()))
                return embarazo;
        });
        dispatch(action.setEmbarazos(resultado));
    }
    const handleSearch = txt => {
        setSearch(txt);
        filtrar(txt);
    }
    const handleEmbarazo = (item) =>{
        setShow({...show,embarazo:true});
    }
    const handleUpdate =(type) => {
        console.log(type);
    }
    return (
        <View>
            <Box>
                <HStack space={2}>
                    <Input onChangeText={handleSearch} value={search}placeholder="Buscar" variant="filled" width="80%" borderRadius="10" borderWidth="0" InputLeftElement={<Icon ml="2" size="4" color="gray.400" as={<Ionicons name="ios-search" />} />} />
                    <IconButton width='15%' colorScheme='rgb(173, 0, 255)' borderRadius="xl" variant="solid"  size="lg"
                        icon={<Icon  as={MaterialCommunityIcons} name="plus"/>}
                        onPress={()=>setShowReg(true)}
                    />
                </HStack>
                <FlatList data={embarazos}  renderItem={({item}) => 
                    <Pressable onPress={() => handleEmbarazo(item)}>
                        <HStack borderBottomWidth="1" space='4' >
                            <Icon size="xl" as={MaterialCommunityIcons} name="dna" width='20%'/>
                            <VStack width="65%">
                                <Heading>{item.id}</Heading>
                                
                            </VStack>
                        </HStack>               
                    </Pressable>
                }
                keyExtractor={item=>item.id}
                />
                <Text>{mt}</Text>             
            </Box>

            <Modal isOpen={show.register} onClose={()=>setShow({...show,register:false})}>
                <Modal.Content>
                    <Modal.CloseButton/>
                    <Modal.Header>Registrar Embarazo</Modal.Header>
                    <Modal.Body>
                        <VStack>
                            <FormControl isInvalid={'name' in errors}>
                                <FormControl.Label>Nombre</FormControl.Label>
                                <Input
                                    placeholder='Nombre'
                                    onChangeText={(value) => setData({...data, nombre:value})}
                                />
                                {
                                    'name' in errors ? 
                                        <FormControl.ErrorMessage>{errors.name}</FormControl.ErrorMessage>:
                                            <FormControl.HelperText></FormControl.HelperText>
                                }
                            </FormControl>

                            <FormControl isInvalid={'fecha' in errors}>
                                <FormControl.Label>Fecha de inicio</FormControl.Label>


                            </FormControl>
                        </VStack>
                    </Modal.Body>
                    <Modal.Footer>

                    </Modal.Footer>
                
                    <Modal.Footer>
                        <Button.Group space={2}>
                            <Button variant="ghost" colorScheme="blueGray" size = 'md' onPress={() => {setShow(false)}}>
                                Cancelar
                            </Button >
                            <Button size='lg' colorScheme='rgb(255, 37, 0)' _text={{color:'white'}} onPress={() => {setShowDel(true);
                            }}>
                                Borrar
                            </Button>
                        </Button.Group>
                    </Modal.Footer> 
                </Modal.Content> 
            </Modal>
        </View>
    );
}

//Screen Pesajes

var peso = {
    codigo:'',
    arete:'',
    fecha: new Date(),
    kg:0.0,
}
export const Pesajes = ({navigation}) => {
    const [form,setForm] = React.useState({});
    const [errors, setErrors] = React.useState({});
    const [show, setShow] = React.useState({pesaje:false,register:false,delete:false});
    const [showPop, setPop] = React.useState({id:false,name:false,date:false});
    const [search, setSearch] = React.useState('');
    const [pesaje, setPesaje] = React.useState({id:0,arete:'N/A',kg:0,date:new Date()});

    const mt = useSelector((state) => state.mtr.pesajes);
    const pesajes = useSelector((state)=> state.pesajes);
    const bkp = useSelector((state) => state.bkpPesajes);

    const dispatch = useDispatch();
    
    const filtrar = (search) => {
        var resultado = bkp.filter((pesaje)=>{
            if(pesaje.arete.toString().toLowerCase().includes(search.toString().toLowerCase()))
                return pesaje;
        });
        dispatch(action.setPesajes(resultado));
    }
    const handleSearch = txt => {
        setSearch(txt);
        filtrar(txt);
    }
    const handlePesaje= (item) =>{
        setShow({...show,pesaje:true});
    }
    const handleUpdate =(type) => {
        console.log(type);
    }
    return (
        <View>
            <Box>
                <HStack space={2}>
                    <Input onChangeText={handleSearch} value={search}placeholder="Buscar" variant="filled" width="80%" borderRadius="10" borderWidth="0" InputLeftElement={<Icon ml="2" size="4" color="gray.400" as={<Ionicons name="ios-search" />} />} />
                    <IconButton width='15%' colorScheme='rgb(173, 0, 255)' borderRadius="xl" variant="solid"  size="lg"
                        icon={<Icon  as={MaterialCommunityIcons} name="plus"/>}
                        onPress={()=>setShowReg(true)}
                    />
                </HStack>
                <FlatList data={pesajes}  renderItem={({item}) => 
                    <Pressable onPress={() => handlePredio(item)}>
                        <HStack borderBottomWidth="1" space='4' >
                            <Icon size="xl" as={MaterialCommunityIcons} name="weight" width='20%'/>
                            <VStack width="65%">
                                <Heading>{item.arete}</Heading>
                                <Text>{item.kg}</Text>
                            </VStack>
                        </HStack>               
                    </Pressable>
                }
                keyExtractor={item=>item.id}
                />
                <Text>{mt}</Text>             
            </Box>

            <Modal isOpen={show.register} onClose={()=>setShow({...show,register:false})}>
                <Modal.Content>
                    <Modal.CloseButton/>
                    <Modal.Header>Registrar Pesaje</Modal.Header>
                    <Modal.Body>
                        <VStack>
                            <FormControl isInvalid={'name' in errors}>
                                <FormControl.Label>Nombre</FormControl.Label>
                                <Input
                                    placeholder='Nombre'
                                    onChangeText={(value) => setData({...data, nombre:value})}
                                />
                                {
                                    'name' in errors ? 
                                        <FormControl.ErrorMessage>{errors.name}</FormControl.ErrorMessage>:
                                            <FormControl.HelperText></FormControl.HelperText>
                                }
                            </FormControl>

                            <FormControl isInvalid={'fecha' in errors}>
                                <FormControl.Label>Fecha de aplicación</FormControl.Label>


                            </FormControl>
                        </VStack>
                    </Modal.Body>
                    <Modal.Footer>

                    </Modal.Footer>
                
                    <Modal.Footer>
                        <Button.Group space={2}>
                            <Button variant="ghost" colorScheme="blueGray" size = 'md' onPress={() => {setShow(false)}}>
                                Cancelar
                            </Button >
                            <Button size='lg' colorScheme='rgb(255, 37, 0)' _text={{color:'white'}} onPress={() => {setShowDel(true);
                            }}>
                                Borrar
                            </Button>
                        </Button.Group>
                    </Modal.Footer> 
                </Modal.Content> 
            </Modal>
        </View>
    );
}

//Screen Predios

export const Predios = ( {navitagion}) => {
    const [form,setForm] = React.useState({});
    const [errors, setErrors] = React.useState({});
    const [show, setShow] = React.useState({predio:false,register:false,delete:false,animals:false});
    const [showPop, setPop] = React.useState({id:false,name:false,date:false});
    const [search, setSearch] = React.useState('');
    const [predio, setPredio] = React.useState({id:0,name:'N/A',agua:1,pasto:1});

    const mt = useSelector((state) => state.mtr.predios);
    const predios = useSelector((state)=> state.predios);
    const bkp = useSelector((state) => state.bkpPredios);

    const dispatch = useDispatch();
    
    const filtrar = (search) => {
        var resultado = bkp.filter((predio)=>{
            if(predio.name.toString().toLowerCase().includes(search.toString().toLowerCase()))
                return predio;
        });
        dispatch(action.setPredios(resultado));
    }
    const handleSearch = txt => {
        setSearch(txt);
        filtrar(txt);
    }
    const handlePredio = (item) =>{
        setShow({...show,predio:true});
    }
    const handleUpdate =(type) => {
        console.log(type);
    }
    return (
        <View>
            <Box>
                <HStack space={2}>
                    <Input onChangeText={handleSearch} value={search}placeholder="Buscar" variant="filled" width="80%" borderRadius="10" borderWidth="0" InputLeftElement={<Icon ml="2" size="4" color="gray.400" as={<Ionicons name="ios-search" />} />} />
                    <IconButton width='15%' colorScheme='rgb(173, 0, 255)' borderRadius="xl" variant="solid"  size="lg"
                        icon={<Icon  as={MaterialCommunityIcons} name="plus"/>}
                        onPress={()=>setShowReg(true)}
                    />
                </HStack>
                <FlatList data={predios}  renderItem={({item}) => 
                    <Pressable onPress={() => handlePredio(item)}>
                        <HStack borderBottomWidth="1" space='4' >
                            <Icon size="xl" as={MaterialCommunityIcons} name="terrain" width='20%'/>
                            <VStack width="65%">
                                <Heading>{item.id}</Heading>
                                <Text>{item.name}</Text>
                            </VStack>
                        </HStack>               
                    </Pressable>
                }
                keyExtractor={item=>item.id}
                />
                <Text>{mt}</Text>             
            </Box>

            <Modal isOpen={show.register} onClose={()=>setShow({...show,register:false})}>
                <Modal.Content>
                    <Modal.CloseButton/>
                    <Modal.Header>Registrar Predio</Modal.Header>
                    <Modal.Body>
                        <VStack>
                            <FormControl isInvalid={'name' in errors}>
                                <FormControl.Label>Nombre</FormControl.Label>
                                <Input
                                    placeholder='Nombre'
                                    onChangeText={(value) => setData({...data, nombre:value})}
                                />
                                {
                                    'name' in errors ? 
                                        <FormControl.ErrorMessage>{errors.name}</FormControl.ErrorMessage>:
                                            <FormControl.HelperText></FormControl.HelperText>
                                }
                            </FormControl>

                            <FormControl isInvalid={'fecha' in errors}>
                                <FormControl.Label>Fecha de aplicación</FormControl.Label>


                            </FormControl>
                        </VStack>
                    </Modal.Body>
                    <Modal.Footer>

                    </Modal.Footer>
                
                    <Modal.Footer>
                        <Button.Group space={2}>
                            <Button variant="ghost" colorScheme="blueGray" size = 'md' onPress={() => {setShow(false)}}>
                                Cancelar
                            </Button >
                            <Button size='lg' colorScheme='rgb(255, 37, 0)' _text={{color:'white'}} onPress={() => {setShowDel(true);
                            }}>
                                Borrar
                            </Button>
                        </Button.Group>
                    </Modal.Footer> 
                </Modal.Content> 
            </Modal>
        </View>
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

export const Configuracion = ({navigation}) => {
    const tkn = useSelector(state => state.jwt);
    const perfil = useSelector(state => state.perfil);
    const dispatch = useDispatch();
        // user,name,pass,cpass,address, phone.

    const [errors, setError] = React.useState({});
    const handleParam = (type) =>{

    }
    return (
        <Box >
            <Box bgColor='#DEDDDA'>
                <Center>
                    <Heading size='sm'>Actualizar datos</Heading>
                </Center>
            </Box>
            <FlatList
                data={perfil}
                renderItem={({item}) => (
                    <Pressable onPress={() => handleParam(item)}>
                        <HStack borderBottomWidth="1" space='4' >
                            <VStack width="65%">
                                <Heading>{item.value}</Heading>
                                <Text>{item.id}</Text>
                            </VStack>
                        </HStack>               
                    </Pressable>
                )}
                keyExtractor={(item) => item.id}
            />
        </Box>
    );
}
