import React, { useEffect, useState } from "react";
import { Question, QuestionType, Resource, ResourceType, UserAnswer } from "@/types/global.type";
import { Button, Image, Text, View } from "react-native";
import { RadioButton } from 'react-native-paper'; // Nhập RadioButton từ react-native-paper
import { Audio } from 'expo-av'; // Thư viện để phát âm thanh
import { Ionicons } from "@expo/vector-icons";

interface QuestionDisplayProps {
    question: Question | UserAnswer;
    displayQuestNum?: boolean;
    onAnswerSelect?: (questionId: string, answer: string) => void;
    disableSelect?: boolean;
}

const QuestionDisplay = ({ question, displayQuestNum, onAnswerSelect, disableSelect }: QuestionDisplayProps) => {
    switch (question.type) {
        case QuestionType.GROUP:
            return <QuestionTypeGroup
                displayQuestNum={displayQuestNum}
                question={question}
                onAnswerSelect={onAnswerSelect}
                disableSelect={disableSelect}
            />;
        case QuestionType.SINGLE:
            return <QuestionTypeSingle
                question={question}
                displayQuestNum={displayQuestNum}
                onAnswerSelect={onAnswerSelect}
                disableSelect={disableSelect}
            />;
        case QuestionType.SUBQUESTION:
            return <QuestionTypeSubquestion
                question={question}
                displayQuestNum={displayQuestNum}
                onAnswerSelect={onAnswerSelect}
                disableSelect={disableSelect}
            />;
        default:
            return <Text>Unknown question type</Text>;
    }
};

const QuestionTypeGroup = ({ question, displayQuestNum, onAnswerSelect, disableSelect }: { question: Question | UserAnswer, displayQuestNum?: boolean, onAnswerSelect?: (questionId: string, answer: string) => void, disableSelect?: boolean }) => (
    <View style={{ marginBottom: 24, padding: 16, backgroundColor: '#cce5ff', borderRadius: 8 }}>
        {question.resources.map((resource, index) => (
            <RenderResource key={index} resource={resource} />
        ))}
        {"subQuestions" in question &&
            question.subQuestions.map((subQuestion: Question, index) => (
                <QuestionDisplay
                    key={`subQuestion-${index}`}
                    question={subQuestion}
                    displayQuestNum={displayQuestNum}
                    onAnswerSelect={onAnswerSelect}
                />
            ))
        }

        {"subUserAnswer" in question &&
            question.subUserAnswer.map((subQuestion: UserAnswer, index) => (
                <QuestionDisplay
                    key={`subQuestion-${index}`}
                    question={subQuestion}
                    displayQuestNum={displayQuestNum}
                    onAnswerSelect={onAnswerSelect}
                    disableSelect={disableSelect}
                />
            ))
        }
    </View>
);

const QuestionTypeSingle = ({ question, displayQuestNum, onAnswerSelect, disableSelect }: { question: Question | UserAnswer, displayQuestNum?: boolean, onAnswerSelect?: (questionId: string, answer: string) => void, disableSelect?: boolean }) => {
    
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

    const userAnswer = (question as UserAnswer).userAnswer;

    const isCorrect = (question as UserAnswer).correct;

    return (
        <View style={{ marginBottom: 24, padding: 16, backgroundColor: '#d4edda', borderRadius: 8 }}>
            {displayQuestNum && (
                <View className="flex-row items-center gap-4">
                    <Text className="font-bold mb-2">Question Number: {question.questionNum}</Text>
                    {disableSelect && (
                        <Text className={`font-bold mb-2 ${userAnswer === "" ? 'text-[#FF9800]' : isCorrect ? 'text-[#4CAF50]' : 'text-[#F44336]'}`}>{userAnswer === "" ? 'Skip answer' : isCorrect ? 'Correct answer' : 'Wrong answer'}</Text>
                    )}
                </View>
            )}
            {question.resources.map((resource, index) => (
                <RenderResource key={index} resource={resource} />
            ))}
            <Text style={{ marginTop: 16 }}>{question.content}</Text>
            <View style={{ marginTop: 8 }}>
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
                        const isSelected = userAnswer === answer;
                        const isCorrect = question.correctAnswer === answer;
                        return (
                            <View key={index} style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginBottom: 8,
                                backgroundColor: isSelected
                                ? (isCorrect ? '#79d67d' : '#f8d7da') // Màu xanh nếu đúng, đỏ nếu sai
                                : 'transparent',
                                padding: 8,
                                borderRadius: 4,
                            }}>
                                <RadioButton value={index.toString()} disabled={disableSelect} />
                                <Text style={{ flexShrink: 1, flexWrap: 'wrap' }}>{`${String.fromCharCode(65 + index)}. ${answer}`}</Text>
                                {disableSelect && isCorrect && (
                                    <Ionicons
                                        name="checkmark-circle"
                                        size={20}
                                        color="#004B8D"
                                        style={{ marginLeft: 8 }}
                                    />
                                )}
                            </View>
                        )
                    })}
                </RadioButton.Group>
            </View>
        </View>
    );
};

const QuestionTypeSubquestion = ({ question, displayQuestNum, onAnswerSelect, disableSelect }: { question: Question | UserAnswer, displayQuestNum?: boolean, onAnswerSelect?: (questionId: string, answer: string) => void, disableSelect?: boolean }) => {

    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

    const userAnswer = (question as UserAnswer).userAnswer;

    const isCorrect = (question as UserAnswer).correct;

    return (
        <View style={{ marginBottom: 24, padding: 16, backgroundColor: '#d4edda', borderRadius: 8 }}>
            {displayQuestNum && (
                <View className="flex-row items-center gap-4">
                    <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Question Number: {question.questionNum}</Text>
                    {disableSelect && (
                        <Text className={`font-bold mb-2 ${userAnswer === "" ? 'text-[#FF9800]' : isCorrect ? 'text-[#4CAF50]' : 'text-[#F44336]'}`}>{userAnswer === "" ? 'Skip answer' : isCorrect ? 'Correct answer' : 'Wrong answer'}</Text>
                    )}
                </View>
            )}
            {question.resources.map((resource, index) => (
                <RenderResource key={index} resource={resource} />
            ))}
            <Text style={{ marginTop: 16 }}>{question.content}</Text>
            <View style={{ marginTop: 8 }}>
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
                        const isSelected = userAnswer === answer;
                        const isCorrect = question.correctAnswer === answer;
                        return (
                            <View key={index} style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginBottom: 8,
                                backgroundColor: isSelected
                                ? (isCorrect ? '#5abe5d' : '#f8d7da') // Màu xanh nếu đúng, đỏ nếu sai
                                : 'transparent',
                                padding: 8,
                                borderRadius: 4,
                            }}>
                                <RadioButton value={index.toString()} disabled={disableSelect} />
                                <Text style={{ flexShrink: 1, flexWrap: 'wrap' }}>{`${String.fromCharCode(65 + index)}. ${answer}`}</Text>
                                {disableSelect && isCorrect && (
                                    <Ionicons
                                        name="checkmark-circle"
                                        size={20}
                                        color="#004B8D"
                                        style={{ marginLeft: 8 }}
                                    />
                                )}
                            </View>
                        )
                    })}
                </RadioButton.Group>
            </View>
        </View>
    );
};

const RenderResource = ({ resource }: { resource: Resource }) => {
    switch (resource.type) {
        case ResourceType.IMAGE:
            return <Image source={{ uri: resource.content }} style={{ width: '100%', height: 200, marginBottom: 16, objectFit: 'contain' }} />;
        case ResourceType.AUDIO:
            return (
                <View className="py-4">
                    <Button
                        color={"#004B8D"}
                        title="Play Audio"
                        onPress={() => playAudio(resource.content)} // Gọi hàm phát âm thanh
                    />
                </View>
            );
        case ResourceType.PARAGRAPH:
            return <Text>{resource.content}</Text>;
        default:
            return null;
    }
};

// Hàm phát âm thanh
const playAudio = async (uri: string) => {
    const { sound } = await Audio.Sound.createAsync({ uri });
    await sound.playAsync();
};

export default QuestionDisplay;
