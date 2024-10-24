import { useState } from "react";
import { Button, Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Question {
    id: string;
    type: string;
    content: string;
}

export default function TestDetailScreen() {

    const [questions, setQuestions] = useState<Question[]>([
        { id: '1', type: 'listening_part1', content: 'This is a listening part 1 question' },
        { id: '2', type: 'reading_part5', content: 'This is a reading part 5 question' },
        { id: '3', type: 'listening_part2', content: 'This is a listening part 3 question' },
    ]);

    const renderQuestion = (question: Question) => {
        switch (question.type) {
          case 'listening_part1':
            return <QuestionType1 key={question.id} question={question} />;
          case 'listening_part2':
            return <QuestionType2 key={question.id} question={question} />;
          case 'reading_part5':
            return <QuestionType3 key={question.id} question={question} />;
          default:
            return <Text key={question.id}>Unknown question type</Text>;
        }
    };

    return (
        <SafeAreaView className="flex-1">
            <ScrollView className="p-4 bg-white">
                {questions.map((question) => renderQuestion(question))}
            </ScrollView>
        </SafeAreaView>
    )
}

export const QuestionType1 = ({ question } : { question : Question}) => (
    <View className="mb-6 p-4 bg-blue-100 rounded-lg">
      <Text className="text-lg font-bold mb-2">Listening Part 1</Text>
      {/* Giả sử đây là câu hỏi dạng hình ảnh */}
      <Image
        source={{ uri: 'https://example.com/image.png' }}
        className="w-full h-48 mb-4"
      />
      <Button title="Play Audio" onPress={() => console.log('Playing audio')} />
      <Text className="mt-4">{question.content}</Text>
    </View>
  );
  
  export const QuestionType2 = ({ question } : { question : Question }) => (
    <View className="mb-6 p-4 bg-green-100 rounded-lg">
      <Text className="text-lg font-bold mb-2">Listening Part 2</Text>
      {/* Có thể là câu hỏi dạng đoạn hội thoại */}
      <Button title="Play Audio" onPress={() => console.log('Playing audio')} />
      <Text className="mt-4">{question.content}</Text>
    </View>
  );
  
  export const QuestionType3 = ({ question } : { question : Question }) => (
    <View className="mb-6 p-4 bg-yellow-100 rounded-lg">
      <Text className="text-lg font-bold mb-2">Reading Part 5</Text>
      {/* Đây là câu hỏi dạng điền từ vào chỗ trống */}
      <Text>{question.content}</Text>
      <View>
        {/* Giả sử bạn có các tùy chọn câu trả lời */}
        <Text>A. Option 1</Text>
        <Text>B. Option 2</Text>
        <Text>C. Option 3</Text>
        <Text>D. Option 4</Text>
      </View>
    </View>
  );