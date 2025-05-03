import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../database/firebase';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type LoginScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Login'>;
};

type User = {
  id: string;
  name: string;
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [name, setName] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [showCreateUser, setShowCreateUser] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const fetchedUsers: User[] = [];
      querySnapshot.forEach(doc => {
        fetchedUsers.push({ id: doc.id, ...doc.data() } as User);
      });
      setUsers(fetchedUsers);
    };

    const checkLoginStatus = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        console.log('User is already logged in');
        navigation.replace('MainMenu');
      } else {
        console.log('No user logged in');
      }
    };

    fetchUsers();
    checkLoginStatus();  // Check if the user is already logged in
  }, []);

  const handleUserSelect = async (user: User) => {
    await AsyncStorage.setItem('userName', user.name);
    await AsyncStorage.setItem('userId', user.id);
    console.log('Logged in as:', user.name);  // Log the user on login
    navigation.replace('MainMenu');
  };

  const handleCreateUser = async () => {
    if (!name.trim()) {
      Alert.alert('Please enter a name');
      return;
    }

    try {
      const newUserRef = await addDoc(collection(db, 'users'), {
        name: name.trim(),
        createdAt: serverTimestamp(),
      });

      await AsyncStorage.setItem('userName', name.trim());
      await AsyncStorage.setItem('userId', newUserRef.id);
      console.log('Created and logged in as:', name.trim());  // Log new user creation
      navigation.replace('MainMenu');
    } catch (err) {
      Alert.alert('Error creating user', (err as Error).message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Select an Existing User</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.userButton} onPress={() => handleUserSelect(item)}>
            <Text style={styles.userText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity onPress={() => setShowCreateUser(!showCreateUser)}>
        <Text style={styles.button}>New User</Text>
      </TouchableOpacity>

      {showCreateUser && (
        <View style={styles.createUserSection}>
          <Text style={styles.subHeading}>Enter a new name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
          />
          <Button title="Create & Continue" onPress={handleCreateUser} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 100,
  },
  heading: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  subHeading: {
    marginTop: 30,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    width: '80%',
  },
  userButton: {
    maxHeight: 75,
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    marginVertical: 10,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userText: {
    fontSize: 16,
    color: 'white',
  },
  button: {
    backgroundColor: '#007BFF',
    width: '80%',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'PixelSans'
  },
  createUserSection: {
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  },
});
