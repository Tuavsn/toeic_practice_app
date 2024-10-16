import { Entypo, FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

export default function HomeMenuButtons() {
    return (
        <View className="flex gap-5 my-1">
            <View className="flex flex-row justify-between">
                <TouchableOpacity className="bg-[#004B8D] p-3 rounded-2xl flex flex-col justify-center items-center w-[120]">
                    <FontAwesome5 name="headphones" size={50} color="white" />
                    <Text className="font-bold text-lg text-white">Listening</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-[#004B8D] p-3 rounded-2xl flex flex-col justify-center items-center w-[120]">
                    <FontAwesome5 name="book-reader" size={50} color="white" />
                    <Text className="font-bold text-lg text-white">Reading</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-[#004B8D] p-3 rounded-2xl flex flex-col justify-center items-center w-[120]">
                    <FontAwesome5 name="spell-check" size={50} color="white" />
                    <Text className="font-bold text-lg text-white">Vocabulary</Text>
                </TouchableOpacity>
            </View>
            <View className="flex flex-row justify-between">
                <TouchableOpacity className="bg-[#004B8D] p-3 rounded-2xl flex flex-col justify-center items-center w-[120]">
                    <Entypo name="open-book" size={50} color="white" />
                    <Text className="font-bold text-lg text-white">Grammar</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-[#004B8D] p-3 rounded-2xl flex flex-col justify-center items-center w-[120]">
                    <FontAwesome6 name="list-check" size={50} color="white" />
                    <Text className="font-bold text-lg text-white">Mini Test</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-[#004B8D] p-3 rounded-2xl flex flex-col justify-center items-center w-[120]">
                    <FontAwesome6 name="file-circle-check" size={50} color="white" />
                    <Text className="font-bold text-lg text-white">Full Test</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}