// components/QuestionResources.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Question, Resource, ResourceType } from '@/types/global.type';
import RenderResource from './RenderResouce';

interface QuestionResourcesProps {
  question: Question;
  primaryColor?: string;
}

const QuestionResources = ({ question, primaryColor = "#004B8D" }: QuestionResourcesProps) => {
  if (!question.resources || question.resources.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {question.resources.map((resource, index) => (
        <RenderResource
          key={`resource-${question.id}-${index}`}
          resource={resource}
          resourceIndex={index}
          questionId={question.id}
          primaryColor={primaryColor}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
});

export default QuestionResources;