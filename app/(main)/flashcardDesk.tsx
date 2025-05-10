import FlashCardDeckScreen from "@/screens/flashCardDesk.screen";
import { useLocalSearchParams } from "expo-router";

export default function FlashCardDesk() {

    const { deckId, title } = useLocalSearchParams();

    return (
        <FlashCardDeckScreen deckId={deckId} title={title} />
    )
}