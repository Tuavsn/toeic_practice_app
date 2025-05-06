import React from 'react';
import { ImageBackground, TouchableOpacity, Text, View } from 'react-native';
import { BadgeList } from '../badge/BadgeList';
import { Lecture } from '@/types/global.type';

interface LectureCardProps {
  lecture: Lecture;
  imageSrc: any;
  onSelect: () => void;
}

export const LectureCard: React.FC<LectureCardProps> = ({ lecture, imageSrc, onSelect }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onSelect}
      className="w-full mb-4 rounded-2xl overflow-hidden shadow-md"
    >
      <ImageBackground
        source={imageSrc}
        className="w-full aspect-video"
        imageStyle={{ borderRadius: 16 }}
      >
        {/* Overlay */}
        <View className="absolute inset-0 bg-black opacity-40" />

        {/* Content */}
        <View className="relative p-4">
          <Text className="text-white text-2xl font-bold mb-1" numberOfLines={2}>
            {lecture.name}
          </Text>
          <View className="mb-2">
            <BadgeList list={lecture.topic} />
          </View>
          {lecture.content ? (
            <Text className="text-gray-200 text-sm mb-3" numberOfLines={3}>
              {lecture.content}
            </Text>
          ) : null}
          <View>
            <TouchableOpacity className="bg-blue-600 px-4 py-2 rounded-lg self-start" activeOpacity={0.8}>
              <Text className="text-white text-lg font-bold">Learn now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};
