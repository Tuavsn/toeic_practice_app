import React from 'react';
import { View, Text } from 'react-native';

interface BadgeListProps {
  list: { name: string }[];
  max?: number;
  maxNameLength?: number;
}

export const BadgeList: React.FC<BadgeListProps> = ({
  list,
  max = 4,
  maxNameLength = 15
}) => {
  const visibleBadges = list.slice(0, max);
  const hasMore = list.length > max;

  // Function to truncate text if it's too long
  const truncateName = (name: string) => {
    if (name.length > maxNameLength) {
      return name.substring(0, maxNameLength) + '...';
    }
    return name;
  };

  return (
    <View className="flex-row flex-wrap">
      {visibleBadges.map((item, index) => (
        <View
          key={index}
          className="bg-[#004B8D] py-1 px-2 rounded-full mr-2 mb-1"
        >
          <Text className="text-white text-sm">{truncateName(item.name)}</Text>
        </View>
      ))}
      {hasMore && (
        <View className="bg-gray-300 py-1 px-2 rounded-full mb-1">
          <Text className="text-gray-700 text-sm">...</Text>
        </View>
      )}
    </View>
  );
};