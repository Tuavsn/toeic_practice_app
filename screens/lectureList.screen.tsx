import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAuth from '@/hooks/auth/useAuth';
import LectureService from '@/services/lecture.service';
import { Lecture } from '@/types/global.type';
import { router } from 'expo-router';
import Loader from '@/components/Loader';
import { LectureCard } from '@/components/common/card/LectureCard';

const placeholderImage = require('@/assets/images/course-placeholder.png');

export default function CourseListScreen() {
  const { loading, toggleLoading } = useAuth();
  const [lectures, setLectures] = useState<Lecture[]>([]);

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
  }, []);

  const handleSelect = (lectureId: string) => {
    router.push({
      pathname: '/(main)/lecture',
      params: { lectureId },
    });
  };

  const renderItem = ({ item }: { item: Lecture }) => (
    <View style={{ marginBottom: 16, alignItems: 'center' }}>
      <LectureCard
        lecture={item}
        imageSrc={item.coverImageUrl ? { uri: item.coverImageUrl } : placeholderImage}
        onSelect={() => handleSelect(item.id as string)}
      />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 p-4">
      {loading ? (
        <Loader loadingText="Đang tải tài liệu" />
      ) : (
        <FlatList
          data={lectures}
          renderItem={renderItem}
          keyExtractor={(item) => item.id as string}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 16, paddingTop: 8 }}
          className='mb-6'
        />
      )}
    </SafeAreaView>
  );
}
