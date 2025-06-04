import React from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';

interface StreakItem { day: string; value: string; checked?: boolean; highlight?: boolean }

const streaks: StreakItem[] = [
  { day: '12.03', value: '+1', checked: true },
  { day: '12.04', value: '+2', checked: true },
  { day: 'Today', value: '+3', highlight: true },
  { day: '12.05', value: '+4' },
  { day: '12.06', value: '+4' },
];

export const StreakCarousel: React.FC = () => (
  <View className="mt-6">
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {streaks.map((item, idx) => (
        <View key={idx} className="items-center mr-4">
          <View className={`w-12 h-12 rounded-full justify-center items-center border-2 ${item.checked ? 'bg-[#004B8D] border-[#004B8D]' : item.highlight ? 'border-gray-400' : 'border-gray-200'
            }`}>
            <Text className={`${item.checked ? 'text-white' : item.highlight ? 'text-gray-700 font-bold' : 'text-gray-400'
              }`}>{item.value}</Text>
          </View>
          <Text className="text-gray-500 mt-1 text-xs">{item.day}</Text>
        </View>
      ))}
      <TouchableOpacity className="justify-center">
        <Text className="text-[#004B8D] font-medium">See all</Text>
      </TouchableOpacity>
    </ScrollView>
  </View>
);