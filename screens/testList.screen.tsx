import Loader from "@/components/Loader";
import useAuth from "@/hooks/auth/useAuth";
import categoryService from "@/services/category.service";
import resultService from "@/services/result.service";
import { Category, Result, Test } from "@/types/global.type";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Button, FlatList, Text, TouchableOpacity, View } from "react-native";
import Collapsible from "react-native-collapsible";
import { SafeAreaView } from "react-native-safe-area-context";

const ITEMS_PER_PAGE = 5;

export default function TestListScreen() {

    const router = useRouter();

    const {user} = useAuth();

    const {loading, toggleLoading} = useAuth();

    const [categories, setCategories] = useState<Category[]>([]);

    const [collapsed, setCollapsed] = useState<string | null>(null); // Trạng thái để kiểm soát dropdown

    const [page, setPage] = useState<{ [key: string]: number }>({}); // Trạng thái phân trang cho mỗi mục

    const [userTestIds, setUserTestIds] = useState<Set<string>>(new Set());

    const toggleCollapse = (id: string) => {
        setCollapsed(collapsed === id ? null : id); // Đổi trạng thái
    };

    const handlePress = (testId: string) => {
        // Điều hướng đến TestDetail với params là question
        router.push({
            pathname: '/(main)/test',
            params: { testId: testId }, // Serialize question object
        });
    };

    useEffect(() => {
        const fetchCategoriesAndTests = async () => {
            toggleLoading()
            try {
                const categoriesResponse = await categoryService.getAllCategories();
                const categoriesData = await categoriesResponse.data;
                // Fetch tests for each category
                const categoriesWithTests = await Promise.all(
                    categoriesData.map(async (category: Category) => {
                        const testsResponse = await categoryService.getAllTestsByCategory(category.id as string);
                        const testsData = await testsResponse.data;
                        return {
                            ...category,
                            tests: testsData,
                        };
                    })
                );
                setCategories(categoriesWithTests);
            } catch (error) {
                console.error('Error fetching tests:', error);
            } finally {
                toggleLoading()
            }
        };
        fetchCategoriesAndTests();
    }, [])

    const fetchUserResults = async () => {
        toggleLoading()
        try {
            const userAnswersResponse = await resultService.getAllResults({ pageSize: 999, type: 'PRACTICE' });
            const userAnswersData = await userAnswersResponse.data;

            const userTestIdsSet = new Set<string>(userAnswersData.map((result: Result) => result.testId));
            setUserTestIds(userTestIdsSet);
        } catch (error) {
            console.error('Error fetching results:', error);
        } finally {
            toggleLoading()
        }
    }

    useFocusEffect(
        useCallback(() => {
            user && fetchUserResults();
            setCollapsed(null)
        }, [])
    );

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
                            onPress={() => handlePress(item.id as string)}
                        >
                            <View className="ml-2">
                                <View className="flex-row items-center">
                                    <Text className="text-gray-700 font-bold text-lg">{item.name}</Text>
                                    {(userTestIds.has(item.id as string)) && (
                                        <Ionicons name="checkmark-circle" size={20} color="green" style={{ marginLeft: 8 }} />
                                    )}
                                </View>
                                <Text className="text-gray-600">Số câu: {item.totalQuestion}</Text>
                                <Text className="text-gray-600">Tổng điểm: {item.totalScore}</Text>
                            </View>
                            <FontAwesome6 name="file-circle-check" size={25} color="#004B8D" />
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
                style={{shadowColor: "#171717" ,elevation: 2}}
                onPress={() => toggleCollapse(item.id as string)}
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
                    {renderTests(item.tests, item.id as string)}
                </View>
            </Collapsible>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            {
                loading ? (
                    <Loader loadingText="Đang tải danh sách đề"/>
                ) : 
                    <FlatList
                        data={categories}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id as string}
                        contentContainerStyle={{ padding: 16 }}
                    />
                
            }
        </SafeAreaView>
    )
}