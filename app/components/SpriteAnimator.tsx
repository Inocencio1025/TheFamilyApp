// components/SpriteAnimator.tsx
import React, { useEffect } from 'react';
import { Image, View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface SpriteAnimatorProps {
  frameWidth: number;
  frameHeight: number;
  columns: number;
  fps: number;
  totalFrames: number;
  spriteSheet: any;
}

export const SpriteAnimator: React.FC<SpriteAnimatorProps> = ({
  frameWidth,
  frameHeight,
  columns,
  fps,
  totalFrames,
  spriteSheet,
}) => {
  const frameIndex = useSharedValue(0);

  useEffect(() => {
    frameIndex.value = withRepeat(
      withTiming(totalFrames - 1, { duration: (1000 / fps) * totalFrames }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const x = -((Math.floor(frameIndex.value) % columns) * frameWidth);
    const y = -Math.floor(frameIndex.value / columns) * frameHeight;

    return {
      transform: [{ translateX: x }, { translateY: y }],
    };
  });

  return (
    <View style={{ width: frameWidth, height: frameHeight, overflow: 'hidden' }}>
      <Animated.Image
        source={spriteSheet}
        style={[
          {
            width: frameWidth * columns,
            height: frameHeight,
          },
          animatedStyle,
        ]}
        resizeMode="contain"
      />
    </View>
  );
};
