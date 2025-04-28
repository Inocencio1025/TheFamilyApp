import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type MainMenuNavigationProp = StackNavigationProp<RootStackParamList, 'MainMenu'>;

type Props = {
  navigation: MainMenuNavigationProp;
};

export default function MainMenuScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Button title="Family Schedule" onPress={() => navigation.navigate('FamilySchedule')} />
      <Button title="Media Tracker" onPress={() => navigation.navigate('MediaTracker')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
    paddingHorizontal: 40,
  },
});
