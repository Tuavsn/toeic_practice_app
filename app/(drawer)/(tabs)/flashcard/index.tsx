import FlashCardScreen from "@/screens/flashCard.screen"
import { SafeAreaView } from "react-native-safe-area-context"

export default function FlashCardItem() {
    return (
        <SafeAreaView className="flex-1">
            <FlashCardScreen />
        </SafeAreaView>
    )
}