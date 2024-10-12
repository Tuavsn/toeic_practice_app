import { Text, View } from "react-native";
import { useFonts, Raleway_700Bold } from "@expo-google-fonts/raleway";
import { Nunito_400Regular, Nunito_700Bold } from "@expo-google-fonts/nunito";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function HomeScreen() {

    const router = useRouter()

    let [fontsLoaded, fontError] = useFonts({
        Raleway_700Bold,
        Nunito_400Regular,
        Nunito_700Bold
    })

    if(!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <SafeAreaView>
            <View>
                <Text className="text-center" onPress={() => router.push('/(routes)/login')}>
                    HomeSCreen
                </Text>
            </View>
        </SafeAreaView>
    )
}