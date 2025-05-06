import React, { useState, useRef, useEffect } from "react";
import { Question, UserAnswer, ResourceType } from "@/types/global.type";
import { TouchableOpacity, Text, View, Animated } from "react-native";
import { RadioButton } from 'react-native-paper';
import { Ionicons } from "@expo/vector-icons";
import QuestionResources from "./QuestionResouce";

interface QuestionTypeSubquestionProps { 
    question: Question | UserAnswer;
    displayQuestNum?: boolean;
    onAnswerSelect?: (questionId: string, answer: string) => void;
    disableSelect?: boolean;
    selectedAnswers?: { [key: string]: string };
    primaryColor?: string;
}

const QuestionTypeSubquestion = ({ 
    question, 
    displayQuestNum, 
    onAnswerSelect, 
    disableSelect,
    selectedAnswers,
    primaryColor
}: QuestionTypeSubquestionProps) => {
    const scaleAnim = useRef(new Animated.Value(0.95)).current;
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [hasAudio, setHasAudio] = useState(false);
    const [hasImage, setHasImage] = useState(false);

    // Check if resources include audio or images
    useEffect(() => {
        const hasAudioResource = question.resources.some(r => r.type === ResourceType.AUDIO);
        const hasImageResource = question.resources.some(r => r.type === ResourceType.IMAGE);
        setHasAudio(hasAudioResource);
        setHasImage(hasImageResource);
    }, [question.resources]);

    // Animation when component mounts
    useEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 6,
            tension: 40,
            useNativeDriver: true,
        }).start();
    }, []);

    // Initialize selectedAnswer if there's a selected answer in props
    useEffect(() => {
        if (selectedAnswers && question.id && selectedAnswers[question.id as string]) {
            const answerIndex = question.answers.findIndex(
                ans => ans === selectedAnswers[question.id as string]
            );
            if (answerIndex !== -1) {
                setSelectedAnswer(answerIndex);
            }
        }
    }, [selectedAnswers, question.id, question.answers]);

    const userAnswer = (question as UserAnswer).userAnswer;
    const isCorrect = (question as UserAnswer).correct;

    return (
        <Animated.View style={{ 
            marginBottom: 20, 
            transform: [{ scale: scaleAnim }] 
        }}>
            <View style={{ 
                padding: 16, 
                backgroundColor: '#ffffff',
                borderRadius: 12,
                borderLeftWidth: 4,
                borderLeftColor: primaryColor,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
            }}>
                {displayQuestNum && (
                    <View style={{ 
                        flexDirection: 'row', 
                        alignItems: 'center', 
                        marginBottom: 8, 
                        justifyContent: 'space-between'
                    }}>
                        <View style={{ 
                            backgroundColor: primaryColor, 
                            paddingHorizontal: 12, 
                            paddingVertical: 4, 
                            borderRadius: 16 
                        }}>
                            <Text style={{ 
                                color: 'white', 
                                fontWeight: 'bold' 
                            }}>
                                Question {question.questionNum}
                            </Text>
                        </View>
                        
                        {disableSelect && (
                            <View style={{ 
                                backgroundColor: userAnswer === "" 
                                    ? '#FFF3E0' 
                                    : isCorrect 
                                        ? '#E8F5E9' 
                                        : '#FFEBEE',
                                paddingHorizontal: 10,
                                paddingVertical: 4,
                                borderRadius: 16,
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginLeft: 8
                            }}>
                                <Ionicons 
                                    name={userAnswer === "" 
                                        ? "alert-circle" 
                                        : isCorrect 
                                            ? "checkmark-circle" 
                                            : "close-circle"} 
                                    size={16} 
                                    color={userAnswer === "" 
                                        ? '#FF9800' 
                                        : isCorrect 
                                            ? '#4CAF50' 
                                            : '#F44336'} 
                                    style={{ marginRight: 4 }}
                                />
                                <Text style={{ 
                                    color: userAnswer === "" 
                                        ? '#FF9800' 
                                        : isCorrect 
                                            ? '#4CAF50' 
                                            : '#F44336',
                                    fontWeight: '500',
                                    fontSize: 12
                                }}>
                                    {userAnswer === "" 
                                        ? 'Bỏ qua' 
                                        : isCorrect 
                                            ? 'Đúng' 
                                            : 'Sai'}
                                </Text>
                            </View>
                        )}
                    </View>
                )}
                
                {/* Resources display */}
                <View style={hasAudio && hasImage ? { marginBottom: 8 } : null}>
                    <QuestionResources question={question as Question} />
                </View>
                
                {/* Question content */}
                <Text style={{ 
                    marginVertical: 16, 
                    fontSize: 16, 
                    lineHeight: 24,
                    color: '#333',
                }}>
                    {question.content}
                </Text>
                
                {/* Answer options */}
                <View style={{ marginTop: 4 }}>
                    <RadioButton.Group
                        onValueChange={(value) => {
                            setSelectedAnswer(parseInt(value));
                            if (onAnswerSelect && value) {
                                onAnswerSelect(question.id as string, question.answers[parseInt(value)]);
                            }
                        }}
                        value={selectedAnswer?.toString() ?? ''}
                    >
                        {question.answers.map((answer, index) => {
                            const isSelected = userAnswer === answer || selectedAnswer === index;
                            const isCorrectAnswer = question.correctAnswer === answer;
                            
                            return (
                                <TouchableOpacity
                                    key={index}
                                    disabled={disableSelect}
                                    activeOpacity={0.7}
                                    onPress={() => {
                                        if (!disableSelect) {
                                            setSelectedAnswer(index);
                                            if (onAnswerSelect) {
                                                onAnswerSelect(question.id as string, answer);
                                            }
                                        }
                                    }}
                                >
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginBottom: 10,
                                        backgroundColor: isSelected
                                            ? (disableSelect 
                                                ? (isCorrectAnswer ? '#E8F5E9' : '#FFEBEE')
                                                : '#E3F2FD')
                                            : '#F5F5F5',
                                        padding: 12,
                                        borderRadius: 8,
                                        borderWidth: isSelected ? 1 : 0,
                                        borderColor: isSelected 
                                            ? (disableSelect 
                                                ? (isCorrectAnswer ? '#4CAF50' : '#F44336')
                                                : primaryColor)
                                            : 'transparent',
                                    }}>
                                        <RadioButton 
                                            value={index.toString()} 
                                            disabled={disableSelect}
                                            color={primaryColor}
                                            uncheckedColor={primaryColor}
                                        />
                                        <Text style={{ 
                                            flexShrink: 1, 
                                            flexWrap: 'wrap',
                                            marginLeft: 8,
                                            fontSize: 15,
                                            lineHeight: 22,
                                            color: isSelected ? '#000000' : '#333333',
                                        }}>
                                            {`${String.fromCharCode(65 + index)}. ${answer}`}
                                        </Text>
                                        {disableSelect && isCorrectAnswer && (
                                            <Ionicons
                                                name="checkmark-circle"
                                                size={20}
                                                color="#4CAF50"
                                                style={{ marginLeft: 'auto' }}
                                            />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </RadioButton.Group>
                </View>
            </View>
        </Animated.View>
    );
};

export default QuestionTypeSubquestion;