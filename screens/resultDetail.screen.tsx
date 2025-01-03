import Loader from '@/components/loader/Loader';
import QuestionDisplay from '@/components/test_card/QuestionDisplay';
import ProgressBar from '@/components/user_history/ProgressBar';
import useAuth from '@/hooks/auth/useAuth';
import { getResultById } from '@/services/result.service';
import { Result, UserAnswer } from '@/types/global.type';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, Dimensions, Button } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';

const ResultDetailScreen = () => {

    const { resultId } = useLocalSearchParams();

    const { loading, toggleLoading } = useAuth();

    const [results, setResults] = useState<Result>();
    
    const [userAnswer, setUserAnswer] = useState<UserAnswer[]>([]);

    const navigation = useNavigation();

    const router = useRouter();

    const scrollViewRef = useRef<ScrollView>(null); // Tham chiếu để cuộn trang
    
    const [page, setPage] = useState(1);

    const ITEMS_PER_PAGE = 20;

    const start = (page - 1) * ITEMS_PER_PAGE;

    const end = start + ITEMS_PER_PAGE;

    const paginatedQuestions = userAnswer.slice(start, end);

    const screenWidth = Dimensions.get('window').width;

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        scrollViewRef.current?.scrollTo({ y: 0, animated: true }); // Cuộn về đầu trang
    };

    useEffect(() => {
        const fetchResult = async () => {
            toggleLoading()
            try {
                var response = await getResultById(resultId as string);
                const resultData = await response.json();
                setResults(resultData.data);
                setUserAnswer(resultData.data.userAnswers);
            } catch (error) {
                console.error('Error fetching exercises:', error);
            } finally {
                toggleLoading();
            }
        };
        fetchResult();
    }, [resultId])

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <Button
                    title="Trang chủ"
                    onPress={() => router.push('(drawer)/(tabs)')} // Navigate to Home screen
                    color="#004B8D"
                />
            ),
        });
    }, [navigation]);

    const renderExplaintation = (userAnswer: UserAnswer) => {
        return (
            <View className="bg-white p-3 mb-2 rounded shadow-sm">
                <Text className="text-lg font-semibold text-center">
                </Text>
                <View className="mt-2">
                <Text className="font-bold text-base text-gray-700">Correct Answer:</Text>
                <Text className="text-gray-800">{userAnswer.correctAnswer}</Text>
                </View>
                <View className="mt-2">
                <Text className="font-bold text-base text-gray-700">Explanation:</Text>
                <Text className="text-gray-800">{userAnswer.explanation}</Text>
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView className='flex-1'>
            {loading ? (
                <Loader loadingText="Đang tải kết quả"/>
            ) : (
            <View className='flex-1 p-4 bg-gray-100'>
                {results && (
                    <>
                        <ScrollView className="flex-1" ref={scrollViewRef}>
                            <View key={results.id} className="mb-6 p-4 bg-white rounded-lg shadow-md">
                                <Text className="text-lg font-semibold text-gray-800">Chi tiết kết quả</Text>
                                <View className="mt-2">
                                    <Text className="text-gray-600">Điểm đọc: {results.totalReadingScore}</Text>
                                    <Text className="text-gray-600">Điểm nghe: {results.totalListeningScore}</Text>
                                    <View className='flex-row items-center justify-between'>
                                        <Text className="text-gray-600">Số câu trả lời đúng: {results.totalCorrectAnswer}/{results.totalCorrectAnswer + results.totalIncorrectAnswer + results.totalSkipAnswer}</Text>
                                        <ProgressBar
                                            value={results.totalCorrectAnswer / (results.totalCorrectAnswer + results.totalIncorrectAnswer + results.totalSkipAnswer)}
                                            color="#4CAF50"
                                        />
                                    </View>
                                    <View className='flex-row items-center justify-between'>
                                        <Text className="text-gray-600">Số câu trả lời sai: {results.totalIncorrectAnswer}/{results.totalCorrectAnswer + results.totalIncorrectAnswer + results.totalSkipAnswer}</Text>
                                        <ProgressBar
                                            value={results.totalIncorrectAnswer / (results.totalCorrectAnswer + results.totalIncorrectAnswer + results.totalSkipAnswer)}
                                            color="#F44336"
                                        />
                                    </View>
                                    <View className='flex-row items-center justify-between'>
                                        <Text className="text-gray-600">Số câu bỏ qua: {results.totalSkipAnswer}/{results.totalCorrectAnswer + results.totalIncorrectAnswer + results.totalSkipAnswer}</Text>
                                        <ProgressBar
                                            value={results.totalSkipAnswer / (results.totalCorrectAnswer + results.totalIncorrectAnswer + results.totalSkipAnswer)}
                                            color="#FF9800"
                                        />
                                    </View>
                                </View>

                                <View className="mt-8">
                                    <Text className="text-lg font-bold text-gray-800 mb-2">Tỷ lệ câu hỏi</Text>
                                    <PieChart
                                        data={[
                                            {
                                                name: "% Câu đúng",
                                                count: parseFloat((results.totalCorrectAnswer / (results.totalCorrectAnswer + results.totalIncorrectAnswer + results.totalSkipAnswer) * 100).toFixed(2)),
                                                color: "#4CAF50",
                                                legendFontColor: "#4CAF50",
                                                legendFontSize: 12
                                            },
                                            {
                                                name: "% Câu sai",
                                                count: parseFloat((results.totalIncorrectAnswer / (results.totalCorrectAnswer + results.totalIncorrectAnswer + results.totalSkipAnswer) * 100).toFixed(2)),
                                                color: "#F44336",
                                                legendFontColor: "#F44336",
                                                legendFontSize: 12
                                            },
                                            {
                                                name: "% Bỏ qua",
                                                count: parseFloat((results.totalSkipAnswer / (results.totalCorrectAnswer + results.totalIncorrectAnswer + results.totalSkipAnswer) * 100).toFixed(2)),
                                                color: "#FF9800",
                                                legendFontColor: "#FF9800",
                                                legendFontSize: 12
                                            }
                                        ]}
                                        width={screenWidth - 40} // Chart width
                                        height={220}
                                        chartConfig={{
                                            backgroundColor: "#ffffff",
                                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                        }}
                                        accessor="count"
                                        backgroundColor="transparent"
                                        paddingLeft="15"
                                        absolute
                                    />
                                </View>
                            </View>
                            {paginatedQuestions.map((userAnswer, index) => (
                                <>
                                    <QuestionDisplay
                                        question={userAnswer as UserAnswer}
                                        displayQuestNum={true}
                                        key={index}
                                        disableSelect={true}
                                    />
                                    {userAnswer.subUserAnswer.length > 0 ? (
                                        userAnswer.subUserAnswer.map((subUserAnswer, index) => (
                                            renderExplaintation(subUserAnswer)
                                        ))
                                        ) : (
                                            renderExplaintation(userAnswer)
                                        )}
                                    {/* <View key={index} className="bg-white p-3 mb-2 rounded shadow-sm">
                                        <Text className="text-lg font-semibold text-center">
                                        </Text>
                                        <View className="mt-2">
                                        <Text className="font-bold text-base text-gray-700">Correct Answer:</Text>
                                        <Text className="text-gray-800">{userAnswer.correctAnswer}</Text>
                                        </View>
                                        <View className="mt-2">
                                        <Text className="font-bold text-base text-gray-700">Explanation:</Text>
                                        <Text className="text-gray-800">{userAnswer.explanation}</Text>
                                        </View>
                                    </View> */}
                                </>
                            ))}
                        </ScrollView>
                        <View className="flex-row justify-between mt-4">
                            <View className="flex-row gap-4">
                                <View>
                                    <Button
                                        color={"#004B8D"}
                                        title="Previous"
                                        onPress={() => handlePageChange(page - 1)}
                                        disabled={page === 1}
                                    />
                                </View>
                                <View>
                                    <Button
                                        color={"#004B8D"}
                                        title="Next"
                                        onPress={() => handlePageChange(page + 1)}
                                        disabled={end >= userAnswer.length}
                                    />
                                </View>
                            </View>
                        </View>
                    </>
                )}
            </View>
        )}
        </SafeAreaView>
    );
};

export default ResultDetailScreen;
