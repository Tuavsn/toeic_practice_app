import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    ImageBackground,
    Image,
} from 'react-native';
import {
    Ionicons,
    MaterialCommunityIcons,
    FontAwesome5,
    AntDesign,
    Entypo,
} from '@expo/vector-icons';
import { BannerCarousel } from '@/components/BannerCarousel';
import { PracticeType } from '@/types/global.type';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const ICON_SIZE = 32;
const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = (SCREEN_WIDTH - 40) / 2; // Để mỗi hàng chỉ có 2 thẻ

const items = [
    {
        label: 'Grammar',
        icon: <MaterialCommunityIcons name="book-open-page-variant" size={ICON_SIZE} />,
        bg: '#ECFDF5',
        fg: '#065F46',
        pathname: '/(main)/course',
        params: {},
        bgImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1373&q=80',
    },
    {
        label: 'Vocabulary',
        icon: <MaterialCommunityIcons name="book-multiple" size={ICON_SIZE} />,
        bg: '#ECFDF5',
        fg: '#065F46',
        pathname: '/(main)/vocabulary',
        params: {},
        bgImage: 'https://images.unsplash.com/photo-1546521343-4eb2c01aa44b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1475&q=80',
    },
    {
        label: 'Dictionary',
        icon: <MaterialCommunityIcons name="translate" size={ICON_SIZE} />,
        bg: '#ECFEF9',
        fg: '#047857',
        pathname: '/(main)/dictionary',
        params: {},
        bgImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1528&q=80',
    },
    {
        label: 'Reading',
        icon: <Ionicons name="book" size={ICON_SIZE} />,
        bg: '#FEFCE8',
        fg: '#92400E',
        pathname: '/(main)/practiceList',
        params: { type: PracticeType.READING },
        bgImage: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80',
    },
    {
        label: 'Listening',
        icon: <Ionicons name="headset" size={ICON_SIZE} />,
        bg: '#EFF6FF',
        fg: '#1E3A8A',
        pathname: '/(main)/practiceList',
        params: { type: PracticeType.LISTENING },
        bgImage: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    },
    {
        label: 'Test Practice',
        icon: <MaterialCommunityIcons name="pencil-box-outline" size={ICON_SIZE} />,
        bg: '#FFF7ED',
        fg: '#9A3412',
        pathname: '/(main)/testCategoryList',
        params: {},
        bgImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    },
];

const upcomingEvents = [
    {
        title: 'IELTS Speaking Workshop',
        time: 'Tomorrow,.2:00 PM',
        icon: 'microphone'
    },
    {
        title: 'Grammar Quiz',
        time: 'Friday, 10:00 AM',
        icon: 'pencil'
    }
];

const recommendations = [
    {
        title: 'Intermediate Reading',
        description: 'Improve your reading skills with these engaging articles',
        progress: 35,
    },
    {
        title: 'Business Vocabulary',
        description: 'Essential words for professional communication',
        progress: 62,
    }
];

export const HomeScreen: React.FC = () => {
    const router = useRouter();

    const renderRecommendations = () => (
        <View className="mx-5 mt-4 mb-20">
            <Text className="text-xl font-bold text-gray-800 mb-3">Recommended for You</Text>
            {recommendations.map((item, index) => (
                <TouchableOpacity key={index} className="bg-white rounded-xl p-4 mb-3 shadow-sm">
                    <Text className="font-bold text-lg text-gray-800">{item.title}</Text>
                    <Text className="text-gray-500 mb-2">{item.description}</Text>
                    <View className="bg-gray-200 h-2 rounded-full w-full">
                        <View
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${item.progress}%` }}
                        />
                    </View>
                    <Text className="text-right text-gray-500 mt-1">{item.progress}%</Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    return (
        <ScrollView className="flex-1 bg-gray-50">
            {/* Banner placeholder */}
            <View className='mt-2 px-1'>
                <BannerCarousel />
            </View>
            
            {/* Learning Sources - 2 buttons per row with background images */}
            <View className="px-5 pt-2">
                <Text className="text-xl font-bold text-gray-800 mb-4">Learning Sources</Text>
                <View className="flex-row flex-wrap justify-between">
                    {items.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            className="mb-4"
                            activeOpacity={0.8}
                            onPress={() => router.push({
                                pathname: item.pathname,
                                params: item.params
                            })}
                            style={{ width: CARD_WIDTH }}
                        >
                            <ImageBackground
                                source={{ uri: item.bgImage }}
                                className="overflow-hidden rounded-2xl"
                                style={{ height: 120 }}
                                imageStyle={{ opacity: 0.9 }}
                            >
                                <LinearGradient
                                    colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.7)']}
                                    className="w-full h-full justify-center items-center p-3"
                                >
                                    <View 
                                        className="rounded-full p-3 mb-2" 
                                        style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
                                    >
                                        {React.cloneElement(item.icon as React.ReactElement, {
                                            color: '#fff',
                                        })}
                                    </View>
                                    <Text className="text-white font-bold text-lg">
                                        {item.label}
                                    </Text>
                                </LinearGradient>
                            </ImageBackground>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            
            {renderRecommendations()}
        </ScrollView>
    );
};