import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useNavigation } from '@react-navigation/native';

export default function AddScheduleScreen() {
  const navigation = useNavigation();

  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

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
          onPress={() => navigation.goBack()}
          title="Submit"
          color="#2196F3" // optional: change button color
        />
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter title"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter description"
        value={description}
        onChangeText={setDescription}
      />

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
  }
});
