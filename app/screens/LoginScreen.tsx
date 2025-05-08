import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Alert, ImageBackground, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../database/firebase';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Text, Button, TextInput, useTheme, Card } from 'react-native-paper';
import { GradientBackground } from './components/GradientBackground';

type LoginScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Login'>;
};

type User = {
  id: string;
  name: string;
  profileImageUrl?: string;
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [name, setName] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [showCreateUser, setShowCreateUser] = useState(false);

  const theme = useTheme();

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
    checkLoginStatus();
  }, []);

  const handleUserSelect = async (user: User) => {
    await AsyncStorage.setItem('userName', user.name);
    await AsyncStorage.setItem('userId', user.id);
    if (user.profileImageUrl) {
      await AsyncStorage.setItem('userImageUrl', user.profileImageUrl); // ✅ Add this
    }
    console.log('Logged in as:', user.name);
    navigation.replace('MainMenu');
  };
  

  const handleCreateUser = async () => {
    if (!name.trim()) {
      Alert.alert('Please enter a name');
      return;
    }
  
    try {
      const profileImageUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}&background=0D8ABC&color=fff`;
  
      const newUserRef = await addDoc(collection(db, 'users'), {
        name: name.trim(),
        profileImageUrl,
        createdAt: serverTimestamp(),
      });
  
      await AsyncStorage.setItem('userName', name.trim());
      await AsyncStorage.setItem('userId', newUserRef.id);
      console.log('Created and logged in as:', name.trim());
      navigation.replace('MainMenu');
    } catch (err) {
      Alert.alert('Error creating user', (err as Error).message);
    }
  };
  

  return (
    <GradientBackground palette='green' variant={0}>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="titleLarge" style={styles.heading}>Select an Existing User</Text>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        horizontal
        contentContainerStyle={styles.userList}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleUserSelect(item)}>
            <Card style={styles.userCard} mode="contained">
              <ImageBackground
                source={{ uri: item.profileImageUrl || 'https://via.placeholder.com/150' }}
                style={styles.cardImage}
                resizeMode='cover'
                imageStyle={{ borderRadius: 16 }}
              >
                <View style={styles.overlay}>
                  <Text variant="titleMedium" style={styles.userName}>
                    {item.name}
                  </Text>
                </View>
              </ImageBackground>
            </Card>
          </TouchableOpacity>
        )}
        />

      <Button
        mode="contained"
        style={styles.newUserButton}
        onPress={() => setShowCreateUser(!showCreateUser)}
      >
        {showCreateUser ? 'Cancel' : 'New User'}
      </Button>

      {showCreateUser && (
        <View style={styles.createUserSection}>
          <Text variant="titleMedium" style={styles.subHeading}>Enter a new name:</Text>
          <TextInput
            mode="outlined"
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <Button mode="contained" onPress={handleCreateUser} style={styles.createButton}>
            Create & Continue
          </Button>
        </View>
      )}
      </View>
    </GradientBackground>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 100,
    alignItems: 'center',
  },
  heading: {
    marginBottom: 10,
    textAlign: 'center',
  },
  userList: {
    paddingVertical: 10,
  },
  userCard: {
    width: 300,
    height: 480,
    marginHorizontal: 10,
    borderRadius: 16,
    overflow: 'hidden',
  },
  newUserButton: {
    marginVertical: 10,
    width: '80%',
  },
  subHeading: {
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  createUserSection: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    marginBottom: 10,
  },
  createButton: {
    width: '80%',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ffffff44', // semi-transparent white
    marginBottom: 12,
  },
  userName: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  overlay: {
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  paddingVertical: 10,
  alignItems: 'center',
  },
});
