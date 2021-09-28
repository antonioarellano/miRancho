
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {NativeBaseProvider} from 'native-base';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import * as screens from './screens';

const NavLogin = createNativeStackNavigator();
const NavPrincipal = createDrawerNavigator();

const Inicio = () => {
  return(
    <NavigationContainer>
      <NavLogin.Navigator>
        <NavLogin.Screen name='login' component={screens.LogIn}/>
        <NavLogin.Screen name='singin' component={screens.SingIn}/>
        <NavLogin.Screen name='terms' component={screens.Terms}/>
      </NavLogin.Navigator>
    </NavigationContainer>
  );
}
const Principal = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Feed" component={Feed} />
      <Drawer.Screen name="Article" component={Article} />
    </Drawer.Navigator>
  );
}
export default function App() {
  return (
    <NativeBaseProvider >
      <Inicio/>
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
