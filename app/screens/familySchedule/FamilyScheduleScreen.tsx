import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Agenda } from 'react-native-calendars';
import { createStackNavigator } from '@react-navigation/stack';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isSameOrBefore);

import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

type NavigationProp = StackNavigationProp<RootStackParamList, 'FamilySchedule'>;

const TodayScreen = ({ selectedDate, setSelectedDate }: { selectedDate: string; setSelectedDate: React.Dispatch<React.SetStateAction<string>> }) => {
  const navigation = useNavigation<NavigationProp>();
  const [items, setItems] = useState<Record<string, { name: string }[]>>({});
  
  const predefinedEvents = [
    { date: '2025-04-30', name: 'Meeting with Bob' },
    { date: '2025-04-30', name: 'Team Lunch' },
    { date: '2025-05-01', name: 'Doctor Appointment' },
    { date: '2025-05-02', name: 'Project Deadline' },
    { date: '2025-05-03', name: 'Dinner with Alice' },
    { date: '2025-05-08', name: 'Meeting with Bob' },
    { date: '2025-05-12', name: 'Team Lunch' },
    { date: '2025-05-15', name: 'Doctor Appointment' },
    { date: '2025-05-13', name: 'Project Deadline' },
    { date: '2025-05-7', name: 'Dinner with Alice' },
  ];

  const loadItemsForMonth = useCallback((day: any) => {
    const newItems: Record<string, { name: string }[]> = {};
    const today = new Date(day.timestamp);
  
    // Fill next 30 days with empty arrays
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      newItems[dateString] = [];
    }
  
    // Insert predefined events
    predefinedEvents.forEach(event => {
      if (!newItems[event.date]) {
        newItems[event.date] = [];
      }
      newItems[event.date].push({ name: event.name });
    });
  
    setItems(prevItems => ({
      ...prevItems,
      ...newItems
    }));    

  }, []);
  

  const renderItem = useCallback((item: { name: string }) => (
    <View style={styles.item}>
      <Text>{item.name}</Text>
    </View>
  ), []);



  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const peopleColors: Record<string, string> = {};

  const buildMarkedDates = () => {
    const markings: Record<string, any> = {};
    predefinedEvents.forEach(event => {
      if (!markings[event.date]) {
        markings[event.date] = { dots: [] };
      }
      markings[event.date].dots.push({
        key: event.name,
        color: peopleColors[event.name] || 'gray',
      });
    });

    if (selectedDate) {
      markings[selectedDate] = {
        ...(markings[selectedDate] || {}),
        selected: true,
        selectedColor: '#00adf5',
      };
    }

    return markings;
  };

  return (
    <View style={styles.container}>
      <Agenda
        items={items}
        selected={selectedDate}
        loadItemsForMonth={loadItemsForMonth}
        renderItem={renderItem}
        onDayPress={(day: { dateString: string }) => handleDateSelect(day.dateString)}
        markedDates={buildMarkedDates()}
        markingType={'multi-dot'}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddSchedule')}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default function FamilyScheduleScreen() {
  const [selectedDate, setSelectedDate] = useState<string>(dayjs().format('YYYY-MM-DD'));

  return (
    <Tab.Navigator
      screenListeners={{
        tabPress: (e) => {
          setSelectedDate(dayjs().format('YYYY-MM-DD'));
        },
      }}
    >
      <Tab.Screen
        name="Today"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="today" size={size} color={color} />
          ),
        }}
      >
        {() => <TodayScreen selectedDate={selectedDate} setSelectedDate={setSelectedDate} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#2196F3',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    zIndex: 1,
  },
  item: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginRight: 10,
    marginTop: 17,
  },
  emptyItem: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 17,
  },
});
