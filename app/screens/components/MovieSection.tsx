import React from 'react';
import { View, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { GradientBackground } from './GradientBackground';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MediaStackParamList } from '@/app/navigation/MediaStack';


type Movie = {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
};

type Props = {
  title: string;
  data: Movie[];
  onPress?: (movie: Movie) => void;
};


const MovieSection = ({ title, data, onPress }: Props) => {
  const navigation = useNavigation<StackNavigationProp<MediaStackParamList, 'MovieDetails'>>();
  const theme = useTheme();

  return (
    <View style={styles.gradientWrapper}>
      <GradientBackground palette="green" variant={1}>
      <Text style={styles.genreTitle}>{title}</Text>
          <FlatList
            data={data}
            horizontal
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity 
              onPress={() => navigation.navigate('MovieDetails', { movieId: item.id })}
              style={styles.itemWrapper}>

                <View style={styles.itemContent}>
                  <Image
                    source={{ uri: `https://image.tmdb.org/t/p/w185${item.poster_path}` }}
                    style={styles.poster}
                  />
                  <Text numberOfLines={2} style={styles.movieTitle}>
                    {item.title}
                  </Text>
                  <Text style={styles.movieMeta}>
                    {item.vote_average.toFixed(1)} ★   {item.release_date?.slice(0, 4) || 'N/A'}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
          />
        </GradientBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  genreTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 32,
    marginBottom: 12,
    color: '#fff',
  },
  gradientWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    marginHorizontal: 0,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#000000'
  },
  itemWrapper: {
    marginHorizontal: 8,
  },
  itemContent: {
    alignItems: 'center',
    width: 120,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 8,
  },
  movieTitle: {
    marginTop: 6,
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  movieMeta: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 2,
    textAlign: 'center',
  },
});

export default MovieSection;
