import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import { AuthProvider } from '@/context/AuthContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <StatusBar barStyle="light-content" backgroundColor="#004B8D" />
      <Stack>
        <Stack.Screen name='index' options={{ headerShown: false }}/>
        <Stack.Screen name='welcome-intro'  options={{ headerShown: false }}/>
        <Stack.Screen name='(main)/course'  options={{
          title: "Khoá học",
          headerTitleAlign: 'center',
          headerStyle: {backgroundColor: '#004B8D'},
          headerTitleStyle: {fontWeight: 'bold'},
          headerTintColor: 'white'}}
        />
        <Stack.Screen name='(main)/lecture'  options={{
          title: "Bài giảng",
          headerTitleAlign: 'center',
          headerStyle: {backgroundColor: '#004B8D'},
          headerTitleStyle: {fontWeight: 'bold'},
          headerTintColor: 'white'}}
        />
        <Stack.Screen name='(main)/test'  options={{
          title: "Bài test",
          headerTitleAlign: 'center',
          headerStyle: {backgroundColor: '#004B8D'},
          headerTitleStyle: {fontWeight: 'bold'},
          headerTintColor: 'white'}}
        />
        <Stack.Screen name='(main)/notify'  options={{
          title: "Thông báo",
          headerTitleAlign: 'center',
          headerStyle: {backgroundColor: '#004B8D'},
          headerTitleStyle: {fontWeight: 'bold'},
          headerTintColor: 'white'}}
        />
        <Stack.Screen name='(auth)/login'  options={{
          title: "Đăng nhập",
          headerTitleAlign: 'center',
          headerStyle: {backgroundColor: '#004B8D'},
          headerTitleStyle: {fontWeight: 'bold'},
          headerTintColor: 'white'}}
        />
        <Stack.Screen name='(drawer)'  options={{ headerShown: false }}/>
      </Stack>
    </AuthProvider>
  );
}
