import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {

    const router = useRouter()

    return (
        <SafeAreaView className="flex-1">
            <View className="flex-1 items-center mt-28">
                <Image 
                    className="w-[300px]"
                    source={require('@/assets/images/Login-logo.png')}
                />
                <Text className="mt-4 text-3xl font-bold text-[#004B8D]">
                    Đăng nhập với
                </Text>
                <TouchableOpacity className="mt-4 p-4 rounded-lg bg-[#E5E7EA]" style={{elevation: 2}} onPress={() => router.push('/(drawer)')}>
                    <Image 
                        className="w-[45px] h-[45px]"
                        source={require('@/assets/images/google-logo.png')} 
                    />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}