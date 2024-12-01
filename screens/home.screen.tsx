import CourseMenuButton from "@/components/home_menu/CourseMenuButton";
import PracticeMenuButton from "@/components/home_menu/PracticeMenuButton";
import Loader from "@/components/loader/Loader";
import DiscoverStudyPath from "@/components/studypath/DiscoverStudyPath";
import UserHistory from "@/components/user_history/UserHistory";
import useAuth from "@/hooks/auth/useAuth";
import { ScrollView, Text, View } from "react-native";

export default function HomeScreen() {

    const {user, loading} = useAuth();

    return (
        <ScrollView className="px-4 mt-4">
            <View>
                <Text>
                    <Text className="text-3xl font-bold text-[#004B8D]">Toiec</Text>
                    <Text className="text-3xl font-bold text-[#FF5757]"> Practice</Text>
                </Text>
            </View>
            {/* Discover study path */}
            <DiscoverStudyPath />
            <Text className="text-2xl font-bold text-[#004B8D] my-2">Lý thuyết</Text>
            {/* Course Menu Buttons */}
            <CourseMenuButton />
            <Text className="text-2xl font-bold text-[#004B8D] my-2">Luyện tập</Text>
            {/* Practice Menu buttons */}
            <PracticeMenuButton />
            {user && (
                <>
                    {/* Practice history */}
                    <Text className="text-2xl font-bold text-[#004B8D] mb-2 mt-6">Lịch sử luyện tập</Text>
                    <UserHistory />
                </>
            )}
        </ScrollView>
    )
}