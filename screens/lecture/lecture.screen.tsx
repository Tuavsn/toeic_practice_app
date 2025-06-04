import Loader from "@/components/Loader";
import useAuth from "@/hooks/useAuth";
import { Lecture } from "@/types/global.type";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import RenderHTML from "react-native-render-html";
import lectureService from "@/services/lecture.service";

export default function LectureScreen() {

    const { loading, toggleLoading } = useAuth();

    const { lectureId } = useLocalSearchParams();

    const [lecture, setLecture] = useState<Lecture>();

    useEffect(() => {
        const fetchLecture = async () => {
            toggleLoading();
            try {
                const response = await lectureService.getLectureById(lectureId as string, { pageSize: 1000, info: true, content: true, practice: true });
                const data = await response.data;
                setLecture(data);
            } catch (error) {
                console.error("Error fetching lectures:", error);
            } finally {
                toggleLoading();
            }
        };
        fetchLecture();
    }, []);

    const windowWidth = Dimensions.get('window').width;

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            {
                !loading && (
                    <ScrollView className="flex-1 p-4">
                        {/* Lecture information */}
                        <View className="mb-6 p-5 bg-[#004B8D] rounded-lg shadow-lg">
                            {/* Overlay */}
                            <View className="absolute inset-0 bg-black opacity-20" />
                            <View className="relative">
                                <Text className="text-2xl font-bold text-white">{lecture?.name}</Text>
                                <Text className="text-sm text-white mt-2">
                                    <Ionicons name="calendar-outline" size={16} color="#E5E7EB" /> Created at: {new Date(lecture?.createdAt as Date).toLocaleString()}
                                </Text>
                            </View>
                        </View>

                        {/* Lecture content */}
                        <View className="mb-6 p-5 bg-white rounded-lg shadow-lg border border-gray-200">
                            <RenderHTML
                                contentWidth={windowWidth}
                                source={{ html: lecture?.content || '' }}
                                tagsStyles={{
                                    body: { fontSize: 16, lineHeight: 24, overflow: 'hidden' }, // Default font size and line spacing
                                    p: { fontSize: 16, lineHeight: 24 },
                                    span: {fontSize: 16, lineHeight: 24},
                                    h1: { fontSize: 20, fontWeight: 'bold' },
                                    h2: { fontSize: 18, fontWeight: 'bold' },
                                    h3: { fontSize: 16, fontWeight: 'bold' },
                                    img: { alignSelf: 'flex-start' },
                                }}
                            />
                        </View>
                    </ScrollView>
                )
            }
        </SafeAreaView>
    );
}