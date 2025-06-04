import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { BadgeList } from '../badge/BadgeList';
import { Lecture } from '@/types/global.type';
import { FontAwesome, AntDesign } from "@expo/vector-icons";

interface LectureCardProps {
  lecture: Lecture;
  onSelect: () => void;
}

export const LectureCard: React.FC<LectureCardProps> = ({ lecture, onSelect }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onSelect}
      className="flex-row items-center p-3 bg-white rounded-lg border border-gray-200 mb-2 w-full"
    >
      {/* Left Icon */}
      <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mr-3">
        <FontAwesome name="mortar-board" size={18} color="#004B8D" />
      </View>
      
      {/* Content */}
      <View className="flex-1">
        <Text className="text-gray-800 font-semibold text-base" numberOfLines={1}>
          {lecture.name}
        </Text>
        
        {/* Topic badges - using BadgeList from existing code */}
        {lecture.topic && lecture.topic.length > 0 && (
          <View className="mt-1">
            <BadgeList list={lecture.topic} />
          </View>
        )}
      </View>
      
      {/* Right Icon */}
      <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center">
        <AntDesign name="right" size={16} color="#004B8D" />
      </View>
    </TouchableOpacity>
  );
};