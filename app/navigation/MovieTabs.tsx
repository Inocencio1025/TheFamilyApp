import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'react-native-paper';

import { Ionicons } from '@expo/vector-icons';
import FindingScreen from '../screens/mediaTracker/movies/FindingScreen';
import PlannedScreen from '../screens/mediaTracker/movies/PlannedScreen';
import WatchedScreen from '../screens/mediaTracker/movies/WatchedScreen';

const Tab = createBottomTabNavigator();

const MovieTabs: React.FC = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.elevation.level2,
          borderTopColor: theme.colors.outlineVariant,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'search';

          if (route.name === 'Finding') {
            iconName = 'search';
          } else if (route.name === 'Planned') {
            iconName = 'bookmark-outline';
          } else if (route.name === 'Watched') {
            iconName = 'checkmark-done-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Finding" component={FindingScreen} />
      <Tab.Screen name="Planned" component={PlannedScreen} />
      <Tab.Screen name="Watched" component={WatchedScreen} />
    </Tab.Navigator>
  );
};

export default MovieTabs;
