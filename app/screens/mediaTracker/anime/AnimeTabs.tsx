import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FindingScreen from './FindingScreen';
import PlannedScreen from './PlannedScreen';
import EpisodeTrackerScreen from './EpisodeTrackerScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const AnimeTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'search'; // Default value

          // Assign icon names based on the route
          if (route.name === 'Finding') {
            iconName = 'search';
          } else if (route.name === 'Planned') {
            iconName = 'bookmark-outline';
          } else if (route.name === 'Episode Tracker') {
            iconName = 'list-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'dodgerblue',  // Active icon color
        tabBarInactiveTintColor: 'gray',      // Inactive icon color
      })}
    >
      <Tab.Screen name="Finding" component={FindingScreen} />
      <Tab.Screen name="Planned" component={PlannedScreen} />
      <Tab.Screen name="Episode Tracker" component={EpisodeTrackerScreen} />
    </Tab.Navigator>
  );
};

export default AnimeTabs;
