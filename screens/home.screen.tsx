import CourseMenuButton from "@/components/common/button/CourseMenuButton";
import PracticeMenuButton from "@/components/common/button/PracticeMenuButton";
import Loader from "@/components/Loader";
import DiscoverStudyPath from "@/components/DiscoverStudyPath";
import UserHistory from "@/components/UserHistory";
import useAuth from "@/hooks/auth/useAuth";
import React from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";

export default function HomeScreen() {

    const {user, loading} = useAuth();

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
          setRefreshing(false);
        }, 2000);
      }, []);


    return (
        <ScrollView className="px-4 mt-4"
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
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