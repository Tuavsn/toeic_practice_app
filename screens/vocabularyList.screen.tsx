import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, SafeAreaView, TouchableOpacity } from 'react-native';
import Database from '../database/Database';
import FlashCardService from '../services/flashcard.service';
import DeckItem from '../components/DeskItem';
import { useRouter, useFocusEffect } from 'expo-router';

interface Deck {
  id: number;
  title: string;
  description?: string;
  imageUrl?: string;
}

const VocabularyScreen = () => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [savedDeckIds, setSavedDeckIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Load data initially
  useEffect(() => {
    loadData();
  }, []);

  // Reload data when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async (): Promise<void> => {
    try {
      setLoading(true);
      const dbInstance = Database.getInstance();
      const allDecks = await dbInstance.getAllDecks();
      setDecks(allDecks);
      await loadSavedDecks();
    } catch (err) {
      console.error('Error loading vocabulary data:', err);
      setError('Không thể tải dữ liệu từ vựng. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const loadSavedDecks = async (): Promise<void> => {
    try {
      const ids = await FlashCardService.getSavedDeckIds();
      setSavedDeckIds(ids);
    } catch (err) {
      console.error('Error loading saved decks:', err);
    }
  };

  const handleDeckPress = (deck: Deck): void => {
    router.push({
      pathname: '/(main)/deskDetail',
      params: { deckId: deck.id }
    });
  };

  const handleSaveDeck = async (deck: Deck): Promise<void> => {
    try {
      const deckIdString = deck.id.toString();
      const isDeckSaved = savedDeckIds.includes(deckIdString);
      if (isDeckSaved) {
        const updatedIds = await FlashCardService.removeSavedDeck(deckIdString);
        setSavedDeckIds(updatedIds);
      } else {
        const updatedIds = await FlashCardService.saveDeckId(deckIdString);
        setSavedDeckIds(updatedIds);
      }
    } catch (err) {
      console.error('Error saving/removing deck:', err);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#007AFF" />
        <Text className="mt-2 text-base text-gray-800">Đang tải dữ liệu...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100 p-5">
        <Text className="text-base text-red-500 text-center mb-5">{error}</Text>
        <TouchableOpacity className="px-5 py-2.5 bg-blue-500 rounded-lg shadow-md" onPress={loadData}>
          <Text className="text-white text-base font-semibold">Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderDeckItem = ({ item }: { item: Deck }): React.ReactElement => {
    const isSaved = savedDeckIds.includes(item.id.toString());
    return (
      <DeckItem
        deck={item}
        isSaved={isSaved}
        onPress={() => handleDeckPress(item)}
        onSave={() => handleSaveDeck(item)}
      />
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-row justify-between items-center px-5 py-4 bg-white border-b border-gray-200 shadow-sm">
        <Text className="text-2xl font-bold text-gray-800">Từ vựng</Text>
        <TouchableOpacity className="px-4 py-2.5 bg-blue-500 rounded-lg shadow-md">
          <Text className="text-white text-sm font-semibold">+ Tạo mới</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1 p-5 mb-6">
        {decks.length > 0 ? (
          <FlatList
            data={decks}
            renderItem={renderDeckItem}
            keyExtractor={(item: Deck) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View className="flex-1 justify-center items-center p-5">
            <Text className="text-lg text-gray-600 text-center mb-6">
              Chưa có bộ từ vựng nào. Hãy tạo bộ từ vựng mới!
            </Text>
            <TouchableOpacity className="px-6 py-3.5 bg-blue-500 rounded-lg shadow-md">
              <Text className="text-white text-lg font-semibold">Tạo bộ từ vựng</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default VocabularyScreen;