import React, { useEffect, useState } from 'react';
import { View, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, useTheme } from 'react-native-paper';
import { fetchMovieDetails } from '../../../api/tmdb';
import { GradientBackground } from '../../components/GradientBackground';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MediaStackParamList } from '@/app/navigation/MediaStack';
import { RefreshControl } from 'react-native';

type NavigationProp = StackNavigationProp<MediaStackParamList, 'PlannedScreen'>;

const PlannedScreen = () => {
  const [plannedMovies, setPlannedMovies] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false); // For handling refresh state

  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const loadPlannedMovies = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;

      const saved = JSON.parse(await AsyncStorage.getItem(`${userId}_movies`) || '[]');
      const plannedOnly = saved.filter((m: any) => m.status === 'planned');

      const detailedMovies = await Promise.all(
        plannedOnly.map(async (entry: any) => {
          try {
            const data = await fetchMovieDetails(entry.movieId);
            return { ...data, savedAt: entry.savedAt };
          } catch {
            return null;
          }
        })
      );

      setPlannedMovies(detailedMovies.filter(Boolean)); // Remove failed fetches
    };

    loadPlannedMovies();
  }, []);

  const renderItem = ({ item }: any) => (
    <TouchableOpacity 
      onPress={() => navigation.navigate('MovieDetails', { movieId: item.id })}>
      
      <View style={styles.card}>
        <Image source={{ uri: `https://image.tmdb.org/t/p/w300${item.poster_path}` }} style={styles.poster} />
        <Text style={styles.title}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  // Function to handle pull to refresh
  const fetchMovies = async () => {
    setIsRefreshing(true); // Start refreshing
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) return;

    const saved = JSON.parse(await AsyncStorage.getItem(`${userId}_movies`) || '[]');
    const plannedOnly = saved.filter((m: any) => m.status === 'planned');

    const detailedMovies = await Promise.all(
      plannedOnly.map(async (entry: any) => {
        try {
          const data = await fetchMovieDetails(entry.movieId);
          return { ...data, savedAt: entry.savedAt };
        } catch {
          return null;
        }
      })
    );

    setPlannedMovies(detailedMovies.filter(Boolean)); // Remove failed fetches
    setIsRefreshing(false); // Stop refreshing
  };

  return (
    <GradientBackground palette="green" variant={0}>
      <FlatList
        data={plannedMovies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={fetchMovies} />
        }
      />
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 20,
    alignItems: 'center',
  },
  poster: {
    width: 180,
    height: 270,
    borderRadius: 10,
    marginBottom: 8,
  },
  title: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default PlannedScreen;
