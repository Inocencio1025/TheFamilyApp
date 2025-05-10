import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, RefreshControl, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GestureDetector,
  Gesture,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { useTheme, Text as PaperText } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MediaStackParamList } from '@/app/navigation/MediaStack';
import { fetchMovieDetails } from '@/app/api/tmdb';
import { GradientBackground } from '../../components/GradientBackground';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;

type NavigationProp = StackNavigationProp<MediaStackParamList, 'PlannedScreen'>;

type MovieItemProps = {
  item: any;
  onSwipeRight: (id: number) => void;
  onSwipeLeft: (id: number) => void;
  onPress?: (id: number) => void;

};

const SwipeableMovieItem = ({ item, onSwipeRight, onSwipeLeft, onPress }: MovieItemProps) => {
  const translateX = useSharedValue(0);
  const theme = useTheme();

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd(() => {
      if (translateX.value > SWIPE_THRESHOLD) {
        runOnJS(onSwipeRight)(item.id);
      } else if (translateX.value < -SWIPE_THRESHOLD) {
        runOnJS(onSwipeLeft)(item.id);
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={() => onPress?.(item.id)}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.itemWrapper, animatedStyle]}>
          <GradientBackground palette="green" variant={1}>
            <View style={styles.card}>
              <Image
                source={{ uri: `https://image.tmdb.org/t/p/w300${item.poster_path}` }}
                style={styles.poster}
              />
              <PaperText style={styles.title}>{item.title}</PaperText>
            </View>
          </GradientBackground>
        </Animated.View>
      </GestureDetector>
    </TouchableOpacity>


  );
};

const PlannedScreen = () => {
  const [plannedMovies, setPlannedMovies] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    setIsRefreshing(true);
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) return;

    const saved = JSON.parse(await AsyncStorage.getItem(`${userId}_movies`) || '[]');
    const plannedOnly = saved.filter((m: any) => m.status === 'planned');

    const detailedMovies = await Promise.all(
      plannedOnly.map(async (entry: any) => {
        try {
          const data = await fetchMovieDetails(entry.movieId);
          return { ...data, savedAt: entry.savedAt };
        } catch {
          return null;
        }
      })
    );

    setPlannedMovies(detailedMovies.filter(Boolean));
    setIsRefreshing(false);
  };

  const handleSwipeRight = async (movieId: number) => {
    console.log(`[SWIPE RIGHT] Start - movieId: ${movieId}`);
  
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      console.warn('[SWIPE RIGHT] No user ID found');
      return;
    }
  
    const rawData = await AsyncStorage.getItem(`${userId}_movies`);
    const saved = JSON.parse(rawData || '[]');
  
    console.log(`[SWIPE RIGHT] Loaded ${saved.length} saved movies`);
  
    const updated = saved.map((m: any) =>
      m.movieId === movieId ? { ...m, status: 'watched' } : m
    );
  
    console.log(`[SWIPE RIGHT] Updated status for movieId: ${movieId} to 'watched'`);
  
    await AsyncStorage.setItem(`${userId}_movies`, JSON.stringify(updated));
    console.log('[SWIPE RIGHT] AsyncStorage updated');
  
    setPlannedMovies((prev) => {
      const filtered = prev.filter((m) => m.id !== movieId);
      console.log(`[SWIPE RIGHT] Updated local state, new length: ${filtered.length}`);
      return filtered;
    });
  };
  

  const handleSwipeLeft = async (movieId: number) => {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) return;

    const saved = JSON.parse(await AsyncStorage.getItem(`${userId}_movies`) || '[]');
    const updated = saved.filter((m: any) => m.movieId !== movieId);
    await AsyncStorage.setItem(`${userId}_movies`, JSON.stringify(updated));
    setPlannedMovies((prev) => prev.filter((m) => m.id !== movieId));
  };

  return (
    <GradientBackground palette="green" variant={0}>
      <FlatList
        data={plannedMovies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          
          <SwipeableMovieItem
            item={item}
            onSwipeRight={handleSwipeRight}
            onSwipeLeft={handleSwipeLeft}
            onPress={(movieId) => navigation.navigate('MovieDetails', { movieId })}
          />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={fetchMovies} />
        }
      />
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 12,
  },
  itemWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    marginHorizontal: 0,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#000000',    
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: 6,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    color: 'white',
    flexShrink: 1,
  },
    gradientWrapper: {

  },
});

export default PlannedScreen;
