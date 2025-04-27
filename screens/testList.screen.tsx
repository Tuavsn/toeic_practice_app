import Loader from "@/components/Loader";
import useAuth from "@/hooks/auth/useAuth";
import categoryService from "@/services/category.service";
import resultService from "@/services/result.service";
import { Category, Result, Test } from "@/types/global.type";
import { FontAwesome6, Ionicons, MaterialIcons, AntDesign } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState, useRef } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Animated,
} from "react-native";
import Collapsible from "react-native-collapsible";
import { ActivityIndicator } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from 'expo-haptics';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');
const ITEMS_PER_PAGE = 5;

export default function TestListScreen() {
  const router = useRouter();
  const { user, loading, toggleLoading } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [collapseLoading, setCollapseLoading] = useState<{ [key: string]: boolean }>({});
  const [collapsed, setCollapsed] = useState<string | null>(null);
  const [page, setPage] = useState<{ [key: string]: number }>({});
  const [userTestIds, setUserTestIds] = useState<Set<string>>(new Set());
  
  // Animation references
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const rotateAnimations = useRef<{ [key: string]: Animated.Value }>({}).current;

  // Initialize rotation animations for each category
  useEffect(() => {
    categories.forEach(category => {
      if (category.id && !rotateAnimations[category.id]) {
        rotateAnimations[category.id] = new Animated.Value(0);
      }
    });
  }, [categories]);

  const handlePress = async (testId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await router.push({
      pathname: '/(main)/test',
      params: { testId },
    });
  };

  const fetchCategoriesAndTests = async () => {
    toggleLoading();
    try {
      const { data: cats } = await categoryService.getAllCategories();
      const withTests = await Promise.all(
        cats.map(async (category: Category) => {
          const { data: tests } = await categoryService.getAllTestsByCategory(category.id!);
          return { ...category, tests };
        })
      );
      setCategories(withTests);
    } catch (err) {
      console.error('Error fetching categories/tests:', err);
    } finally {
      toggleLoading();
    }
  };

  const toggleCollapse = (id: string) => {
    const isCollapsed = collapsed === id;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Rotate animation
    if (rotateAnimations[id]) {
      Animated.timing(rotateAnimations[id], {
        toValue: isCollapsed ? 0 : 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
    
    setCollapsed(isCollapsed ? null : id);
    
    if (!isCollapsed) {
      setPage((prev) => ({ ...prev, [id]: 1 }));
      
      // Set loading state when expanding
      setCollapseLoading((prev) => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setCollapseLoading((prev) => ({ ...prev, [id]: false }));
      }, 500);
    }
  };

  useEffect(() => {
    const prepareData = async () => {
      // Start entrance animations
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
    };
  
    prepareData();
    setCollapsed(null);
  }, []);

  // Fetch user completed tests
  const fetchUserResults = async () => {
    toggleLoading();
    try {
      const res = await resultService.getAllResults({ pageSize: 999, type: 'PRACTICE' });
      const ids = new Set(res.data.map((r: Result) => r.testId));
      setUserTestIds(ids);
    } catch (err) {
      console.error('Error fetching results:', err);
    } finally {
      toggleLoading();
    }
  };

  // On mount
  useEffect(() => {
    fetchCategoriesAndTests();
  }, []);

  // On focus
  useFocusEffect(
    useCallback(() => {
      if (user) fetchUserResults();
      setCollapsed(null);
    }, [user])
  );

  // Get test difficulty color and icon
  const getTestDifficultyDetails = (test: Test) => {
    const score = test.totalScore || 0;
    
    if (score < 300) {
      return { color: '#4CAF50', bgColor: 'bg-green-100', textColor: 'text-green-700', type: 'Easy' };
    } else if (score < 600) {
      return { color: '#FF9800', bgColor: 'bg-orange-100', textColor: 'text-orange-700', type: 'Medium' };
    } else {
      return { color: '#F44336', bgColor: 'bg-red-100', textColor: 'text-red-700', type: 'Hard' };
    }
  };

  // Get category icon based on format or year
  const getCategoryIcon = (category: Category) => {
    if (category.format?.toLowerCase().includes('toeic')) {
      return "school";
    } else if (category.format?.toLowerCase().includes('ielts')) {
      return "stars";
    } else {
      return "event-note"; // Default icon
    }
  };

  const renderTests = (tests: Test[] = [], categoryId: string) => {
    const currentPage = page[categoryId] || 1;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentPageTests = tests.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    if(collapseLoading[categoryId]) {
      return (
        <View className="items-center justify-center py-8">
          <LottieView
            source={require('@/assets/animations/loading.json')}
            autoPlay
            loop
            style={{ width: 100, height: 100 }}
          />
          <Text className="mt-2 text-base text-gray-600">Đang tải đề thi...</Text>
        </View>
      );
    }

    if (!tests.length) {
      return (
        <View className="items-center justify-center py-8">
          <LottieView
            source={require('@/assets/animations/reading.json')}
            autoPlay
            loop
            style={{ width: 120, height: 120 }}
          />
          <Text className="mt-2 text-base text-gray-600">Chưa có đề thi nào</Text>
        </View>
      );
    }

    return (
      <>
        <FlatList
          data={currentPageTests}
          renderItem={({ item, index }) => {
            const testNumber = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
            const difficulty = getTestDifficultyDetails(item);
            const isCompleted = userTestIds.has(item.id!);
                        
            return (
              <Animated.View 
                style={{
                  transform: [{ scale: fadeAnim }],
                  opacity: fadeAnim 
                }}
                className="mb-2"
              >
                <TouchableOpacity
                  className={`flex-row items-center p-3 bg-white rounded-lg border border-gray-200 ${isCompleted ? 'border-l-4 border-l-green-500 bg-green-50' : ''}`}
                  onPress={() => handlePress(item.id!)}
                  activeOpacity={0.7}
                >
                  <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mr-3">
                    <Text className="text-blue-600 font-bold text-base">{testNumber}</Text>
                  </View>
                  
                  <View className="flex-1">
                    <View className="flex-row items-center">
                      <Text className="text-gray-800 font-semibold text-base">
                        {item.name}
                      </Text>
                      {isCompleted && (
                        <View className="flex-row items-center bg-green-500 rounded-full px-2 py-0.5 ml-2">
                          <Ionicons name="checkmark-circle" size={14} color="#fff" />
                          <Text className="text-white text-xs font-medium ml-1">Đã làm</Text>
                        </View>
                      )}
                    </View>
                    
                    <View className="flex-row items-center mt-1">
                      <View className={`flex-row items-center ${difficulty.bgColor} px-2 py-0.5 rounded-md mr-2`}>
                        <MaterialIcons name={
                          difficulty.textColor.includes('green') ? "trending-down" : 
                          difficulty.textColor.includes('orange') ? "trending-flat" : "trending-up"
                        } size={14} color={difficulty.color} />
                        <Text className={`${difficulty.textColor} text-xs ml-1`}>
                          {difficulty.type}
                        </Text>
                      </View>
                      
                      <View className="flex-row items-center bg-gray-100 px-2 py-0.5 rounded-md mr-2">
                        <AntDesign name="questioncircleo" size={12} color="#666" />
                        <Text className="text-gray-600 text-xs ml-1">{item.totalQuestion} câu hỏi</Text>
                      </View>
                      
                      <View className="flex-row items-center bg-gray-100 px-2 py-0.5 rounded-md">
                        <AntDesign name="star" size={12} color="#666" />
                        <Text className="text-gray-600 text-xs ml-1">{item.totalScore} điểm</Text>
                      </View>
                    </View>
                  </View>
                  
                  <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center">
                    <FontAwesome6 
                      name="file-circle-check" 
                      size={18} 
                      color="#004B8D" 
                    />
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          }}
          keyExtractor={(item) => `${categoryId}-${item.id}`}
          showsVerticalScrollIndicator={false}
        />
        
        <View className="flex-row justify-between items-center mt-4">
          <TouchableOpacity
            className={`flex-row items-center px-3 py-2 rounded-lg ${currentPage === 1 ? 'bg-gray-200' : 'bg-blue-600'}`}
            onPress={() => {
              if (currentPage > 1) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setPage((prev) => ({ ...prev, [categoryId]: prev[categoryId] - 1 }));
              }
            }}
            disabled={currentPage === 1}
          >
            <Ionicons name="chevron-back" size={16} color={currentPage === 1 ? "#718096" : "#fff"} />
            <Text className={`ml-1 font-medium ${currentPage === 1 ? 'text-gray-500' : 'text-white'}`}>
              Previous
            </Text>
          </TouchableOpacity>
          
          <Text className="text-gray-600">Page {currentPage || 1}</Text>
          
          <TouchableOpacity
            className={`flex-row items-center px-3 py-2 rounded-lg ${currentPageTests.length < ITEMS_PER_PAGE ? 'bg-gray-200' : 'bg-blue-600'}`}
            onPress={() => {
              if (currentPageTests.length >= ITEMS_PER_PAGE) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setPage((prev) => ({ ...prev, [categoryId]: (prev[categoryId] || 1) + 1 }));
              }
            }}
            disabled={currentPageTests.length < ITEMS_PER_PAGE}
          >
            <Text className={`mr-1 font-medium ${currentPageTests.length < ITEMS_PER_PAGE ? 'text-gray-500' : 'text-white'}`}>
              Next
            </Text>
            <Ionicons name="chevron-forward" size={16} color={currentPageTests.length < ITEMS_PER_PAGE ? "#718096" : "#fff"} />
          </TouchableOpacity>
        </View>
      </>
    );
  };

  const renderItem = ({ item, index }: { item: Category, index: number }) => {
    const spin = rotateAnimations[item.id!]?.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg']
    }) || '0deg';
    
    const isCollapsed = collapsed !== item.id;
    const categoryIcon = getCategoryIcon(item);
    
    return (
      <Animated.View 
        style={{
          transform: [
            { scale: scaleAnim },
            { translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50 * index, 0]
            })}
          ],
          opacity: fadeAnim
        }}
        className="mb-3 overflow-hidden rounded-xl shadow-sm bg-white"
      >
        <TouchableOpacity
          className={`flex-row items-center justify-between p-4 ${!isCollapsed ? 'bg-blue-50 border-b border-blue-100' : 'bg-white'}`}
          onPress={() => toggleCollapse(item.id!)}
          activeOpacity={0.8}
        >
          <View className="flex-row items-center flex-1">
            <View className="w-11 h-11 rounded-full bg-blue-50 items-center justify-center mr-3">
              <MaterialIcons name={categoryIcon} size={22} color="#004B8D" />
            </View>
            
            <Text className="text-lg font-semibold text-gray-800">{item.format} ({item.year})</Text>
          </View>
          
          <View className="w-8 h-8 items-center justify-center">
            {collapseLoading[item.id!] ? (
              <ActivityIndicator size="small" color="#004B8D" />
            ) : (
              <Animated.View style={{ transform: [{ rotate: spin }] }}>
                <Ionicons
                  name="chevron-down"
                  size={22}
                  color="#004B8D"
                />
              </Animated.View>
            )}
          </View>
        </TouchableOpacity>
        
        <Collapsible collapsed={isCollapsed} duration={400} easing="easeOutCubic">
          <View className="p-4 bg-gray-50">
            {renderTests(item.tests, item.id!)}
          </View>
        </Collapsible>
      </Animated.View>
    );
  };

  const renderEmptyState = () => (
    <View className="items-center justify-center py-16">
      <LottieView
        source={require('@/assets/animations/reading.json')}
        autoPlay
        loop
        style={{ width: 180, height: 180 }}
      />
      <Text className="text-xl font-bold text-gray-800 mt-4 mb-2">
        No Tests Available
      </Text>
      <Text className="text-base text-gray-600 text-center px-8">
        Please check back later or try refreshing the page
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View className="mb-6 pb-4 border-b border-gray-200">
      <Text className="text-2xl font-bold text-blue-900 mb-1">
        Test List
      </Text>
      <Text className="text-base text-gray-600">
        Select a test to start practicing
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {loading ? (
        <Loader loadingText="Đang tải dữ liệu" />
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