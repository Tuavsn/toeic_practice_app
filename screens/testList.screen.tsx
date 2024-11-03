import Loader from "@/components/loader/Loader";
import useAuth from "@/hooks/auth/useAuth";
import { getAllCategories, getAllTestsByCategory } from "@/services/category.service";
import { getAllQuestions } from "@/services/question.service";
import { Category, Question, Test } from "@/types/global.type";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, FlatList, Text, TouchableOpacity, View } from "react-native";
import Collapsible from "react-native-collapsible";
import { SafeAreaView } from "react-native-safe-area-context";

const ITEMS_PER_PAGE = 5;

export default function TestListScreen() {

    const router = useRouter();

    const {loading, toggleLoading} = useAuth()

    const [categories, setCategories] = useState<Category[]>([]);

    const [collapsed, setCollapsed] = useState<string | null>(null); // Trạng thái để kiểm soát dropdown

    const [page, setPage] = useState<{ [key: string]: number }>({}); // Trạng thái phân trang cho mỗi mục

    const toggleCollapse = (id: string) => {
        setCollapsed(collapsed === id ? null : id); // Đổi trạng thái
    };

    const handlePress = (question: Question) => {
        // Điều hướng đến TestDetail với params là question
        router.push({
          pathname: '/(main)/test',
          params: { question: JSON.stringify(question) }, // Serialize question object
        });
    };

    useEffect(() => {
        const fetchCategoriesAndTests = async () => {
            toggleLoading()
            try {
                const categoriesResponse = await getAllCategories();
                const categoriesData = await categoriesResponse.json();
                // Fetch tests for each category
                const categoriesWithTests = await Promise.all(
                    categoriesData.data.result.map(async (category: Category) => {
                        const testsResponse = await getAllTestsByCategory(category.id);
                        const testsData = await testsResponse.json();
                        return {
                            ...category,
                            tests: testsData.data.result,
                        };
                    })
                );
                setCategories(categoriesWithTests);
            } catch (error) {
                console.error('Error fetching exercises:', error);
            } finally {
                toggleLoading()
            }
        };
        fetchCategoriesAndTests();
    }, [])

    const renderTests = (tests: Test[], categoryId: string) => {
        const currentPage = page[categoryId] || 1;
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const paginatedTests = tests.slice(start, end);

        return (
            <>
                <FlatList
                    data={paginatedTests}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            key={index}
                            className="flex-row items-start justify-between mb-2 border border-gray-300 rounded-lg p-4"
                            onPress={() => handlePress(item.questions[0])}
                        >
                            <View className="ml-2">
                                <Text className="text-gray-700 font-bold text-lg">{item.name}</Text>
                                <Text className="text-gray-600">Số câu: {item.totalQuestion}</Text>
                                <Text className="text-gray-600">Tổng điểm: {item.totalScore}</Text>
                            </View>
                            <FontAwesome5 name="headphones" size={25} color="#004B8D" />
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => `${categoryId}-${item.id}`}
                />
                <View className="flex-row justify-between mt-2">
                    <Button
                        title="Previous"
                        onPress={() => setPage((prev) => ({ ...prev, [categoryId]: currentPage - 1 }))}
                        disabled={currentPage === 1}
                    />
                    <Button
                        title="Next"
                        onPress={() => setPage((prev) => ({ ...prev, [categoryId]: currentPage + 1 }))}
                        disabled={end >= tests.length}
                    />
                </View>
            </>
        );
    };

    const renderItem = ({ item } : { item: Category }) => (
        <View className="mb-2">
            <TouchableOpacity
                className="flex-row items-center justify-between p-4 border border-gray-300 rounded-lg bg-white"
                onPress={() => toggleCollapse(item.id)}
                >
                <Text className="text-lg font-semibold text-gray-800">
                    {item.format} ({item.year})
                </Text>
                <Ionicons
                    name={collapsed === item.id ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#004B8D"
                />
            </TouchableOpacity>
            <Collapsible collapsed={collapsed !== item.id}>
                <View className="p-4 bg-gray-50 border border-gray-300 rounded-b-lg">
                    {renderTests(item.tests, item.id)}
                </View>
            </Collapsible>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            {
                loading ? (
                    <Loader />
                ) : (
                    <FlatList
                        data={categories}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ padding: 16 }}
                    />
                )
            }
        </SafeAreaView>
    )
}