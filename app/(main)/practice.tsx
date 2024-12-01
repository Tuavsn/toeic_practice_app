import PracticeListScreen from "@/screens/practiceList.screen";
import QuestionDetailScreen from "@/screens/questionDetail.screen";
import { PracticeType } from "@/types/global.type";
import { useLocalSearchParams } from "expo-router";

export default function Practice() {

    const { type, isList } = useLocalSearchParams();

    if(isList) return (
        <PracticeListScreen type={type as PracticeType} />
    )

    return (
        <QuestionDetailScreen />  
    )
}