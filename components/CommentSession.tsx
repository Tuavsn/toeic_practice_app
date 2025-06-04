import React from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { CommentTargetType, Comment } from '@/types/global.type';
import CommentInput from './CommentInput';
import CommentItem from './CommentItem';
import { useCommentSystem } from '@/hooks/useComment';

interface CommentSystemProps {
  targetType: CommentTargetType;
  targetId: string;
  currentUserId: string;
  userAvatarUrl?: string;
}

const CommentSystem: React.FC<CommentSystemProps> = ({
  targetType,
  targetId,
  currentUserId,
  userAvatarUrl
}) => {
  const {
    rootComments,
    replyComments,
    loadingRootComments,
    loadingReplies,
    hasMore,
    commentText,
    replyTo,
    expandedComments,
    commentInputRef,
    flatListRef,
    setCommentText,
    handleSubmitComment,
    handleToggleLike,
    handleDeleteComment,
    handleReply,
    handleCancelReply,
    toggleReplies,
    handleEndReached
  } = useCommentSystem(targetType, targetId, currentUserId);

  // Render comment item với replies
  const renderCommentItem = ({ item }: { item: Comment }) => (
    <View>
      <CommentItem
        comment={item}
        onReply={handleReply}
        onToggleLike={handleToggleLike}
        onDelete={handleDeleteComment}
        onViewReplies={toggleReplies}
        showReplies={expandedComments[item.id]}
        currentUserId={currentUserId}
      />

      {/* Show replies if expanded */}
      {expandedComments[item.id] && (
        <View className="ml-8">
          {loadingReplies[item.id] ? (
            <View className="p-4 items-center">
              <ActivityIndicator size="small" color="#3b82f6" />
            </View>
          ) : (
            replyComments[item.id] && replyComments[item.id].map((reply, index) => (
              <CommentItem
                key={index}
                comment={reply}
                onReply={handleReply}
                onToggleLike={handleToggleLike}
                onDelete={handleDeleteComment}
                isReply={true}
                currentUserId={currentUserId}
              />
            ))
          )}
        </View>
      )}
    </View>
  );

  const renderFooter = () => {
    if (!loadingRootComments) return null;
    return (
      <View className="p-4 items-center">
        <ActivityIndicator size="small" color="#3b82f6" />
      </View>
    );
  };

  const renderEmptyComponent = () => {
    if (loadingRootComments) return null;
    return (
      <View className="p-4 items-center">
        <Text className="text-gray-400">No comments yet. Be the first to comment!</Text>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-100 mb-10">
      {/* Header */}
      <View className="p-4 bg-white border-b border-gray-200">
        <Text className="text-lg font-bold">Comments ({rootComments.length})</Text>
      </View>

      {/* Comment Input */}
      <CommentInput
        ref={commentInputRef}
        value={commentText}
        onChangeText={setCommentText}
        onSubmit={handleSubmitComment}
        userAvatarUrl={userAvatarUrl}
        replyTo={replyTo}
        onCancelReply={handleCancelReply}
      />

      {/* Comments List */}
      <FlatList
        ref={flatListRef}
        data={rootComments}
        renderItem={renderCommentItem}
        keyExtractor={item => item.id}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
      />
    </View>
  );
};

export default CommentSystem;