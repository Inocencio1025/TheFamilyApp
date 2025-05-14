import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  FlatList,
  RefreshControl,
  Dimensions,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GestureDetector,
  Gesture,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import {
  useTheme,
  Text as PaperText,
  IconButton,
  Dialog,
  Portal,
  Button,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { fetchMovieDetails } from '@/app/api/tmdb';
import { MediaStackParamList } from '@/app/navigation/MediaStack';
import { GradientBackground } from '../../components/GradientBackground';

const SCREEN_WIDTH = Dimensions.get('window').width;
const BUTTON_WIDTH = 150;

type NavigationProp = StackNavigationProp<MediaStackParamList, 'WatchedScreen'>;

type MovieItemProps = {
  item: any;
  onEdit: (id: number) => void;
  onRequestDelete: (id: number) => void;
};

const SwipeableMovieItem = ({ item, onEdit, onRequestDelete }: MovieItemProps) => {
  const theme = useTheme();
  const navigation = useNavigation<StackNavigationProp<MediaStackParamList, 'EditMovie'>>();
 
  const translateX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = Math.max(event.translationX, -BUTTON_WIDTH);
    })
    .onEnd(() => {
      if (translateX.value < -BUTTON_WIDTH / 2) {
        translateX.value = withSpring(-BUTTON_WIDTH);
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const actionStyle = useAnimatedStyle(() => ({
    width: Math.min(Math.abs(translateX.value), BUTTON_WIDTH),
    flexDirection: 'row',
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 0,
    overflow: 'hidden',
  }));

  return (
    <View style={styles.swipeableContainer}>
      <Animated.View style={actionStyle}>
        <View style={[styles.actionHalfLeft, {backgroundColor: theme.colors.secondary}]}>
          <IconButton
            icon="pencil"
            iconColor="black"
            size={28}
            style={styles.iconButton}
            onPress={() => onEdit(item.id)}
          />
        </View>
        <View style={[styles.actionHalfRight, {backgroundColor: theme.colors.error}]}>
          <IconButton
            icon="trash-can"
            iconColor="black"
            size={28}
            style={styles.iconButton}
            onPress={() => onRequestDelete(item.id)}
          />
        </View>
      </Animated.View>

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
    </View>
  );
};

const WatchedScreen = () => {
  const [watchedMovies, setWatchedMovies] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
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
    const watchedOnly = saved.filter((m: any) => m.status === 'watched');

    const detailedMovies = await Promise.all(
      watchedOnly.map(async (entry: any) => {
        try {
          const data = await fetchMovieDetails(entry.movieId);
          return { ...data, savedAt: entry.savedAt };
        } catch {
          return null;
        }
      })
    );

    setWatchedMovies(detailedMovies.filter(Boolean));
    setIsRefreshing(false);
  };

  const handleEdit = (movieId: number) => {
    navigation.navigate('EditMovie', { movieId: movieId })  
  };

  const confirmDelete = async () => {
    if (pendingDeleteId === null) return;
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) return;

    const saved = JSON.parse(await AsyncStorage.getItem(`${userId}_movies`) || '[]');
    const updated = saved.filter((m: any) => m.movieId !== pendingDeleteId);

    await AsyncStorage.setItem(`${userId}_movies`, JSON.stringify(updated));
    setWatchedMovies((prev) => prev.filter((m) => m.id !== pendingDeleteId));
    setPendingDeleteId(null)
  };

  return (
    <GradientBackground palette="green" variant={0}>
      <FlatList
        data={watchedMovies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <SwipeableMovieItem
            item={item}
            onEdit={handleEdit}
            onRequestDelete={(id) => setPendingDeleteId(id)}
          />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={fetchMovies} />
        }
      />

      <Portal>
        <Dialog visible={pendingDeleteId !== null} onDismiss={() => setPendingDeleteId(null)}>
          <Dialog.Title>Remove from Watched?</Dialog.Title>
          <Dialog.Content>
            <PaperText>
              Deleting this watched movie will remove all saved info, including notes and history. This action cannot be undone.
            </PaperText>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setPendingDeleteId(null)}>Cancel</Button>
            <Button onPress={confirmDelete}>Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 12,
  },
  swipeableContainer: {
    marginBottom: 16,
    borderRightWidth: 2,
    borderColor: '#000000',



  },
  itemWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
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
  actionHalfLeft: {
    flex: 1,
    backgroundColor: '#4caf50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionHalfRight: {
    flex: 1,
    backgroundColor: '#f44336',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {
    margin: 0,
  },
});

export default WatchedScreen;
