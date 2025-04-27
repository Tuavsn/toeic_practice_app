import { BannerData } from '@/constants/banner';
import React, { useRef, useState } from 'react';
import { View, FlatList, Image, Dimensions, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

const { width } = Dimensions.get('window');

export const BannerCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<FlatList<any>>(null);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slide = Math.round(e.nativeEvent.contentOffset.x / width);
    if (slide !== activeIndex) {
      setActiveIndex(slide);
    }
  };

  return (
    <View className='mb-6'>
      <FlatList
        ref={listRef}
        data={BannerData}
        keyExtractor={(_, idx) => idx.toString()}
        horizontal
        pagingEnabled
        snapToAlignment="center"
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <Image
            source={item.bannerImageUrl}
            style={{ width, height: 240 }}
            resizeMode="cover"
          />
        )}
      />

      {/* Pagination dots */}
      <View className="flex-row justify-center mt-2">
        {BannerData.map((_, idx) => (
          <View
            key={idx}
            className={`mx-1 ${activeIndex === idx ? 'w-3 h-3 bg-blue-600' : 'w-2 h-2 bg-gray-300'} rounded-full`}
          />
        ))}
      </View>
    </View>
  );
};
