import Loader from "@/components/Loader";
import useAuth from "@/hooks/auth/useAuth";
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

    const renderPracticeQuestions = () => {
        return lecture?.practiceQuestions.map((question, index) => (
            <View key={question.id} className="mb-4 p-4 bg-white rounded-lg shadow-lg border border-gray-200">
                <Text className="font-bold text-lg text-gray-800 mb-2">
                    <Ionicons name="help-circle-outline" size={20} color="#4F46E5" /> Câu hỏi {index + 1}
                </Text>
                <Text className="text-gray-700 mb-2">{question.transcript}</Text>
                <Text className="text-sm text-gray-500 mb-2">Giải thích: {question.explanation}</Text>
                <Text className="font-bold text-gray-800">Đáp án:</Text>
                {question.answers.map((answer, idx) => (
                    <Text key={idx} className="ml-4 text-gray-700">
                        <Ionicons name="ellipse" size={10} color="#9CA3AF" /> {answer}
                    </Text>
                ))}
                <Text className="mt-2 text-green-600 font-medium">
                    <Ionicons name="checkmark-circle-outline" size={16} color="#10B981" /> Đáp án đúng: {question.correctAnswer}
                </Text>
            </View>
        ));
    };

    const windowWidth = Dimensions.get('window').width;

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            {
                loading ? (
                    <Loader loadingText="Đang tải tài liệu" />
                ) : (
                    <ScrollView className="flex-1 p-4">
                        {/* Thông tin bài giảng */}
                        <View className="mb-6 p-5 bg-[#004B8D] rounded-lg shadow-lg">
                            <Text className="text-2xl font-bold text-white">{lecture?.name}</Text>
                            <Text className="text-sm text-gray-200 mt-2">
                                <Ionicons name="calendar-outline" size={16} color="#E5E7EB" /> Tạo lúc: {new Date(lecture?.createdAt as Date).toLocaleString()}
                            </Text>
                        </View>

                        {/* Nội dung bài giảng */}
                        <View className="mb-6 p-5 bg-white rounded-lg shadow-lg border border-gray-200">
                            <RenderHTML
                                contentWidth={windowWidth}
                                source={{ html: lecture?.content || '' }}
                                tagsStyles={{
                                    body: { fontSize: 16, lineHeight: 24 }, // Kích thước và khoảng cách dòng mặc định
                                    p: { fontSize: 16, lineHeight: 24 },
                                    span: {fontSize: 16, lineHeight: 24},
                                    h1: { fontSize: 20, fontWeight: 'bold' },
                                    h2: { fontSize: 18, fontWeight: 'bold' },
                                    h3: { fontSize: 16, fontWeight: 'bold' },
                                    img: { alignSelf: 'flex-start' },
                                }}
                            />
                        </View>

                        {/* Danh sách câu ôn tập */}
                        {/* <View className="mb-6">
                            <Text className="text-xl font-bold text-gray-800 mb-4">Câu hỏi ôn tập</Text>
                            {renderPracticeQuestions()}
                        </View> */}
                    </ScrollView>
                )
            }
        </SafeAreaView>
    );
}
