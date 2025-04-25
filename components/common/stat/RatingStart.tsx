import React from 'react';
import { View, Image } from 'react-native';

export const RatingStars: React.FC<{ rating: number; max?: number }> = ({ rating, max = 5 }) => (
  <View className="flex-row mt-2">
    {Array.from({ length: max }).map((_, i) => (
      <Image
        key={i}
        source={
          i < rating
            ? require('../assets/star-filled.png')
            : require('../assets/star-outline.png')
        }
        className="w-5 h-5 mr-1"
      />
    ))}
  </View>
);