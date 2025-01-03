import Loader from "@/components/loader/Loader";
import QuestionDisplay from "@/components/test_card/QuestionDisplay";
import useAuth from "@/hooks/auth/useAuth";
import { getAllTestQuestions, submitTest } from "@/services/test.service";
import { AnswerPair, Question } from "@/types/global.type";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Button, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TestDetailScreen() {

    const { loading, toggleLoading } = useAuth();

    const [loadingText, setLoadingText] = useState("Đang tải bài thi")

    const { testId } = useLocalSearchParams();

    const router = useRouter();

    const [questions, setQuestions] = useState<Question[]>([]);

    const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});

    const [page, setPage] = useState(1);

    const ITEMS_PER_PAGE = 10;

    const scrollViewRef = useRef<ScrollView>(null); // Tham chiếu để cuộn trang

    useEffect(() => {
        const fetchTestQuestions = async () => {
            toggleLoading();
            try {
                const result = await getAllTestQuestions(testId as string);
                const questionsData = await result.json();
                setQuestions(questionsData.data.listMultipleChoiceQuestions);
            } catch (error) {
                console.error('Error fetching exercises:', error);
            } finally {
                toggleLoading();
            }
        };
        fetchTestQuestions();
    }, [testId]);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        scrollViewRef.current?.scrollTo({ y: 0, animated: true }); // Cuộn về đầu trang
    };

    const handleAnswerSelection = (questionId: string, answer: string) => {
        setUserAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: answer,
        }));
    };

    const handleSubmit = async () => {
        setLoadingText("Đang chấm bài")
        toggleLoading();
        try {
            const answers: AnswerPair[] = questions.flatMap((question) => {
                if(question.subQuestions && question.subQuestions.length > 0) {
                    return question.subQuestions.map((subQuestion) => ({
                        questionId: subQuestion.id as string,
                        userAnswer: userAnswers[subQuestion.id as string] || '',
                        timeSpent: 0
                    }))
                } else {
                    return {
                        questionId: question.id as string,
                        userAnswer: userAnswers[question.id as string] || '',
                        timeSpent: 0
                    }
                }
            })

            const submitResponse = await submitTest({
                userAnswer: answers,
                testId: testId as string,
                totalSeconds: 0,
                parts: '1234567',
                type: 'practice'
            })

            setUserAnswers({})

            alert("Nộp bài thành công")

            const resultData = await submitResponse.json()

            await router.push({
                pathname: '/(main)/result',
                params: { resultId: resultData.data.resultId },
            });
        } catch (error) {
            console.error('Submit error:', error);
        } finally {
            toggleLoading();
            setLoadingText("Đang tải bài thi")
        }
    }

    const start = (page - 1) * ITEMS_PER_PAGE;

    const end = start + ITEMS_PER_PAGE;
    
    const paginatedQuestions = questions.slice(start, end);

    return (
        <SafeAreaView className="flex-1">
            {loading ? (
                <Loader loadingText={loadingText} />
            ) : (
                <View className="flex-1 p-4 bg-white">
                    {paginatedQuestions.length > 0 && (
                        <>
                            <ScrollView ref={scrollViewRef} className="mb-4">
                                {paginatedQuestions.map((question) => (
                                    <QuestionDisplay
                                        question={question}
                                        displayQuestNum={true}
                                        key={question.id}
                                        onAnswerSelect={(questionId, answer) => handleAnswerSelection(questionId as string, answer)}
                                    />
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
                                            disabled={end >= questions.length}
                                        />
                                    </View>
                                </View>
                                <View>
                                    <Button
                                        color={"#004B8D"}
                                        title="Submit"
                                        onPress={() => handleSubmit()}
                                    />
                                </View>
                            </View>
                        </>
                    )}
                </View>
            )}
        </SafeAreaView>
    );
}
