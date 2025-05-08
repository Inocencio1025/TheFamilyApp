// MMDrawerContent.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MMDrawerContent(props: any) {
  const [userName, setUserName] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      const name = await AsyncStorage.getItem('userName');
      const image = await AsyncStorage.getItem('userImageUrl'); // or use a default if not set
      
      setUserName(name || 'Guest');
      setProfileImageUrl(
        image || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Guest')}&background=0D8ABC&color=fff`
      );
    };
    loadUser();
  }, []);

  return (
    <DrawerContentScrollView {...props}>
      <Text style={styles.drawerTitle}>The Family App</Text>
      <View style={styles.header}>
        <Image source={{ uri: profileImageUrl }} style={styles.avatar} />
        <Text style={styles.name}>{userName}</Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'black',
  },
  avatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
    marginBottom: 10,
    backgroundColor: '#ccc',
  },
  name: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  drawerTitle: {
    color: 'white',
    textAlign: 'center',
    fontSize: 24,
    fontFamily: "PixelifySans"
  },
});
