import React, { useEffect } from 'react';
import { Button, NativeBaseProvider, Box, Input, FormControl, VStack, Checkbox, Link, Slider, Select, Radio, ScrollView, Divider, Center, Text, FlatList,Heading, Icon, KeyboardAvoidingView,Alert, IconButton, CloseIcon, Collapse, HStack, Modal,useToast, Pressable, View, AlertDialog, Spinner, Flex} from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import NetInfo from "@react-native-community/netinfo";
import { Platform } from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import * as action from './ranchoActions';
import { Header } from 'react-native/Libraries/NewAppScreen';


// CONSTANTES GLOBALES
const api = 'http://192.168.1.250/request/';

///////////////////////////////////////
  // Screens - Navegacion de Inicio //
/////////////////////////////////////

//Screen LogIn
export const LogIn = ({navigation}) => {
    const dispatch = useDispatch();
    const session = useSelector(state => state.jwt);
    const toast = useToast();
    
    const [cntLogin, setCounter] = React.useState(0);
    const [data, setData] = React.useState({});
    const [errors, setError] = React.useState({});

    React.useEffect(() => {
        dispatch(action.setSession('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NTI0ODY5NzgsInVzZXIiOiJwcnVlYmEifQ.D9z3QEagJ-ACpalDB68npB9h-pxVGntJbHFRP7wqXNc'))
        //if(session != false)
        navigation.navigate('getData');  
    },[]);
    const HandleLogin = () => {
        if(cntLogin > 10)
            toast.show({ title:'Intente mas tarde',status:'error', description: "Demasiados intentos" });
        else
            NetInfo.fetch().then(state=>{
                if(state.isConnected){
                    setCounter(cntLogin+1);
                    dispatch(action.getSession(data.user, data.pass)).then(s => {
                        if(s)
                            navigation.navigate('getData');
                        else
                            toast.show({title:'Credenciales incorrectas',status:'warning', description: "Intente de nuevo"});
                    });
                }
                else
                    toast.show({title:'No hay conexión',status:'warning', description: "Intente mas tarde"});
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
    const [loading, setLoading] = React.useState(false);
   

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
            if (msj < 1){
                toast.show({title:'Exito',status:'success',description:'Usuario creado!'});
                return true;
            }else{
                toast.show({title:'Error en el registro',status:'warning',description:'Intente de nuevo'});
                return false;
            }
                
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
        if(validForm()){
            setLoading(true);
            NetInfo.fetch().then(state => {
                if(state.isConnected){
                    verifyUser().then(validUser => {
                        if (validUser){
                            verifyMail().then(validMail =>{
                                if(validMail)
                                    createUser().then(regUser =>{
                                        navigation.navigate('login');
                                    })
                            });    
                        }
                    }); 
                }else
                    toast({title:'No hay conexión',status:'warning',description:'Se necesita conexion'});
              });
            
        }
    }
    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "height" : ""} keyboardVerticalOffset={100} >
        <ScrollView safe>
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
                
            </VStack>
            <Button.Group space={2}>
                <Button isLoading={loading} colorScheme='success' size = 'lg' onPress={()=> HandleRegister()}> Registrar </Button>
            </Button.Group>
        </Box>
        
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
    const tkn = useSelector(state => state.jwt);
    const [show, setShow] = React.useState(false);
    const dispatch = useDispatch();
    const errors = useSelector((state) =>state.errors);
    const toast = useToast();
    
    const getData = () => {
        console.log(tkn);
        NetInfo.fetch().then((state) => { 
            if(state.isConnected)
                dispatch(action.getRancho(tkn)).then(msj => {
                    if(msj === false){
                        toast.show({title:'Error con el servidor',status:'warning' ,description:'Intente de nuevo'});
                    }else
                        navigation.navigate('rancho');
                });
            else
                setShow(true);
        });
    }
    React.useEffect(()=>{getData()},[]);
        
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

////////////////////////////////////
// Screens - Navegacion "Rancho" //
////////////////////////// ///////

//Screen Ganado

export const Hato = ({navigation}) => {
    // const jwt = useSelector(state => state.jwt);

    const hato = useSelector((state)=> state.hato);
    const bkp = useSelector((state) => state.bkpHato);
    const mt = useSelector((state) => state.mtr.hato);
    
    const vacunas = useSelector(state=> state.vacunas);
    const vac_animal = useSelector( state => state.vac_animal);

    const sanitarios = useSelector(state=> state.sanitarios);
    const ctl_animal = useSelector(state=> state.ctl_animal);

    const pesajes = useSelector(state=> state.pesajes);

    const embarazos = useSelector (state => state.embarazos);
    const crias = useSelector(state => state.crias);

    const predios = useSelector(state => state.predios);
    const pre_animal =  useSelector ( state => state.pre_animal);
    
    const toast = useToast();
    const dispatch = useDispatch();

    const [list,setList] = React.useState([]);
    const [show, setShow] = React.useState({animal:false,register:false,delete:false,vac:false,pesaje:false,rep:false,san:false,trans:false,predios:false})   
    const [showPop, setPop] = React.useState({name:false,nac:false,date:false,sex:false,race:false,color:false,predio:false});
    
    const [search, setSearch] = React.useState('');
    const [animal, setAnimal] = React.useState({arete:'',name:'',nac:new Date(),sex:'M',race:'',color:''});
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
        setShow({...show,animal:true});
    }
    const handleUpdate =(type) => {
        switch(type){
            case 'name':
                console.log(form.name);
                break;
            case 'nac':
                console.log(form.nac.toString());
                break;
            case 'sex':
                console.log(form.sex);
                break;
            case 'race':
                console.log(form.race);
                break;
            case 'color':
                console.log(form.color);
                break;
            default:
                break;
        }
    }
    const handleVacunas = () => {
        var ids = vac_animal.filter((rel)=>{
            if(rel.arete == animal.arete)
                return rel;
        });
        console.log(vac_animal);
        var lista = vacunas.filter((vacuna)=>{
            for(let i=0; i<=ids.length-1; i++){
                if(ids[i].vacuna == vacuna.id)
                    return true;
            }
        });
        if(lista.length > 0){
            setList(lista);
            setShow({...show,vac:true});
        }else
            toast.show({title:'Vacio',description:'No hay vacunas',status:'info',placement:'top'});
        
    }
 
    const handleSanitarios = () => {
        var ids = ctl_animal.filter((rel)=>{
            if(rel.arete == animal.arete)
                return rel;
        });
        var lista = sanitarios.filter((ctl)=>{
            for(let i=0; i<=ids.length-1; i++){
                if(ids[i].ctl == ctl.id)
                    return true;
            }
        });
        if(lista.length > 0){
            setList(lista);
            setShow({...show,san:true});
        }else
            toast.show({title:'Vacio',description:'No hay controles',status:'info',placement:'top'});
    }
    
    const handleReproductivos = () => {
        var cria = crias.filter((embarazo)=>{
            if (embarazo.arete == animal.arete)
                return true;
        });
        console.log(embarazos);
        var lista = embarazos.filter((embarazo)=> {
            for(i=0; i<cria.length; i++)
                if(embarazo.id == cria[i].embarazo)
                return true;
        });
        console.log(lista);
        if(lista.length > 0){
            setList(lista[0]);
            setShow({...show,rep:true});
        }else
            toast.show({title:'Vacio',description:'No hay registros',status:'info',placement:'top'});
    }
    const handlePesajes = () => {
        var lista = pesajes.filter((pesaje)=>{
            if(pesaje.arete == animal.arete)
                return true;
        });
        if(lista.length > 0){
            setList(lista);
            setShow({...show,pesaje:true});
        }else
            toast.show({title:'Vacio',description:'No hay pesajes',status:'info',placement:'top'});
    }
    const handlePredios = () => {
        var transferencias = pre_animal.filter((trans) =>{
            if(trans.arete == animal.arete)
                return true;
        });
        var ranchos = predios.filter((predio) =>{
            for(i=0; i<=transferencias.length-1; i++)
                if(predio.id == transferencias[i].predio)
                    return true;
        });
        for(i=0; i<=transferencias.length-1; i++)
            for(y=0; y<ranchos.length; y++)
                if(ranchos[y].id == transferencias[i].predio)
                    transferencias[i].predio = ranchos[y].name;
        if(transferencias.length>0){
            setList(transferencias);
            setShow({...show,predios:true});
        }else
            toast.show({title:'Vacio',description:'No hay predios',status:'info',placement:'top'});
    }
    return(
        <View>
            <Box>
                <HStack space={2}>
                    <Input onChangeText={handleSearch} value={search}placeholder="Buscar" variant="filled" width="80%" borderRadius="10" borderWidth="0" InputLeftElement={<Icon ml="2" size="4" color="gray.400" as={<Ionicons name="ios-search" />} />} />
                    <IconButton width='15%' colorScheme='rgb(173, 0, 255)' borderRadius="xl" variant="solid"  size="lg"
                        icon={<Icon  as={MaterialCommunityIcons} name="plus"/>}
                        onPress={()=>setShow({...show,register:true})}
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
                                            <Button colorScheme="warning" onPress={()=> {
                                                handleUpdate('name');
                                                setPop({...showPop,name:false});
                                            }}>Actualizar</Button>
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
                                                onValueChange={(itemValue) => {
                                                    setForm({...form, sex:itemValue});
                                                    handleUpdate('sex');
                                                    (setPop({...showPop,sex:false}));
                                                }}
                                                
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
                                            <Input placeholder='Nueva raza' onChangeText={(value)=>setForm({...form,race:value})}/>
                                        </FormControl>
                                    </Modal.Body>
                                    <Modal.Footer justifyContent="flex-end">
                                        <Button.Group space={2}>
                                            <Button colorScheme="coolGray" variant="ghost" onPress={()=>setPop({...showPop,race:false})}> 
                                                Cancel
                                            </Button>
                                            <Button colorScheme="warning" onPress={()=>{
                                                handleUpdate('race');
                                                setPop({...showPop,race:false});
                                            }}>Actualizar</Button>
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
                                            <Button colorScheme="coolGray" variant="ghost" onPress={()=> {
                                                handleUpdate('color');
                                                setPop({...showPop,color:false});
                                            }}> 
                                                Cancel
                                            </Button>
                                            <Button colorScheme="warning" onPress={()=>{
                                                handleUpdate('color');
                                                setPop({...showPop,color:false});
                                            }}>Actualizar</Button>
                                        </Button.Group>
                                    </Modal.Footer>
                                </Modal.Content>
                            </Modal>                            
                        </VStack>
                        
                        <Button.Group colorScheme="info" my ={3} direction='column'>
                            <HStack space='sm'>
                                <Button 
                                    colorScheme='rgb(0, 154, 159)' 
                                    _text={{color:'white'}} 
                                    leftIcon={<Icon size="md" as={MaterialCommunityIcons} name="dna"/>}
                                    onPress = {() => handleReproductivos()}
                                >
                                    Registros reproductivos
                                </Button>
                                <Button 
                                    colorScheme='rgb(0, 154, 159)' 
                                    _text={{color:'white'}} 
                                    leftIcon={<Icon size="md" as={MaterialCommunityIcons} name="needle"/>}
                                    onPress = {() => handleVacunas()}
                                >
                                    Vacunas
                                </Button>
                            </HStack>
                            <HStack space='sm'>
                                <Button width='40%'
                                    colorScheme='rgb(0, 154, 159)' 
                                    _text={{color:'white'}} 
                                    leftIcon={<Icon size="md" as={MaterialCommunityIcons} name="weight"/>}
                                    onPress = {() => handlePesajes()}
                                >
                                    Pesajes
                                </Button>
                                <Button 
                                    colorScheme='rgb(0, 154, 159)' 
                                    _text={{color:'white'}} 
                                    leftIcon={<Icon size="md" as={MaterialCommunityIcons} name="virus"/>}
                                    onPress = {() => handleSanitarios()}
                                >
                                    Controles sanitarios
                                </Button>
                            </HStack>
                            <Button
                                colorScheme='rgb(0, 154, 159)' 
                                _text={{color:'white'}} 
                                leftIcon={<Icon size="md" as={MaterialCommunityIcons} name="terrain"/>}
                                onPress = {() => handlePredios()}
                            >
                               Historial de predios
                            </Button>
                        </Button.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        
                        <Button.Group space={3}>
                            <Button variant="ghost" colorScheme="blueGray" size = 'md' onPress={() => {setShow(false)}}>
                                Cancelar
                            </Button >
                            <Button size='lg' colorScheme='rgb(255, 37, 0)' _text={{color:'white'}} onPress={() => {setShow({...show,delete:true});
                            }}>
                                Borrar
                            </Button>
                            <Button size='lg' colorScheme='orange' _text={{color:'white'}} onPress={() => {setShow({...show,trans:true});
                            }}>
                                Transferir
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

            <Modal isOpen={show.rep} onClose={()=>setShow({...show,rep:false})} size='lg' >
                
                <Modal.Content>
                    <Modal.CloseButton/>
                    <Modal.Header alignContent='center'>Registro reproductivo</Modal.Header>
                    <Modal.Body>
                        <Center>
                            <Heading>ID de Embarazo</Heading>
                            <Text>{list.id}</Text>
                            <HStack space={2}>
                                <VStack space={2}>
                                    <Heading>Padre</Heading>
                                    <Text>{list.dad}</Text>
                                </VStack>
                                <VStack space={2}>
                                    <Heading>Madre</Heading>
                                    <Text>{list.mom}</Text>
                                </VStack>
                            </HStack>
                        </Center>
                    </Modal.Body>
                </Modal.Content>
            </Modal>

            <Modal isOpen={show.vac} onClose={()=>setShow({...show,vac:false})} size='lg' >
                <Modal.Content>
                    <Modal.CloseButton/>
                    <Modal.Header alignContent='center'>Vacunas</Modal.Header>
                    <Modal.Body>
                        <FlatList data={list}  renderItem={({item}) => 
                            <HStack borderBottomWidth="1" space='4' >
                                <Icon size="xl" as={MaterialCommunityIcons} name="needle" width='20%'/>
                                <VStack width="65%">
                                    <Heading>{item.name}</Heading>
                                    <Text>{item.date}</Text>
                                </VStack> 
                            </HStack>               
                        }
                        keyExtractor={item=>item.id}
                        />
                    </Modal.Body>
                </Modal.Content>
            </Modal>

            <Modal isOpen={show.pesaje} onClose={()=>setShow({...show,pesaje:false})} size='lg' >
                <Modal.Content>
                    <Modal.CloseButton/>
                    <Modal.Header alignContent='center'>Pesajes</Modal.Header>
                    <Modal.Body>
                        <FlatList data={list}  renderItem={({item}) => 
                                <HStack borderBottomWidth="1" space='4' >
                                    <Icon size="xl" as={MaterialCommunityIcons} name="weight" width='20%'/>
                                    <VStack width="65%">
                                        <Heading>{item.kg} Kg</Heading>
                                        <Text>{item.date}</Text>
                                    </VStack> 
                                </HStack>               
                            }
                            keyExtractor={item=>item.id}
                        />
                    </Modal.Body>
                </Modal.Content>
            </Modal>
            <Modal isOpen={show.san} onClose={()=>setShow({...show,san:false})} size='lg' >
                <Modal.Content>
                    <Modal.CloseButton/>
                    <Modal.Header alignContent='center'>Controles sanitarios</Modal.Header>
                    <Modal.Body>
                        <FlatList data={list}  renderItem={({item}) => 
                                <HStack borderBottomWidth="1" space='4' >
                                    <Icon size="xl" as={MaterialCommunityIcons} name="virus" width='20%'/>
                                    <VStack width="65%">
                                        <Heading>{item.name}</Heading>
                                        <Text>{item.date}</Text>
                                    </VStack> 
                                </HStack>               
                            }
                            keyExtractor={item=>item.id}
                        />
                    </Modal.Body>
                </Modal.Content>
            </Modal>
            <Modal isOpen={show.predios} onClose={()=>setShow({...show,predios:false})} size='lg' >
                <Modal.Content>
                    <Modal.CloseButton/>
                    <Modal.Header alignContent='center'>Historial de predios</Modal.Header>
                    <Modal.Body>
                        <FlatList data={list}  inverted={true} renderItem={({item}) => 
                                <HStack borderBottomWidth="1" space='4' >
                                    <Icon size="xl" as={MaterialCommunityIcons} name="terrain" width='20%'/>
                                    <VStack width="65%">
                                        <Heading>{item.predio}</Heading>
                                        <Text>{item.date}</Text>
                                    </VStack> 
                                </HStack>               
                            }
                            keyExtractor={item=>item.id}
                        />
                    </Modal.Body>
                </Modal.Content>
            </Modal>

        </View>
    )
}


//Screen Vacunas

export const Vacunas = ({navigation }) => {

    const [form,setForm] = React.useState({show:false,date:'YYYY-MM-DD'});
    const [errors, setErrors] = React.useState({});
    const [show, setShow] = React.useState({vacuna:false,register:false,delete:false,animals:false,add:false,rm:false});
    const [showPop, setPop] = React.useState({id:false,name:false,date:false});
    const [search, setSearch] = React.useState('');
    const [vacuna, setVacuna] = React.useState({id:0,name:'N/A',date:new Date()});
    const [list, setList] = React.useState([]);

    const mt = useSelector((state) => state.mtr.vacunas);
    const vacunas = useSelector((state)=> state.vacunas);
    const bkp = useSelector((state) => state.bkpVacunas);
    const vac_animal = useSelector((state) => state.vac_animal);
    const hato = useSelector((state)=> state.hato);

    const toast = useToast();
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
        setVacuna(item);
        setShow({...show,vacuna:true});
    }
    const handleUpdate =(type) => {
        console.log(type);
    }
    const handleAnimals = () => {
        var ids = vac_animal.filter((rel)=>{
            if(rel.vacuna == vacuna.id)
                return rel;
        });
        var lista = hato.filter((animal)=>{
            for(let i=0; i<=ids.length-1; i++){
                if(ids[i].arete == animal.arete)
                    return true;
            }
        });
        if(lista.length > 0){
            setList(lista);
            setShow({...show,animals:true});
        }else
            toast.show({title:'Vacio',description:'No hay animales'});
    }
    return (
        <View>
            <Box>
                <HStack space={2}>
                    <Input onChangeText={handleSearch} value={search}placeholder="Buscar" variant="filled" width="80%" borderRadius="10" borderWidth="0" InputLeftElement={<Icon ml="2" size="4" color="gray.400" as={<Ionicons name="ios-search" />} />} />
                    <IconButton width='15%' colorScheme='rgb(173, 0, 255)' borderRadius="xl" variant="solid"  size="lg"
                        icon={<Icon  as={MaterialCommunityIcons} name="plus"/>}
                        onPress={()=>setShow({...show,register:true})}
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
                                    onChangeText={(value) => setForm({...form,name:value})}
                                />
                                {
                                    'name' in errors ? 
                                        <FormControl.ErrorMessage>{errors.name}</FormControl.ErrorMessage>:
                                            <FormControl.HelperText></FormControl.HelperText>
                                }
                            </FormControl>

                            <FormControl isInvalid={'fecha' in errors}>
                                <FormControl.Label>Fecha de aplicación</FormControl.Label>
                                <Pressable  onPress={() => setForm({...form,show:true})}>
                                    <Text fontSize='2xs'>Fecha de aplicacion</Text>
                                    <Text fontSize='md'>{form.date}</Text>
                                    <Divider />
                                </Pressable>        
                                {form.show && (
                                    <DateTimePicker
                                        value={new Date()}
                                        mode='date'
                                        display="default"
                                        onChange={(event, selectedDate) => {
                                            const f = selectedDate;
                                            const currentDate = f.getFullYear() + "-"+ f.getMonth()+ "-" +f.getDate();
                                            setForm({...form,date:currentDate,show:false});
                                    
                                        }}
                                    />
                                )}
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
                            <Button size='lg' colorScheme='rgb(0, 247, 255)' _text={{color:'white'}} onPress={() => {setShowDel(true);
                            }}>
                                Registrar vacuna
                            </Button>
                        </Button.Group>
                    </Modal.Footer> 
                </Modal.Content> 
            </Modal>

            <Modal isOpen={show.vacuna} onClose={() => setShow({...show,vacuna:false})} size='full'>
                <Modal.Content >
                    <Modal.CloseButton />
                    <Modal.Header alignSelf="center" _text={{fontSize:'xl',Overridden:'bold'}}>{vacuna.id}</Modal.Header>
                    <Modal.Body >
                        <VStack >
                            <Pressable onPress={() => setPop({...showPop,name:true})}>
                                <Text fontSize='2xs'>Nombre</Text>
                                <Text fontSize='md'>{vacuna.name}</Text>
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
                                            <Button colorScheme="warning" onPress={()=> {
                                                handleUpdate('name');
                                                setPop({...showPop,name:false});
                                            }}>Actualizar</Button>
                                        </Button.Group>
                                    </Modal.Footer>
                                </Modal.Content>
                            </Modal>

                            <Pressable  onPress={() => setPop({...showPop,date:true})}>
                                <Text fontSize='2xs'>Fecha de aplicacion</Text>
                                <Text fontSize='md'>{vacuna.date}</Text>
                                <Divider />
                            </Pressable>        
                            {showPop.date && (
                                <DateTimePicker
                                    value={new Date(vacuna.date)}
                                    mode='date'
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        const f = selectedDate;
                                        const currentDate = f.getFullYear() + "-"+ f.getMonth()+ "-" +f.getDate();
                                        setForm({...form,date:currentDate});
                                        handleUpdate('nac');
                                        setPop({...showPop,date:false});
                                    }}
                                />
                            )}
                        </VStack>
                        
                        
                        <Button 
                            colorScheme='rgb(0, 154, 159)' 
                            _text={{color:'white'}} 
                            leftIcon={<Icon size="md" as={MaterialCommunityIcons} name="cow"/>}
                            onPress = {() => handleAnimals()}
                        >
                            Hato vacunado
                        </Button>
                            
                    </Modal.Body>
                    <Modal.Footer>
                        
                        <Button.Group space={2}>
                            <Button variant="ghost" colorScheme="blueGray" size = 'md' onPress={() => {setShow(false)}}>
                                Cancelar
                            </Button >
                            <Button size='lg' colorScheme='rgb(255, 37, 0)' _text={{color:'white'}} onPress={() => {setShow({...show,delete:true});
                            }}>
                                Borrar
                            </Button>
                        </Button.Group>
                    </Modal.Footer>

                    <AlertDialog  isOpen={show.delete} onClose={()=>setShow({...show,delete:false})}>
                        <AlertDialog.Content>
                            <AlertDialog.CloseButton />
                            <AlertDialog.Header>Borrar vacuna</AlertDialog.Header>
                            <AlertDialog.Body>
                                Esto borrará todos los datos relacionados con esta vacuna. 
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
                </Modal.Content>
            </Modal>

            <Modal isOpen={show.animals} onClose={()=>setShow({...show,animals:false})} size='full' >
                <Modal.Content>
                    <Modal.CloseButton/>
                    <Modal.Header alignContent='center'>Animales</Modal.Header>
                    <Modal.Body>
                        <FlatList data={list}  renderItem={({item}) => 
                            <HStack borderBottomWidth="1" space='4' >
                                <Icon size="xl" as={MaterialCommunityIcons} name="cow" width='20%'/>
                                <VStack width="65%">
                                    <Heading>{item.arete}</Heading>
                                    <Text>{item.name}</Text>
                                </VStack> 
                            </HStack>               
                        }
                        keyExtractor={item=>item.id}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                                <Button.Group space={2}>
                                    <Button colorScheme='orange'>Eliminar</Button>
                                    <Button >Agregar</Button>
                                </Button.Group>
                            </Modal.Footer>  
                </Modal.Content>
            </Modal>
        </View>
    );

}

//Screen Sanitario
export const Sanitarios= ({navigation}) =>{
    const [form,setForm] = React.useState({name:'',date:'YYYY-MM-DD'});
    const [errors, setErrors] = React.useState({});
    const [show, setShow] = React.useState({sanitario:false,register:false,delete:false,animals:false,add:false,rm:false});
    const [showPop, setPop] = React.useState({id:false,name:false,date:false});
    const [search, setSearch] = React.useState('');
    const [sanitario, setSanitario] = React.useState({id:0,name:'N/A',date:new Date()});
    const [list, setList] = React.useState([]);

    const mt = useSelector((state) => state.mtr.sanitarios);
    const sanitarios = useSelector((state)=> state.sanitarios);
    const bkp = useSelector((state) => state.bkpSanitarios);
    const hato = useSelector(state => state.hato);
    const ctl_animal = useSelector(state => state.ctl_animal);

    const toast = useToast();
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
        setSanitario(item);
        setShow({...show,sanitario:true});
    }
    const handleUpdate =(type) => {
        console.log(type);
    }
    const handleAnimals = () => {
        var ids = ctl_animal.filter((rel)=>{
            if(rel.ctl == sanitario.id)
                return rel;
        });
        
        var lista = hato.filter((animal)=>{
            for(let i=0; i<=ids.length-1; i++){
                if(ids[i].arete == animal.arete)
                    return true;
            }
        });
        if(lista.length > 0){
            setList(lista);
            setShow({...show,animals:true});
        }else
            toast.show({title:'Vacio',description:'No hay animales'});
    }
    return (
        <View>
            <Box>
                <HStack space={2}>
                    <Input onChangeText={handleSearch} value={search}placeholder="Buscar" variant="filled" width="80%" borderRadius="10" borderWidth="0" InputLeftElement={<Icon ml="2" size="4" color="gray.400" as={<Ionicons name="ios-search" />} />} />
                    <IconButton width='15%' colorScheme='rgb(173, 0, 255)' borderRadius="xl" variant="solid"  size="lg"
                        icon={<Icon  as={MaterialCommunityIcons} name="plus"/>}
                        onPress={()=>setShow({...show,register:true})}
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
                    <Modal.Header>Nuevo control sanitario</Modal.Header>
                    <Modal.Body>
                        <VStack>
                            <FormControl isInvalid={'name' in errors}>
                                <FormControl.Label>Nombre</FormControl.Label>
                                <Input
                                    placeholder='Nombre'
                                    onChangeText={(value) => setForm({...form, name:value})}
                                />
                                {
                                    'name' in errors ? 
                                        <FormControl.ErrorMessage>{errors.name}</FormControl.ErrorMessage>:
                                            <FormControl.HelperText></FormControl.HelperText>
                                }
                            </FormControl>

                            <FormControl isInvalid={'fecha' in errors}>
                                <FormControl.Label>Fecha de aplicación</FormControl.Label>
                                <Pressable  onPress={() => setForm({...form,show:true})}>
                                    <Text fontSize='2xs'>Fecha de aplicacion</Text>
                                    <Text fontSize='md'>{form.date}</Text>
                                    <Divider />
                                </Pressable>        
                                {form.show && (
                                    <DateTimePicker
                                        value={new Date()}
                                        mode='date'
                                        display="default"
                                        onChange={(event, selectedDate) => {
                                            const f = selectedDate;
                                            const currentDate = f.getFullYear() + "-"+ f.getMonth()+ "-" +f.getDate();
                                            setForm({...form,show:false,date:currentDate});
                                           
                                        }}
                                    />
                                )}
                            </FormControl>
                        </VStack>
                    </Modal.Body>
        
                    <Modal.Footer>
                        <Button.Group space={2}>
                            <Button variant="ghost" colorScheme="blueGray" size = 'md' onPress={() => {setShow(false)}}>
                                Cancelar
                            </Button >
                            <Button size='lg' colorScheme='rgb(0, 247, 255)' _text={{color:'white'}} onPress={() => {setShowDel(true);
                            }}>
                                Crear
                            </Button>
                        </Button.Group>
                    </Modal.Footer> 
                </Modal.Content> 
            </Modal>

            <Modal isOpen={show.sanitario} onClose={() => setShow({...show,sanitario:false})} size='full'>
                <Modal.Content >
                    <Modal.CloseButton />
                    <Modal.Header alignSelf="center" _text={{fontSize:'xl',Overridden:'bold'}}>{sanitario.id}</Modal.Header>
                    <Modal.Body >
                        <VStack >
                            <Pressable onPress={() => setPop({...showPop,name:true})}>
                                <Text fontSize='2xs'>Nombre</Text>
                                <Text fontSize='md'>{sanitario.name}</Text>
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
                                            <Button colorScheme="warning" onPress={()=> {
                                                handleUpdate('name');
                                                setPop({...showPop,name:false});
                                            }}>Actualizar</Button>
                                        </Button.Group>
                                    </Modal.Footer>
                                </Modal.Content>
                            </Modal>

                            <Pressable  onPress={() => setPop({...showPop,date:true})}>
                                <Text fontSize='2xs'>Fecha de aplicacion</Text>
                                <Text fontSize='md'>{sanitario.date}</Text>
                                <Divider />
                            </Pressable>        
                            {showPop.date && (
                                <DateTimePicker
                                    value={new Date(sanitario.date)}
                                    mode='date'
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        const f = selectedDate;
                                        const currentDate = f.getFullYear() + "-"+ f.getMonth()+ "-" +f.getDate();
                                        setForm({...form,date:currentDate});
                                        handleUpdate('nac');
                                        setPop({...showPop,date:false});
                                    }}
                                />
                            )}
                        </VStack>
                        
                        
                        <Button 
                            colorScheme='rgb(0, 154, 159)' 
                            _text={{color:'white'}} 
                            leftIcon={<Icon size="md" as={MaterialCommunityIcons} name="cow"/>}
                            onPress = {() => handleAnimals()}
                        >
                            Hato de control
                        </Button>
                            
                    </Modal.Body>
                    <Modal.Footer>
                        
                        <Button.Group space={2}>
                            <Button variant="ghost" colorScheme="blueGray" size = 'md' onPress={() => {setShow(false)}}>
                                Cancelar
                            </Button >
                            <Button size='lg' colorScheme='rgb(255, 37, 0)' _text={{color:'white'}} onPress={() => {setShow({...show,delete:true});
                            }}>
                                Borrar
                            </Button>
                        </Button.Group>
                    </Modal.Footer>

                    <AlertDialog  isOpen={show.delete} onClose={()=>setShow({...show,delete:false})}>
                        <AlertDialog.Content>
                            <AlertDialog.CloseButton />
                            <AlertDialog.Header>Borrar control sanitario</AlertDialog.Header>
                            <AlertDialog.Body>
                                Esto borrará todos los datos relacionados con esta control sanitario. 
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
                </Modal.Content>
            </Modal>

            <Modal isOpen={show.animals} onClose={()=>setShow({...show,animals:false})} size='full' >
                <Modal.Content>
                    <Modal.CloseButton/>
                    <Modal.Header alignContent='center'>Animales</Modal.Header>
                    <Modal.Body>
                        <FlatList data={list}  renderItem={({item}) => 
                            <HStack borderBottomWidth="1" space='4' >
                                <Icon size="xl" as={MaterialCommunityIcons} name="cow" width='20%'/>
                                <VStack width="65%">
                                    <Heading>{item.arete}</Heading>
                                    <Text>{item.name}</Text>
                                </VStack> 
                            </HStack>               
                        }
                        keyExtractor={item=>item.id}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                                <Button.Group space={2}>
                                    <Button colorScheme='orange'>Eliminar</Button>
                                    <Button >Agregar</Button>
                                </Button.Group>
                            </Modal.Footer>  
                </Modal.Content>
            </Modal>
        </View>
    );
}

//Screen Embarazos

export const Embarazos = ({navigation}) => {
    const [form,setForm] = React.useState({show:false,date:'YYYY-MM-DD'});
    const [errors, setErrors] = React.useState({});
    const [show, setShow] = React.useState({embarazo:false,register:false,delete:false,animals:false});
    const [showPop, setPop] = React.useState({id:false,name:false,inicio:false,fin:false});
    const [search, setSearch] = React.useState('');
    const [embarazo, setEmbarazo] = React.useState({id:0,name:'N/A',inicio:'YYYY-MM-DD', fin:'YYYY-MM-DD'});

    const mt = useSelector((state) => state.mtr.embarazos);
    const embarazos = useSelector((state)=> state.embarazos);
    const bkp = useSelector((state) => state.bkpEmbarazos);

    const dispatch = useDispatch();
    
    const filtrar = (search) => {
        var resultado = bkp.filter((embarazo)=>{
            if(embarazo.date.toString().toLowerCase().includes(search.toString().toLowerCase()))
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
                        onPress={()=>setShow({...show,register:true})}
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
                                <FormControl.Label>Fecha de aplicación</FormControl.Label>
                                <Pressable  onPress={() => setForm({...form,show:true})}>
                                    <Text fontSize='2xs'>Fecha de aplicacion</Text>
                                    <Text fontSize='md'>{form.date}</Text>
                                    <Divider />
                                </Pressable>        
                                {form.show && (
                                    <DateTimePicker
                                        value={new Date()}
                                        mode='date'
                                        display="default"
                                        onChange={(event, selectedDate) => {
                                            const f = selectedDate;
                                            const currentDate = f.getFullYear() + "-"+ f.getMonth()+ "-" +f.getDate();
                                            setForm({...form,date:currentDate,show:false});
                                    
                                        }}
                                    />
                                )}
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

export const Pesajes = ({navigation}) => {
    const [form,setForm] = React.useState({show:false, date:'YYYY-MM-DD', kg:0});
    const [errors, setErrors] = React.useState({});
    const [show, setShow] = React.useState({pesaje:false,register:false,delete:false});
    const [showPop, setPop] = React.useState({date:false,kg:false});
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
        setPesaje(item);
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
                        onPress={()=>setShow({...show,register:true})}
                    />
                </HStack>
                <FlatList data={pesajes}  renderItem={({item}) => 
                    <Pressable onPress={() => handlePesaje(item)}>
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
                    <Modal.Header>Nuevo pesaje</Modal.Header>
                    <Modal.Body>
                        <VStack>
                            <FormControl isInvalid={'arete' in errors}>
                                <FormControl.Label>Arete</FormControl.Label>
                                <Input
                                    placeholder='Arete'
                                    onChangeText={(value) => setForm({...form, arete:value})}
                                />
                                {
                                    'arete' in errors ? 
                                        <FormControl.ErrorMessage>{errors.arete}</FormControl.ErrorMessage>:
                                            <FormControl.HelperText></FormControl.HelperText>
                                }
                            </FormControl>

                            <FormControl isInvalid={'kg' in errors}>
                                <FormControl.Label>Peso</FormControl.Label>
                                <Input
                                    placeholder='Peso'
                                    keyboardType='numeric'
                                    onChangeText={(value) => setForm({...form, kg:value})}
                                />
                                {
                                    'arete' in errors ? 
                                        <FormControl.ErrorMessage>{errors.kg}</FormControl.ErrorMessage>:
                                            <FormControl.HelperText></FormControl.HelperText>
                                }
                            </FormControl>

                            <FormControl isInvalid={'fecha' in errors}>
                                <FormControl.Label>Fecha </FormControl.Label>
                                <Pressable  onPress={() => setForm({...form,show:true})}>
                                    <Text fontSize='md'>{form.date}</Text>
                                    <Divider />
                                </Pressable>        
                                {form.show && (
                                    <DateTimePicker
                                        value={new Date()}
                                        mode='date'
                                        display="default"
                                        onChange={(event, selectedDate) => {
                                            const f = selectedDate;
                                            const currentDate = f.getFullYear() + "-"+ f.getMonth()+ "-" +f.getDate();
                                            setForm({...form,show:false,date:currentDate});
                                           
                                        }}
                                    />
                                )}
                            </FormControl>
                        </VStack>
                    </Modal.Body>
        
                    <Modal.Footer>
                        <Button.Group space={2}>
                            <Button variant="ghost" colorScheme="blueGray" size = 'md' onPress={() => {setShow(false)}}>
                                Cancelar
                            </Button >
                            <Button size='lg' colorScheme='rgb(0, 247, 255)' _text={{color:'white'}} onPress={() => {setShowDel(true);
                            }}>
                                Crear
                            </Button>
                        </Button.Group>
                    </Modal.Footer> 
                </Modal.Content> 
            </Modal>

            <Modal isOpen={show.pesaje} onClose={() => setShow({...show,pesaje:false})} size='full'>
                <Modal.Content >
                    <Modal.CloseButton />
                    <Modal.Header alignSelf="center" _text={{fontSize:'xl',Overridden:'bold'}}>{pesaje.arete}</Modal.Header>
                    <Modal.Body >
                        <VStack >
                            <Pressable onPress={() => setPop({...showPop,kg:true})}>
                                <Text fontSize='2xs'>Peso</Text>
                                <Text fontSize='md'>{pesaje.kg}</Text>
                                <Divider />
                            </Pressable> 
                            <Modal isOpen={showPop.kg} onClose={() => setPop({...showPop,kg:false})} size='xl'>
                                <Modal.Content >
                                    <Modal.Header alignContent='center'>Actualizar peso</Modal.Header>
                                    <Modal.Body>
                                        <FormControl>
                                            <Input placeholder='Nuevo peso' keyboardType='numeric' onChangeText={(value)=>{setForm({...form,kg:value})}}/>
                                        </FormControl>
                                    </Modal.Body>
                                    <Modal.Footer >
                                        <Button.Group space={2}>
                                            <Button colorScheme="coolGray" variant="ghost" onPress={()=>setPop({...showPop,kg:false})}> 
                                                Cancel
                                            </Button>
                                            <Button colorScheme="warning" onPress={()=> {
                                                handleUpdate('name');
                                                setPop({...showPop,kg:false});
                                            }}>Actualizar</Button>
                                        </Button.Group>
                                    </Modal.Footer>
                                </Modal.Content>
                            </Modal>

                            <Pressable  onPress={() => setPop({...showPop,date:true})}>
                                <Text fontSize='2xs'>Fecha de aplicacion</Text>
                                <Text fontSize='md'>{pesaje.date}</Text>
                                <Divider />
                            </Pressable>        
                            {showPop.date && (
                                <DateTimePicker
                                    value={new Date(pesaje.date)}
                                    mode='date'
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        const f = selectedDate;
                                        const currentDate = f.getFullYear() + "-"+ f.getMonth()+ "-" +f.getDate();
                                        setForm({...form,date:currentDate});
                                        handleUpdate('nac');
                                        setPop({...showPop,date:false});
                                    }}
                                />
                            )}
                        </VStack>         
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Group space={2}>
                            <Button variant="ghost" colorScheme="blueGray" size = 'md' onPress={() => {setShow(false)}}>
                                Cancelar
                            </Button >
                            <Button size='lg' colorScheme='rgb(255, 37, 0)' _text={{color:'white'}} onPress={() => {setShow({...show,delete:true});
                            }}>
                                Borrar
                            </Button>
                        </Button.Group>
                    </Modal.Footer>

                    <AlertDialog  isOpen={show.delete} onClose={()=>setShow({...show,delete:false})}>
                        <AlertDialog.Content>
                            <AlertDialog.CloseButton />
                            <AlertDialog.Header>Borrar pesaje</AlertDialog.Header>
                            <AlertDialog.Body>
                                Esto borrará todos los datos relacionados con esta pesaje. 
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
                </Modal.Content>
            </Modal>
        </View>
    );
}

//Screen Predios

export const Predios = ( {navitagion}) => {
    const [form,setForm] = React.useState({agua:1,pasto:1});
    const [errors, setErrors] = React.useState({});
    const [show, setShow] = React.useState({predio:false,register:false,delete:false,animals:false});
    const [showPop, setPop] = React.useState({id:false,name:false,agua:false,pasto:false});
    const [search, setSearch] = React.useState('');
    const [predio, setPredio] = React.useState({id:0,name:'N/A',agua:1,pasto:1});
    const [list, setList] = React.useState([]);
    const mt = useSelector((state) => state.mtr.predios);
    const predios = useSelector((state)=> state.predios);
    const bkp = useSelector((state) => state.bkpPredios);
    const pre_animal = useSelector((state) => state.pre_animal);
    const hato = useSelector(state => state.hato);

    const dispatch = useDispatch();
    const toast = useToast();

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
        setPredio(item);
        setShow({...show,predio:true});
    }
    const handleUpdate =(type) => {
        console.log(type);
    }
    const handleAnimals = () => {
        
        var trans = pre_animal.filter((rel)=>{
            if(rel.predio == predio.id)
                return rel;
        });
        
        var rec = trans.filter((tran)=>{
            var ultimo = true;
            var ani = pre_animal.filter((rel)=> {
                if(rel.arete == tran.arete && rel.predio != tran.predio)
                    return true;
            });
            console.log(ani);
            for (i =0; i<=ani.length-1;i++)
                if(new Date(ani[i].date).getDate() > new Date(tran.date).getDate())
                    ultimo = false;
            console.log(ultimo);
            return ultimo
        })
        var lista = hato.filter((animal)=>{
            for(let i=0; i<=rec.length-1; i++){
                if(rec[i].arete == animal.arete)
                    return true;
            }
        });
        if(lista.length > 0){
            setList(lista);
            setShow({...show,animals:true});
        }else
            toast.show({title:'Vacio',description:'No hay animales'});
    } 
    return (
        <View>
            <Box>
                <HStack space={2}>
                    <Input onChangeText={handleSearch} value={search}placeholder="Buscar" variant="filled" width="80%" borderRadius="10" borderWidth="0" InputLeftElement={<Icon ml="2" size="4" color="gray.400" as={<Ionicons name="ios-search" />} />} />
                    <IconButton width='15%' colorScheme='rgb(173, 0, 255)' borderRadius="xl" variant="solid"  size="lg"
                        icon={<Icon  as={MaterialCommunityIcons} name="plus"/>}
                        onPress={()=>setShow({...show,register:true})}
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
                    <Modal.Header>Nuevo predio</Modal.Header>
                    <Modal.Body>
                        <VStack>
                            <FormControl isInvalid={'name' in errors}>
                                <FormControl.Label>Nombre</FormControl.Label>
                                <Input
                                    placeholder='Nombre'
                                    onChangeText={(value) => setForm({...form, name:value})}
                                />
                                {
                                    'name' in errors ? 
                                        <FormControl.ErrorMessage>{errors.name}</FormControl.ErrorMessage>:
                                            <FormControl.HelperText></FormControl.HelperText>
                                }
                            </FormControl>

                        </VStack>
                    </Modal.Body>
        
                    <Modal.Footer>
                        <Button.Group space={2}>
                            <Button variant="ghost" colorScheme="blueGray" size = 'md' onPress={() => {setShow(false)}}>
                                Cancelar
                            </Button >
                            <Button size='lg' colorScheme='rgb(0, 247, 255)' _text={{color:'white'}} onPress={() => {setShowDel(true);
                            }}>
                                Crear
                            </Button>
                        </Button.Group>
                    </Modal.Footer> 
                </Modal.Content> 
            </Modal>

            <Modal isOpen={show.predio} onClose={() => setShow({...show,predio:false})} size='full'>
                <Modal.Content >
                    <Modal.CloseButton />
                    <Modal.Header alignSelf="center" _text={{fontSize:'xl',Overridden:'bold'}}>{predio.id}</Modal.Header>
                    <Modal.Body >
                        <VStack >
                            <Pressable onPress={() => setPop({...showPop,name:true})}>
                                <Text fontSize='2xs'>Nombre</Text>
                                <Text fontSize='md'>{predio.name}</Text>
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
                                            <Button colorScheme="warning" onPress={()=> {
                                                handleUpdate('name');
                                                setPop({...showPop,name:false});
                                            }}>Actualizar</Button>
                                        </Button.Group>
                                    </Modal.Footer>
                                </Modal.Content>
                            </Modal>

                           
                        </VStack>
                        
                        
                        <Button 
                            colorScheme='rgb(0, 154, 159)' 
                            _text={{color:'white'}} 
                            leftIcon={<Icon size="md" as={MaterialCommunityIcons} name="cow"/>}
                            onPress = {() => handleAnimals()}
                        >
                            Ver Hato
                        </Button>
                            
                    </Modal.Body>
                    <Modal.Footer>
                        
                        <Button.Group space={2}>
                            <Button variant="ghost" colorScheme="blueGray" size = 'md' onPress={() => {setShow(false)}}>
                                Cancelar
                            </Button >
                            <Button size='lg' colorScheme='rgb(255, 37, 0)' _text={{color:'white'}} onPress={() => {setShow({...show,delete:true});
                            }}>
                                Borrar
                            </Button>
                        </Button.Group>
                    </Modal.Footer>

                    <AlertDialog  isOpen={show.delete} onClose={()=>setShow({...show,delete:false})}>
                        <AlertDialog.Content>
                            <AlertDialog.CloseButton />
                            <AlertDialog.Header>Borrar predio</AlertDialog.Header>
                            <AlertDialog.Body>
                                Esto borrará todos los datos relacionados con este predio. 
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

                    <Modal isOpen={show.animals} onClose={() => setShow({...show,animals:false})} size='full'>
                        <Modal.Content>
                            <Modal.CloseButton/>
                            <Modal.Header>Hato en el predio</Modal.Header>
                            <Modal.Body>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button.Group space={2}>
                                    <Button colorScheme='orange'>Eliminar</Button>
                                    <Button >Transferir</Button>
                                </Button.Group>
                            </Modal.Footer>    
                        </Modal.Content>
                    </Modal>
                </Modal.Content>
            </Modal>
            <Modal isOpen={show.animals} onClose={()=>setShow({...show,animals:false})} size='full' >
                <Modal.Content>
                    <Modal.CloseButton/>
                    <Modal.Header alignContent='center'>Animales</Modal.Header>
                    <Modal.Body>
                        <FlatList data={list}  renderItem={({item}) => 
                            <HStack borderBottomWidth="1" space='4' >
                                <Icon size="xl" as={MaterialCommunityIcons} name="cow" width='20%'/>
                                <VStack width="65%">
                                    <Heading>{item.arete}</Heading>
                                    <Text>{item.name}</Text>
                                </VStack> 
                            </HStack>               
                        }
                        keyExtractor={item=>item.arete}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                                <Button.Group space={2}>
                                    <Button colorScheme='orange'>Eliminar</Button>
                                    <Button >Agregar</Button>
                                </Button.Group>
                            </Modal.Footer>  
                </Modal.Content>
            </Modal>
        </View>
    );
}

//Screens "Embarques"
export const Embarque = ({navigation}) => {
    const pesajes = useSelector(state => state.pesajes);
    const [hato,setHato] = React.useState([]);
    const [embarque,setEmbarque] = React.useState([]);
    const [vehicles, setVehicles] = React.useState([]);
    const [show, setShow] = React.useState({vehicle:false,solucion:false});
    const [cap, setCap] = React.useState(0);
    const toast = useToast();

    const embarcar = (arete,peso) =>{
        if(embarque.length < 1)
            setEmbarque([{id:arete,kg:peso}].concat(embarque));
        else{
            let check = embarque.filter(animal =>{
                if(animal.id == arete)
                    return true
            });
            if(check.length > 0){
                let newEmb = embarque.filter(animal =>{
                    if(animal.id != arete)
                        return true
                });
                setEmbarque(newEmb);
            }else
                setEmbarque([{id:arete,kg:peso}].concat(embarque));
        } 
    }
    const addVehicle = (capacidad) =>{
        num = vehicles.length;
        setVehicles([{id:num,kg:capacidad}].concat(vehicles));
        setShow({...show,vehicle:false});
    }
    const delVehicle = (id) => {
        list = vehicles.filter(vehicle =>{
            if(vehicle.id != id)
                return true
        })
        setVehicles(list);
    }
    const filterPesajes = () => {
        let tem = [];
        pesajes.forEach(pesaje => {
            if(tem.length === 0)
                tem.push(pesaje);
            else{
                for(var i = 0; i<=tem.length-1; i++){
                    if(pesaje.arete == tem[i].arete){
                        if(pesaje.date > tem[i].date){
                            tem[i].kg = pesaje.kg;
                            tem[i].date = pesaje.date;
                        }
                    }
                    else if(i == tem.length-1){
                        tem.push({...pesaje,check:false})
                    }
                }
            }
        })
        setHato(tem);
    }
    const handleOptimizar = () => {
        if(embarque.length < 1)
            toast.show({title:'Hato vacio',status:'error',description:'Agrega ganado al embarque'});
        else
            if(vehicles.length < 1)
                toast.show({title:'No hay vehiculo',status:'error',description:'Agrega transporte al embarque'});
            else{
                console.log(embarque);
            }
    }
    React.useEffect(()=>{filterPesajes()},[]);
    return(
        <Box display="flex" flexDirection="column" minH='100%'>
            <Box maxH='40%'>
                <Heading>Hato</Heading>
                <FlatList data={hato}  renderItem={({item}) => 
                    <Checkbox value={item.kg} onChange={()=>{embarcar(item.arete,item.kg)}}colorScheme="orange" size="md" icon={<Icon as={<MaterialCommunityIcons name="truck" />} />}>
                        {item.arete}:{item.kg} kg
                    </Checkbox>
                    }
                    keyExtractor={item=>item.id}
                /> 
            </Box>
            <Box maxH='40%'>
                <HStack w="100%" justifyContent="space-between" alignItems="center">
                    <Heading>Vehiculos</Heading>
                    <IconButton colorScheme="trueGray" 
                        icon={<Icon as={MaterialCommunityIcons} name="plus" size="md" color="trueGray.400" />} 
                    onPress={() => setShow({...show,vehicle:true})} 
                    />
                </HStack>
        
                <FlatList data={vehicles} inverted={true}  renderItem={({item}) => 
                    <HStack w="100%" justifyContent="space-between" alignItems="center">
                        <Text >
                            {item.id+1}: {item.kg} kg
                        </Text>
                        <IconButton colorScheme="trueGray" 
                            icon={<Icon as={MaterialCommunityIcons} name="minus" size="sm" color="trueGray.400" />} 
                            onPress={() => delVehicle(item.id)} 
                        />
                    </HStack>
                    }
                    keyExtractor={item=>item}    
                />     
            </Box>
            <Box>
                <Button onPress={()=> handleOptimizar()}>Optimizar</Button>   
            </Box>
                     
            <Modal size='md' isOpen={show.vehicle} onClose={()=>setShow({...show,vehicle:false})}>
                <Modal.Content>
                    <Modal.CloseButton/>
                    <Modal.Header>Nuevo vehiculo</Modal.Header>
                    <Modal.Body>
                        <Input
                            placeholder='Capacidad'
                            keyboardType='numeric'
                            onChangeText={(value) => setCap(value)}
                        />
                    </Modal.Body>
        
                    <Modal.Footer>
                        <Button.Group space={2}>
                            <Button variant="ghost" colorScheme="blueGray" size = 'md' onPress={() => {setShow(false)}}>
                                Cancelar
                            </Button >
                            <Button size='lg' colorScheme='rgb(0, 247, 255)' 
                                _text={{color:'white'}} 
                                onPress={() => {addVehicle(cap)}}s
                            >
                                Agregar
                            </Button>
                        </Button.Group>
                    </Modal.Footer> 
                </Modal.Content> 
            </Modal>
        </Box>
     
           
      
    );
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
            <Box bgColor='#DEDDDA' >
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
            
            <Button.Group space={2}>
                <VStack width='100%'>
                    <Button  variant='outline' colorScheme='orange'>Cerrar sesión</Button>
                    <Button  variant='outline' colorScheme='red'>Eliminar cuenta</Button>
                </VStack>
                
            </Button.Group>
        </Box>
    );
}
