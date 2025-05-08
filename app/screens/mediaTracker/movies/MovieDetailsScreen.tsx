import React, { useEffect, useState } from 'react';
import { View, Image, ScrollView, StyleSheet } from 'react-native';
import { Text, FAB, useTheme } from 'react-native-paper';
import { fetchMovieDetails } from '../../../api/tmdb';
import { GradientBackground } from '../../components/GradientBackground';
import AsyncStorage from '@react-native-async-storage/async-storage';


const checkIfMovieIsSaved = async (movieId: number) => {
  const userId = await AsyncStorage.getItem('userId');
  if (!userId) return false;

  const key = `${userId}_movies`;
  const savedMovies = JSON.parse(await AsyncStorage.getItem(key) || '[]');
  return savedMovies.some((m: any) => m.movieId === movieId);
};

const MovieDetailsScreen = ({ route }: any) => {
  const { movieId } = route.params;
  const [movie, setMovie] = useState<any>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [user, setUser] = useState<any>(null);

  const theme = useTheme();

  useEffect(() => {
    (async () => {
      try {
        console.log('Fetching details for movie ID:', movieId);
        const data = await fetchMovieDetails(movieId);
        setMovie(data);
  
        const saved = await checkIfMovieIsSaved(movieId);
        setIsSaved(saved);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    })();
  }, [movieId]);
  

  const handleSaveMovie = async () => {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId || !movie) return;
  
    const key = `${userId}_movies`;
    const existing = JSON.parse(await AsyncStorage.getItem(key) || '[]');
  
    const alreadySaved = existing.some((m: any) => m.movieId === movie.id);
  
    if (alreadySaved) {
      // Remove the movie
      const updated = existing.filter((m: any) => m.movieId !== movie.id);
      await AsyncStorage.setItem(key, JSON.stringify(updated));
      setIsSaved(false);
      console.log('Movie removed from saved list');
    } else {
      // Save the movie
      const newMovie = {
        movieId: movie.id,
        status: 'planned',
        savedAt: new Date().toISOString(),
      };
      const updated = [...existing, newMovie];
      await AsyncStorage.setItem(key, JSON.stringify(updated));
      setIsSaved(true);
      console.log('Movie saved');
    }
  };
  
  

  if (!movie) return null;

  return (
    <GradientBackground palette="green" variant={0}>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <Image
            source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
            style={styles.poster}
          />
          <Text style={styles.title}>{movie.title}</Text>
          <Text style={styles.info}>
            {movie.release_date?.slice(0, 4)} · {movie.vote_average?.toFixed(1)} ★ · {movie.runtime} min
          </Text>
          <Text style={styles.overview}>{movie.overview}</Text>
        </ScrollView>

        <FAB
          icon={isSaved ? 'check' : 'bookmark-plus'}
          label={isSaved ? 'Saved' : 'Watch Later'}
          onPress={handleSaveMovie}
          style={[
            styles.fab,
            { backgroundColor: isSaved ? theme.colors.secondary : theme.colors.primary },
          ]}
          color={theme.colors.onPrimary}
        />
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  poster: {
    width: 300,
    height: 450,
    borderRadius: 10,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  info: {
    color: '#aaa',
    fontSize: 16,
    marginBottom: 10,
  },
  overview: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 40,
    backgroundColor: '#0D8ABC',
  },
});

export default MovieDetailsScreen;
