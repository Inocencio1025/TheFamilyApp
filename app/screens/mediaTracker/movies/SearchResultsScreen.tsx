import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { fetchMoviesBySearch } from '../../../api/tmdb';
import { GradientBackground } from '../../components/GradientBackground';
import { RouteProp } from '@react-navigation/native';
import { MediaStackParamList } from '../../../navigation/MediaNavigator'; // adjust path as needed
import MovieSection from '../../components/MovieSection';

type SearchScreenRouteProp = RouteProp<MediaStackParamList, 'MovieSearch'>;

type Props = {
  route: SearchScreenRouteProp;
};

const SearchResultsScreen = ({ route }: Props) => {
  const { query } = route.params;
  const [results, setResults] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await fetchMoviesBySearch(query);
      setResults(data.results || []);
    })();
  }, [query]);

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.container}>
        {results.length > 0 ? (
          <MovieSection title={`Results for "${query}"`} data={results} />
        ) : (
          <Text style={styles.emptyText}>No results found for "{query}"</Text>
        )}
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  emptyText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    marginTop: 50,
  },
});

export default SearchResultsScreen;
