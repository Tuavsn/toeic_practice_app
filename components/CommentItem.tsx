import { Comment, DeleteReasonTagComment } from "@/types/global.type";
import { convertToVietnamTime } from "@/utils/TimeFormat";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

// Props for CommentItem component
interface CommentItemProps {
  comment: Comment;
  onReply: (comment: Comment) => void;
  onToggleLike: (commentId: string) => void;
  onDelete: (commentId: string, reasonTag: DeleteReasonTagComment) => void;
  onViewReplies?: (commentId: string) => void;
  showReplies?: boolean;
  isReply?: boolean;
  currentUserId: string;
}

// Comment Item Component
const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onReply,
  onToggleLike,
  onDelete,
  onViewReplies,
  showReplies,
  isReply = false,
  currentUserId
}) => {
  const [showDeleteOptions, setShowDeleteOptions] = useState<boolean>(false);
  const [deleteReason, setDeleteReason] = useState<DeleteReasonTagComment>(DeleteReasonTagComment.OTHER);

  return (
    <View className={`p-3 mb-2 border border-gray-200 rounded-lg bg-white ${isReply ? 'ml-8 bg-gray-50' : ''}`}>
      {/* User info and date */}
      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-row items-center">
          {comment.userAvatarUrl ? (
            <Image
              source={{ uri: comment.userAvatarUrl }}
              className="w-8 h-8 rounded-full mr-2"
            />
          ) : (
            <View className="w-8 h-8 rounded-full bg-gray-200 items-center justify-center mr-2">
              <Ionicons name="person" size={16} color="#666" />
            </View>
          )}
          <Text className="font-bold text-sm">{comment.userDisplayName}</Text>
        </View>
      </View>
      <Text className="text-xs text-gray-400">{convertToVietnamTime(comment.createdAt, 'short')}</Text>

      {/* Comment content */}
      <View className="mb-3">
        {comment.deleted ? (
          <Text className="italic text-gray-400">[Comment deleted: {comment.deleteReasonTag}]</Text>
        ) : (
          <Text>{comment.content}</Text>
        )}
      </View>

      {/* Actions */}
      {!comment.deleted && (
        <View className="flex-row justify-between items-center">
          <View className="flex-row">
            {/* Like button */}
            <TouchableOpacity
              onPress={() => onToggleLike(comment.id)}
              className="flex-row items-center mr-4"
            >
              <Ionicons
                name={comment.isLikedByCurrentUser ? "thumbs-up" : "thumbs-up-outline"}
                size={16}
                color={comment.isLikedByCurrentUser ? "#3b82f6" : "#6b7280"}
                className="mr-1"
              />
              <Text className="text-xs text-gray-500">{comment.likeCounts}</Text>
            </TouchableOpacity>

            {/* Reply button */}
            <TouchableOpacity
              onPress={() => onReply(comment)}
              className="flex-row items-center mr-4"
            >
              <Ionicons
                name="chatbubble-outline"
                size={16}
                color="#4b5563"
                className="mr-1"
              />
              <Text className="text-xs text-gray-500">Reply</Text>
            </TouchableOpacity>

            {/* Delete button (only for current user's comments) */}
            {currentUserId === comment.userId && (
              <TouchableOpacity
                onPress={() => setShowDeleteOptions(true)}
                className="flex-row items-center"
              >
                <Ionicons
                  name="trash-outline"
                  size={16}
                  color="#ef4444"
                  className="mr-1"
                />
                <Text className="text-xs text-red-500">Delete</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* View replies button (only for root comments with replies) */}
          {!isReply && comment.directReplyCount > 0 && onViewReplies && (
            <TouchableOpacity
              onPress={() => onViewReplies(comment.id)}
              className="flex-row items-center"
            >
              <Ionicons
                name={showReplies ? "chevron-up" : "chevron-down"}
                size={16}
                color="#3b82f6"
                className="mr-1"
              />
              <Text className="text-xs text-blue-500">
                {showReplies ? 'Hide' : 'View'} {comment.directReplyCount} {comment.directReplyCount === 1 ? 'reply' : 'replies'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Delete options modal */}
      {showDeleteOptions && (
        <View className="mt-4 p-3 border border-gray-300 rounded-lg bg-gray-50">
          <Text className="font-bold mb-2">Select reason for deletion:</Text>

          {Object.values(DeleteReasonTagComment).map((reason, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setDeleteReason(reason)}
              className={`p-2 mb-1 rounded ${deleteReason === reason ? 'bg-blue-100' : ''}`}
            >
              <Text>{reason}</Text>
            </TouchableOpacity>
          ))}

          <View className="flex-row justify-end mt-2">
            <TouchableOpacity
              onPress={() => setShowDeleteOptions(false)}
              className="p-2 mr-2 bg-gray-200 rounded"
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                onDelete(comment.id, deleteReason);
                setShowDeleteOptions(false);
              }}
              className="p-2 bg-red-500 rounded"
            >
              <Text className="text-white">Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default CommentItem;