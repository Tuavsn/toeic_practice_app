import useAuth from "@/hooks/auth/useAuth";
import { PracticeType } from "@/types/global.type";
import { Entypo, FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function PracticeMenuButton() {

    const {user} = useAuth();

    const router = useRouter()

    return (
        <View className="flex gap-2 mb-1">
            <View className="flex flex-row gap-2 justify-between">
                <TouchableOpacity className="bg-white py-5 rounded-2xl flex flex-col justify-center items-center min-w-[100px] grow" style={{
                    shadowColor: "#171717",
                    elevation: 4
                }}
                onPress={() => router.push({
                    pathname: '/(main)/practiceList',
                    params: { type: PracticeType.LISTENING, isList: "true" }
                })}
                >
                    <FontAwesome5 name="headphones" size={30} color="#004B8D" />
                    <Text className="font-bold text-[#004B8D]">Listening</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-white py-5 rounded-2xl flex flex-col justify-center items-center min-w-[100px] grow" style={{
                    shadowColor: "#171717",
                    elevation: 4
                }}
                onPress={() => router.push({
                    pathname: '/(main)/practiceList',
                    params: { type: PracticeType.READING }
                })}
                >
                    <FontAwesome5 name="book-reader" size={30} color="#004B8D" />
                    <Text className="font-bold text-[#004B8D]">Reading</Text>
                </TouchableOpacity>
                {user !== null && (
                    <TouchableOpacity className='bg-white py-5 rounded-2xl flex flex-col justify-center items-center min-w-[100px] grow' style={{
                        shadowColor: "#171717",
                        elevation: 4,
                    }}
                    onPress={() => router.push({
                        pathname: '/(main)/testList'
                    })}
                    >
                        <FontAwesome6 name="file-circle-check" size={30} color="#004B8D" />
                        <Text className="font-bold text-[#004B8D]">Full Test</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    )
}