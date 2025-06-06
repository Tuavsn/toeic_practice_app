import React, { useState, useCallback } from 'react';
import { 
  Text, 
  View, 
  FlatList, 
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Database from '../../database/Database';
import FlashCardService from '@/services/flashcard.service';
import { Deck } from '@/types/global.type';

interface DeckWithCardCount extends Deck {
  cardCount: number;
  masteredCount: number; // Số thẻ đã thuộc
  reviewCount: number;   // Số thẻ cần ôn tập
}

const UserFlashcardCollection = () => {
  const router = useRouter();
  const [savedDecks, setSavedDecks] = useState<DeckWithCardCount[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCards, setTotalCards] = useState<number>(0);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Get saved deck IDs
      const savedDeckIds = await FlashCardService.getSavedDeckIds();
      
      if (savedDeckIds.length === 0) {
        setSavedDecks([]);
        setTotalCards(0);
        setLoading(false);
        return;
      }
      
      // Get detailed information for each deck
      const dbInstance = Database.getInstance();
      
      const decksWithDetails: DeckWithCardCount[] = [];
      let totalCardCount = 0;
      
      for (const deckId of savedDeckIds) {
        // Convert string ID back to number for database query
        const numericDeckId = parseInt(deckId);
        if (isNaN(numericDeckId)) continue;
        
        const deck = await dbInstance.getDeckById(numericDeckId);
        if (deck) {
          // Get cards in each deck
          const cards = await dbInstance.getCardsByDeckId(numericDeckId);
          
          // Simulate mastered and review counts (replace with actual data in your app)
          const masteredCount = Math.floor(cards.length * Math.random() * 0.8); // Random mastered count
          const reviewCount = Math.floor((cards.length - masteredCount) * 0.6); // Random review count
          
          totalCardCount += cards.length;
          
          decksWithDetails.push({
            ...deck,
            cardCount: cards.length,
            masteredCount,
            reviewCount
          });
        }
      }
      
      setSavedDecks(decksWithDetails);
      setTotalCards(totalCardCount);
      setLoading(false);
    } catch (err) {
      console.error('Error loading saved decks:', err);
      setError(`Can't load Flashcard collections, please try again.`);
      setLoading(false);
    }
  };

  // Load data when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadData();
      return () => {
        // Cleanup if needed when screen loses focus
      };
    }, [])
  );

  const handleDeckPress = (deck: DeckWithCardCount) => {
    router.push({
      pathname: '/(main)/flashcardDesk',
      params: { deckId: deck.id, title: deck.title }
    });
  };

  const handleRemoveDeck = async (deck: DeckWithCardCount) => {
    try {
      Alert.alert(
        'Xác nhận xóa',
        `Bạn có chắc chắn muốn xóa bộ từ vựng "${deck.title}" khỏi danh sách không?`,
        [
          { text: 'Hủy', style: 'cancel' },
          { 
            text: 'Xóa', 
            style: 'destructive',
            onPress: async () => {
              await FlashCardService.removeSavedDeck(deck.id.toString());
              await loadData();
              Alert.alert('Thành công', 'Đã xóa bộ từ vựng khỏi danh sách.');
            }
          }
        ]
      );
    } catch (err) {
      console.error('Error removing deck:', err);
      Alert.alert('Lỗi', 'Không thể xóa bộ từ vựng.');
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#004B8D" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-5 bg-gray-50">
        <Ionicons name="alert-circle" size={64} color="#EF4444" />
        <Text className="text-base text-red-500 text-center mt-4">{error}</Text>
        <TouchableOpacity 
          className="mt-6 bg-[#004B8D] px-4 py-2 rounded-lg flex-row items-center"
          onPress={loadData}
        >
          <Ionicons name="refresh" size={18} color="white" />
          <Text className="text-white font-medium ml-2">Try again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (savedDecks.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="px-5 py-4 bg-white border-b border-gray-200">
          <Text className="text-base text-gray-500 mt-1">Flash card collections</Text>
        </View>
        
        <View className="flex-1 justify-center items-center p-5">
          <View className="bg-gray-100 rounded-full p-8">
            <MaterialCommunityIcons 
              name="cards-outline" 
              size={80} 
              color="#6366F1" 
            />
          </View>
          <Text className="text-xl font-bold text-gray-900 mt-6 mb-2">Empty FLashcards</Text>
          <TouchableOpacity
            className="bg-[#004B8D] py-3 px-6 rounded-lg flex-row items-center"
            onPress={() => router.push('/(main)/vocabulary')}
          >
            <Ionicons name="add-circle-outline" size={20} color="white" />
            <Text className="text-white font-bold text-base ml-2">Add more</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="px-5 py-4 bg-white border-b border-gray-200">
        <View className="flex-row justify-between items-center mt-1">
          <Text className="text-base text-gray-500">Flash card collections</Text>
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="cards" size={18} color="#004B8D" />
            <Text className="text-[#004B8D] font-medium ml-1.5">{totalCards} Cards</Text>
          </View>
        </View>
      </View>
      
      <FlatList
        data={savedDecks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            className="bg-white rounded-xl p-4 mb-3 mx-4 shadow-sm border border-gray-100"
            onPress={() => handleDeckPress(item)}
            activeOpacity={0.7}
          >
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <Text className="text-lg font-bold mb-1 text-gray-800">{item.title}</Text>
                {item.description ? (
                  <Text className="text-sm text-gray-500 mb-2">{item.description}</Text>
                ) : null}
              </View>
              
              <TouchableOpacity
                className="bg-gray-100 h-8 w-8 rounded-full items-center justify-center"
                onPress={() => handleRemoveDeck(item)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>
            
            <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-gray-100">
              <View className="flex-row items-center">
                <MaterialCommunityIcons name="cards-outline" size={16} color="#004B8D" />
                <Text className="text-sm font-medium text-[#004B8D] ml-1.5">{item.cardCount} Cards</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ padding: 12, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View className="flex-row justify-between items-center mb-4 px-4 py-3 bg-indigo-50 rounded-xl mx-4">
            <View className="flex-row items-center">
              <View className="bg-indigo-100 p-2 rounded-lg">
                <Ionicons name="stats-chart" size={20} color="#004B8D" />
              </View>
              <View className="ml-3">
                <Text className="text-sm text-gray-600">Total: </Text>
                <Text className="text-lg font-bold text-gray-900">{savedDecks.length} Cards</Text>
              </View>
            </View>
            
            <TouchableOpacity
              className="bg-[#004B8D] py-2 px-4 rounded-lg flex-row items-center"
              onPress={() => router.push('/(main)/vocabulary')}
            >
              <Ionicons name="add" size={18} color="white" />
              <Text className="text-white font-medium ml-1">Add more</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default UserFlashcardCollection;