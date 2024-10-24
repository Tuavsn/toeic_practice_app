import { Entypo, FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function HomeMenuButtons() {

    const router = useRouter()

    return (
        <View className="flex gap-5">
            <View className="flex flex-row justify-between">
                <TouchableOpacity className="bg-white p-3 rounded-2xl flex flex-col justify-center items-center w-[120]" style={{
                    shadowColor: "#171717",
                    elevation: 5
                }}
                onPress={() => router.push('/(main)/course')}
                >
                    <FontAwesome5 name="headphones" size={40} color="#004B8D" />
                    <Text className="font-bold text-lg text-[#004B8D]">Listening</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-white px-3 py-4 rounded-2xl flex flex-col justify-center items-center w-[120]" style={{
                    shadowColor: "#171717",
                    elevation: 5
                }}>
                    <FontAwesome5 name="book-reader" size={40} color="#004B8D" />
                    <Text className="font-bold text-lg text-[#004B8D]">Reading</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-white px-3 py-4 rounded-2xl flex flex-col justify-center items-center w-[120]" style={{
                    shadowColor: "#171717",
                    elevation: 5
                }}>
                    <FontAwesome5 name="spell-check" size={40} color="#004B8D" />
                    <Text className="font-bold text-lg text-[#004B8D]">Vocabulary</Text>
                </TouchableOpacity>
            </View>
            <View className="flex flex-row justify-between">
                <TouchableOpacity className="bg-white px-3 py-4 rounded-2xl flex flex-col justify-center items-center w-[120]" style={{
                    shadowColor: "#171717",
                    elevation: 5
                }}>
                    <Entypo name="open-book" size={40} color="#004B8D" />
                    <Text className="font-bold text-lg text-[#004B8D]">Grammar</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-white px-3 py-4 rounded-2xl flex flex-col justify-center items-center w-[120]" style={{
                    shadowColor: "#171717",
                    elevation: 5
                }}>
                    <FontAwesome6 name="list-check" size={40} color="#004B8D" />
                    <Text className="font-bold text-lg text-[#004B8D]">Mini Test</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-white px-3 py-4 rounded-2xl flex flex-col justify-center items-center w-[120]" style={{
                    shadowColor: "#171717",
                    elevation: 5
                }}>
                    <FontAwesome6 name="file-circle-check" size={40} color="#004B8D" />
                    <Text className="font-bold text-lg text-[#004B8D]">Full Test</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}