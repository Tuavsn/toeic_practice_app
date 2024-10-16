import HomeMenuButtons from "@/components/home_menu/HomeMenuButtons";
import DiscoverStudyPath from "@/components/studypath/DiscoverStudyPath";
import { ScrollView, Text, View } from "react-native";

export default function HomeScreen() {
    return (
        <ScrollView className="px-4">
            <View>
                <Text>
                    <Text className="text-3xl font-bold text-[#004B8D]">Toiec</Text>
                    <Text className="text-3xl font-bold text-[#FF5757]"> Practice</Text>
                </Text>
            </View>
            {/* Discover study path */}
            <DiscoverStudyPath />
            <Text className="text-3xl font-bold text-[#004B8D]">Menu</Text>
            {/* Menu buttons */}
            <HomeMenuButtons />
        </ScrollView>
    )
}