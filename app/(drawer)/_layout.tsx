import 'react-native-reanimated';
import { router, useNavigation } from 'expo-router';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Drawer } from "expo-router/drawer";
import { Image, Text, View } from 'react-native';
import { AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import useAuth from '@/hooks/useAuth';

const DrawerContent = () => {

  const { user, logout } = useAuth()

  return (
    <DrawerContentScrollView>
      <View className='flex-1 flex-row gap-4 items-center p-2'>
        {
          user ? (
            <Image
              width={70}
              height={70}
              source={{ uri: user.avatar }}
            />
          ) : (
            <FontAwesome name="user-circle" size={60} color="#637794" />
          )
        }
        <View>
          <Text className="text-[#004B8D] font-bold text-lg">Xin chào</Text>
          {user && (
            <Text className="font-bold">{user.email}</Text>
          )}
        </View>
      </View>
      {user ? (
        <View className='flex-1 gap-2'>
          <DrawerItem
            icon={({ color, size }) =>
              <MaterialIcons
                name="logout"
                size={size}
                color={"white"}
              />
            }
            label={"Đăng xuất"}
            labelStyle={[
              { color: "white" },
            ]}
            style={{ backgroundColor: "#004B8D", elevation: 5 }}
            onPress={() => logout()}
          />
        </View>
      ) : (
        <DrawerItem
          icon={({ color, size }) =>
            <MaterialIcons
              name="login"
              size={size}
              color={"white"}
            />
          }
          label={"Đăng nhập"}
          labelStyle={[
            { color: "white" },
          ]}
          style={{ backgroundColor: "#004B8D", elevation: 5 }}
          onPress={() => {
            router.push("/(auth)/login");
          }}
        />
      )}
    </DrawerContentScrollView>
  )
}

export default function DrawersLayout() {

  const nav = useNavigation()

  return (
    <Drawer drawerContent={() => <DrawerContent />} screenOptions={{ headerShown: false }} />
  );
}
