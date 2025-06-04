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
} from '@expo/vector-icons';
import { BannerCarousel } from '@/components/BannerCarousel';
import { PracticeType } from '@/types/global.type';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const ICON_SIZE = 30;
const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = (SCREEN_WIDTH - 36) / 2; // Để mỗi hàng chỉ có 2 thẻ

type AppRoutes =
  | '/(main)/course'
  | '/(main)/vocabulary'
  | '/(main)/dictionary'
  | '/(main)/practiceList'
  | '/(main)/testCategoryList';

const items: Array<{
  label: string;
  icon: React.ReactElement;
  bg: string;
  fg: string;
  bgImage: string;
  pathname: AppRoutes;
  params: any;
}> = [
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

export const HomeScreen: React.FC = () => {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Banner placeholder */}
      <View>
        <BannerCarousel />
      </View>

      {/* Learning Sources - 2 buttons per row with background images */}
      <View className="px-4 mb-20">
        <Text className="text-2xl font-bold text-gray-800 mb-4">Learning Sources</Text>
        <View className="flex-row flex-wrap justify-between">
          {items.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="mb-2"
              activeOpacity={0.8}
              onPress={() => router.push({
                pathname: item.pathname,
                params: item.params
              })}
              style={{ width: CARD_WIDTH }}
            >
              <ImageBackground
                source={{ uri: item.bgImage }}
                className="overflow-hidden rounded-xl"
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
    </ScrollView>
  );
};