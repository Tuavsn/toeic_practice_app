import { Question } from "@/types/global.type";
import { Button, Image, Text, View } from "react-native";

interface question {
    question: Question
}

export default function SingleQuestion({ question } : question) {
    return (
        <View className="mb-4 p-4 bg-blue-50 rounded-lg shadow">
            <Text className="text-xl font-bold mb-2">Listening Part 1 - Picture Description</Text>
            <Image
            source={{ uri: question.resouces[0].content }}
            className="w-full h-40 mb-4"
            resizeMode="contain"
            />
            <Button title="Play Audio" onPress={() => console.log('Playing audio')} />
            <Text className="mt-4 text-lg">{question.content}</Text>
            <View className="mt-4">
            {question.answers.map((answer, index) => (
                <Button
                key={index}
                title={answer}
                />
            ))}
            </View>
        </View>
    )
}