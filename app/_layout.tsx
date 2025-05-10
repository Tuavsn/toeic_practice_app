import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import { AuthProvider } from '@/context/AuthContext';
import { AudioManagerProvider } from '@/context/AudioContext';
import '@/global.css'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QuestionsProvider } from '@/context/QuestionContext';

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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <QuestionsProvider>
          <AudioManagerProvider>
            <StatusBar barStyle="light-content" backgroundColor="#004B8D" />
            {/* <GlobalAudioController /> */}
            <Stack>
              <Stack.Screen name='index' options={{ headerShown: false }}/>
              <Stack.Screen name='welcome-intro' options={{ headerShown: false }}/>
              <Stack.Screen name='(auth)/profile' options={{
                title: "Profile",
                headerTitleAlign: 'center',
                headerStyle: {backgroundColor: '#004B8D'},
                headerTitleStyle: {fontWeight: 'bold'},
                headerTintColor: 'white'}}
              />
              <Stack.Screen name='(main)/course' options={{
                title: "Grammar",
                headerTitleAlign: 'center',
                headerStyle: {backgroundColor: '#004B8D'},
                headerTitleStyle: {fontWeight: 'bold'},
                headerTintColor: 'white'}}
              />
              <Stack.Screen name='(main)/lecture'  options={{
                title: "Lecture",
                headerTitleAlign: 'center',
                headerStyle: {backgroundColor: '#004B8D'},
                headerTitleStyle: {fontWeight: 'bold'},
                headerTintColor: 'white'}}
              />
              <Stack.Screen name='(main)/testCategoryList'  options={{
                title: "Test Category List",
                headerTitleAlign: 'center',
                headerStyle: {backgroundColor: '#004B8D'},
                headerTitleStyle: {fontWeight: 'bold'},
                headerTintColor: 'white'}}
              />
              <Stack.Screen name='(main)/testList'  options={{
                title: "Test List",
                headerTitleAlign: 'center',
                headerStyle: {backgroundColor: '#004B8D'},
                headerTitleStyle: {fontWeight: 'bold'},
                headerTintColor: 'white'}}
              />
              <Stack.Screen name='(main)/test'  options={{
                title: "Test",
                headerTitleAlign: 'center',
                headerStyle: {backgroundColor: '#004B8D'},
                headerTitleStyle: {fontWeight: 'bold'},
                headerTintColor: 'white'}}
              />
              <Stack.Screen name='(main)/practiceList'  options={{
                title: "Practice List",
                headerTitleAlign: 'center',
                headerStyle: {backgroundColor: '#004B8D'},
                headerTitleStyle: {fontWeight: 'bold'},
                headerTintColor: 'white'}}
              />
              <Stack.Screen name='(main)/practice'  options={{
                title: "Practice",
                headerTitleAlign: 'center',
                headerStyle: {backgroundColor: '#004B8D'},
                headerTitleStyle: {fontWeight: 'bold'},
                headerTintColor: 'white'}}
              />
              <Stack.Screen name='(main)/vocabulary'  options={{
                title: "Vocabulary",
                headerTitleAlign: 'center',
                headerStyle: {backgroundColor: '#004B8D'},
                headerTitleStyle: {fontWeight: 'bold'},
                headerTintColor: 'white'}}
              />
              <Stack.Screen name='(main)/deskDetail'  options={{
                title: "Vocabulary",
                headerTitleAlign: 'center',
                headerStyle: {backgroundColor: '#004B8D'},
                headerTitleStyle: {fontWeight: 'bold'},
                headerTintColor: 'white'}}
              />
              <Stack.Screen name='(main)/flashcardDesk'  options={{
                title: "Flash Card Deck",
                headerTitleAlign: 'center',
                headerStyle: {backgroundColor: '#004B8D'},
                headerTitleStyle: {fontWeight: 'bold'},
                headerTintColor: 'white'}}
              />
              <Stack.Screen name='(main)/flashCard'  options={{
                title: "Flash Card",
                headerTitleAlign: 'center',
                headerStyle: {backgroundColor: '#004B8D'},
                headerTitleStyle: {fontWeight: 'bold'},
                headerTintColor: 'white'}}
              />
              <Stack.Screen name='(main)/dictionary'  options={{
                title: "Dictionary",
                headerTitleAlign: 'center',
                headerStyle: {backgroundColor: '#004B8D'},
                headerTitleStyle: {fontWeight: 'bold'},
                headerTintColor: 'white'}}
              />
              <Stack.Screen name='(main)/result'  options={{
                title: "Test Result",
                headerTitleAlign: 'center',
                headerStyle: {backgroundColor: '#004B8D'},
                headerTitleStyle: {fontWeight: 'bold'},
                headerTintColor: 'white'}}
              />
              <Stack.Screen name='(main)/search'  options={{
                title: "Search",
                headerTitleAlign: 'center',
                headerStyle: {backgroundColor: '#004B8D'},
                headerTitleStyle: {fontWeight: 'bold'},
                headerTintColor: 'white'}}
              />
              <Stack.Screen name='(main)/notify'  options={{
                title: "Notify",
                headerTitleAlign: 'center',
                headerStyle: {backgroundColor: '#004B8D'},
                headerTitleStyle: {fontWeight: 'bold'},
                headerTintColor: 'white'}}
              />
              <Stack.Screen name='(auth)/login'  options={{
                title: "Login",
                headerTitleAlign: 'center',
                headerStyle: {backgroundColor: '#004B8D'},
                headerTitleStyle: {fontWeight: 'bold'},
                headerTintColor: 'white'}}
              />
              <Stack.Screen name='(drawer)'  options={{ headerShown: false }}/>
            </Stack>
          </AudioManagerProvider>
        </QuestionsProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
