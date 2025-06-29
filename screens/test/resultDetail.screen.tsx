import Loader from '@/components/Loader';
import ResultFloatingChatButton from '@/components/common/button/ResultFloatingChatButton';
import QuestionDisplay from '@/components/common/question/QuestionDisplay';
import ProgressBar from '@/components/common/stat/ProgressBar';
import useAuth from '@/hooks/useAuth';
import resultService from '@/services/result.service';
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

  const scrollViewRef = useRef<ScrollView>(null);

  const [page, setPage] = useState(1);

  const ITEMS_PER_PAGE = 20;

  const start = (page - 1) * ITEMS_PER_PAGE;

  const end = start + ITEMS_PER_PAGE;

  const paginatedQuestions = userAnswer.slice(start, end);

  const screenWidth = Dimensions.get('window').width;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  useEffect(() => {
    const fetchResult = async () => {
      toggleLoading()
      try {
        var response = await resultService.getResultById(resultId as string);
        const resultData = await response.data;
        setResults(resultData);
        setUserAnswer(resultData.userAnswers);
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
          title="Back"
          onPress={() => router.navigate('/(drawer)/(tabs)')}
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

  const renderQuestionWithTutor = (userAnswer: UserAnswer, index: number) => {
    return (
      <View key={index} className="mb-4">
        <QuestionDisplay
          question={userAnswer as UserAnswer}
          displayQuestNum={true}
          disableSelect={true}
        />
        
        {/* Render explanations */}
        {userAnswer.subUserAnswer.length > 0 ? (
          userAnswer.subUserAnswer.map((subUserAnswer, subIndex) => (
            <View key={subIndex}>
              {renderExplaintation(subUserAnswer)}
            </View>
          ))
        ) : (
          renderExplaintation(userAnswer)
        )}

        {/* Ask Tutor Button */}
        <ResultFloatingChatButton 
          questionId={userAnswer.questionId || `question_${index}`}
          questionText={userAnswer.content}
        />
      </View>
    )
  }

  return (
    <SafeAreaView className='flex-1'>
      {loading ? (
        <Loader loadingText="Loading results" />
      ) : (
        <View className='flex-1 bg-gray-100'>
          {results && (
            <>
              <ScrollView className="flex-1 p-4" ref={scrollViewRef}>
                <View key={results.id} className="mb-6 p-4 bg-white rounded-lg shadow-md">
                  <Text className="text-lg font-semibold text-gray-800">Result Details</Text>
                  <View className="mt-2">
                    <Text className="text-gray-600">Reading Score: {results.totalReadingScore}</Text>
                    <Text className="text-gray-600">Listening Score: {results.totalListeningScore}</Text>
                    <View className='flex-row items-center justify-between'>
                      <Text className="text-gray-600">Right Answers: {results.totalCorrectAnswer}/{results.totalCorrectAnswer + results.totalIncorrectAnswer + results.totalSkipAnswer}</Text>
                      <ProgressBar
                        value={results.totalCorrectAnswer / (results.totalCorrectAnswer + results.totalIncorrectAnswer + results.totalSkipAnswer)}
                        color="#4CAF50"
                      />
                    </View>
                    <View className='flex-row items-center justify-between'>
                      <Text className="text-gray-600">Wrong Answers: {results.totalIncorrectAnswer}/{results.totalCorrectAnswer + results.totalIncorrectAnswer + results.totalSkipAnswer}</Text>
                      <ProgressBar
                        value={results.totalIncorrectAnswer / (results.totalCorrectAnswer + results.totalIncorrectAnswer + results.totalSkipAnswer)}
                        color="#F44336"
                      />
                    </View>
                    <View className='flex-row items-center justify-between'>
                      <Text className="text-gray-600">Skip Answers: {results.totalSkipAnswer}/{results.totalCorrectAnswer + results.totalIncorrectAnswer + results.totalSkipAnswer}</Text>
                      <ProgressBar
                        value={results.totalSkipAnswer / (results.totalCorrectAnswer + results.totalIncorrectAnswer + results.totalSkipAnswer)}
                        color="#FF9800"
                      />
                    </View>
                  </View>

                  <View className="mt-8">
                    <Text className="text-lg font-bold text-gray-800 mb-2">Answers Rating</Text>
                    <PieChart
                      data={[
                        {
                          name: "% Right Answers",
                          count: parseFloat((results.totalCorrectAnswer / (results.totalCorrectAnswer + results.totalIncorrectAnswer + results.totalSkipAnswer) * 100).toFixed(2)),
                          color: "#4CAF50",
                          legendFontColor: "#4CAF50",
                          legendFontSize: 12
                        },
                        {
                          name: "% Wrong Answers",
                          count: parseFloat((results.totalIncorrectAnswer / (results.totalCorrectAnswer + results.totalIncorrectAnswer + results.totalSkipAnswer) * 100).toFixed(2)),
                          color: "#F44336",
                          legendFontColor: "#F44336",
                          legendFontSize: 12
                        },
                        {
                          name: "% Skip Answers",
                          count: parseFloat((results.totalSkipAnswer / (results.totalCorrectAnswer + results.totalIncorrectAnswer + results.totalSkipAnswer) * 100).toFixed(2)),
                          color: "#FF9800",
                          legendFontColor: "#FF9800",
                          legendFontSize: 12
                        }
                      ]}
                      width={screenWidth - 40}
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
                
                {/* Render questions with Ask Tutor buttons */}
                {paginatedQuestions.map((userAnswer, index) => 
                  renderQuestionWithTutor(userAnswer, index)
                )}
              </ScrollView>
              
              {/* Pagination Controls */}
              <View className="bg-white border-t border-gray-200 p-4">
                <View className="flex-row justify-between items-center">
                  <View className="flex-1 mr-2">
                    <Button
                      color="#004B8D"
                      title="Previous"
                      onPress={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                    />
                  </View>
                  <View className="px-4">
                    <Text className="text-gray-600 font-medium">
                      Page {page} of {Math.ceil(userAnswer.length / ITEMS_PER_PAGE)}
                    </Text>
                  </View>
                  <View className="flex-1 ml-2">
                    <Button
                      color="#004B8D"
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