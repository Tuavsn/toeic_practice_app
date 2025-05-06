import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Question } from '@/types/global.type';

interface QuestionsContextType {
  questions: Question[];
  currentQuestion: Question | null;
  currentIndex: number;
  setQuestions: (questions: Question[]) => void;
  goToNextQuestion: () => void;
  goToPreviousQuestion: () => void;
  setCurrentQuestionIndex: (index: number) => void;
}

const QuestionsContext = createContext<QuestionsContextType | undefined>(undefined);

export const useQuestions = () => {
  const context = useContext(QuestionsContext);
  if (context === undefined) {
    throw new Error('useQuestions must be used within a QuestionsProvider');
  }
  return context;
};

interface QuestionsProviderProps {
  children: ReactNode;
}

export const QuestionsProvider: React.FC<QuestionsProviderProps> = ({ children }) => {
  const [questions, setQuestionsState] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const currentQuestion = questions.length > 0 && currentIndex < questions.length 
    ? questions[currentIndex] 
    : null;

  const setQuestions = (newQuestions: Question[]) => {
    setQuestionsState(newQuestions);
    setCurrentIndex(0); // Reset to first question when new questions are loaded
  };

  const goToNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const setCurrentQuestionIndex = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentIndex(index);
    }
  };

  const value = {
    questions,
    currentQuestion,
    currentIndex,
    setQuestions,
    goToNextQuestion,
    goToPreviousQuestion,
    setCurrentQuestionIndex,
  };

  return (
    <QuestionsContext.Provider value={value}>
      {children}
    </QuestionsContext.Provider>
  );
};