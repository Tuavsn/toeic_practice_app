import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import Database from "../database/Database";

export default function WelcomeIntroScreen() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Initialize database when component mounts
    useEffect(() => {
        initializeDatabase();
    }, []);

    const initializeDatabase = async () => {
        try {
            const dbInstance = Database.getInstance();
            await dbInstance.initDB();
            await dbInstance.createTables();
            console.log("Database initialized successfully");
        } catch (error) {
            console.error("Error initializing database:", error);
        }
    };

    const handleGetStarted = async () => {
        try {
            setIsLoading(true);
            await AsyncStorage.setItem('firstLoad', 'false');
            router.push('/(drawer)/');
        } catch (error) {
            console.error("Error navigating to main screen:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1">
            <View className="flex-1 items-center justify-center">
                <Image 
                    style={{objectFit: "contain"}}
                    className="w-[350px]"
                    source={require('@/assets/images/Main-Logo.png')} 
                />
                <Text className="text-3xl px-2 font-bold text-center mb-6">Luyện thi TOEIC với ứng dụng TOEIC Practice</Text>
                <Text className="text-md text-slate-500 text-center mb-6 px-6">Hãy khám phá ngay bộ bài giảng và đề thi TOEIC chất lượng với ứng dụng TOIEC Practice</Text>
                <TouchableOpacity 
                    className={`w-[80%] mt-4 p-4 rounded-lg ${isLoading ? 'bg-gray-400' : 'bg-[#2765E6]'}`} 
                    onPress={handleGetStarted}
                    disabled={isLoading}
                >
                    <Text className="text-lg text-center text-white font-bold">
                        {isLoading ? "Đang tải dữ liệu..." : "Bắt đầu ngay"}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}