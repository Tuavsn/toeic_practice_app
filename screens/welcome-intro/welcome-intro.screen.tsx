import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WelcomeIntroScreen() {

    const router = useRouter()

    return (
        <SafeAreaView className="flex-1">
            <View className="flex-1 items-center justify-center">
                <Image 
                    style={{objectFit: "contain"}}
                    className="w-[350px]"
                    source={require('@/assets/images/Main-Logo.png')} 
                />
                <Text className="text-3xl px-2 font-bold text-center mb-6">Luyện thi TOIEC với ứng dụng TOIEC Practice</Text>
                <Text className="text-md text-slate-500 text-center mb-6 px-6">Hãy khám phá ngay bộ bài giảng và đề thi TOIEC chất lượng với ứng dụng TOIEC Practice</Text>
                <TouchableOpacity className="w-[80%] mt-4 p-4 rounded-lg bg-[#2765E6]" onPress={() => router.push('/(routes)/home')}>
                    <Text className="text-lg text-center text-white font-bold">Bắt đầu ngay</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}