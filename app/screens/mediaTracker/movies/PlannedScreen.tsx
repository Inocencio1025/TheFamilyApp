import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PlannedScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Movie - Planned to watch Screen</Text>
    </View>
  );
};

export default PlannedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
