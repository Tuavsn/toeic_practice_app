import React, { useState, useEffect } from 'react';
import { 
  Text, 
  View, 
  FlatList, 
  ActivityIndicator,
  TouchableOpacity,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Database from '../../database/Database';
import FlashCardService from '@/services/flashcard.service';
import { Card, Deck } from '@/types/global.type';
import { useRouter } from 'expo-router';

interface DeckDetailScreenProps {
    deckId: number;
}

const DeckDetailScreen = ({ deckId }: DeckDetailScreenProps) => {
  const [deck, setDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const dbInstance = Database.getInstance();
      const db = await dbInstance.initDB();
      
      // Get deck information
      const deckData = await dbInstance.getDeckById(deckId);
      if (!deckData) {
        setError('Vocabulary deck not found');
        setLoading(false);
        return;
      }
      
      setDeck(deckData);
      
      // Get cards list for this deck
      const cardsData = await dbInstance.getCardsByDeckId(deckId);
      setCards(cardsData);
      
      // Check if deck is saved
      const saved = await FlashCardService.isDeckSaved(deckId);
      setIsSaved(saved);
      
      setLoading(false);
    } catch (err) {
      console.error('Error loading deck details:', err);
      setError('Unable to load vocabulary deck information. Please try again later.');
      setLoading(false);
    }
  };

  const handleSaveDeck = async () => {
    try {
      if (isSaved) {
        await FlashCardService.removeSavedDeck(deckId);
        setIsSaved(false);
        Alert.alert('Notice', 'Deck removed from saved list');
      } else {
        await FlashCardService.saveDeckId(deckId);
        setIsSaved(true);
        Alert.alert('Notice', 'Deck added to saved list');
      }
    } catch (err) {
      console.error('Error saving/removing deck:', err);
      Alert.alert('Error', 'Unable to save/remove deck');
    }
  };

  const handleStartLearning = () => {
    if (deck) {
        router.push({
            pathname: '/(main)/flashcardDesk',
            params: { deckId, title: deck.title }
        });
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-5">
        <Text className="text-base text-red-500 text-center">{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="p-5 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900 mb-1.5">{deck?.title}</Text>
        {deck?.description ? (
          <Text className="text-base text-gray-600 mb-3">{deck.description}</Text>
        ) : null}
        
        <View className="flex-row mt-2.5">
          <View className="mr-5">
            <Text className="text-lg font-bold text-blue-500">{cards.length}</Text>
            <Text className="text-sm text-gray-500">Cards</Text>
          </View>
        </View>
      </View>

      <View className="flex-row p-4 justify-between">
        <TouchableOpacity 
          className="flex-1 py-3 rounded-lg items-center mx-1 bg-blue-500"
          onPress={handleStartLearning}
        >
          <Text className="text-white font-bold text-base">Learn Now</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className={`flex-1 py-3 rounded-lg items-center mx-1 ${isSaved ? 'bg-green-500' : 'bg-gray-600'}`}
          onPress={handleSaveDeck}
        >
          <Text className="text-white font-bold text-base">
            {isSaved ? 'Saved' : 'Save Deck'}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1 p-4 mb-6">
        <Text className="text-lg font-bold mb-4 text-gray-900">Vocabulary Cards List</Text>
        
        <FlatList
          data={cards}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <View className="bg-white rounded-lg p-3 mb-2.5 flex-row items-center shadow-sm">
              <View className="w-9 h-9 rounded-full bg-gray-50 justify-center items-center mr-3">
                <Text className="font-bold text-gray-700">{index + 1}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold text-gray-900 mb-1">{item.front_text}</Text>
                <Text className="text-sm text-gray-600">{item.back_text}</Text>
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <View className="p-5 items-center">
              <Text className="text-base text-gray-500 text-center">No vocabulary cards available</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default DeckDetailScreen;
