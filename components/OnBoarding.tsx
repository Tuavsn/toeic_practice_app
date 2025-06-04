import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function OnBoarding() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleGetStarted = async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.setItem('firstLoad', 'false');
      router.push('/(drawer)/(tabs)');
    } catch (error) {
      console.error("Error navigating to main screen:", error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <View className="flex-1 items-center justify-center">
      <Image
        style={{ objectFit: "contain" }}
        className="w-[350px]"
        source={require('@/assets/images/Main-Logo.png')}
      />
      <Text className="text-3xl px-2 font-bold text-center mb-6">Practice TOEIC with TOEIC Practice app</Text>
      <Text className="text-md text-slate-500 text-center mb-6 px-6">Explore quality TOEIC lessons and practice tests with the TOEIC Practice app</Text>
      <TouchableOpacity
        className={`w-[80%] mt-4 p-4 rounded-lg ${isLoading ? 'bg-gray-400' : 'bg-[#2765E6]'}`}
        onPress={handleGetStarted}
        disabled={isLoading}
      >
        <Text className="text-lg text-center text-white font-bold">
          {isLoading ? "Loading data..." : "Get Started"}
        </Text>
      </TouchableOpacity>
    </View>
  )
}