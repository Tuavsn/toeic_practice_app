import React, { useState } from "react";
import { Question, QuestionType, Resource, ResourceType } from "@/types/global.type";
import { Button, Image, Text, View } from "react-native";
import { RadioButton } from 'react-native-paper'; // Nhập RadioButton từ react-native-paper
import { Audio } from 'expo-av'; // Thư viện để phát âm thanh

interface QuestionDisplayProps {
    question: Question;
}

const QuestionDisplay = ({ question }: QuestionDisplayProps) => {
    switch (question.type) {
        case QuestionType.GROUP:
            return <QuestionTypeGroup question={question} />;
        case QuestionType.SINGLE:
            return <QuestionTypeSingle question={question} />;
        case QuestionType.SUBQUESTION:
            return <QuestionTypeSubquestion question={question} />;
        default:
            return <Text>Unknown question type</Text>;
    }
};

const QuestionTypeGroup = ({ question }: { question: Question }) => (
    <View style={{ marginBottom: 24, padding: 16, backgroundColor: '#cce5ff', borderRadius: 8 }}>
        {question.resources.map((resource, index) => (
            <RenderResource key={index} resource={resource} />
        ))}
        {question.subQuestions.map((subQuestion, index) => (
            <QuestionDisplay key={index} question={subQuestion} />
        ))}
    </View>
);

const QuestionTypeSingle = ({ question }: { question: Question }) => {
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

    return (
        <View style={{ marginBottom: 24, padding: 16, backgroundColor: '#d4edda', borderRadius: 8 }}>
            {question.resources.map((resource, index) => (
                <RenderResource key={index} resource={resource} />
            ))}
            <Text style={{ marginTop: 16 }}>{question.content}</Text>
            <View style={{ marginTop: 8 }}>
                <RadioButton.Group onValueChange={(value) => setSelectedAnswer(parseInt(value))} value={selectedAnswer?.toString()}>
                    {question.answers.map((answer, index) => (
                        <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                            <RadioButton value={index.toString()} />
                            <Text>{`${String.fromCharCode(65 + index)}. ${answer}`}</Text>
                        </View>
                    ))}
                </RadioButton.Group>
            </View>
        </View>
    );
};

const QuestionTypeSubquestion = ({ question }: { question: Question }) => {
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

    return (
        <View style={{ marginBottom: 24, padding: 16, backgroundColor: '#d4edda', borderRadius: 8 }}>
            {question.resources.map((resource, index) => (
                <RenderResource key={index} resource={resource} />
            ))}
            <Text style={{ marginTop: 16 }}>{question.content}</Text>
            <View style={{ marginTop: 8 }}>
                <RadioButton.Group onValueChange={(value) => setSelectedAnswer(parseInt(value))} value={selectedAnswer?.toString()}>
                    {question.answers.map((answer, index) => (
                        <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                            <RadioButton value={index.toString()} />
                            <Text>{`${String.fromCharCode(65 + index)}. ${answer}`}</Text>
                        </View>
                    ))}
                </RadioButton.Group>
            </View>
        </View>
    );
};

const RenderResource = ({ resource }: { resource: Resource }) => {
    switch (resource.type) {
        case ResourceType.IMAGE:
            return <Image source={{ uri: resource.content }} style={{ width: '100%', height: 200, marginBottom: 16 }} />;
        case ResourceType.AUDIO:
            return (
                <View className="py-4">
                    <Button
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
