import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MovieTabs from './MovieTabs';
import MovieDetailsScreen from './MovieDetailsScreen';

export type MovieTabsStackParamList = {
  MovieTabs: undefined;
  MovieDetails: { movieId: number };
};

const Stack = createStackNavigator<MovieTabsStackParamList>();

const MovieTabsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MovieTabs" component={MovieTabs} />
    <Stack.Screen name="MovieDetails" component={MovieDetailsScreen} />
  </Stack.Navigator>
);

export default MovieTabsStack;
