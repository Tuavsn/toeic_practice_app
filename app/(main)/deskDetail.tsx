import DeckDetailScreen from "@/screens/flashcard/deskDetail.screen";
import { useLocalSearchParams } from "expo-router";

export default function DeskDetail() {

  const { deckId } = useLocalSearchParams();

  return (
    <DeckDetailScreen deckId={Number.parseInt(deckId as string)} />
  )
}