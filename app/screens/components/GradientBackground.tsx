import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gradientPresets } from '../../theme/gradients';

type Props = {
  children: React.ReactNode;
  palette?: string;     // e.g. 'green', 'red'
  variant?: number;     // e.g. index of the gradient in the palette
};

export const GradientBackground = ({ children, palette = 'green', variant = 0 }: Props) => {
  const colors = (gradientPresets[palette]?.[variant] || gradientPresets.green[0]) as [string, string];

  return (
    <LinearGradient colors={colors} style={styles.container}>
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
