import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotifyScreen() {

    const router = useRouter()

    return (
        <SafeAreaView className="flex-1">
            <View className="flex-1 items-center mt-32">
                <Text className="mt-4 text-3xl font-bold text-[#004B8D]">
                    Notify
                </Text>
            </View>
        </SafeAreaView>
    )
}