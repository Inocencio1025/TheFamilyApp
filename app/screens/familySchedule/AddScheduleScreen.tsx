import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useNavigation } from '@react-navigation/native';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../database/firebase';
import { getAuth } from 'firebase/auth'; // Import Firebase Authentication

export default function AddScheduleScreen() {
  const navigation = useNavigation();
  const auth = getAuth(); // Get Firebase Auth instance

  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [title, setTitle] = useState('');
  const [color, setColor] = useState('#f44336'); 
  const [eventType, setEventType] = useState<'Work' | 'School' | 'Other' | ''>(''); 

  const [pickerTarget, setPickerTarget] = useState<'date' | 'start' | 'end'>('date');
  const [isPickerVisible, setPickerVisibility] = useState(false);

  const showPicker = (target: 'date' | 'start' | 'end') => {
    setPickerTarget(target);
    setPickerVisibility(true);
  };

  const hidePicker = () => {
    setPickerVisibility(false);
  };

  const handleConfirm = (selectedDate: Date) => {
    if (pickerTarget === 'date') {
      setDate(selectedDate);
    } else if (pickerTarget === 'start') {
      setStartTime(selectedDate);
    } else if (pickerTarget === 'end') {
      setEndTime(selectedDate);
    }
    hidePicker();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
        onPress={async () => {
          try {
            // Fetch current user from Firebase Auth
            const user = auth.currentUser;
            const userName = user?.displayName || 'Guest'; // Use displayName or fallback to 'Guest'
        
            // Use userName dynamically in the title for 'Other' event type
            const finalTitle = eventType === 'Other' && title ? title : `${eventType} (${userName})`;
        
            const scheduleData = {
              title: finalTitle,
              date: date.toISOString().split('T')[0], 
              startTime: "08:30", 
              endTime: "10:00", 
              color: "#FF0000" 
            };
        
            await addDoc(collection(db, 'schedules'), scheduleData);
            navigation.goBack();
          } catch (error) {
            console.error('Error adding document: ', error);
          }
        }}
        title="Submit"
        color="#2196F3"
        />
        
      ),
    });
  }, [navigation, title, date, startTime, endTime, eventType, auth]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Date</Text>
      <Button title="Select Date" onPress={() => showPicker('date')} />
      <Text style={styles.dateText}>{date.toDateString()}</Text>

      <Text style={styles.label}>Start Time</Text>
      <Button title="Select Start Time" onPress={() => showPicker('start')} />
      <Text style={styles.value}>
        {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>

      <Text style={styles.label}>End Time</Text>
      <Button title="Select End Time" onPress={() => showPicker('end')} />
      <Text style={styles.value}>
        {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>

      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode={pickerTarget === 'date' ? 'date' : 'time'}
        onConfirm={handleConfirm}
        onCancel={hidePicker}
      />

      <Text style={styles.label}>Event Type</Text>
      <View style={styles.eventTypeRow}>
        {['Work', 'School', 'Other'].map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.optionButton, eventType === type && styles.selectedOption]}
            onPress={() => setEventType(type as 'Work' | 'School' | 'Other')} // Explicitly cast type to one of the allowed types
          >
            <Text style={[styles.buttonText, eventType === type && styles.selectedText]}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {(eventType === 'Other') && (
        <>
          <Text style={styles.label}>Custom Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter custom title"
            value={title}
            onChangeText={setTitle}
          />
        </>
      )}

      <Text style={styles.label}>Color</Text>
      <View style={styles.colorRow}>
        {['#f44336', '#2196F3', '#4CAF50', '#FF9800', '#9C27B0'].map((c) => (
          <TouchableOpacity
            key={c}
            onPress={() => setColor(c)}
            style={[styles.colorOption, { backgroundColor: c, borderWidth: color === c ? 2 : 0 }]}
          />
        ))}
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
  },
  label: {
    fontSize: 16,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
  },
  dateText: {
    fontSize: 16,
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    marginTop: 10,
  },
  colorRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
    borderColor: 'black',
  },
  eventTypeRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  selectedOption: {
    backgroundColor: '#2196F3',
  },
  selectedText: {
    color: '#fff',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'PixelSans'
  },
});
