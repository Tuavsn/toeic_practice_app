import Loader from "@/components/loader/Loader";
import useAuth from "@/hooks/auth/useAuth";
import { getAllQuestions } from "@/services/question.service";
import { getAllResults } from "@/services/result.service";
import { PracticeType, Question, Result } from "@/types/global.type";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Button, FlatList, Text, TouchableOpacity, View } from "react-native";
import Collapsible from "react-native-collapsible";
import { SafeAreaView } from "react-native-safe-area-context";

interface Practice {
    id: string;
    title: string;
    exercises: Question[];
}

const DATA: Practice[] = [
    { id: '1', title: 'Part 1: Photographs', exercises: [] },
    { id: '2', title: 'Part 2: Question-Response', exercises: [] },
    { id: '3', title: 'Part 3: Short Conversations', exercises: [] },
    { id: '4', title: 'Part 4: Talks', exercises: [] },
    { id: '5', title: 'Part 5: Incomplete Sentences', exercises: [] },
    { id: '6', title: 'Part 6: Text Completion', exercises: [] },
    { id: '7', title: 'Part 7: Reading Comprehension', exercises: [] },
];

const ITEMS_PER_PAGE = 5;

interface PracticeListScreenProps {
    type: PracticeType;
}

export default function PracticeListScreen({ type }: PracticeListScreenProps) {

    const router = useRouter();

    const {user} = useAuth();

    const {loading, toggleLoading} = useAuth();

    const [practices, setPractices] = useState<Practice[]>([]);

    const [collapsed, setCollapsed] = useState<string | null>(null); // Trạng thái để kiểm soát dropdown

    const [page, setPage] = useState<{ [key: string]: number }>({}); // Trạng thái phân trang cho mỗi mục

    const [userAnswerIds, setUserAnswerIds] = useState<Set<string>>(new Set());

    const toggleCollapse = (id: string) => {
        setCollapsed(collapsed === id ? null : id); // Đổi trạng thái
    };

    const handlePress = async (question: Question, questNum: number) => {
        // Điều hướng đến PracticeDetail với params là question
        await router.push({
            pathname: '/(main)/practice',
            params: { question: JSON.stringify(question), questNum: questNum + 1 }, // Serialize question object
        });
    };

    useEffect(() => {
        const fetchExercises = async () => {
            toggleLoading()
            try {
                let filteredData = [];
                switch (type) {
                    case PracticeType.LISTENING:
                        filteredData = DATA.filter(practice => parseInt(practice.id) >= 1 && parseInt(practice.id) <= 4);
                        break;
                    case PracticeType.READING:
                        filteredData = DATA.filter(practice => parseInt(practice.id) >= 5 && parseInt(practice.id) <= 7);
                        break;
                    default:
                        filteredData = DATA;
                        break;
                }
                const promises = filteredData.map(async (practice) => {
                    const response = await getAllQuestions({ pageSize: '1000', partNum: practice.id});
                    const data = await response.json(); // Giả sử response có định dạng JSON
                    return {
                        ...practice,
                        exercises: data.data.result, // Cập nhật mảng exercises với dữ liệu trả về
                    };
                });
                // Chờ tất cả Promise hoàn thành và cập nhật practices
                const updatedPractices = await Promise.all(promises);
                setPractices(updatedPractices);
            } catch (error) {
                console.error('Error fetching exercises:', error);
            } finally {
                toggleLoading();
            }
        };
        fetchExercises();
    }, [])

    const fetchUserResults = async () => {
        toggleLoading()
        try {
            const userAnswersResponse = await getAllResults({ pageSize: "999", type: 'QUESTION' });
            const userAnswersData = await userAnswersResponse.json();
            const userAnswerIdsSet = new Set<string>(userAnswersData.data.result.map((result: Result) => result.userAnswers[0].questionId));
            setUserAnswerIds(userAnswerIdsSet);
        } catch (error) {
            console.error('Error fetching exercises:', error);
        } finally {
            toggleLoading()
        }
    }

    useFocusEffect(
        useCallback(() => {
            user && fetchUserResults();
            setCollapsed(null)
        }, [type])
    );

    const renderExercises = (exercises: Question[], practiceId: string) => {
        const currentPage = page[practiceId] || 1;
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const paginatedExercises = exercises.slice(start, end);

        return (
            <>
                <FlatList
                    data={paginatedExercises}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            key={index}
                            className="flex-row items-start justify-between mb-2 border border-gray-300 rounded-lg p-4"
                            onPress={() => handlePress(item, index)}
                        >
                            <View className="ml-2">
                                <View className="flex-row items-center">
                                    <Text className="text-gray-700 font-bold text-lg">Câu {index + 1 + start}</Text>
                                    {(userAnswerIds.has(item.id as string) ||
                                        (item.subQuestions &&
                                            item.subQuestions.some(subQuestion => userAnswerIds.has(subQuestion.id as string)))
                                    ) && (
                                        <Ionicons name="checkmark-circle" size={20} color="green" style={{ marginLeft: 8 }} />
                                    )}
                                </View>
                                <Text className="text-gray-600">Độ khó: {item.difficulty}</Text>
                                <Text className="text-gray-600">Topic: {item.topics}</Text>
                            </View>
                            <FontAwesome5 name={type === PracticeType.LISTENING ? "headphones" : "book-reader"} size={25} color="#004B8D" />
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item, index) => `${practiceId}-${index}`}
                />
                <View className="flex-row justify-between mt-2">
                    <Button
                        color={"#004B8D"}
                        title="Previous"
                        onPress={() => setPage((prev) => ({ ...prev, [practiceId]: currentPage - 1 }))}
                        disabled={currentPage === 1}
                    />
                    <Button
                        color={"#004B8D"}
                        title="Next"
                        onPress={() => setPage((prev) => ({ ...prev, [practiceId]: currentPage + 1 }))}
                        disabled={end >= exercises.length}
                    />
                </View>
            </>
        );
    };

    const renderItem = ({ item } : { item: Practice }) => (
        <View className="mb-2">
            <TouchableOpacity
                className="flex-row items-center justify-between p-4 border border-gray-300 rounded-lg bg-white"
                style={{shadowColor: "#171717" ,elevation: 2}}
                onPress={() => toggleCollapse(item.id)}
                >
                <Text className="text-lg font-semibold text-gray-800">{item.title}</Text>
                <Ionicons
                    name={collapsed === item.id ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#004B8D"
                />
            </TouchableOpacity>
            <Collapsible collapsed={collapsed !== item.id}>
                <View className="p-4 bg-gray-50 border border-gray-300 rounded-b-lg">
                    {renderExercises(item.exercises, item.id)}
                </View>
            </Collapsible>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            {
                loading ? (
                    <Loader loadingText="Đang tải câu hỏi" />
                ) : (
                    <FlatList
                        data={practices}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        contentContainerStyle={{ padding: 16 }}
                    />
                )
            }
        </SafeAreaView>
    )
}