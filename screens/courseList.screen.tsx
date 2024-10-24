import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import Collapsible from "react-native-collapsible";
import { SafeAreaView } from "react-native-safe-area-context";

interface Lecture {
    id: string;
    title: string;
    exercises: string[];
}

const DATA: Lecture[] = [
    { id: '1', title: 'Bài giảng 1: Giới thiệu về React Native', exercises: ['Tài liệu 1.1', 'Tài liệu 1.2', 'Test 1', 'Test 2', 'Test 3', 'Test 4', 'Test 5'] },
    { id: '2', title: 'Bài giảng 2: Cấu trúc ứng dụng', exercises: ['Tài liệu 1.1', 'Tài liệu 1.2', 'Test 1', 'Test 2', 'Test 3', 'Test 4', 'Test 5'] },
    { id: '3', title: 'Bài giảng 3: State và Props', exercises: ['Tài liệu 1.1', 'Tài liệu 1.2', 'Test 1', 'Test 2', 'Test 3', 'Test 4', 'Test 5'] },
    { id: '4', title: 'Bài giảng 4: Điều hướng', exercises: ['Tài liệu 1.1', 'Tài liệu 1.2', 'Test 1', 'Test 2', 'Test 3', 'Test 4', 'Test 5'] },
    { id: '5', title: 'Bài giảng 5: Tương tác người dùng', exercises: ['Tài liệu 1.1', 'Tài liệu 1.2', 'Test 1', 'Test 2', 'Test 3', 'Test 4', 'Test 5'] },
];

export default function CourseListScreen() {

    const navigation = useNavigation()

    const router = useRouter();

    const [collapsed, setCollapsed] = useState<string | null>(null); // Trạng thái để kiểm soát dropdown

    const toggleCollapse = (id: string) => {
        setCollapsed(collapsed === id ? null : id); // Đổi trạng thái
    };

    const renderItem = ({ item } : { item: Lecture }) => (
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
                            className="flex-row items-center mb-2 border border-gray-300 rounded-lg p-4"
                            onPress={() => router.push({pathname: '/(main)/test' })}
                        >
                            <Ionicons name="checkbox-outline" size={18} color="#004B8D" />
                            <Text className="ml-2 text-gray-700">{exercise}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </Collapsible>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <FlatList
                data={DATA}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={{ padding: 16 }}
            />
        </SafeAreaView>
    )
}