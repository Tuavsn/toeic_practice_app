import Loader from "@/components/loader/Loader";
import { OAUTH2_REDIRECT_URL, OAUTH2_URL } from "@/constants/api";
import useAuth from "@/hooks/auth/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Platform, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView, WebViewNavigation } from "react-native-webview";

export default function LoginScreen() {

    const [showWebView, setShowWebView] = useState(false);

    const { login, loading } = useAuth()

    const handleWebViewNavigationStateChange = async (event: WebViewNavigation) => {
        // Kiểm tra nếu URL là redirectUri và chứa token
        if (event.url.startsWith(OAUTH2_REDIRECT_URL)) {
            setShowWebView(false)
            const url = new URL(event.url);
            const token = url.searchParams.get('token');
            const id = url.searchParams.get('id');
            const email = url.searchParams.get('email');
            const avatar = url.searchParams.get('avatar');
            const role = url.searchParams.get('role');

            const loginUser = {
                id: id ? id : undefined,
                email: email ? email : undefined,
                avatar: avatar ? avatar : undefined,
                role: role ? role : undefined,
                token: token ? token : undefined
            }

            await AsyncStorage.setItem('userInfo', JSON.stringify(loginUser))

            login(loginUser)

            router.push('/(drawer)/(tabs)')
        }
    }

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <SafeAreaView className="flex-1">
                    {
                        !showWebView ? (
                            <View className="flex-1 items-center mt-10">
                                <Image 
                                    className="w-[300px]"
                                    source={require('@/assets/images/Login-logo.png')}
                                />
                                <Text className="mt-4 text-3xl font-bold text-[#004B8D]">
                                    Đăng nhập với
                                </Text>
                                <TouchableOpacity className="mt-4 p-4 rounded-lg bg-[#E5E7EA]" style={{elevation: 2}} onPress={() => setShowWebView(true)}>
                                    <Image 
                                        className="w-[45px] h-[45px]"
                                        source={require('@/assets/images/google-logo.png')} 
                                    />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <WebView
                                source={{ uri: OAUTH2_URL }}
                                onNavigationStateChange={handleWebViewNavigationStateChange}
                                startInLoadingState
                                userAgent={Platform.OS === 'android' ? 'Chrome/18.0.1025.133 Mobile Safari/535.19' : 'AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75'}
                                style={{ flex: 1 }}
                            />
                        )
                    }
                    
                </SafeAreaView>
            )}
        </>
    )
}