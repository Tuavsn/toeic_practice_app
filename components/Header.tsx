import useAuth from "@/hooks/useAuth";
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
    <View className="flex flex-row items-center justify-between px-4 py-1 bg-[white]">
      <Image
        style={{ width: 130, height: 50, objectFit: "scale-down" }}
        source={require("@/assets/images/Header-Logo.png")}
      />
      <View className="flex flex-row gap-2 items-center">
        <TouchableOpacity
          className="mx-2 rounded-full py-2.5"
          onPress={() => router.push('/(main)/search')}
        >
          <Fontisto name="search" size={25} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          className="mx-2 rounded-full py-2.5"
          onPress={() => router.push('/(main)/notify')}
        >
          <Fontisto name="bell" size={25} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          className="mx-2 rounded-full py-2.5"
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        >
          {
            user ? (
              <Image
                width={32}
                height={32}
                style={{ borderRadius: 10 }}
                source={{ uri: user.avatar }}
              />
            ) : (
              <FontAwesome name="user-circle" size={32} color="black" />
            )
          }
        </TouchableOpacity>
      </View>
    </View>
  )
}