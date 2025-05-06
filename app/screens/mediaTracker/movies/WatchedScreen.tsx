import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WatchedScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Movie - Finding Screen</Text>
    </View>
  );
};

export default WatchedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
