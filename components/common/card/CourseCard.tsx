import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Badge } from '../badge/Badge';
import { RatingStars } from '../stat/RatingStart';

interface CourseCardProps {
  lessonNumber: string;
  level: string;
  title: string;
  imageSrc: any;
  progress: number; // 0 to 1
  chapterLabel: string;
  courseTitle: string;
  rating: number;
  onSelect: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  lessonNumber,
  level,
  title,
  imageSrc,
  progress,
  chapterLabel,
  courseTitle,
  rating,
  onSelect,
}) => (
  <View className="bg-white rounded-2xl p-6 items-center">
    <View className="w-full flex-row justify-between items-center">
      <Text className="font-bold text-gray-800 text-lg">{lessonNumber}</Text>
      <Badge label={level} />
    </View>
    <Text className="mt-2 text-2xl font-semibold text-gray-900">{title}</Text>
    <Image source={imageSrc} className="w-40 h-40 mt-4" resizeMode="contain" />
    <ProgressBar progress={progress} />
    <Text className="mt-2 text-gray-600">{chapterLabel}</Text>
    <Text className="mt-1 text-xl font-bold text-gray-800">{courseTitle}</Text>
    <RatingStars rating={rating} max={3} />
    <TouchableOpacity onPress={onSelect} className="mt-6 bg-blue-800 rounded-lg py-3 px-6">
      <Text className="text-white font-bold">Select this course</Text>
    </TouchableOpacity>
  </View>
);
