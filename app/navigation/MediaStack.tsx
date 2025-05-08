import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TopTabs from '../screens/mediaTracker/TopTabs';
import MovieDetailsScreen from '../screens/mediaTracker/movies/MovieDetailsScreen';

export type MediaStackParamList = {
  MediaTabs: undefined;
  MovieDetails: { movieId: number };
};

const Stack = createStackNavigator<MediaStackParamList>();

const MediaStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MediaTabs" component={TopTabs} />
    <Stack.Screen name="MovieDetails" component={MovieDetailsScreen} />
  </Stack.Navigator>
);

export default MediaStack;
