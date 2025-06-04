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
import { useRouter } from 'expo-router';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import FlashCard from '@/components/common/card/FlashCard';

interface FlashCardDeckScreenProps {
  deckId: number;
  title: string;
}

const FlashCardDeckScreen = ({ deckId, title }: FlashCardDeckScreenProps) => {
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [flipped, setFlipped] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Get screen dimensions to prevent overflow
  const { width, height } = Dimensions.get('window');
  const cardHeight: number = Math.min(height * 0.45, 400);

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
        setError('No flashcards in this deck');
        setLoading(false);
        return;
      }

      // Shuffle cards
      const shuffledCards = [...cardsData].sort(() => Math.random() - 0.5);
      setCards(shuffledCards);
      setLoading(false);
    } catch (err) {
      console.error('Error loading cards:', err);
      setError('Unable to load flashcards. Please try again later.');
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
        'Completed',
        'You have studied all flashcards.',
        [
          {
            text: 'Study Again',
            onPress: () => {
              setCurrentCardIndex(0);
              setFlipped(false);
            }
          },
          {
            text: 'Go Back',
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
            <Text className="text-white font-medium">Go Back</Text>
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
        {/* Navigation buttons */}
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

        {/* Progress info and title */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-sm text-gray-500">{progress}</Text>
          <Text className="text-lg font-bold text-gray-900" numberOfLines={1} ellipsizeMode="tail">
            {title}
          </Text>
          <View className="w-12"></View>
        </View>

        {/* Flashcard Container */}
        <View className="flex-1 justify-start px-2">
          <Animated.View
            className="w-full h-[70%]"
            style={{
              opacity: fadeAnim,
              transform: [{ translateX: slideAnim }]
            }}
          >
            <FlashCard
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