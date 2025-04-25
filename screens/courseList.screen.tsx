import { BadgeList } from '@/components/common/badge/BadgeList';
import Loader from '@/components/Loader';
import useAuth from '@/hooks/auth/useAuth';
import LectureService from '@/services/lecture.service';
import { Lecture } from '@/types/global.type';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CourseListScreen = () => {

    const {loading, toggleLoading} = useAuth();

    const [lectures, setLectures] = useState<Lecture[]>([])

    const handlePress = (lectureId: string) => {
        router.push({
            pathname: '/(main)/lecture',
            params: { lectureId: lectureId },
        });
    };

    useEffect(() => {
        const fetchLectures = async() => {
            toggleLoading()
            try {
                const response = await LectureService.getAllLectures({ pageSize: 1000, info: true, active: true })
                const data = await response.data;
                setLectures(data)
            } catch (error) {
                console.error('Error fetching lectures:', error);
            } finally {
                toggleLoading()
            }
        }
        fetchLectures()
    }, [])

    const renderCourseItem = ({ item }: { item: Lecture }) => {
        const maxTopicsToShow = 4;
        const visibleTopics = item.topic.slice(0, maxTopicsToShow);
        const hasMore = item.topic.length > maxTopicsToShow;

        return (
            <TouchableOpacity
                className="mb-3 p-4 border border-gray-300 rounded-lg bg-white"
                style={{shadowColor: "#171717" ,elevation: 2}}
                onPress={() => handlePress(item.id as string)}
            >
                <View className='flex-row items-start justify-between'>
                    <Text className="text-xl font-semibold text-gray-800 mb-3">{item.name}</Text>
                    <AntDesign name="rightcircleo" size={20} color="#004B8D" />
                </View>
                <BadgeList
                    list={visibleTopics}
                />
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView className="flex-1 p-4">
            {
                loading ? (
                    <Loader loadingText='Đang tải tài liệu' />
                ) : (
                    <FlatList
                        data={lectures}
                        renderItem={renderCourseItem}
                        keyExtractor={item => item.id as string}
                        showsVerticalScrollIndicator={false}
                    />
                )
            }
        </SafeAreaView>
    );
};

export default CourseListScreen;
