import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Animated,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Database from '@/database/Database';
import { Card } from '@/types/global.type';
import { Animated as AnimatedType } from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign, Ionicons } from '@expo/vector-icons'; // Import Expo icons

interface FlashCardDeckScreenProps {
  deckId: number;
  title: string;
}

interface EnhancedFlashCardProps {
  frontText: string;
  backText: string;
  flipped: boolean;
  onFlip: () => void;
}

// Enhanced FlashCard component with smoother animations
const EnhancedFlashCard: React.FC<EnhancedFlashCardProps> = ({ frontText, backText, flipped, onFlip }) => {
  const flipAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(flipAnim, {
      toValue: flipped ? 180 : 0,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
  }, [flipped]);

  const frontAnimatedStyle: { transform: any[] } = {
    transform: [
      { perspective: 1000 },
      {
        rotateY: flipAnim.interpolate({
          inputRange: [0, 180],
          outputRange: ['0deg', '180deg'],
        }),
      },
    ],
  };

  const backAnimatedStyle: { transform: any[] } = {
    transform: [
      { perspective: 1000 },
      {
        rotateY: flipAnim.interpolate({
          inputRange: [0, 180],
          outputRange: ['180deg', '360deg'],
        }),
      },
    ],
  };

  const frontOpacity: AnimatedType.AnimatedInterpolation<number> = flipAnim.interpolate({
    inputRange: [89, 90],
    outputRange: [1, 0],
  });

  const backOpacity: AnimatedType.AnimatedInterpolation<number> = flipAnim.interpolate({
    inputRange: [89, 90],
    outputRange: [0, 1],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      className="w-full h-full"
      onPress={onFlip}
    >
      <View className="w-full h-full relative">
        <Animated.View
          className="absolute w-full h-full bg-white rounded-xl shadow-md p-6 justify-center items-center"
          style={[frontAnimatedStyle, { opacity: frontOpacity, backfaceVisibility: 'hidden' }]}
        >
          <Text className="text-2xl font-bold text-center text-gray-800">{frontText}</Text>
          <Text className="text-sm text-gray-500 mt-4 text-center">Nhấn để xem nghĩa</Text>
        </Animated.View>

        <Animated.View
          className="absolute w-full h-full bg-blue-50 rounded-xl shadow-md p-6 justify-center items-center"
          style={[backAnimatedStyle, { opacity: backOpacity, backfaceVisibility: 'hidden' }]}
        >
          <Text className="text-xl text-center text-gray-800">{backText}</Text>
          <Text className="text-sm text-gray-500 mt-4 text-center">Nhấn để xem từ</Text>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

const FlashCardDeckScreen = ({ deckId, title }: FlashCardDeckScreenProps) => {
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [flipped, setFlipped] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Get screen dimensions to prevent overflow
  const { width, height } = Dimensions.get('window');
  const cardHeight: number = Math.min(height * 0.45, 400); // Limit card height to 45% of screen height or 400px

  // Animation refs for card transitions
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Load cards
  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      setLoading(true);
      const dbInstance = Database.getInstance();
      const db = await dbInstance.initDB();

      // Get cards for this deck
      const cardsData = await dbInstance.getCardsByDeckId(deckId);

      if (cardsData.length === 0) {
        setError('Không có thẻ từ vựng nào trong bộ này');
        setLoading(false);
        return;
      }

      // Shuffle cards
      const shuffledCards = [...cardsData].sort(() => Math.random() - 0.5);
      setCards(shuffledCards);
      setLoading(false);
    } catch (err) {
      console.error('Error loading cards:', err);
      setError('Không thể tải thẻ từ vựng. Vui lòng thử lại sau.');
      setLoading(false);
    }
  };

  const handleFlipCard = () => {
    setFlipped(!flipped);
  };

  const animateCardTransition = (direction: 'next' | 'prev') => {
    // Reset flip state
    setFlipped(false);

    // Fade out current card
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: direction === 'next' ? -50 : 50,
        duration: 150,
        useNativeDriver: true,
      })
    ]).start(() => {
      // Change the card
      if (direction === 'next') {
        setCurrentCardIndex(prev => prev + 1);
      } else {
        setCurrentCardIndex(prev => prev - 1);
      }

      // Reset position
      slideAnim.setValue(direction === 'next' ? 50 : -50);

      // Fade in new card
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        })
      ]).start();
    });
  };

  const handleNextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      animateCardTransition('next');
    } else {
      // Completed all cards
      Alert.alert(
        'Hoàn thành',
        'Bạn đã học hết tất cả các thẻ từ vựng.',
        [
          {
            text: 'Học lại',
            onPress: () => {
              setCurrentCardIndex(0);
              setFlipped(false);
            }
          },
          {
            text: 'Quay lại',
            onPress: () => router.back(),
            style: 'cancel'
          },
        ]
      );
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      animateCardTransition('prev');
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center p-5">
          <Text className="text-base text-red-500 text-center">{error}</Text>
          <TouchableOpacity
            className="mt-4 bg-blue-500 py-2 px-4 rounded-lg"
            onPress={() => router.back()}
          >
            <Text className="text-white font-medium">Quay lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentCard = cards[currentCardIndex];
  const progress = `${currentCardIndex + 1}/${cards.length}`;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 p-4">
        {/* Các nút điều hướng */}
        <View className="flex-row justify-between mb-4 px-2">
          <TouchableOpacity
            className="w-14 h-14 justify-center items-center rounded-full bg-gray-200"
            onPress={handlePrevCard}
            disabled={currentCardIndex === 0}
            activeOpacity={0.7}
          >
            <AntDesign 
              name="arrowleft" 
              size={24} 
              color={currentCardIndex === 0 ? "#9ca3af" : "#374151"} 
            />
          </TouchableOpacity>

          <TouchableOpacity
            className="w-14 h-14 justify-center items-center rounded-full bg-blue-500"
            onPress={handleFlipCard}
            activeOpacity={0.7}
          >
            <Ionicons name="refresh" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            className="w-14 h-14 justify-center items-center rounded-full bg-green-500"
            onPress={handleNextCard}
            activeOpacity={0.7}
          >
            <AntDesign name="arrowright" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Thông tin tiến độ và tiêu đề */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-sm text-gray-500">{progress}</Text>
          <Text className="text-lg font-bold text-gray-900" numberOfLines={1} ellipsizeMode="tail">
            {title}
          </Text>
          <View className="w-12"></View> {/* Placeholder for alignment */}
        </View>

        {/* Thẻ flashcard */}
        <View className="flex-1 justify-start px-2">
          <Animated.View
            className="w-full h-[70%]"
            style={{
              opacity: fadeAnim,
              transform: [{ translateX: slideAnim }]
            }}
          >
            <EnhancedFlashCard
              frontText={currentCard.front_text}
              backText={currentCard.back_text}
              flipped={flipped}
              onFlip={handleFlipCard}
            />
          </Animated.View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default FlashCardDeckScreen;