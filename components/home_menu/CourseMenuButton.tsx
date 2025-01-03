import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function CourseMenuButton() {

    const router = useRouter()

    return (
        <View className="flex gap-2">
            <View className="flex flex-row gap-2 justify-between">
                <TouchableOpacity className="bg-white py-5 rounded-2xl flex flex-col justify-center items-center min-w-[100px] grow" style={{
                    shadowColor: "#171717",
                    elevation: 4
                }}
                onPress={() => router.push({
                    pathname: '/(main)/course'
                })}
                >
                    <Entypo name="open-book" size={30} color="#004B8D" />
                    <Text className="font-bold text-[#004B8D]">Tổng hợp lý thuyết</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity className="bg-white py-5 rounded-2xl flex flex-col justify-center items-center min-w-[100px] grow" style={{
                    shadowColor: "#171717",
                    elevation: 4
                }}
                onPress={() => router.push({
                    pathname: '/(main)/course'
                })}
                >
                    <FontAwesome5 name="spell-check" size={30} color="#004B8D" />
                    <Text className="font-bold text-[#004B8D]">Vocabulary</Text>
                </TouchableOpacity> */}
            </View>
            {/* <View className="flex flex-row gap-2 justify-between">
                <TouchableOpacity className="bg-white py-5 rounded-2xl flex flex-col justify-center items-center min-w-[100px] grow" style={{
                    shadowColor: "#171717",
                    elevation: 4
                }}>
                    <AntDesign name="layout" size={30} color="#004B8D" />
                    <Text className="font-bold text-[#004B8D]">Toiec test structure</Text>
                </TouchableOpacity>
            </View> */}
        </View>
    )
}