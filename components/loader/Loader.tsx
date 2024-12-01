import { ActivityIndicator, Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Animatable from 'react-native-animatable';

interface LoaderProps {
    loadingText?: string;
}

export default function Loader({ loadingText }: LoaderProps) {

    const renderTextWithAnimation = (text: string) => {
        return text.split('').map((char, index) => (
            <Animatable.Text
                key={index}
                animation="pulse"  // Thay đổi thành 'pulse' để tạo hiệu ứng nhấp nhô
                iterationCount="infinite"
                delay={index * 50}  // Delay nhanh hơn để tạo hiệu ứng sóng
                style={{
                fontSize: 25,
                fontWeight: 'bold',
                color: '#004B8D',
                transform: [
                    {
                    translateY: index % 2 === 0 ? -35 : 35, // Tăng biên độ giao động mạnh hơn
                    },
                    {
                    scale: 1.4, // Kết hợp với hiệu ứng scale để chữ cũng phóng to thêm một chút
                    },
                ],
                }}
            >
            {char}
          </Animatable.Text>
        ));
    };

    return (
        <SafeAreaView className="flex-1">
            <View className="flex-1 items-center">
                <Image
                    className="w-[300px]"
                    source={require('@/assets/images/Login-logo.png')}
                />
                {loadingText && (
                    <View className="flex-row mt-4">
                        {renderTextWithAnimation(loadingText)}
                    </View>
                )}
                <ActivityIndicator className="mt-2" size="large" color="#004B8D" />
            </View>
        </SafeAreaView>
    )
}