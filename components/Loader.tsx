import { ActivityIndicator, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';

interface LoaderProps {
  loadingText?: string;
}

export default function Loader({ loadingText }: LoaderProps) {
  const renderTextWithAnimation = (text: string) =>
    text.split('').map((char, i) => (
      <Animatable.Text
        key={i}
        animation="pulse"
        iterationCount="infinite"
        delay={i * 50}
        style={{
          fontSize: 25,
          fontWeight: 'bold',
          color: '#004B8D',
          transform: [
            { translateY: i % 2 === 0 ? -35 : 35 },
            { scale: 1.4 },
          ],
        }}
      >
        {char}
      </Animatable.Text>
    ));

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Phần chính: LottieView căn giữa nhưng nhích lên 75px */}
      <View className="flex-1 justify-center items-center">
        <LottieView
          source={require('@/assets/animations/loading.json')}
          autoPlay
          loop
          style={{
            width: 150,
            height: 150,
            transform: [{ translateY: -75 }],  // đẩy lên nửa chiều cao
          }}
        />

        {/* Phần phụ: loadingText và spinner */}
        {loadingText && (
          <View className="items-center mt-4 translate-y-[-75]">
            <View className="flex-row mb-2">
              {renderTextWithAnimation(loadingText)}
            </View>
            <ActivityIndicator size="large" color="#004B8D" />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
