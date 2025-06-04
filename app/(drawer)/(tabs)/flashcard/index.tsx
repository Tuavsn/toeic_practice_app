import UserFlashcardCollection from "@/screens/flashcard/userFlashcardCollection.screen"
import { SafeAreaView } from "react-native-safe-area-context"

export default function FlashCardItem() {
  return (
    <SafeAreaView className="flex-1">
      <UserFlashcardCollection />
    </SafeAreaView>
  )
}