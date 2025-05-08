import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TopTabs from '../screens/mediaTracker/TopTabs';
import MovieDetailsScreen from '../screens/mediaTracker/movies/MovieDetailsScreen';
import FindingScreen from '../screens/mediaTracker/movies/FindingScreen';
import SearchResultsScreen from '../screens/mediaTracker/movies/SearchResultsScreen';

export type MediaStackParamList = {
  TopTabs: undefined;
  MovieDetails: { movieId: number };
  MovieSearch: { query: string };
  PlannedScreen: undefined;

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
    <Stack.Screen name="MovieSearch" component={SearchResultsScreen} />

  </Stack.Navigator>
)

export default MediaStack;
