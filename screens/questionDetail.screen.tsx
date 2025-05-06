import React, { useEffect, useState, useCallback } from "react";
import QuestionDisplay from "@/components/common/question/QuestionDisplay";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { ScrollView, Text, View, TouchableOpacity, Modal, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuestions } from "@/context/QuestionContext";
import LottieView from 'lottie-react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from "@expo/vector-icons";
import questionService from '@/services/question.service';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import FloatingChatButton from "@/components/common/button/FloatingChatButton";

interface ResultDetail {
  message: string;
  correctAnswer: string;
  transcript: string;
  explanation: string;
}

export default function QuestionDetailScreen() {
  const { partNum, questionId } = useLocalSearchParams();
  const navigation = useNavigation();
  const { 
    currentQuestion, 
    currentIndex, 
    questions, 
    setQuestions,
    goToNextQuestion, 
    goToPreviousQuestion,
    setCurrentQuestionIndex
  } = useQuestions();

  const [resultDetails, setResultDetails] = useState<ResultDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [questionsModalVisible, setQuestionsModalVisible] = useState(false);
  const [completedQuestions, setCompletedQuestions] = useState<string[]>([]);

  // Get completed questions from AsyncStorage
  const loadCompletedQuestions = async () => {
    try {
      const storedCompletedQuestions = await AsyncStorage.getItem(`completedQuestions_part${partNum}`);
      if (storedCompletedQuestions) {
        setCompletedQuestions(JSON.parse(storedCompletedQuestions));
      }
    } catch (err) {
      console.error('Error loading completed questions:', err);
    }
  };

  // Load completed questions when component mounts or when revisiting the screen
  useFocusEffect(
    useCallback(() => {
      loadCompletedQuestions();
    }, [partNum])
  );

  // Fetch all questions when screen loads
  useEffect(() => {
    if (partNum) {
      fetchAllQuestions(partNum as string);
    }
  }, [partNum]);

  // Fetch all questions at once
  const fetchAllQuestions = async (partNumber: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await questionService.getAllQuestions({
        pageSize: 999, // Fetch all questions at once
        partNum: partNumber,
        current: 1,
      });
      
      setQuestions(response.data);
      
      // If a specific question ID was provided, set it as current
      if (questionId && response.data.length > 0) {
        const index = response.data.findIndex(q => q.id === questionId);
        if (index >= 0) {
          setCurrentQuestionIndex(index);
        }
      }
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError('Failed to load questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Clear result details when changing questions
  useEffect(() => {
    setResultDetails([]);
  }, [currentIndex]);

  const handleAnswerSelection = async (qid: string, answer: string) => {
    if (!currentQuestion) return;
    
    let details: ResultDetail[] = [];
    
    if (currentQuestion.subQuestions && currentQuestion.subQuestions.length) {
      // For questions with subquestions
      details = currentQuestion.subQuestions.map(subQ => {
        const userAns = subQ.id === qid ? answer : "";
        const isCorrect = userAns.trim().toLowerCase() === subQ.correctAnswer?.trim().toLowerCase();
        return {
          message: isCorrect ? "Correct! Well done." : "Incorrect.",
          correctAnswer: subQ.correctAnswer || "",
          transcript: subQ.transcript || "N/A",
          explanation: subQ.explanation || "No explanation provided.",
        };
      });
    } else {
      // For single questions
      const isCorrect = answer.trim().toLowerCase() === currentQuestion.correctAnswer?.trim().toLowerCase();
      details = [{
        message: isCorrect ? "Correct! Well done." : "Incorrect.",
        correctAnswer: currentQuestion.correctAnswer || "",
        transcript: currentQuestion.transcript || "N/A",
        explanation: currentQuestion.explanation || "No explanation provided.",
      }];
    }
    
    setResultDetails(details);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Save to completed questions in AsyncStorage
    try {
      const questionIdToSave = currentQuestion.id;
      if (questionIdToSave && !completedQuestions.includes(questionIdToSave)) {
        const updatedCompletedQuestions = [...completedQuestions, questionIdToSave];
        setCompletedQuestions(updatedCompletedQuestions);
        await AsyncStorage.setItem(
          `completedQuestions_part${partNum}`, 
          JSON.stringify(updatedCompletedQuestions)
        );
      }
    } catch (err) {
      console.error('Error saving completed question:', err);
    }
  };

  const handleNext = () => {
    setResultDetails([]);
    goToNextQuestion();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePrevious = () => {
    setResultDetails([]);
    goToPreviousQuestion();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const navigateToQuestion = (index) => {
    setResultDetails([]);
    setCurrentQuestionIndex(index);
    setQuestionsModalVisible(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Function to determine if a question is answered
  const isQuestionCompleted = (questionId: string | undefined) => {
    if (!questionId) return false;
    return completedQuestions.includes(questionId);
  };

  if (loading && questions.length === 0) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <LottieView
          source={require('@/assets/animations/loading.json')}
          autoPlay
          loop
          style={{ width: 120, height: 120 }}
        />
        <Text className="text-base text-gray-600 mt-4">Loading questions...</Text>
      </SafeAreaView>
    );
  }

  if (error && questions.length === 0) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Ionicons name="alert-circle-outline" size={60} color="#ef4444" />
        <Text className="text-xl font-semibold text-gray-800 mt-4">Error Loading Questions</Text>
        <Text className="text-base text-gray-600 text-center mx-8 mt-2">{error}</Text>
        <TouchableOpacity 
          className="mt-6 bg-blue-600 px-6 py-3 rounded-lg"
          onPress={() => partNum && fetchAllQuestions(partNum as string)}
        >
          <Text className="text-white font-medium">Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!currentQuestion) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text className="text-lg text-gray-600">No questions available</Text>
      </SafeAreaView>
    );
  }

  // Calculate completion percentage for progress bar
  const completedCount = completedQuestions.length;
  const totalQuestions = questions.length;
  const progressPercentage = (completedCount / totalQuestions) * 100;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-4 mb-10">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Progress Bar and Navigation */}
          <View className="mb-6">
            {/* Progress indicator */}
            <View className="mb-2">
              <View className="flex-row justify-between mb-1">
                <Text className="text-gray-600 font-medium">Progress</Text>
                <Text className="text-gray-600">{completedCount}/{totalQuestions} questions</Text>
              </View>
              <View className="h-2 bg-gray-200 rounded-full">
                <View 
                  className="h-2 bg-blue-600 rounded-full" 
                  style={{ width: `${progressPercentage}%` }} 
                />
              </View>
            </View>
            
            {/* Question counter */}
            <View className="flex-row justify-between items-center mb-3">
              <View className="flex-row items-center">
                <Ionicons name="document-text-outline" size={16} color="#4B5563" />
                <Text className="ml-1 text-gray-600">
                  Question {currentIndex + 1} of {questions.length}
                </Text>
              </View>
              <Text className="text-gray-500">Part {currentQuestion.partNum}</Text>
            </View>
            
            {/* Navigation buttons with questions list */}
            <View className="flex-row justify-center space-x-2 gap-2">
              <TouchableOpacity
                onPress={handlePrevious}
                disabled={currentIndex === 0}
                className={`flex-1 flex-row justify-center items-center py-2 rounded-lg ${
                  currentIndex === 0 ? 'bg-gray-200' : 'bg-gray-300'
                }`}
              >
                <Ionicons 
                  name="chevron-back" 
                  size={18} 
                  color={currentIndex === 0 ? "#9CA3AF" : "#4B5563"} 
                />
                <Text className={`ml-1 font-medium ${
                  currentIndex === 0 ? 'text-gray-400' : 'text-gray-700'
                }`}>
                  Previous
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleNext}
                disabled={currentIndex === questions.length - 1}
                className={`flex-1 flex-row justify-center items-center py-2 rounded-lg ${
                  currentIndex === questions.length - 1 ? 'bg-gray-200' : 'bg-gray-300'
                }`}
              >
                <Text className={`mr-1 font-medium ${
                  currentIndex === questions.length - 1 ? 'text-gray-400' : 'text-gray-700'
                }`}>
                  Next
                </Text>
                <Ionicons 
                  name="chevron-forward" 
                  size={18}
                  color={currentIndex === questions.length - 1 ? "#9CA3AF" : "#4B5563"} 
                />
              </TouchableOpacity>
              
              {/* Question list button */}
              <TouchableOpacity
                onPress={() => setQuestionsModalVisible(true)}
                className="py-2 px-3 bg-blue-100 rounded-lg flex-row justify-center items-center"
              >
                <Ionicons name="list" size={18} color="#3B82F6" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Question Display - Added the key to force re-render when question changes */}
          <QuestionDisplay
            question={currentQuestion}
            displayQuestNum={false}
            onAnswerSelect={handleAnswerSelection}
            key={currentQuestion.id} // This forces the component to re-render when currentQuestion changes
          />

          {/* Result Details */}
          {resultDetails.length > 0 && (
            <View className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
              <Text className="text-lg font-bold text-blue-900 mb-2">Answer Results</Text>
              
              {resultDetails.map((detail, idx) => (
                <View key={idx} className="bg-white p-4 rounded-lg mb-3 shadow-sm">
                  <Text className={`text-lg font-semibold mb-2 ${
                    detail.message.includes("Correct") ? "text-green-600" : "text-red-600"
                  }`}>
                    {detail.message}
                  </Text>
                  
                  <View className="space-y-2">
                    <View>
                      <Text className="font-bold text-gray-700">Correct Answer:</Text>
                      <Text className="text-gray-800">{detail.correctAnswer}</Text>
                    </View>
                    
                    {detail.transcript !== "N/A" && (
                      <View>
                        <Text className="font-bold text-gray-700">Transcript:</Text>
                        <Text className="text-gray-800">{detail.transcript}</Text>
                      </View>
                    )}
                    
                    <View>
                      <Text className="font-bold text-gray-700">Explanation:</Text>
                      <Text className="text-gray-800">{detail.explanation}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Questions Overview Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={questionsModalVisible}
          onRequestClose={() => setQuestionsModalVisible(false)}
        >
          <SafeAreaView className="flex-1 justify-center items-center bg-black bg-opacity-50">
            <View className="bg-white rounded-xl w-11/12 max-h-5/6 p-4">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-bold text-gray-800">Questions List</Text>
                <TouchableOpacity onPress={() => setQuestionsModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#4B5563" />
                </TouchableOpacity>
              </View>
              
              <View className="mb-4 bg-gray-100 p-3 rounded-lg">
                <View className="flex-row justify-between mb-2">
                  <Text className="text-gray-700">Completed:</Text>
                  <Text className="font-medium text-blue-600">{completedCount}/{totalQuestions}</Text>
                </View>
                <View className="h-2 bg-gray-200 rounded-full">
                  <View 
                    className="h-2 bg-blue-600 rounded-full" 
                    style={{ width: `${progressPercentage}%` }} 
                  />
                </View>
              </View>
              
              {/* Questions list */}
              <FlatList
                data={questions}
                className="mb-4"
                style={{ height: '70%' }}
                keyExtractor={(item, index) => item.id || index.toString()}
                renderItem={({ item, index }) => {
                  const isCompleted = isQuestionCompleted(item.id);
                  const isCurrentQuestion = index === currentIndex;
                  
                  return (
                    <TouchableOpacity
                      onPress={() => navigateToQuestion(index)}
                      className={`flex-row items-center p-3 mb-2 rounded-lg ${
                        isCurrentQuestion ? 'bg-blue-100 border border-blue-300' : 'bg-gray-50'
                      }`}
                    >
                      <View className={`w-8 h-8 rounded-full mr-3 items-center justify-center ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-300'
                      }`}>
                        <Text className="text-white font-medium">{index + 1}</Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-gray-800 font-medium" numberOfLines={1}>
                          {item.question ? 
                            (item.question.length > 40 ? item.question.substring(0, 40) + '...' : item.question) : 
                            `Question ${index + 1}`}
                        </Text>
                        <View className="flex-row items-center mt-1">
                          <Text className="text-xs text-gray-500 mr-2">Part {item.partNum}</Text>
                          {isCompleted ? (
                            <View className="flex-row items-center">
                              <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                              <Text className="text-xs text-green-600 ml-1">Completed</Text>
                            </View>
                          ) : (
                            <View className="flex-row items-center">
                              <Ionicons name="alert-circle" size={14} color="#F59E0B" />
                              <Text className="text-xs text-amber-600 ml-1">Not attempted</Text>
                            </View>
                          )}
                        </View>
                      </View>
                      <Ionicons 
                        name="chevron-forward" 
                        size={18} 
                        color="#4B5563" 
                      />
                    </TouchableOpacity>
                  );
                }}
              />
              
              <TouchableOpacity
                onPress={() => setQuestionsModalVisible(false)}
                className="py-3 bg-blue-600 rounded-lg items-center mt-auto"
              >
                <Text className="text-white font-medium">Back to Question</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>
      </View>
      {/* Floating Chat Button */}
      {currentQuestion?.id ? (
        <FloatingChatButton questionId={currentQuestion.id} />
      ) : null}
    </SafeAreaView>
  );
}