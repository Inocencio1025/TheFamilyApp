import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainMenuScreen from '../screens/MainMenuScreen';
import FamilyScheduleScreen from '../screens/familySchedule/FamilyScheduleScreen';
import MediaTrackerScreen from '../screens/mediaTracker/MediaTrackerScreen';
import AddScheduleScreen from '../screens/familySchedule/AddScheduleScreen';
import LoginScreen from '../screens/LoginScreen';  // Import LoginScreen

export type RootStackParamList = {
  Login: undefined;
  MainMenu: undefined;
  FamilySchedule: undefined;
  AddSchedule: undefined;
  MediaTracker: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">  
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: 'Login' }}  
      />
      <Stack.Screen
        name="MainMenu"
        component={MainMenuScreen}
        options={{ title: 'Main Menu' }}
      />
      <Stack.Screen
        name="FamilySchedule"
        component={FamilyScheduleScreen}
        options={{ title: 'Family Schedule' }}
      />
      <Stack.Screen
        name="AddSchedule"
        component={AddScheduleScreen}
        options={{
          presentation: 'modal',
          title: 'Add Schedule',
        }}
      />
      <Stack.Screen
        name="MediaTracker"
        component={MediaTrackerScreen}
        options={{ title: 'Media Tracker' }}
      />
    </Stack.Navigator>
  );
}
