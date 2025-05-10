import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { GradientBackground } from '../../components/GradientBackground';

const FindingScreen: React.FC = () => {
  return (
    <GradientBackground palette="green" variant={0}>
      <View style={styles.container}>
        <Text style={styles.message}>Anime Tracker Coming Soon!</Text>
      </View>
    </GradientBackground>
  );
};

export default FindingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    fontFamily: 'PixelifySans',
    fontSize: 40,
    color: 'white',
    textAlign: 'center',
  },
});
