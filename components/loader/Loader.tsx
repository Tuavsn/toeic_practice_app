import { ActivityIndicator, Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Loader() {
    return (
        <SafeAreaView className="flex-1">
            <View className="flex-1 items-center justify-center">
                <Image
                    className="w-[300px]"
                    source={require('@/assets/images/Login-logo.png')}
                />
                <ActivityIndicator size="large" color="#004B8D" />
            </View>
        </SafeAreaView>
    )
}