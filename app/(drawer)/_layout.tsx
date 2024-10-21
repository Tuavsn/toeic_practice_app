import 'react-native-reanimated';
import { router, useNavigation } from 'expo-router';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Drawer } from "expo-router/drawer";
import { Image, Text, View } from 'react-native';
import { AntDesign, Feather, FontAwesome } from '@expo/vector-icons';
import useAuth from '@/hooks/auth/useAuth';

const DrawerContent = () => {

  const { loading, user } = useAuth()
  
  return (
    <DrawerContentScrollView>
      <View className='flex-1 flex-row gap-4 items-center p-2'>
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
        <View>
          <Text className="text-[#004B8D] font-bold text-lg">Xin chào</Text>
          <Text className="font-bold text-xl">Học Tuấn</Text>
        </View>
      </View>
      <DrawerItem
        icon={({ color, size }) => (
          <Feather
            name="list"
            size={size}
            color={"#fff"}
          />
        )}
        label={"Đăng nhập"}
        labelStyle={[
          { color: "#fff"},
        ]}
        style={{ backgroundColor: "#333"}}
        onPress={() => {
          router.push("/login");
        }}
      />
      <DrawerItem
        icon={({ color, size }) => (
          <AntDesign
            name="user"
            size={size}
            color="#fff"
          />
        )}
        label={"Profile"}
        labelStyle={{color: "#fff"}}
        style={{ backgroundColor: "#333"}}
        onPress={() => {
          router.push("/login");
        }}
      />
    </DrawerContentScrollView>
  )
}

export default function DrawerLayout() {

  const nav = useNavigation()

  return (
    <Drawer drawerContent={() => <DrawerContent />} screenOptions={{headerShown: false}}>
      <Drawer.Screen name='login' options={{headerShown: false}}/>
    </Drawer>
  );
}
