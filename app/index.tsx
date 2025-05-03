import React from 'react';
import { useFonts } from 'expo-font';
import AppNavigator from './navigation/AppNavigator';
import { Text } from 'react-native';

export default function App() {
  const [fontsLoaded] = useFonts({
    'PixelSans': require('../assets/fonts/PixelifySans-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>; // Show a loading message while fonts are loading
  }

  return (
    <AppNavigator />
  );
}
