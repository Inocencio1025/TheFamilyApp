import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TopTabs from '../screens/mediaTracker/TopTabs';
import MovieDetailsScreen from '../screens/mediaTracker/movies/MovieDetailsScreen';

export type MediaStackParamList = {
  TopTabs: undefined;
  MovieDetails: { movieId: number };
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
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="MovieDetails"
      component={MovieDetailsScreen}
      options={{
        headerShown: true,
        title: '',
      }}
    />
  </Stack.Navigator>
)

export default MediaStack;
