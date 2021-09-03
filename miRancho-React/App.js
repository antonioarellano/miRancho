
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, NativeBaseProvider, Box, Center } from 'native-base';
export default function App() {
  return (
    <NativeBaseProvider >
      <Center>
        <Box><Text>Hola</Text></Box>
        <Button>Hola</Button>
      </Center>
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
