import React, { useEffect, useState } from 'react';
import { View, Image, ScrollView, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { fetchMovieDetails } from '../../../api/tmdb';
import { GradientBackground } from '../../components/GradientBackground';

const MovieDetailsScreen = ({ route }: any) => {
  const { movieId } = route.params;
  const [movie, setMovie] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const data = await fetchMovieDetails(movieId);
      setMovie(data);
    })();
  }, [movieId]);

  if (!movie) return null;

  return (
    <GradientBackground palette="green" variant={0}>
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
});

export default MovieDetailsScreen;
