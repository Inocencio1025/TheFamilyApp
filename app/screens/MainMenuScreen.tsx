import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

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
  useEffect(() => {
    const setHeaderTitle = async () => {
      const userName = await AsyncStorage.getItem('userName');
      if (userName) {
        navigation.setOptions({ title: `Welcome Back, ${userName}!` });
      }
    };

    setHeaderTitle();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('FamilySchedule')}>
        <Text style={styles.buttonText}>Family Schedule</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MediaTracker')}>
        <Text style={styles.buttonText}>Media Tracker</Text>
      </TouchableOpacity>

      {/* Logout button as TouchableOpacity */}
      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={() => logout(navigation)}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
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
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
