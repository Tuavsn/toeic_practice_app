import QuestionDisplay from "@/components/test_card/QuestionDisplay";
import { Question } from "@/types/global.type";
import { useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TestDetailScreen() {

    const { question } = useLocalSearchParams();

    const parsedQuestion: Question = question ? JSON.parse(question as string) : null;

    return (
        <SafeAreaView className="flex-1">
            <ScrollView className="p-4 bg-white">
              {parsedQuestion && <QuestionDisplay question={parsedQuestion} />}
            </ScrollView>
        </SafeAreaView>
    )
}