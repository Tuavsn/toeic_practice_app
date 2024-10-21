import { Fontisto, Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { TouchableOpacity, View } from "react-native";

export default function Header() {

    const navigation = useNavigation();

    return (
        <View className="flex flex-row items-center justify-between px-2 py-4">
            <View className="flex flex-row items-center">
                <TouchableOpacity className="mx-2 bg-white px-3 py-2 rounded-xl" style={{elevation: 1}} onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
                    <Ionicons name="menu" size={35} color="#004B8D" />
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity className="mx-2 bg-white px-4 py-2 rounded-xl" style={{elevation: 1}}>
                    <Fontisto name="bell" size={35} color="#004B8D" />
                </TouchableOpacity>
            </View>
        </View>
    )
}