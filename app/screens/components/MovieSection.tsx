import React from 'react';
import { View, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import { GradientBackground } from './GradientBackground';

type Movie = {
  id: number;
  title: string;
  poster_path: string;
};

type Props = {
  title: string;
  data: Movie[];
  onPress?: (movie: Movie) => void;
};

const MovieSection = ({ title, data, onPress }: Props) => {
  return (
    <View style={{ marginVertical: 10 }}>
      <Text style={styles.genreTitle}>{title}</Text>
      <GradientBackground palette="green" variant={1}>        
        <FlatList
          data={data}
          
          horizontal
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => onPress?.(item)} style={{ margin: 8 }}>
              <Image
                source={{ uri: `https://image.tmdb.org/t/p/w185${item.poster_path}` }}
                style={{ width: 120, height: 180, borderRadius: 8 }}
              />
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
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    marginBottom: 4,
    color: '#fff',
  },

  
});

export default MovieSection;
