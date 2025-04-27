// RatingStars.tsx
import React from 'react';
import { View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface RatingStarsProps {
  rating: number;
  max?: number;
  size?: number;
  filledColor?: string;
  emptyColor?: string;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  max = 5,
  size = 20,
  filledColor = '#f6ad55',   // amber-300
  emptyColor = '#e2e8f0',    // gray-200
}) => (
  <View className="flex-row mt-2">
    {Array.from({ length: max }).map((_, i) => (
      <FontAwesome
        key={i}
        name={i < rating ? 'star' : 'star-o'}
        size={size}
        color={i < rating ? filledColor : emptyColor}
        style={{ marginRight: 4 }}
      />
    ))}
  </View>
);
