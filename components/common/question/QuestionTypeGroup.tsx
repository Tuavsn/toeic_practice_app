import React from "react";
import { Question, UserAnswer } from "@/types/global.type";
import { View } from "react-native";
import QuestionResources from "./QuestionResouce";
import QuestionDisplay from './QuestionDisplay';

interface QuestionTypeGroupProps {
  question: Question | UserAnswer;
  displayQuestNum?: boolean;
  onAnswerSelect?: (questionId: string, answer: string) => void;
  disableSelect?: boolean;
  selectedAnswers?: { [key: string]: string };
  primaryColor?: string;
}

const QuestionTypeGroup = ({
  question,
  displayQuestNum,
  onAnswerSelect,
  disableSelect,
  selectedAnswers,
  primaryColor
}: QuestionTypeGroupProps) => (
  <View>
    <QuestionResources question={question as Question} />

    {"subQuestions" in question &&
      question.subQuestions.map((subQuestion: Question, index) => (
        <QuestionDisplay
          key={`subQuestion-${index}`}
          question={subQuestion}
          displayQuestNum={displayQuestNum}
          onAnswerSelect={onAnswerSelect}
          selectedAnswers={selectedAnswers}
          primaryColor={primaryColor}
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
          selectedAnswers={selectedAnswers}
          primaryColor={primaryColor}
        />
      ))
    }
  </View>
);

export default QuestionTypeGroup;