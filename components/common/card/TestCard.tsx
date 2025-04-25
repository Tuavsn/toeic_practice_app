import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export const LessonCard: React.FC = () => (
  <View className="mt-6 bg-gray-100 rounded-xl p-4">
    <Text className="font-bold text-gray-800">Lesson #1</Text>
    <Text className="mt-1 text-gray-600 text-lg font-semibold">Pronunciation Exercise</Text>
    <View className="flex-row justify-between mt-4">
      <View>
        <Text className="text-gray-500">Duration</Text>
        <Text className="font-medium">43 Min</Text>
      </View>
      <View>
        <Text className="text-gray-500">Difficulty</Text>
        <Text className="font-medium">Beginner</Text>
      </View>
      <View>
        <Text className="text-gray-500">Average Score</Text>
        <Text className="font-medium">3.0</Text>
      </View>
    </View>
    <TouchableOpacity className="mt-6 bg-blue-800 rounded-lg py-3 items-center">
      <Text className="text-white font-bold">Get started</Text>
    </TouchableOpacity>
  </View>
);