
import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {NativeBaseProvider} from 'native-base';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import * as screens from './screens';
import { UserContext } from './UserContext';

const NavLogin = createNativeStackNavigator();
const NavRancho = createDrawerNavigator();
const NavMain = createNativeStackNavigator();


const Inicio = ({navigation}) => {
  return(          
    <NavLogin.Navigator>
      <NavLogin.Screen name='login' component={screens.LogIn}/>
      <NavLogin.Screen name='singin' component={screens.SingIn}/>
      <NavLogin.Screen name='terms' component={screens.Terms}/>
    </NavLogin.Navigator>
  );
}
const Rancho = ({navigation}) => {
  return (
    <NavRancho.Navigator initialRouteName="Ganado">
        <NavRancho.Screen name='Ganado' component={screens.Ganado}/>
        
    </NavRancho.Navigator>
  );
}
/*
<NavRancho.Screen name='vacunas' component={screens.Vacunas}/>
        <NavRancho.Screen name='ctlSanitario' component={screens.ControlSan}/>
        <NavRancho.Screen name='embarazo' component={screens.ControlRep}/>
        <NavRancho.Screen name='pesaje' component={screens.Pesaje}/>
        <NavRancho.Screen name='predios' component={screens.Predio}/>
        <NavRancho.Screen name='configuracion' component={screens.Configuracion}/>
*/
export default function App() {
  const [user, setUser] = useState(null);
  const providerValue = useMemo(()=> ({user,setUser}), [user,setUser]);
  return (
    <NativeBaseProvider >
      <UserContext.Provider value= {providerValue}>
        <NavigationContainer>
          <NativeBaseProvider>
          <NavLogin.Navigator screenOptions={{headerShown: false}}>
            <NavMain.Screen name='inicio' component={Inicio} />
            <NavMain.Screen name='rancho' component={Rancho} />
          </NavLogin.Navigator>
          </NativeBaseProvider>
        </NavigationContainer>
        
      </UserContext.Provider>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
