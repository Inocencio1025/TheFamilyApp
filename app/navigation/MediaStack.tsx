import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MovieDetailsScreen from '../screens/mediaTracker/movies/MovieDetailsScreen';
import SearchResultsScreen from '../screens/mediaTracker/movies/SearchResultsScreen';
import TopTabs from './TopTabs';
import EditMovieScreen from '../screens/mediaTracker/movies/EditMovieScreen';

export type MediaStackParamList = {
  TopTabs: undefined;
  MovieDetails: { movieId: number };
  MovieSearch: { query: string };
  PlannedScreen: undefined;
  WatchedScreen: undefined;
  EditMovie: { movieId: number };

};

const Stack = createStackNavigator<MediaStackParamList>();

const MediaStack = () => (
  
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: 'black',
      },
      headerTitleStyle: {
        fontFamily: 'PixelifySans',
        fontSize: 28,
        color: 'white',
      },
      headerTitleAlign: 'center',
      headerTintColor: 'white',
    }}
  >
    <Stack.Screen
      name="TopTabs"
      component={TopTabs}
      options={{ headerShown: true, title: "Media Tracker" }}
    />
    <Stack.Screen
      name="MovieDetails"
      component={MovieDetailsScreen}
      options={{
        headerShown: true,
        title: '',
      }}
    />
    <Stack.Screen
      name="EditMovie"
      component={EditMovieScreen}
      options={{
        headerShown: true,
        title: '',
      }}
    />
    <Stack.Screen name="MovieSearch" component={SearchResultsScreen} />

  </Stack.Navigator>
)

export default MediaStack;
