// FamilyScheduleScreen.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Agenda, AgendaEntry, AgendaSchedule } from 'react-native-calendars';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../../database/firebase';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';

dayjs.extend(isSameOrBefore);

const Tab = createBottomTabNavigator();
type NavigationProp = StackNavigationProp<RootStackParamList, 'FamilySchedule'>;

type EventItem = {
  id: string;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  color?: string;
};

type CustomAgendaEntry = AgendaEntry & EventItem;

type EventItemFromDB = Omit<EventItem, 'id'>;

const TodayScreen = ({
  selectedDate,
  setSelectedDate,
}: {
  selectedDate: string;
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const navigation = useNavigation<NavigationProp>();
  const [rawItems, setRawItems] = useState<Record<string, EventItem[]>>({});
  const [loading, setLoading] = useState(true);

  const updateItems = (newData: Record<string, EventItem[]>) => {
    setRawItems(prev => ({ ...prev, ...newData }));
  };

  const loadEventsFromDB = async () => {
    const snapshot = await getDocs(collection(db, 'schedules'));
    const eventList = snapshot.docs.map(docSnap => {
      const data = docSnap.data() as EventItemFromDB;
      return {
        id: docSnap.id,
        ...data,
      };
    });

    const newItems: Record<string, EventItem[]> = {};
    eventList.forEach(event => {
      if (!newItems[event.date]) newItems[event.date] = [];
      newItems[event.date].push(event);
    });

    updateItems(newItems);
    setLoading(false);
  };

  useEffect(() => {
    loadEventsFromDB();
  }, []);

  const transformEventsToAgendaSchedule = (
    data: Record<string, EventItem[]>
  ): AgendaSchedule => {
    const result: AgendaSchedule = {};
    for (const date in data) {
      result[date] = data[date].map(event => ({
        ...event,
        name: event.title,
        height: 50,
        day: date,
      }));
    }
    return result;
  };

  const loadItemsForMonth = useCallback((day: any) => {
    const baseDate = new Date(day.timestamp);
    const generated: Record<string, EventItem[]> = {};
  
    for (let i = 0; i < 30; i++) {
      const date = new Date(baseDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      generated[dateStr] = [];
    }
  
    // Only update if rawItems have changed
    if (JSON.stringify(generated) !== JSON.stringify(rawItems)) {
      Object.keys(rawItems).forEach(date => {
        generated[date] = rawItems[date];
      });
      updateItems(generated);
    }
  }, [rawItems]);
  

  const renderItem = useCallback((item: AgendaEntry, isFirst: boolean) => {
    const customItem = item as CustomAgendaEntry;
  
    return (
      <TouchableOpacity
        key={customItem.id}
        onLongPress={() => handleLongPress(customItem)}
        style={styles.itemContainer}
      >
        <View style={[styles.colorStrip, { backgroundColor: customItem.color || 'gray' }]} />
        <View style={styles.itemContent}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>{customItem.title}</Text>
            {customItem.startTime && customItem.endTime && (
              <Text style={{ color: 'gray' }}>{customItem.startTime} - {customItem.endTime}</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }, []);
  

  const handleLongPress = (item: EventItem) => {
    Alert.alert('Event Options', `What would you like to do with "${item.title}"?`, [
      { text: 'Edit', onPress: () => handleEdit(item) },
      { text: 'Delete', onPress: () => handleDelete(item) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleEdit = (item: EventItem) => {
    navigation.navigate('EditEvent', { event: item });
  };

  const handleDelete = (item: EventItem) => {
    Alert.alert('Confirm Delete', `Delete "${item.title}"?`, [
      {
        text: 'Yes',
        onPress: async () => {
          await deleteDoc(doc(db, 'schedules', item.id));
          const updated = { ...rawItems };
          Object.keys(updated).forEach(date => {
            updated[date] = updated[date].filter(e => e.id !== item.id);
          });
          updateItems(updated);
        },
      },
      { text: 'No', style: 'cancel' },
    ]);
  };

  const buildMarkedDates = () => {
    const markings: Record<string, any> = {};

    Object.keys(rawItems).forEach(date => {
      markings[date] = { dots: [] };
      rawItems[date].forEach(event => {
        markings[date].dots.push({
          key: event.id,
          color: event.color || 'gray',
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
        items={transformEventsToAgendaSchedule(rawItems)}
        selected={selectedDate}
        loadItemsForMonth={loadItemsForMonth}
        renderItem={renderItem}
        onDayPress={(day: { dateString: string }) => setSelectedDate(day.dateString)}
        markedDates={buildMarkedDates()}
        markingType="multi-dot"
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
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));

  return (
    <Tab.Navigator
      screenListeners={{
        tabPress: () => setSelectedDate(dayjs().format('YYYY-MM-DD')),
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
