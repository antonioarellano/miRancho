
import React, { useState, useMemo } from 'react';
import {NativeBaseProvider} from 'native-base';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { ranchoReducer } from './ranchoReducer';
import * as screens from './screens';

const ranchoStore = createStore(ranchoReducer);


const NavLogin = createNativeStackNavigator();
const NavConfig = createNativeStackNavigator();
const NavEmbarque = createNativeStackNavigator();
const NavRancho = createDrawerNavigator();
const NavMain = createNativeStackNavigator();


const Inicio = ({navigation}) => {
  return(          
    <NavLogin.Navigator>
      <NavLogin.Screen options={{title: 'Mi Rancho'}} name='login' component={screens.LogIn}/>
      <NavLogin.Screen options={{title: 'Crear cuenta'}}name='singin' component={screens.SingIn}/>
      <NavLogin.Screen options={{title: 'Terminos y condiciones'}}name='terms' component={screens.Terms}/>
      <NavLogin.Screen options={{title: 'Recuperar contraseña'}} name='recPass' component={screens.RecPass}/>
    </NavLogin.Navigator>
  );
}
const Embarques = ({navigation}) => {
  return (
    <NavEmbarque.Navigator>
      <NavEmbarque.Screen options={{headerShown: false}} name='newEmbarque' component={screens.newEmbarque}/>
      <NavEmbarque.Screen options={{title: ''}} name='setEmbarque' component={screens.setEmbarque}/>
      <NavEmbarque.Screen options={{title: ''}} name='getEmbarque' component={screens.getEmbarque}/>
    </NavEmbarque.Navigator>
  );
}
const Configuracion = ({navigation}) => {
  return (
    <NavConfig.Navigator >
      <NavConfig.Screen options={{headerShown: false}} name='Configuración' component={screens.Configuracion}/>
      <NavConfig.Screen options={{title: ''}}name='setConfig' component={screens.setConfig}/>
    </NavConfig.Navigator>
  );
}
const Rancho = ({navigation}) => {
  return (
    <NavRancho.Navigator initialRouteName="Ganado">
        <NavRancho.Screen name='Ganado' component={screens.Ganado}/>
        <NavRancho.Screen name='Vacunas' component={screens.Vacunas}/>
        <NavRancho.Screen name='Controles sanitarios' component={screens.ControlSan}/>
        <NavRancho.Screen name='Controles reproductivos' component={screens.ControlRep}/>
        <NavRancho.Screen name='Pesajes' component={screens.Pesaje}/>
        <NavRancho.Screen name='Predios' component={screens.Predio}/>
        <NavRancho.Screen name='Embarques' component={Embarques}/>
        <NavRancho.Screen name='Configuración' component={Configuracion}/>
    </NavRancho.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const providerValue = useMemo(()=> ({user,setUser}), [user,setUser]);
  return (
    <NativeBaseProvider >
        <Provider store={ranchoStore}>
        <NavigationContainer>
          <NativeBaseProvider>
          <NavLogin.Navigator screenOptions={{headerShown: false}}>
            <NavMain.Screen name='rancho' component={Rancho} />
            <NavMain.Screen name='inicio' component={Inicio} />
          </NavLogin.Navigator>
          </NativeBaseProvider>
        </NavigationContainer>
        </Provider>
    </NativeBaseProvider>
  );
}