import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'react-native-paper';
import FindingScreen from './FindingScreen';
import PlannedScreen from './PlannedScreen';
import EpisodeTrackerScreen from './EpisodeTrackerScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const AnimeTabs: React.FC = () => {
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
          } else if (route.name === 'Episode Tracker') {
            iconName = 'list-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Finding" component={FindingScreen} />
      <Tab.Screen name="Planned" component={PlannedScreen} />
      <Tab.Screen name="Episode Tracker" component={EpisodeTrackerScreen} />
    </Tab.Navigator>
  );
};

export default AnimeTabs;
