import React, { useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Button, useTheme, IconButton } from 'react-native-paper'; // useTheme gives access to theme colors
import { GradientBackground } from './components/GradientBackground';
import { useNavigation, DrawerActions } from '@react-navigation/native';

type MainMenuNavigationProp = StackNavigationProp<RootStackParamList, 'MainMenu'>;

type Props = {
  navigation: MainMenuNavigationProp;
};

const logout = async (navigation: MainMenuNavigationProp) => {
  try {
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('userName');
    navigation.replace('Login');
  } catch (error) {
    Alert.alert('Error', 'An error occurred while logging out');
  }
};

export default function MainMenuScreen({ navigation }: Props) {
  const theme = useTheme();

  useEffect(() => {
    const setHeader = async () => {
      const userName = await AsyncStorage.getItem('userName');
      navigation.setOptions({
        title: userName ? `Welcome Back, ${userName}!` : 'Main Menu',
        headerRight: () => (
          <IconButton
            icon="menu"
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            iconColor="white"
            size={24}
          />
        ),
      });
    };
  
    setHeader();
  }, [navigation]);
  
  return (
    <GradientBackground>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('FamilySchedule')}
          style={[styles.button, { backgroundColor: theme.colors.secondary }]} // Primary color
          contentStyle={styles.buttonContent}
        >
          Family Schedule
        </Button>

        <Button
          mode="contained"
          onPress={() => navigation.navigate('MediaTracker')}
          style={[styles.button, { backgroundColor: theme.colors.secondary }]} // Secondary color
          contentStyle={styles.buttonContent}
        >
          Media Tracker
        </Button>

        <Button
          mode="contained"
          onPress={() => navigation.navigate('MediaTracker')}
          style={[styles.button, { backgroundColor: theme.colors.secondary }]} // Secondary color
          contentStyle={styles.buttonContent}
        >
          Memory Jar
        </Button>

        <Button
          mode="contained"
          onPress={() => logout(navigation)}
          buttonColor={theme.colors.error} // use theme's error color for logout
          style={[styles.button, { backgroundColor: theme.colors.error }]}
          contentStyle={styles.buttonContent}
        >
          Logout
        </Button>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
    paddingHorizontal: 40,
  },
  button: {
    borderRadius: 30,  // Increased borderRadius for pill shape
    elevation: 3,      // Adds a slight shadow/elevation for a material look
    width: '100%',     // Ensures button takes up full width of its container
    borderWidth: 2,
    borderColor: "black"
  },
  buttonContent: {
    paddingVertical: 12,
    paddingHorizontal: 20,  // Adjust padding inside the button
  },
});
