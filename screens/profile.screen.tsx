import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {

    return (
        <SafeAreaView className="flex-1">
           <View>
                <Text>Profile</Text>
           </View>
        </SafeAreaView>
    )
}