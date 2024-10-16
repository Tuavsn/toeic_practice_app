import useAuth from "@/hooks/auth/useAuth";
import { FontAwesome, Fontisto } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function Header() {

    const { loading, user } = useAuth()

    return (
        <View className="flex flex-row items-center justify-between px-2 py-4">
            <View className="flex flex-row items-center">
                <TouchableOpacity className="mx-4">
                    {
                        user ? (
                            <Image
                                width={70}
                                height={70}
                                source={{uri: 'https://lh3.googleusercontent.com/a/ACg8ocIaWmYeQTzXapMs5L7_okIgL05hMYCAMdcITw1QW_k-uuVqsTfW=s432-c-no'}}
                            />
                        ) : (
                            <FontAwesome name="user-circle" size={60} color="#637794" />
                        )
                    }
                </TouchableOpacity>
                <View>
                    <Text className="text-[#004B8D] font-bold text-lg">Xin chào</Text>
                    <Text className="font-bold text-xl">Học Tuấn</Text>
                </View>
            </View>
            <View>
                <TouchableOpacity className="mx-4">
                    <Fontisto name="bell" size={30} color="#004B8D" />
                </TouchableOpacity>
            </View>
        </View>
    )
}