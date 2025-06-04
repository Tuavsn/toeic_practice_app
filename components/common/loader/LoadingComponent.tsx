import LottieView from "lottie-react-native";
import React, { useEffect, useRef } from "react";
import { Animated, Text } from "react-native";

interface LoadingComponentProps {
  message?: string;
  size?: number;
  animationSource?: any;
  showMessage?: boolean;
  containerStyle?: string;
  textStyle?: string;
}

export const Loader: React.FC<LoadingComponentProps> = ({
  message = "Loading...",
  size = 120,
  animationSource = require('@/assets/animations/loading.json'),
  showMessage = true,
  containerStyle = 'items-center justify-center py-8',
  textStyle = 'mt-2 text-base text-gray-600'
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true
      })
    ]).start();
  }, [])

  return (
    <Animated.View
      className={containerStyle}
      style={{
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }]
      }}
    >
      <LottieView
        source={animationSource}
        autoPlay
        loop
        style={{ width: size, height: size }}
      />
      {showMessage && (
        <Text className={textStyle}>
          {message}
        </Text>
      )}
    </Animated.View>
  )
}

export const InlineLoader: React.FC<Pick<LoadingComponentProps, 'message' | 'animationSource'>> = ({
  message = 'Loading...',
  animationSource = require('@/assets/animations/loading.json')
}) => (
  <Loader
    message={message}
    size={80}
    animationSource={animationSource}
    containerStyle="flex-row items-center justify-center py-4"
    textStyle="ml-2 text-sm text-gray-600"
  />
)

export const FullScreenLoader: React.FC<Pick<LoadingComponentProps, 'message' | 'animationSource'>> = ({
  message = 'Loading...',
  animationSource = require('@/assets/animations/loading.json')
}) => (
  <Loader
    message={message}
    size={120}
    animationSource={animationSource}
    containerStyle="items-center"
    textStyle="mt-3 text-base text-gray-700 font-medium"
  />
)

export const ListeningLoader: React.FC<Omit<LoadingComponentProps, 'animationSource'>> = (props) => (
  <Loader
    {...props}
    animationSource={require('@/assets/animations/listening.json')}
    message={props.message || "Loading listening content..."}
  />
);

export const ReadingLoader: React.FC<Omit<LoadingComponentProps, 'animationSource'>> = (props) => (
  <Loader
    {...props}
    animationSource={require('@/assets/animations/reading.json')}
    message={props.message || "Loading reading content..."}
  />
);