import FlashCardDeckScreen from "@/screens/flashcard/flashCardDesk.screen";
import { useLocalSearchParams } from "expo-router";

export default function FlashCardDesk() {

  const { deckId, title } = useLocalSearchParams();

  return (
    <FlashCardDeckScreen deckId={Number.parseInt(deckId as string)} title={title as string} />
  )
}