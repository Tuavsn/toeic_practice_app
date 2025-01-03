import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity } from 'react-native';
import { Lecture, Test } from '@/types/global.type';
import { AntDesign, FontAwesome6 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getAllTests } from '@/services/test.service';
import { getAllLectures } from '@/services/lecture.service';

// type Category = 'test' | 'course' | 'user';
type Category = 'course';

const SearchScreen: React.FC = () => {
  
  const router = useRouter();

  const [query, setQuery] = useState<string>(''); // Trạng thái tìm kiếm

  const [results, setResults] = useState<Lecture[]>([]); // Kết quả tìm kiếm

  const [selectedCategory, setSelectedCategory] = useState<Category>('course'); // Category đã chọn

  // Hàm tìm kiếm
  const handleSearch = async () => {
    if (selectedCategory === 'course') {
      try {
        const response = await getAllLectures({ pageSize: '1000', info: true, active: true, search: query }); // Gọi API với tham số tìm kiếm
        const result = await response.json(); // Lấy dữ liệu từ API

        setResults(result.data.result); // Cập nhật kết quả tìm kiếm
      } catch (error) {
        console.error('Error fetching tests:', error);
      }
    }
  };

  // Hàm thay đổi category
  const handleCategoryChange = (category: Category) => {
    setSelectedCategory(category);
    setResults([]); // Xóa kết quả hiện tại khi thay đổi category
  };

  const handlePress = (lectureId: string) => {
      router.push({
          pathname: '/(main)/lecture',
          params: { lectureId: lectureId },
      });
  };

  // Render item trong danh sách kết quả
  const renderItem = ({ item }: { item: Lecture }) => {
    const maxTopicsToShow = 4;
    const visibleTopics = item.topic.slice(0, maxTopicsToShow);
    const hasMore = item.topic.length > maxTopicsToShow;

    return (
    <TouchableOpacity
        key={item.id}
        className="mb-3 p-4 border border-gray-300 rounded-lg bg-white"
        onPress={() => handlePress(item.id as string)}
    >
        <View className='flex-row items-start justify-between'>
            <Text className="text-xl font-semibold text-gray-800 mb-3">{item.name}</Text>
            <AntDesign name="rightcircleo" size={20} color="#004B8D" />
        </View>
        <View className="flex-row flex-wrap">
            {visibleTopics.map((topic: any, index: number) => (
                <View
                    key={index}
                    className="bg-[#004B8D] text-white py-1 px-2 rounded-full mr-2 mb-1"
                >
                    <Text className="text-white text-sm">{topic.name}</Text>
                </View>
            ))}
            {hasMore && (
                <View className="bg-gray-300 text-gray-700 py-1 px-2 rounded-full mb-1">
                    <Text className="text-gray-700">...</Text>
                </View>
            )}
        </View>
    </TouchableOpacity>
  )};

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#fff' }}>
      <View style={{ flexDirection: 'row', marginBottom: 16 }}>
        <TextInput
          style={{
            flex: 1,
            height: 40,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            paddingLeft: 8,
            fontSize: 16,
          }}
          placeholder="Tìm kiếm..."
          value={query}
          onChangeText={setQuery}
        />
        <TouchableOpacity
          style={{
            marginLeft: 8,
            backgroundColor: '#004B8D',
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 8,
          }}
          onPress={handleSearch}
        >
          <Text style={{ color: '#fff', fontSize: 16 }}>Tìm kiếm</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', marginBottom: 16 }}>
        <TouchableOpacity
          style={{
            paddingVertical: 8,
            paddingHorizontal: 16,
            backgroundColor: selectedCategory === 'course' ? '#004B8D' : '#ccc',
            borderRadius: 8,
          }}
          onPress={() => handleCategoryChange('course')}
        >
          <Text style={{ color: '#fff', fontSize: 16 }}>Bài học</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={{
            paddingVertical: 8,
            paddingHorizontal: 16,
            backgroundColor: selectedCategory === 'course' ? '#004B8D' : '#ccc',
            borderRadius: 8,
            marginLeft: 8,
          }}
          onPress={() => handleCategoryChange('course')}
        >
          <Text style={{ color: '#fff', fontSize: 16 }}>Lý thuyết</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            paddingVertical: 8,
            paddingHorizontal: 16,
            backgroundColor: selectedCategory === 'user' ? '#004B8D' : '#ccc',
            borderRadius: 8,
            marginLeft: 8,
          }}
          onPress={() => handleCategoryChange('user')}
        >
          <Text style={{ color: '#fff', fontSize: 16 }}>Tài khoản</Text>
        </TouchableOpacity> */}
      </View>

      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
        Kết quả tìm kiếm:
      </Text>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id as string}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <Text style={{ textAlign: 'center', color: '#888' }}>No results found</Text>
        )}
      />
    </View>
  );
};

export default SearchScreen;
