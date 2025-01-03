import QuestionDisplay from "@/components/test_card/QuestionDisplay";
import useAuth from "@/hooks/auth/useAuth";
import { submitTest } from "@/services/test.service";
import { AnswerPair, Question } from "@/types/global.type";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { Button, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function QuestionDetailScreen() {

  const { user, toggleLoading } = useAuth();

  const { question, questNum } = useLocalSearchParams();

  const parsedQuestion: Question = question ? JSON.parse(question as string) : null;

  const navigation = useNavigation();

  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
  
  const [resultDetails, setResultDetails] = useState<
    {
      message: string;
      correctAnswer: string;
      transcript: string;
      explanation: string;
    }[]
  >([]);

  const handleAnswerSelection = (questionId: string, answer: string) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async () => {
    toggleLoading();
    try {
      const answers: AnswerPair[] = parsedQuestion.subQuestions.length > 0
        ? parsedQuestion.subQuestions.map((subQuestion) => ({
            questionId: subQuestion.id || "",
            userAnswer: userAnswers[subQuestion.id as string] || "",
            timeSpent: 0,
          }))
        : [
            {
              questionId: parsedQuestion.id as string,
              userAnswer: userAnswers[parsedQuestion.id as string] || "",
              timeSpent: 0,
            },
          ];

      user && await submitTest({
        userAnswer: answers,
        testId: "",
        totalSeconds: 0,
        parts: parsedQuestion.partNum.toString(),
        type: "practice",
      });

      const newResultDetails = parsedQuestion.subQuestions.length > 0
      ? parsedQuestion.subQuestions.map((subQuestion) => {
          // Làm sạch dữ liệu trước khi so sánh
          const userAnswer = (userAnswers[subQuestion.id as string] || "").trim().toLowerCase();
          const correctAnswer = (subQuestion.correctAnswer || "").trim().toLowerCase();
          const isCorrect = userAnswer === correctAnswer;  // So sánh sau khi đã làm sạch

          return {
            message: isCorrect ? "Correct! Well done." : 'Incorrect.',
            correctAnswer: subQuestion.correctAnswer,
            transcript: subQuestion.transcript || "N/A",
            explanation: subQuestion.explanation || "No explanation provided.",
          };
        })
      : [
          {
            // Làm sạch dữ liệu cho câu hỏi đơn
            message: (userAnswers[parsedQuestion.id as string] || "").trim().toLowerCase() === (parsedQuestion.correctAnswer || "").trim().toLowerCase()
              ? "Correct! Well done."
              : "Incorrect.",
            correctAnswer: parsedQuestion.correctAnswer,
            transcript: parsedQuestion.transcript || "N/A",
            explanation: parsedQuestion.explanation || "No explanation provided.",
          },
        ];
      setResultDetails(newResultDetails);
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      toggleLoading();
    }
  };

  useEffect(() => {
    if (questNum) {
      navigation.setOptions({
        title: `Câu ${questNum}`,
      });
    }
  }, [questNum, navigation]);

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 p-4 bg-white">
        <ScrollView className="mb-4">
          {parsedQuestion && (
            <QuestionDisplay
              question={parsedQuestion}
              displayQuestNum={false}
              onAnswerSelect={(questionId, answer) => handleAnswerSelection(questionId as string, answer)}
            />
          )}
        </ScrollView>
        {resultDetails.length > 0 && (
          <ScrollView className="mt-4 p-4 bg-gray-100 rounded space-y-3">
            {resultDetails.map((detail, index) => (
              <View key={index} className="bg-white p-3 mb-2 rounded shadow-sm">
                <Text className="text-lg font-semibold text-center">
                  Question {index + 1}: {detail.message}
                </Text>
                <View className="mt-2">
                  <Text className="font-bold text-base text-gray-700">Correct Answer:</Text>
                  <Text className="text-gray-800">{detail.correctAnswer}</Text>
                </View>
                <View className="mt-2">
                  <Text className="font-bold text-base text-gray-700">Transcript:</Text>
                  <Text className="text-gray-800">{detail.transcript}</Text>
                </View>
                <View className="mt-2">
                  <Text className="font-bold text-base text-gray-700">Explanation:</Text>
                  <Text className="text-gray-800">{detail.explanation}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
        <View className="flex-row justify-end mt-4">
          <View>
            {resultDetails.length === 0 &&
              <Button color={"#004B8D"} title="Kiểm tra" onPress={() => handleSubmit()} />
            }
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
