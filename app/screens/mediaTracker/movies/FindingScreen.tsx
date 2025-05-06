import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FindingScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Movie - Finding Screen</Text>
    </View>
  );
};

export default FindingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
