import AsyncStorage from '@react-native-async-storage/async-storage';

const saveMovieToList = async (movieId: number, status: string, impression?: string) => {
  try {
    // Get the current userId from AsyncStorage
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      console.error('User is not logged in');
      return;
    }

    // Get the existing list of movies for the user (or create a new one if none exists)
    const existingMovies = JSON.parse(await AsyncStorage.getItem(`${userId}_movies`) || '[]');

    // Create a new movie object
    const newMovie = {
      movieId,
      status,       // 'planned' or 'watched'
      addedAt: new Date().toISOString(),
      impression,   // optional
    };

    // Add the new movie to the list
    existingMovies.push(newMovie);

    // Save the updated movie list back to AsyncStorage
    await AsyncStorage.setItem(`${userId}_movies`, JSON.stringify(existingMovies));

    console.log('Movie saved successfully.');
  } catch (error) {
    console.error('Error saving movie to list:', error);
  }
};

const getSavedMovies = async () => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      console.error('User is not logged in');
      return [];
    }

    // Get the saved movie list from AsyncStorage
    const savedMovies = JSON.parse(await AsyncStorage.getItem(`${userId}_movies`) || '[]');
    return savedMovies;
  } catch (error) {
    console.error('Error retrieving saved movies:', error);
    return [];
  }
};

