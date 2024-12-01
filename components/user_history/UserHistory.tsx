import useAuth from "@/hooks/auth/useAuth";
import { getAllResults } from "@/services/result.service";
import { Result, Test } from "@/types/global.type";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Text, View, Button, TouchableOpacity } from "react-native";
import ProgressBar from "./ProgressBar";
import { useRouter } from "expo-router";

const ITEMS_PER_PAGE = 5; // Number of items per page

export default function UserHistory() {

    const router = useRouter();

    const { toggleLoading } = useAuth();
    
    const [results, setResults] = useState<Result[]>([]);
    
    const [collapsedTestIds, setCollapsedTestIds] = useState<Set<string>>(new Set());

    // Track the current page for each testId group
    const [currentPages, setCurrentPages] = useState<Record<string, number>>({});

    // Group the results by testId
    const groupedResults = () => {
        const grouped = results.reduce((acc, result) => {
            const { testId } = result;
            if (!acc[testId]) {
                acc[testId] = [];
            }
            acc[testId].push(result);
            return acc;
        }, {} as Record<string, Result[]>);

        return grouped;
    };

    const fetchPracticeResults = async () => {
        toggleLoading();
        try {
            const response = await getAllResults({ pageSize: "999", type: "PRACTICE" });
            const data = await response.json();
            setResults(data.data.result);
        } catch (error) {
            console.error("Lỗi khi lấy kết quả bài kiểm tra:", error);
        } finally {
            toggleLoading();
        }
    };

    useEffect(() => {
        fetchPracticeResults();
    }, []);

    // Handle the collapse/expand of each testId group
    const toggleCollapse = (testId: string) => {
        setCollapsedTestIds((prev) => {
            const newCollapsedTestIds = new Set(prev);
            if (newCollapsedTestIds.has(testId)) {
                newCollapsedTestIds.delete(testId);
            } else {
                newCollapsedTestIds.add(testId);
            }
            return newCollapsedTestIds;
        });
    };

    // Paginate results for each testId group
    const paginatedResultsForTest = (testId: string) => {
        const currentPage = currentPages[testId] || 1;
        const groupedResult = groupedResults()[testId] || [];
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return groupedResult.slice(startIndex, endIndex);
    };

    // Change page for a specific testId group
    const changePage = (testId: string, direction: "next" | "prev") => {
        setCurrentPages((prev) => {
            const currentPage = prev[testId] || 1;
            const newPage = direction === "next" ? currentPage + 1 : currentPage - 1;
            return { ...prev, [testId]: newPage };
        });
    };

    const handlePress = async (resultId: string) => {
        await router.push({
            pathname: '/(main)/result',
            params: { resultId: resultId },
        });
    };

    return (
        <View className="p-4 bg-white rounded-3xl mb-6" style={{ shadowColor: "#171717", elevation: 4 }}>
            <View className="space-y-4">
                {Object.entries(groupedResults()).map(([testId, groupedResult], index) => (
                    <View key={index} className="space-y-2">
                        {/* Display the group with testId */}
                        <TouchableOpacity onPress={() => toggleCollapse(testId)}>
                            <View className="p-4 bg-gray-200 rounded-lg flex-row justify-between" style={{ elevation: 1 }}>
                                <Text className="font-bold text-gray-800">Mã đề: {testId}</Text>
                                <Ionicons
                                    name={collapsedTestIds.has(testId) ? "chevron-up" : "chevron-down"}
                                    size={20}
                                    color="#004B8D"
                                />
                            </View>
                        </TouchableOpacity>

                        {/* Display results if not collapsed */}
                        {!collapsedTestIds.has(testId) && (
                            <View>
                                {paginatedResultsForTest(testId).map((result, idx) => (
                                    <TouchableOpacity onPress={() => handlePress(result.id as string)} key={idx} className="p-4 bg-gray-100 rounded-lg shadow-sm my-2">
                                        {/* <Text className="font-bold text-gray-800">Thời gian hoàn thành: {result.totalTime} phút</Text> */}
                                        <Text className="font-bold text-gray-800">Lần {idx + 1}</Text>
                                        <Text className="text-gray-800">Tổng điểm: {result.totalReadingScore + result.totalListeningScore}</Text>
                                        <Text className="text-gray-800">Điểm Đọc: {result.totalReadingScore}</Text>
                                        <Text className="text-gray-800">Điểm Nghe: {result.totalListeningScore}</Text>
                                        <View className="flex-row items-center justify-between">
                                            <Text className="text-gray-800">
                                                Câu đúng: {result.totalCorrectAnswer}/{result.totalCorrectAnswer + result.totalIncorrectAnswer + result.totalSkipAnswer}
                                            </Text>
                                            <ProgressBar 
                                                value={result.totalCorrectAnswer / (result.totalCorrectAnswer + result.totalIncorrectAnswer + result.totalSkipAnswer)} 
                                                color="#4CAF50" // Green for correct answers
                                            />
                                        </View>
                                        <View className="flex-row items-center justify-between">
                                            <Text className="text-gray-800">
                                                Câu sai: {result.totalIncorrectAnswer}/{result.totalCorrectAnswer + result.totalIncorrectAnswer + result.totalSkipAnswer}
                                            </Text>
                                            <ProgressBar 
                                                value={result.totalIncorrectAnswer / (result.totalCorrectAnswer + result.totalIncorrectAnswer + result.totalSkipAnswer)} 
                                                color="#FF0000" // Red for incorrect answers
                                            />
                                        </View>
                                        <View className="flex-row items-center justify-between">
                                            <Text className="text-gray-800">
                                                Câu bỏ qua: {result.totalSkipAnswer}/{result.totalCorrectAnswer + result.totalIncorrectAnswer + result.totalSkipAnswer}
                                            </Text>
                                            <ProgressBar 
                                                value={result.totalSkipAnswer / (result.totalCorrectAnswer + result.totalIncorrectAnswer + result.totalSkipAnswer)} 
                                                color="#FFC107" // Yellow for skipped answers
                                            />
                                        </View>
                                    </TouchableOpacity>
                                ))}

                                {/* Pagination controls for the current testId */}
                                <View className="flex-row justify-between items-center mt-4">
                                    <Button
                                        title="Trước"
                                        onPress={() => changePage(testId, "prev")}
                                        disabled={currentPages[testId] === 1}
                                    />
                                    <Button
                                        title="Sau"
                                        onPress={() => changePage(testId, "next")}
                                        disabled={currentPages[testId] * ITEMS_PER_PAGE >= groupedResult.length}
                                    />
                                </View>
                            </View>
                        )}
                    </View>
                ))}
            </View>
        </View>
    );
}
