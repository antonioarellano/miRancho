import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';
import React from 'react';
import {NativeBaseProvider} from 'native-base';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import * as screens from './screens';

import { Provider } from 'react-redux';
import Store from './ranchoStore';

const NavLogin = createNativeStackNavigator();
const NavRancho = createDrawerNavigator();
const NavMain = createNativeStackNavigator();

const Inicio = ({navigation}) => {
  return(          
    <NavLogin.Navigator screenOptions={{headerShown: false}} initialRouteName="getData">
      <NavLogin.Screen options={{title: 'Cargando'}} name='getData' component={screens.GetRancho}/>
      <NavLogin.Screen options={{title: 'Mi Rancho'}} name='login' component={screens.LogIn}/>
      <NavLogin.Screen options={{title: 'Crear cuenta'}}name='singin' component={screens.SingIn}/>
      <NavLogin.Screen options={{title: 'Terminos y condiciones'}}name='terms' component={screens.Terms}/>
    </NavLogin.Navigator>
  );
}

const Rancho = ({navigation}) => {
  return (
    <NavRancho.Navigator initialRouteName="Perfil">
        <NavRancho.Screen name='Ganado' component={screens.Hato}/>
        <NavRancho.Screen name='Vacunas' component={screens.Vacunas}/>
        <NavRancho.Screen name='Sanitarios' component={screens.Sanitarios}/>
        <NavRancho.Screen name='Embarazos' component={screens.Embarazos}/>
        <NavRancho.Screen name='Pesajes' component={screens.Pesajes}/>
        <NavRancho.Screen name='Predios' component={screens.Predios}/>
        <NavRancho.Screen name='Embarques' component={screens.newEmbarque}/>
        <NavRancho.Screen name='Configuración' component={screens.Configuracion}/>
    </NavRancho.Navigator>
  );
}

const store = Store();

export default function App() {
  return (
          <Provider store={store}>
            <NativeBaseProvider>
              <NavigationContainer>
                <NavLogin.Navigator screenOptions={{headerShown: false}}>
                  <NavMain.Screen name='inicio' component={Inicio} />
                  <NavMain.Screen name='rancho' component={Rancho} />
                </NavLogin.Navigator>
              </NavigationContainer>
            </NativeBaseProvider>
          </Provider>
  );
}
