import React, { useEffect, useState, useRef } from 'react';
import { View, FlatList, Text, Animated, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAuth from '@/hooks/useAuth';
import LectureService from '@/services/lecture.service';
import { Lecture } from '@/types/global.type';
import { router } from 'expo-router';
import { AntDesign } from "@expo/vector-icons";
import LottieView from 'lottie-react-native';
import { LectureCard } from '@/components/common/card/LectureCard';

const ITEMS_PER_PAGE = 10;

export default function CourseListScreen() {
  const { loading, toggleLoading } = useAuth();
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [page, setPage] = useState(1);
  
  // Animation references
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    const fetchLectures = async () => {
      toggleLoading();
      try {
        const response = await LectureService.getAllLectures({ pageSize: 1000, info: true, active: true });
        setLectures(response.data);
      } catch (error) {
        console.error('Error fetching lectures:', error);
      } finally {
        toggleLoading();
      }
    };
    fetchLectures();
    
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
  }, []);

  const handleSelect = (lectureId: string) => {
    router.push({
      pathname: '/(main)/lecture',
      params: { lectureId },
    });
  };

  const renderLectures = () => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const currentPageLectures = lectures.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    if (loading) {
      return (
        <View className="items-center justify-center py-8">
          <LottieView
            source={require('@/assets/animations/loading.json')}
            autoPlay
            loop
            style={{ width: 120, height: 120 }}
          />
          <Text className="mt-2 text-base text-gray-600">Loading lectures...</Text>
        </View>
      );
    }

    if (!lectures.length) {
      return (
        <View className="items-center justify-center py-8">
          <LottieView
            source={require('@/assets/animations/reading.json')}
            autoPlay
            loop
            style={{ width: 120, height: 120 }}
          />
          <Text className="mt-2 text-base text-gray-600">No lectures available</Text>
        </View>
      );
    }

    return (
      <>
        <FlatList
          data={currentPageLectures}
          renderItem={({ item, index }) => (
            <Animated.View 
              style={{
                transform: [{ scale: fadeAnim }],
                opacity: fadeAnim 
              }}
            >
              <LectureCard
                lecture={item}
                onSelect={() => handleSelect(item.id as string)}
              />
            </Animated.View>
          )}
          keyExtractor={(item) => item.id as string}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
        
        <View className="flex-row justify-between items-center mt-4 mb-6">
          <TouchableOpacity
            className={`flex-row items-center px-3 py-2 rounded-lg ${page === 1 ? 'bg-gray-200' : 'bg-blue-600'}`}
            onPress={() => {
              if (page > 1) {
                setPage(page - 1);
              }
            }}
            disabled={page === 1}
          >
            <AntDesign name="left" size={16} color={page === 1 ? "#718096" : "#fff"} />
            <Text className={`ml-1 font-medium ${page === 1 ? 'text-gray-500' : 'text-white'}`}>
              Previous
            </Text>
          </TouchableOpacity>
          
          <Text className="text-gray-600">Page {page}</Text>
          
          <TouchableOpacity
            className={`flex-row items-center px-3 py-2 rounded-lg ${currentPageLectures.length < ITEMS_PER_PAGE ? 'bg-gray-200' : 'bg-blue-600'}`}
            onPress={() => {
              if (currentPageLectures.length >= ITEMS_PER_PAGE) {
                setPage(page + 1);
              }
            }}
            disabled={currentPageLectures.length < ITEMS_PER_PAGE}
          >
            <Text className={`mr-1 font-medium ${currentPageLectures.length < ITEMS_PER_PAGE ? 'text-gray-500' : 'text-white'}`}>
              Next
            </Text>
            <AntDesign name="right" size={16} color={currentPageLectures.length < ITEMS_PER_PAGE ? "#718096" : "#fff"} />
          </TouchableOpacity>
        </View>
      </>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1 p-4 mb-10">
        {renderLectures()}
      </View>
    </SafeAreaView>
  );
}