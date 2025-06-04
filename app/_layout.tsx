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
            <StatusBar barStyle="dark-content" />
            {/* <GlobalAudioController /> */}
            <Stack>
              <Stack.Screen name='index' options={{ headerShown: false }} />
              {/* Plash screen */}
              <Stack.Screen name='welcome-intro' options={{ headerShown: false }} />
              {/* Lecture List Screen */}
              <Stack.Screen name='(main)/course' options={{
                title: "Grammar",
                headerTitleAlign: 'center',
                headerTitleStyle: { fontWeight: 'bold' },
                headerTintColor: 'black'
              }}
              />
              {/* Lecture Detail Screen */}
              <Stack.Screen name='(main)/lecture' options={{
                title: "Lecture",
                headerTitleAlign: 'center',
                headerTitleStyle: { fontWeight: 'bold' },
                headerTintColor: 'black'
              }}
              />
              {/* Test Category List Screen */}
              <Stack.Screen name='(main)/testCategoryList' options={{
                title: "Test Category List",
                headerTitleAlign: 'center',
                headerTitleStyle: { fontWeight: 'bold' },
                headerTintColor: 'black'
              }}
              />
              {/* Test List Screen */}
              <Stack.Screen name='(main)/testList' options={{
                title: "Test List",
                headerTitleAlign: 'center',
                headerTitleStyle: { fontWeight: 'bold' },
                headerTintColor: 'black'
              }}
              />
              {/* Test Information Screen */}
              <Stack.Screen name='(main)/testInfo' options={{
                title: "Test Information",
                headerTitleAlign: 'center',
                headerTitleStyle: { fontWeight: 'bold' },
                headerTintColor: 'black'
              }}
              />
              {/* Test Detail Screen */}
              <Stack.Screen name='(main)/test' options={{
                title: "Test",
                headerTitleAlign: 'center',
                headerTitleStyle: { fontWeight: 'bold' },
                headerTintColor: 'black'
              }}
              />
              {/* Practice List Screen */}
              <Stack.Screen name='(main)/practiceList' options={{
                title: "Practice List",
                headerTitleAlign: 'center',
                headerTitleStyle: { fontWeight: 'bold' },
                headerTintColor: 'black'
              }}
              />
              {/* Practice Detail Screen */}
              <Stack.Screen name='(main)/practice' options={{
                title: "Practice",
                headerTitleAlign: 'center',
                headerTitleStyle: { fontWeight: 'bold' },
                headerTintColor: 'black'
              }}
              />
              {/* Vocabulary Screen */}
              <Stack.Screen name='(main)/vocabulary' options={{
                title: "Vocabulary",
                headerTitleAlign: 'center',
                headerTitleStyle: { fontWeight: 'bold' },
                headerTintColor: 'black'
              }}
              />
              {/* FlashCard Desk Screen */}
              <Stack.Screen name='(main)/deskDetail' options={{
                title: "Vocabulary",
                headerTitleAlign: 'center',
                headerTitleStyle: { fontWeight: 'bold' },
                headerTintColor: 'black'
              }}
              />
              {/* FlashCard Screen */}
              <Stack.Screen name='(main)/flashcardDesk' options={{
                title: "Flash Card Deck",
                headerTitleAlign: 'center',
                headerTitleStyle: { fontWeight: 'bold' },
                headerTintColor: 'black'
              }}
              />
              {/* User FlashCard Collections Screen */}
              <Stack.Screen name='(main)/flashCard' options={{
                title: "Flash Card",
                headerTitleAlign: 'center',
                headerTitleStyle: { fontWeight: 'bold' },
                headerTintColor: 'black'
              }}
              />
              {/* Dictionary Screen */}
              <Stack.Screen name='(main)/dictionary' options={{
                title: "Dictionary",
                headerTitleAlign: 'center',
                headerTitleStyle: { fontWeight: 'bold' },
                headerTintColor: 'black'
              }}
              />
              {/* Test Result Screen */}
              <Stack.Screen name='(main)/result' options={{
                title: "Test Result",
                headerTitleAlign: 'center',
                headerTitleStyle: { fontWeight: 'bold' },
                headerTintColor: 'black'
              }}
              />
              {/* Search Screen */}
              <Stack.Screen name='(main)/search' options={{
                title: "Search",
                headerTitleAlign: 'center',
                headerTitleStyle: { fontWeight: 'bold' },
                headerTintColor: 'black'
              }}
              />
              {/* Login Screen */}
              <Stack.Screen name='(auth)/login' options={{
                title: "Login",
                headerTitleAlign: 'center',
                headerTitleStyle: { fontWeight: 'bold' },
                headerTintColor: 'black'
              }}
              />
              {/* Notify Screen */}
              <Stack.Screen name='(main)/notify' options={{
                title: "Notify",
                headerTitleAlign: 'center',
                headerTitleStyle: { fontWeight: 'bold' },
                headerTintColor: 'black'
              }}
              />
              <Stack.Screen name='(drawer)' options={{ headerShown: false }} />
            </Stack>
          </AudioManagerProvider>
        </QuestionsProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
