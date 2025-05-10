import React, { useState, useEffect } from 'react';
import { Provider as PaperProvider, MD3DarkTheme as DefaultTheme } from 'react-native-paper';
import AppNavigator from './navigation/AppNavigator';
import { useFonts } from 'expo-font';
import { StatusBar, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#88d498', 
    secondary: '#f3e9d2',
    background: '#transparent', // needed for gradient
    surface: '#c6dabf',
    text: '#ffffff', 
    error: '#1a936f', 
    outline: '114b5f',
    
  },
  fonts: {
    ...DefaultTheme.fonts,
    bodyLarge: {
      ...DefaultTheme.fonts.bodyLarge,
      fontFamily: 'PixelifySans', // Apply custom font globally
      fontSize: 32, // Increase font size for body text

    },
    titleLarge: {
      ...DefaultTheme.fonts.titleLarge,
      fontFamily: 'PixelifySans',
      fontSize: 24, // Increase font size for body text

    },
    labelLarge: {
      ...DefaultTheme.fonts.labelLarge,
      fontFamily: 'PixelifySans',
      fontSize: 24, // Increase font size for body text

    },
  },
};

export default function Index() {
  const [fontsLoaded] = useFonts({
    PixelifySans: require('../assets/fonts/PixelifySans-Regular.ttf'),
  });

  // Set up a state to manage the loading process
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (fontsLoaded) {
      setIsReady(true); // Once fonts are loaded, set isReady to true
    }
  }, [fontsLoaded]);

  if (!isReady) {
    return null; // Or a loading spinner or placeholder component
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <View style={{ flex: 1 }}>
          <StatusBar
            barStyle="light-content"
            backgroundColor="transparent"
            translucent
          />
          <AppNavigator />
        </View>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
