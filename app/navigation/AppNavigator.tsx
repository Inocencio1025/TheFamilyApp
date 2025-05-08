import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import MainMenuScreen from '../screens/MainMenuScreen';
import FamilyScheduleScreen from '../screens/familySchedule/FamilyScheduleScreen';
import AddScheduleScreen from '../screens/familySchedule/AddScheduleScreen';
import LoginScreen from '../screens/LoginScreen';  
import EditEventScreen from '../screens/familySchedule/EditEventScreen';  
import MMDrawerContent from '../screens/components/MMDrawerContent';
import MediaStack from './MediaStack'; // import at top

export type RootStackParamList = {
  Login: undefined;
  MainMenu: undefined;
  FamilySchedule: undefined;
  AddSchedule: undefined;
  EditEvent: { event: ScheduleEvent };
  MediaTracker: undefined;
};

type ScheduleEvent = {
  id: string;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  color?: string;
};

const Stack = createStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator();

// Drawer wrapper JUST for MainMenu
function MainMenuDrawerWrapper() {
  return (
    <Drawer.Navigator
    drawerContent={(props) => <MMDrawerContent {...props} />}
    screenOptions={{
        drawerPosition: 'right', // ✅ move it here
        drawerStyle: {
          backgroundColor: 'black', // Drawer background
          width: '70%',
        },
        headerStyle: {
          backgroundColor: 'black', // Top bar (header) background
        },
        headerTintColor: 'white', // Text and icon color in header
        drawerLabelStyle: {
          color: 'white', // Drawer text color
        },
        headerTitleStyle: {
          fontFamily: 'PixelifySans'
        },
        headerTitleAlign: 'center',
      }}
    >
      <Drawer.Screen
        name="MainMenu"
        component={MainMenuScreen}
        options={{ title: 'Main Menu' }}
      />
    </Drawer.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerTitleStyle: {
          fontFamily: 'PixelifySans',
          fontSize: 28,
          color: 'white',
        },
        headerStyle: {
          backgroundColor: 'black',
        },
        headerTitleAlign: 'center',
        headerTintColor: 'white',
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: 'Login' }}
      />
      <Stack.Screen
        name="MainMenu"
        component={MainMenuDrawerWrapper} // Wrapped in drawer
        options={{ headerShown: false }} // Hide header, drawer has its own
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
        component={MediaStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditEvent"
        component={EditEventScreen}
        options={{ title: 'Edit' }}
      />
    </Stack.Navigator>
  );
}
