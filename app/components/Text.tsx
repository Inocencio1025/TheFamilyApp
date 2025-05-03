// Text.tsx (component)
import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { theme } from '../theme/theme'; // Adjust the path as needed

type TextProps = RNTextProps & {
  variant?: 'title' | 'body' | 'caption';
};

export const Text = ({ variant, style, children, ...props }: TextProps) => {
  let fontStyle = {};

  switch (variant) {
    case 'title':
      fontStyle = { fontSize: 24, fontWeight: 'bold' };
      break;
    case 'body':
      fontStyle = { fontSize: 16 };
      break;
    case 'caption':
      fontStyle = { fontSize: 12, color: 'gray' };
      break;
    default:
      fontStyle = { fontSize: 16 };
  }

  return (
    <RNText {...props} style={[{ fontFamily: theme.fonts.regular }, fontStyle, style]}>
      {children}
    </RNText>
  );
};
