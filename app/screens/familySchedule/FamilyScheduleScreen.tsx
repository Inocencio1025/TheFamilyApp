import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Agenda } from 'react-native-calendars';
import { createStackNavigator } from '@react-navigation/stack';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../database/firebase';

dayjs.extend(isSameOrBefore);

import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';

const Tab = createBottomTabNavigator();

type NavigationProp = StackNavigationProp<RootStackParamList, 'FamilySchedule'>;

const TodayScreen = ({ selectedDate, setSelectedDate }: { selectedDate: string; setSelectedDate: React.Dispatch<React.SetStateAction<string>> }) => {
  const navigation = useNavigation<NavigationProp>();
  const [items, setItems] = useState<Record<string, { name: string }[]>>({});
  const [loading, setLoading] = useState(true);

  const updateItems = (newData: Record<string, any[]>) => {
    setItems((prevItems) => ({
      ...prevItems,
      ...newData,
    }));
  };

  const loadEventsFromDB = async () => {
    const eventsCollection = collection(db, 'schedules'); 
    const eventsSnapshot = await getDocs(eventsCollection);
    const eventsList = eventsSnapshot.docs.map(doc => doc.data());

    const newItems: Record<string, { name: string; startTime?: string; endTime?: string; color?: string }[]> = {};
    eventsList.forEach(event => {
      const date = event.date; // 'YYYY-MM-DD'
      if (!newItems[date]) {
        newItems[date] = [];
      }
      newItems[date].push({ 
        name: event.title, 
        startTime: event.startTime, 
        endTime: event.endTime,
        color: event.color 
      });
    });

    updateItems(newItems); 
    setLoading(false);
  };

  useEffect(() => {
    loadEventsFromDB();
  }, []);

  const loadItemsForMonth = useCallback((day: any) => {
    const newItems: Record<string, { name: string }[]> = {};
    const today = new Date(day.timestamp);

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      newItems[dateString] = [];
    }

    Object.keys(items).forEach(date => {
      newItems[date] = items[date];
    });

    updateItems(newItems); 
  }, [items]);

  const renderItem = useCallback((item: { name: string; startTime?: string; endTime?: string; color?: string }) => (
    <View style={styles.itemContainer}>
      <View style={[styles.colorStrip, { backgroundColor: item.color || 'gray' }]} />
      <View style={styles.itemContent}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text>{item.name}</Text>
          {item.startTime && item.endTime && (
            <Text style={{ color: 'gray' }}>
              {item.startTime} - {item.endTime}
            </Text>
          )}
        </View>
      </View>
    </View>
  ), []);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const buildMarkedDates = () => {
    const markings: Record<string, any> = {};
    Object.keys(items).forEach(date => {
      markings[date] = { dots: [] };
      items[date].forEach(event => {
        markings[date].dots.push({
          key: event.name,
          color: 'gray',
        });
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

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading events...</Text>
      </View>
    );
  }

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
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    marginRight: 10,
    marginTop: 17,
    overflow: 'hidden',
    elevation: 1,
  },
  colorStrip: {
    width: 6,
  },
  itemContent: {
    flex: 1,
    padding: 20,
  },
});
