import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import AddScheduleScreen from './AddScheduleScreen';

const Tab = createBottomTabNavigator();

function TodayScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Today's Schedule</Text>
    </View>
  );
}


export default function FamilyScheduleScreen() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Today" component={TodayScreen} />
      <Tab.Screen name="Add" component={AddScheduleScreen} />
    </Tab.Navigator>
  );
}
