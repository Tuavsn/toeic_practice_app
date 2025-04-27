import useAuth from "@/hooks/auth/useAuth";
import { FontAwesome, Fontisto } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function Header() {

    const navigation = useNavigation();

    const router = useRouter();

    const { user } = useAuth()

    // console.log(user?.token)

    return (
        <View className="flex flex-row items-center justify-between px-6 py-3 bg-[#004B8D] rounded-b-3xl">
            <TouchableOpacity 
                className='flex-1 flex-row gap-4 items-center px-2' 
                onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
                {
                    user ? (
                        <Image
                            width={50}
                            height={50}
                            source={{uri: user.avatar}}
                        />
                    ) : (
                        <FontAwesome name="user-circle" size={40} color="white" />
                    )
                }
                <View>
                    {user && (
                        <Text className="font-bold text-white">{user.email}</Text>
                    )}
                </View>
            </TouchableOpacity>
            <View className="flex flex-row">
                <TouchableOpacity
                    className="mx-2 rounded-full bg-[#004B8D] px-3 py-2.5"
                    onPress={() => router.push('/(main)/search')}
                >
                    <Fontisto name="search" size={25} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                    className="mx-2 rounded-full bg-[#004B8D] px-3 py-2.5"
                    onPress={() => router.push('/(main)/notify')}
                >
                    <Fontisto name="bell" size={25} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    )
}