import React, { useRef, useEffect } from "react";
import { Question, QuestionType, UserAnswer } from "@/types/global.type";
import { Text, Animated } from "react-native";
import { useAudioManager } from "@/context/AudioContext";
import { useFocusEffect } from "expo-router";
import QuestionTypeGroup from './QuestionTypeGroup';
import QuestionTypeSingle from './QuestionTypeSingle';
import QuestionTypeSubquestion from "./QuestionTypeSubquestion";

interface QuestionDisplayProps {
    question: Question | UserAnswer;
    displayQuestNum?: boolean;
    onAnswerSelect?: (questionId: string, answer: string) => void;
    disableSelect?: boolean;
    selectedAnswers?: { [key: string]: string };
    primaryColor?: string;
}

const QuestionDisplay = ({ 
    question, 
    displayQuestNum, 
    onAnswerSelect, 
    disableSelect, 
    selectedAnswers = {}, 
    primaryColor = "#004B8D"
}: QuestionDisplayProps) => {
    const { stopCurrentAudio } = useAudioManager();
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
          return () => {
            stopCurrentAudio();
          };
        }, [stopCurrentAudio])
    );

    switch (question.type) {
        case QuestionType.GROUP:
            return (
                <Animated.View style={{ opacity: fadeAnim }}>
                    <QuestionTypeGroup
                        displayQuestNum={displayQuestNum}
                        question={question}
                        onAnswerSelect={onAnswerSelect}
                        disableSelect={disableSelect}
                        selectedAnswers={selectedAnswers}
                        primaryColor={primaryColor}
                    />
                </Animated.View>
            );
        case QuestionType.SINGLE:
            return (
                <Animated.View style={{ opacity: fadeAnim }}>
                    <QuestionTypeSingle
                        question={question}
                        displayQuestNum={displayQuestNum}
                        onAnswerSelect={onAnswerSelect}
                        disableSelect={disableSelect}
                        selectedAnswers={selectedAnswers}
                        primaryColor={primaryColor}
                    />
                </Animated.View>
            );
        case QuestionType.SUBQUESTION:
            return (
                <Animated.View style={{ opacity: fadeAnim }}>
                    <QuestionTypeSubquestion
                        question={question}
                        displayQuestNum={displayQuestNum}
                        onAnswerSelect={onAnswerSelect}
                        disableSelect={disableSelect}
                        selectedAnswers={selectedAnswers}
                        primaryColor={primaryColor}
                    />
                </Animated.View>
            );
        default:
            return <Text>Unknown question type</Text>;
    }
};

export default QuestionDisplay;