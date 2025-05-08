import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme } from 'react-native-paper';
import AnimeTabs from './anime/AnimeTabs';
import MovieTabsStack from './movies/MovieTabsStack';

const TopTab = createMaterialTopTabNavigator();

const TopTabs: React.FC = () => {
  const theme = useTheme();

  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.colors.elevation.level2,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarIndicatorStyle: {
          backgroundColor: theme.colors.primary,
        },
        tabBarLabelStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <TopTab.Screen name="Movies" component={MovieTabsStack} />
      <TopTab.Screen name="Anime" component={AnimeTabs} />
    </TopTab.Navigator>
  );
};

export default TopTabs;
