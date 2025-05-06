import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import {
    Ionicons,
    MaterialCommunityIcons,
    FontAwesome5,
} from '@expo/vector-icons';
import DiscoverStudyPath from '@/components/DiscoverStudyPath';
import { BannerCarousel } from '@/components/BannerCarousel';
import { PracticeType } from '@/types/global.type';
import { useRouter } from 'expo-router';

const ICON_SIZE = 28;
const SCREEN_WIDTH = Dimensions.get('window').width;

// Add a bg (background) and fg (foreground) color to each item
const items = [
    {
        label: 'ChatGPT',
        icon: <FontAwesome5 name="robot" size={ICON_SIZE} />,
        bg: '#E0F2FE',
        fg: '#0C4A6E',
        pathname: '',
        params: {}
    },
    {
        label: 'Grammar',
        icon: <MaterialCommunityIcons name="book-open-page-variant" size={ICON_SIZE} />,
        bg: '#ECFDF5',
        fg: '#065F46',
        pathname: '/(main)/course',
        params: {}
    },
    {
        label: 'Vocabulary',
        icon: <MaterialCommunityIcons name="book-multiple" size={ICON_SIZE} />,
        bg: '#ECFDF5',
        fg: '#065F46',
        pathname: '',
        params: {}
    },
    {
        label: 'Dictionary',
        icon: <MaterialCommunityIcons name="translate" size={ICON_SIZE} />,
        bg: '#ECFEF9',
        fg: '#047857',
        pathname: '',
        params: {}
    },
    {
        label: 'Reading',
        icon: <Ionicons name="book" size={ICON_SIZE} />,
        bg: '#FEFCE8',
        fg: '#92400E',
        pathname: '/(main)/practiceList',
        params: { type: PracticeType.READING }
    },
    {
        label: 'Listening',
        icon: <Ionicons name="headset" size={ICON_SIZE} />,
        bg: '#EFF6FF',
        fg: '#1E3A8A',
        pathname: '/(main)/practiceList',
        params: { type: PracticeType.LISTENING }
    },
    {
        label: 'Test Practice',
        icon: <MaterialCommunityIcons name="pencil-box-outline" size={ICON_SIZE} />,
        bg: '#FFF7ED',
        fg: '#9A3412',
        pathname: '/(main)/testCategoryList',
    },
];

export const HomeScreen: React.FC = () => {

    const router = useRouter();

    return (
        <ScrollView className="flex-1 bg-white">
            

            {/* Discover study path */}
            <View className='flex-row justify-between items-center px-4 pb-1 pt-4'>
                <Text className="text-lg font-bold text-gray-800">Study Progress</Text>
            </View>

            <View className='flex-row justify-between items-center px-4'>
                <DiscoverStudyPath />
            </View>

            {/* Header */}
            <View className="flex-row justify-between items-center px-4 pt-4">
                <Text className="text-lg font-bold text-gray-800">Learning Source</Text>
                <TouchableOpacity className="flex-row items-center">
                    <Text className="text-blue-600 font-medium mr-1">Study Method</Text>
                    <Ionicons
                        name="information-circle-outline"
                        size={20}
                        color="#3B82F6"
                    />
                </TouchableOpacity>
            </View>

            {/* Colored Grid of Icons */}
            <View className="flex-row flex-wrap mt-6 px-2 mb-20">
                {/* Banner placeholder */}
                <BannerCarousel />
                {items.map(({ label, icon, bg, fg, pathname, params }, i) => (
                    <TouchableOpacity
                        key={i}
                        className="w-1/4 items-center mb-6"
                        activeOpacity={0.7}
                        onPress={() => router.push({
                            pathname: pathname,
                            params: params
                        })}
                    >
                        <View
                            style={{
                                width: 56,
                                height: 56,
                                borderRadius: 16,
                                backgroundColor: bg,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 4,
                            }}
                        >
                            {React.cloneElement(icon as React.ReactElement, {
                                color: fg,
                            })}
                        </View>
                        <Text
                            style={{
                                fontSize: 12,
                                color: fg,
                                textAlign: 'center',
                            }}
                        >
                            {label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
};
