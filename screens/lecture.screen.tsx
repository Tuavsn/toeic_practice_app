import { useRouter } from "expo-router";
import { Button, ScrollView, Text } from "react-native";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LectureScreen() {

    const router = useRouter();

    return (
        <SafeAreaView className="flex-1">
            <ScrollView className="flex-1 bg-gray-100 p-4">
                {/* <Text className="text-2xl font-bold mb-2">{title}</Text>
                <Text className="text-gray-700 mb-4">{description}</Text> */}
                <Text className="text-lg font-semibold mb-2">Bài tập:</Text>
                {/* {exercises.map((exercise, index) => (
                    <View key={index} className="flex-row items-center mb-2">
                        <Text className="text-gray-800">• {exercise}</Text>
                    </View>
                ))} */}
                <Button title="Quay lại" onPress={() => router.back()} />
            </ScrollView>
        </SafeAreaView>
    )
}