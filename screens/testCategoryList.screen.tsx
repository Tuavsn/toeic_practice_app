import React, { useEffect, useRef, useState } from "react";
import Loader from "@/components/Loader";
import useAuth from "@/hooks/auth/useAuth";
import categoryService from "@/services/category.service";
import { Category } from "@/types/global.type";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from 'expo-haptics';
import LottieView from 'lottie-react-native';

export default function TestCategoryListScreen() {
  const router = useRouter();
  const { loading, toggleLoading } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);

  // Animation references
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  const fetchCategories = async () => {
    toggleLoading();
    try {
      const { data: cats } = await categoryService.getAllCategories();
      setCategories(cats);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      toggleLoading();
    }
  };

  const navigateToTestList = (categoryId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({ pathname: '/(main)/testList', params: { categoryId } });
  };

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();

    // Fetch data
    fetchCategories();
  }, []);

  const renderItem = ({ item, index }: { item: Category; index: number }) => (
    <Animated.View
      style={{
        transform: [
          { scale: scaleAnim },
          {
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50 * index, 0]
            })
          }
        ],
        opacity: fadeAnim
      }}
      className="mb-3 overflow-hidden rounded-xl shadow-sm bg-white"
    >
      <TouchableOpacity
        className="flex-row items-center p-4"
        onPress={() => navigateToTestList(item.id!)}
        activeOpacity={0.8}
      >
        <View className="w-11 h-11 rounded-full bg-blue-50 items-center justify-center mr-3">
          <MaterialIcons name="school" size={22} color="#004B8D" />
        </View>
        <Text className="flex-1 text-lg font-semibold text-gray-800">
          {item.format} ({item.year})
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderEmptyState = () => (
    <View className="items-center justify-center py-16">
      <LottieView
        source={require('@/assets/animations/reading.json')}
        autoPlay
        loop
        style={{ width: 180, height: 180 }}
      />
      <Text className="text-xl font-bold text-gray-800 mt-4 mb-2">
        No Categories Available
      </Text>
      <Text className="text-base text-gray-600 text-center px-8">
        Please check back later or try refreshing the page
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View className="mb-6 pb-4 border-b border-gray-200">
      <Text className="text-2xl font-bold text-blue-900 mb-1">
        Test Categories
      </Text>
      <Text className="text-base text-gray-600">
        Select a category to browse available tests
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {loading ? (
        <Loader loadingText="Đang tải danh mục" />
      ) : (
        <FlatList
          data={categories}
          renderItem={renderItem}
          keyExtractor={item => item.id!}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
