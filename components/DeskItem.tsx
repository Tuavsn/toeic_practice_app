import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const placeholderImage = require('@/assets/images/course-placeholder.png');

interface DeckItemProps {
  deck: {
    id: number;
    title: string;
    description?: string;
    imageUrl?: string;
  };
  isSaved: boolean;
  onPress: () => void;
  onSave: () => Promise<void>;
}

const DeckItem: React.FC<DeckItemProps> = ({ deck, isSaved, onPress, onSave }) => {
  // Default background patterns based on deck ID (for consistent appearance)
  const defaultBackgrounds = placeholderImage
  
  return (
    <TouchableOpacity
      className="mx-4 my-3 h-36 rounded-xl overflow-hidden shadow-lg"
      activeOpacity={0.85}
      onPress={onPress}
    >
      <ImageBackground
        source={deck.imageUrl ? {uri: deck.imageUrl} : defaultBackgrounds}
        className="w-full h-full"
        imageStyle={{ borderRadius: 12 }}
      >
        <View className="absolute inset-0 bg-black opacity-40 rounded-xl" />
        
        <View className="flex-1 p-4 justify-between">
          <View className="flex-row items-center mb-1">
            <Ionicons name="book-outline" size={20} color="#ffffff" />
            <Text className="text-xl font-bold text-white ml-2">{deck.title}</Text>
          </View>
          
          {deck.description && (
            <Text className="text-sm text-gray-100 mb-2" numberOfLines={2}>
              {deck.description}
            </Text>
          )}
          
          <View className="flex-row justify-between items-center mt-2">
            <TouchableOpacity
              className={`px-3 py-2 rounded-lg flex-row items-center ${
                isSaved ? 'bg-blue-500' : 'bg-white bg-opacity-80'
              }`}
              onPress={onSave}
            >
              <Ionicons
                name={isSaved ? 'bookmark' : 'bookmark-outline'}
                size={16}
                color={isSaved ? '#ffffff' : '#3b82f6'}
              />
              <Text
                className={`text-sm font-medium ml-1 ${
                  isSaved ? 'text-white' : 'text-blue-500'
                }`}
              >
                {isSaved ? 'Đã lưu' : 'Lưu'}
              </Text>
            </TouchableOpacity>
            
            <View className="bg-white bg-opacity-80 rounded-full p-1">
              <Ionicons name="chevron-forward" size={18} color="#3b82f6" />
            </View>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default DeckItem;
