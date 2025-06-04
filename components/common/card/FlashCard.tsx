import React, { useRef, useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Animated as AnimatedType } from 'react-native';

interface EnhancedFlashCardProps {
  frontText: string;
  backText: string;
  flipped: boolean;
  onFlip: () => void;
}

const FlashCard: React.FC<EnhancedFlashCardProps> = ({ 
  frontText, 
  backText, 
  flipped, 
  onFlip 
}) => {
  const flipAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(flipAnim, {
      toValue: flipped ? 180 : 0,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
  }, [flipped]);

  const frontAnimatedStyle: { transform: any[] } = {
    transform: [
      { perspective: 1000 },
      {
        rotateY: flipAnim.interpolate({
          inputRange: [0, 180],
          outputRange: ['0deg', '180deg'],
        }),
      },
    ],
  };

  const backAnimatedStyle: { transform: any[] } = {
    transform: [
      { perspective: 1000 },
      {
        rotateY: flipAnim.interpolate({
          inputRange: [0, 180],
          outputRange: ['180deg', '360deg'],
        }),
      },
    ],
  };

  const frontOpacity: AnimatedType.AnimatedInterpolation<number> = flipAnim.interpolate({
    inputRange: [89, 90],
    outputRange: [1, 0],
  });

  const backOpacity: AnimatedType.AnimatedInterpolation<number> = flipAnim.interpolate({
    inputRange: [89, 90],
    outputRange: [0, 1],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      className="w-full h-full"
      onPress={onFlip}
    >
      <View className="w-full h-full relative">
        {/* Front side of the card */}
        <Animated.View
          className="absolute w-full h-full bg-white rounded-xl shadow-md p-6 justify-center items-center"
          style={[frontAnimatedStyle, { opacity: frontOpacity, backfaceVisibility: 'hidden' }]}
        >
          <Text className="text-2xl font-bold text-center text-gray-800">
            {frontText}
          </Text>
          <Text className="text-sm text-gray-500 mt-4 text-center">
            Tap to see definition
          </Text>
        </Animated.View>

        {/* Back side of the card */}
        <Animated.View
          className="absolute w-full h-full bg-blue-50 rounded-xl shadow-md p-6 justify-center items-center"
          style={[backAnimatedStyle, { opacity: backOpacity, backfaceVisibility: 'hidden' }]}
        >
          <Text className="text-xl text-center text-gray-800">
            {backText}
          </Text>
          <Text className="text-sm text-gray-500 mt-4 text-center">
            Tap to see term
          </Text>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

export default FlashCard;