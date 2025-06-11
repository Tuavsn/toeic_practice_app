import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import useDraft from '@/hooks/useDraft';

interface DraftData {
  testId: string;
  partNum?: string;
  submittedAnswers: Record<string, string>;
  currentQuestionIndex: number;
  lastSaved: number;
  totalQuestions: number;
  answeredCount: number;
}

export default function DraftListScreen() {
  const router = useRouter();
  const { getAllDrafts, deleteDraft, loading, error } = useDraft();
  
  const [drafts, setDrafts] = useState<DraftData[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState<DraftData | null>(null);

  // Load drafts when screen focuses
  useFocusEffect(
    useCallback(() => {
      loadDrafts();
    }, [])
  );

  const loadDrafts = async () => {
    try {
      const savedDrafts = await getAllDrafts();
      setDrafts(savedDrafts);
    } catch (err) {
      console.error('Error loading drafts:', err);
      Alert.alert('Error', 'Failed to load saved drafts');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDrafts();
    setRefreshing(false);
  };

  const continueDraft = (draft: DraftData) => {
    // Navigate to test screen with draft parameters
    if (draft.partNum) {
      router.push({
        pathname: '/(main)/test',
        params: {
          partNum: draft.partNum,
          questionId: null, // Will be set by the draft loading
        },
      });
    } else {
      router.push({
        pathname: '/(main)/test',
        params: {
          testId: draft.testId,
          questionId: null,
        },
      });
    }
  };

  const confirmDeleteDraft = (draft: DraftData) => {
    setSelectedDraft(draft);
    setDeleteModalVisible(true);
  };

  const handleDeleteDraft = async () => {
    if (!selectedDraft) return;

    try {
      await deleteDraft(selectedDraft.testId, selectedDraft.partNum);
      await loadDrafts(); // Refresh the list
      setDeleteModalVisible(false);
      setSelectedDraft(null);
      Alert.alert('Success', 'Draft deleted successfully');
    } catch (err) {
      console.error('Error deleting draft:', err);
      Alert.alert('Error', 'Failed to delete draft');
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  const getProgressPercentage = (draft: DraftData) => {
    return Math.round((draft.answeredCount / draft.totalQuestions) * 100);
  };

  const renderDraftItem = ({ item }: { item: DraftData }) => {
    const progressPercentage = getProgressPercentage(item);
    
    return (
      <View className="bg-white mx-4 mb-4 rounded-xl shadow-sm border border-gray-100">
        <TouchableOpacity
          onPress={() => continueDraft(item)}
          className="p-4"
          activeOpacity={0.7}
        >
          {/* Header */}
          <View className="flex-row justify-between items-start mb-3">
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-800">
                {item.partNum ? `Part ${item.partNum}` : `Test ${item.testId}`}
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                Last saved: {formatDate(item.lastSaved)}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => confirmDeleteDraft(item)}
              className="p-2 -mr-2 -mt-2"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>

          {/* Progress */}
          <View className="mb-3">
            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-sm text-gray-600">Progress</Text>
              <Text className="text-sm font-medium text-blue-600">
                {item.answeredCount}/{item.totalQuestions} ({progressPercentage}%)
              </Text>
            </View>
            <View className="h-2 bg-gray-200 rounded-full">
              <View
                className="h-2 bg-blue-500 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </View>
          </View>

          {/* Current question info */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="bookmark-outline" size={16} color="#6B7280" />
              <Text className="text-sm text-gray-600 ml-1">
                Question {item.currentQuestionIndex + 1}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-sm text-blue-600 mr-1">Continue</Text>
              <Ionicons name="chevron-forward" size={16} color="#3B82F6" />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center">
          <LottieView
            source={require('@/assets/animations/loading.json')}
            autoPlay
            loop
            style={{ width: 120, height: 120 }}
          />
          <Text className="text-base text-gray-600 mt-4">Loading drafts...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-xl font-bold text-gray-800">Saved Drafts</Text>
            <Text className="text-sm text-gray-600">
              Continue your incomplete tests
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2 -mr-2"
          >
            <Ionicons name="close" size={24} color="#4B5563" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {drafts.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Ionicons name="document-outline" size={80} color="#D1D5DB" />
          <Text className="text-xl font-semibold text-gray-800 mt-4 text-center">
            No Saved Drafts
          </Text>
          <Text className="text-gray-600 text-center mt-2">
            Your incomplete tests will be automatically saved here for you to continue later.
          </Text>
        </View>
      ) : (
        <FlatList
          data={drafts}
          renderItem={renderDraftItem}
          keyExtractor={(item) => `${item.testId}_${item.partNum || 'main'}`}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white rounded-xl mx-6 p-6">
            <View className="items-center mb-4">
              <Ionicons name="warning" size={48} color="#F59E0B" />
            </View>
            
            <Text className="text-lg font-semibold text-gray-800 text-center mb-2">
              Delete Draft
            </Text>
            <Text className="text-gray-600 text-center mb-6">
              Are you sure you want to delete this saved draft? This action cannot be undone.
            </Text>
            
            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={() => setDeleteModalVisible(false)}
                className="flex-1 py-3 bg-gray-200 rounded-lg"
              >
                <Text className="text-gray-700 font-medium text-center">Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleDeleteDraft}
                className="flex-1 py-3 bg-red-600 rounded-lg"
              >
                <Text className="text-white font-medium text-center">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}