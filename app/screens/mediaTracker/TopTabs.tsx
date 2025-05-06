import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MovieTabs from './movies/MovieTabs';
import AnimeTabs from './anime/AnimeTabs';

const TopTab = createMaterialTopTabNavigator();

const TopTabs: React.FC = () => {
  return (
    <TopTab.Navigator>
      <TopTab.Screen name="Movies" component={MovieTabs} />
      <TopTab.Screen name="Anime" component={AnimeTabs} />
    </TopTab.Navigator>
  );
};

export default TopTabs;
