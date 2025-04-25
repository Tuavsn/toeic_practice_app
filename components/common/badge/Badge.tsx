import React from 'react';
import { View, Text } from 'react-native';

export const Badge: React.FC<{ label: string }> = ({ label }) => (
  <View className="bg-[#004B8D] text-white py-1 px-2 rounded-full mr-2 mb-1">
    <Text className="text-white text-sm">{label}</Text>
  </View>
);