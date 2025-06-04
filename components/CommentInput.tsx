import React, { forwardRef } from 'react';
import { View, TextInput, TouchableOpacity, Image, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Comment } from '@/types/global.type';

interface CommentInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  userAvatarUrl?: string;
  replyTo?: Comment | null;
  onCancelReply?: () => void;
}

const CommentInput = forwardRef<TextInput, CommentInputProps>(({
  value,
  onChangeText,
  onSubmit,
  userAvatarUrl,
  replyTo,
  onCancelReply
}, ref) => {
  return (
    <View>
      <View className='flex-row items-center p-4'>
        <View className="flex-row items-center bg-white p-3 rounded-lg border border-gray-200">
          {userAvatarUrl ? (
            <Image
              source={{ uri: userAvatarUrl }}
              className="w-8 h-8 rounded-full mr-2"
            />
          ) : (
            <View className="w-8 h-8 rounded-full bg-gray-200 items-center justify-center mr-2">
              <Ionicons name="person" size={16} color="#666" />
            </View>
          )}
          <TextInput
            ref={ref}
            value={value}
            onChangeText={onChangeText}
            placeholder="Write a comment..."
            className="flex-1 border border-gray-300 rounded-lg p-2 mr-2 max-h-24"
            multiline
          />
          <TouchableOpacity
            onPress={onSubmit}
            disabled={!value.trim()}
            className={`w-9 h-9 rounded-full items-center justify-center ${value.trim() ? 'bg-blue-500' : 'bg-gray-300'
              }`}
          >
            <Ionicons
              name="send"
              size={16}
              color={value.trim() ? "#ffffff" : "#9ca3af"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Reply indicator */}
      <View className="bg-white px-4 pb-4 border-t border-gray-200">
        {replyTo && (
          <View className="bg-gray-100 p-2 rounded flex-row justify-between items-center">
            <Text className="text-xs">
              Replying to <Text className="font-bold">{replyTo.userDisplayName}</Text>
            </Text>
            <TouchableOpacity onPress={onCancelReply}>
              <Text className="text-xs text-red-500">Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
});

export default CommentInput;