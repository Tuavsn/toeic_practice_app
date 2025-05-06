import PracticeListScreen from "@/screens/practiceList.screen";
import { PracticeType } from "@/types/global.type";
import { useLocalSearchParams } from "expo-router";

export default function PracticeList() {

    const { type } = useLocalSearchParams();

    return <PracticeListScreen type={type as PracticeType} />
}