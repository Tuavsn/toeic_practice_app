import { getAllQuestions } from "@/services/question.service";
import { Question } from "@/types/global.type";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
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
];

export default function CourseListScreen() {
    const [practices, setPractices] = useState<Practice[]>(DATA);

    const router = useRouter();

    const [collapsed, setCollapsed] = useState<string | null>(null); // Trạng thái để kiểm soát dropdown

    const toggleCollapse = (id: string) => {
        setCollapsed(collapsed === id ? null : id); // Đổi trạng thái
    };

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                // Tạo mảng các Promise từ DATA
                const promises = DATA.map(async (practice) => {
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
            }
        };

        fetchExercises();
    }, [])

    const renderItem = ({ item } : { item: Practice }) => (
        <View className="mb-2">
            <TouchableOpacity
                className="flex-row items-center justify-between p-4 border border-gray-300 rounded-lg bg-white"
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
                    {item.exercises.map((exercise, index) => (
                        <TouchableOpacity 
                            key={index} 
                            className="flex-row items-start justify-between mb-2 border border-gray-300 rounded-lg p-4"
                            onPress={() => router.push({pathname: '/(main)/test' })}
                        >
                            <View className="ml-2">
                                <Text className="text-gray-700 font-bold text-lg">Câu {index + 1}</Text>
                                <Text className="text-gray-600">Độ khó: {exercise.difficulty}</Text>
                                <Text className="text-gray-600">Topic: {exercise.topics}</Text>
                            </View>
                            <FontAwesome5 name="headphones" size={25} color="#004B8D" />
                        </TouchableOpacity>
                    ))}
                </View>
            </Collapsible>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <FlatList
                data={practices}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={{ padding: 16 }}
            />
        </SafeAreaView>
    )
}