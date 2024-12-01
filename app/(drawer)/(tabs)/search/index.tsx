import SearchScreen from "@/screens/search.screen"
import { SafeAreaView } from "react-native-safe-area-context"

export default function SearchTabItem() {
    return (
        <SafeAreaView className="flex-1">
            <SearchScreen />
        </SafeAreaView>
    )
}