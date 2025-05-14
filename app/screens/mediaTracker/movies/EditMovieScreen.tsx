import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { GradientBackground } from '../../components/GradientBackground';
import {
  Text,
  TextInput,
  Button,
  useTheme,
  Title,
} from 'react-native-paper';

const EditMovieScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { movieId } = route.params as { movieId: number };

  const [reflection, setReflection] = useState('');
  const [rating, setRating] = useState(5);
  const [photoUri, setPhotoUri] = useState('');
  const [posterPath, setPosterPath] = useState('');
  const theme = useTheme();

  useEffect(() => {
    const loadMovie = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;

      const saved = JSON.parse(await AsyncStorage.getItem(`${userId}_movies`) || '[]');
      const target = saved.find((m: any) => m.movieId === movieId);
      if (target) {
        setReflection(target.reflection || '');
        setRating(target.rating || 5);
        setPhotoUri(target.photoUri || '');
        setPosterPath(target.poster_path || '');
      }
    };
    loadMovie();
  }, [movieId]);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (rating < 1 || rating > 10) {
      Alert.alert('Rating must be between 1 and 10');
      return;
    }

    const userId = await AsyncStorage.getItem('userId');
    if (!userId) return;

    const saved = JSON.parse(await AsyncStorage.getItem(`${userId}_movies`) || '[]');
    const updated = saved.map((m: any) =>
      m.movieId === movieId ? { ...m, reflection, rating, photoUri } : m
    );

    await AsyncStorage.setItem(`${userId}_movies`, JSON.stringify(updated));
    navigation.goBack();
  };

  const displayImage = posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : null;

  return (
    <GradientBackground palette="green" variant={0}>
      <ScrollView contentContainerStyle={styles.container}>
        {displayImage && <Image source={{ uri: displayImage }} style={styles.poster} />}
        {photoUri && <Image source={{ uri: photoUri }} style={styles.image} />}

        <Title style={styles.label}>Your Thoughts:</Title>
        <TextInput
          mode="outlined"
          style={styles.input}
          multiline
          numberOfLines={4}
          placeholder="What did this movie mean to you?"
          placeholderTextColor={theme.colors.onSurfaceDisabled}
          value={reflection}
          onChangeText={setReflection}
        />

        <Title style={styles.label}>Rating: {rating}</Title>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={10}
          step={1}
          value={rating}
          onValueChange={setRating}
          minimumTrackTintColor={theme.colors.primary}
        />

        <Button mode="outlined" onPress={handlePickImage} style={styles.button}>
          Pick a Photo
        </Button>

        <Button mode="contained" onPress={handleSave} style={styles.button}>
          Save
        </Button>
      </ScrollView>
    </GradientBackground>
  );
};

export default EditMovieScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    color: 'white',
  },
  input: {
    backgroundColor: '#222',
    color: 'white',
    borderRadius: 8,
    marginBottom: 20,
  },
  slider: {
    width: '100%',
    marginBottom: 20,
  },
  poster: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },
  button: {
    marginTop: 12,
  },
});
