import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, Animated, Dimensions, StyleSheet, View } from 'react-native';

const { width } = Dimensions.get('window');

interface FlashCardProps {
  frontText: string;
  backText: string;
  flipped: boolean;
  onFlip: () => void;
  index?: number;
}

const FlashCard: React.FC<FlashCardProps> = ({
  frontText,
  backText,
  flipped,
  onFlip,
  index = 0,
}) => {
  const [flipAnimation] = useState(() => new Animated.Value(0));
  
  useEffect(() => {
    // Enhanced spring animation with better parameters for smoother transitions
    Animated.spring(flipAnimation, {
      toValue: flipped ? 1 : 0,
      friction: 9,     // Higher friction for less oscillation
      tension: 15,     // Balanced tension for natural motion
      speed: 14,       // Speed factor to make animation quicker
      useNativeDriver: true,
    }).start();
  }, [flipped, flipAnimation]);

  // Create more nuanced interpolations for rotation
  const frontRotate = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '90deg', '180deg'],
  });
  
  const backRotate = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['180deg', '270deg', '360deg'],
  });

  // Scale effect during rotation to enhance 3D look
  const scale = flipAnimation.interpolate({
    inputRange: [0, 0.15, 0.5, 0.85, 1],
    outputRange: [1, 1.07, 1.1, 1.07, 1],
  });

  // Smoother opacity transitions with expanded input range
  const frontOpacity = flipAnimation.interpolate({
    inputRange: [0.25, 0.26],
    outputRange: [1, 0],
  });
  
  const backOpacity = flipAnimation.interpolate({
    inputRange: [0.74, 0.75],
    outputRange: [0, 1],
  });

  // Shadow interpolation for enhanced depth effect
  const shadowOpacity = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.1, 0.3],
  });

  // Enhanced styles with better perspective and transformations
  const frontStyle = {
    transform: [
      { perspective: 1500 },
      { rotateY: frontRotate },
      { scale: scale },
    ],
    opacity: frontOpacity,
    shadowOpacity: shadowOpacity,
  };
  
  const backStyle = {
    transform: [
      { perspective: 1500 },
      { rotateY: backRotate },
      { scale: scale },
    ],
    opacity: backOpacity,
    shadowOpacity: shadowOpacity,
  };

  return (
    <TouchableOpacity
      className="w-full max-w-md h-52 my-2 mx-auto"
      onPress={onFlip}
      activeOpacity={0.9}
    >
      {/* Front side */}
      <View
        className="absolute w-full h-full rounded-xl bg-gray-100 border border-gray-200 shadow-lg p-5 justify-center items-center"
        style={[styles.card, frontStyle]}
      >
        {index > 0 && (
          <Text className="absolute top-4 left-4 text-sm text-gray-500">{index}</Text>
        )}
        <Text className="text-3xl font-bold text-gray-800 text-center">
          {frontText}
        </Text>
        <Text className="absolute bottom-4 text-xs italic text-gray-400">
          Nhấn để xem nghĩa
        </Text>
      </View>

      {/* Back side */}
      <View
        className="absolute w-full h-full rounded-xl bg-blue-500 shadow-lg p-5 justify-center items-center"
        style={[styles.card, backStyle]}
      >
        {index > 0 && (
          <Text className="absolute top-4 left-4 text-sm text-gray-100">{index}</Text>
        )}
        <Text className="text-2xl font-bold text-white text-center">
          {backText}
        </Text>
        <Text className="absolute bottom-4 text-xs italic text-gray-200">
          Nhấn để xem từ
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// Additional styles for enhanced shadow effects
const styles = StyleSheet.create({
  card: {
    backfaceVisibility: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 6,
    elevation: 8,
  }
});

export default FlashCard;