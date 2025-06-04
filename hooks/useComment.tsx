import { useState, useEffect, useRef } from 'react';
import { Alert, TextInput, FlatList } from 'react-native';
import commentService from '../services/comment.service';
import {
  Comment,
  CommentTargetType,
  CreateCommentRequest,
  DeleteCommentRequest,
  DeleteReasonTagComment
} from '@/types/global.type';

interface PaginationParams {
  current: number;
  pageSize: number;
  sortBy: string[];
  sortDirection: string[];
}

export const useCommentSystem = (
  targetType: CommentTargetType,
  targetId: string,
  currentUserId: string
) => {
  // State for comments data
  const [rootComments, setRootComments] = useState<Comment[]>([]);
  const [replyComments, setReplyComments] = useState<Record<string, Comment[]>>({});
  const [loadingRootComments, setLoadingRootComments] = useState<boolean>(false);
  const [loadingReplies, setLoadingReplies] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // State for UI interactions
  const [commentText, setCommentText] = useState<string>('');
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

  // Refs
  const commentInputRef = useRef<TextInput>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    fetchRootComments(true);
  }, [targetType, targetId]);

  const fetchRootComments = async (refresh = false): Promise<void> => {
    try {
      setLoadingRootComments(true);
      const currentPage = refresh ? 1 : page;

      const paginationParams: PaginationParams = {
        current: currentPage,
        pageSize: 10,
        sortBy: ['createdAt'],
        sortDirection: ['DESC']
      };

      const response = await commentService.getRootComments(targetType, targetId, paginationParams);

      if (response.success && response.data) {
        if (refresh) {
          setRootComments(response.data);
          setPage(2);
        } else {
          setRootComments(prev => [...prev, ...response.data]);
          setPage(currentPage + 1);
        }

        setHasMore(response.data.length === 10);
      } else {
        Alert.alert('Error', 'Failed to load comments');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Error', 'Could not load comments: ' + errorMessage);
    } finally {
      setLoadingRootComments(false);
    }
  };

  const fetchReplies = async (commentId: string): Promise<void> => {
    try {
      setLoadingReplies(prev => ({ ...prev, [commentId]: true }));

      const paginationParams: PaginationParams = {
        current: 1,
        pageSize: 100,
        sortBy: ['createdAt'],
        sortDirection: ['ASC']
      };

      const response = await commentService.getReplyComments(targetType, targetId, commentId, paginationParams);

      if (response.success && response.data) {
        setReplyComments(prev => ({
          ...prev,
          [commentId]: response.data
        }));
      } else {
        Alert.alert('Error', 'Failed to load replies');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Error', 'Could not load replies: ' + errorMessage);
    } finally {
      setLoadingReplies(prev => ({ ...prev, [commentId]: false }));
    }
  };

  const toggleReplies = (commentId: string): void => {
    const newExpandedState = !expandedComments[commentId];
    setExpandedComments(prev => ({
      ...prev,
      [commentId]: newExpandedState
    }));

    if (newExpandedState && (!replyComments[commentId] || replyComments[commentId].length === 0)) {
      fetchReplies(commentId);
    }
  };

  const handleSubmitComment = async (): Promise<void> => {
    if (!commentText.trim()) return;

    try {
      const commentRequest: CreateCommentRequest = {
        content: commentText.trim(),
        targetType,
        targetId,
        parentId: replyTo?.id || null
      };

      const response = await commentService.createComment(commentRequest);

      if (response.success && response.data) {
        if (replyTo) {
          setReplyComments(prev => ({
            ...prev,
            [replyTo.id]: [response.data, ...(prev[replyTo.id] || [])]
          }));

          setRootComments(prev =>
            prev.map(comment =>
              comment.id === replyTo.id
                ? { ...comment, directReplyCount: comment.directReplyCount + 1 }
                : comment
            )
          );

          setExpandedComments(prev => ({
            ...prev,
            [replyTo.id]: true
          }));

          setReplyTo(null);
        } else {
          setRootComments(prev => [response.data, ...prev]);
        }

        setCommentText('');
      } else {
        Alert.alert('Error', 'Failed to post comment');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Error', 'Could not submit comment: ' + errorMessage);
    }
  };

  const handleToggleLike = async (commentId: string): Promise<void> => {
    try {
      const response = await commentService.toggleLike(commentId);

      if (response.success && response.data) {
        const updateCommentInList = (list: Comment[]): Comment[] =>
          list.map(comment =>
            comment.id === commentId
              ? {
                  ...comment,
                  isLikedByCurrentUser: response.data.isLikedByCurrentUser,
                  likeCounts: response.data.likeCounts
                }
              : comment
          );

        setRootComments(prev => updateCommentInList(prev));

        Object.keys(replyComments).forEach(parentId => {
          setReplyComments(prev => ({
            ...prev,
            [parentId]: updateCommentInList(prev[parentId] || [])
          }));
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Error', 'Could not toggle like: ' + errorMessage);
    }
  };

  const handleDeleteComment = async (commentId: string, reasonTag: DeleteReasonTagComment): Promise<void> => {
    try {
      const deleteRequest: DeleteCommentRequest = {
        reasonTag,
        reason: 'User deleted comment'
      };

      const response = await commentService.deleteComment(commentId, deleteRequest);

      if (response.success && response.data) {
        const updateCommentInList = (list: Comment[]): Comment[] =>
          list.map(comment =>
            comment.id === commentId
              ? {
                  ...comment,
                  deleted: true,
                  deleteReasonTag: reasonTag,
                  content: '[Deleted]'
                }
              : comment
          );

        setRootComments(prev => updateCommentInList(prev));

        Object.keys(replyComments).forEach(parentId => {
          setReplyComments(prev => ({
            ...prev,
            [parentId]: updateCommentInList(prev[parentId] || [])
          }));
        });
      } else {
        Alert.alert('Error', 'Failed to delete comment');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Error', 'Could not delete comment: ' + errorMessage);
    }
  };

  const handleReply = (comment: Comment): void => {
    setReplyTo(comment);
    setCommentText(`@${comment.userDisplayName} `);
    if (commentInputRef.current) {
      commentInputRef.current.focus();
    }
  };

  const handleCancelReply = (): void => {
    setReplyTo(null);
    setCommentText('');
  };

  const handleEndReached = () => {
    if (!loadingRootComments && hasMore) {
      fetchRootComments();
    }
  };

  return {
    // State
    rootComments,
    replyComments,
    loadingRootComments,
    loadingReplies,
    hasMore,
    commentText,
    replyTo,
    expandedComments,
    
    // Refs
    commentInputRef,
    flatListRef,
    
    // Handlers
    setCommentText,
    handleSubmitComment,
    handleToggleLike,
    handleDeleteComment,
    handleReply,
    handleCancelReply,
    toggleReplies,
    handleEndReached
  };
};