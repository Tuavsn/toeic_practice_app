import DeckDetailScreen from "@/screens/deskDetail.screen";
import { useLocalSearchParams } from "expo-router";

export default function DeskDetail() {

    const { deckId } = useLocalSearchParams();
    
    return (
        <DeckDetailScreen deckId={deckId}  />
    )
}