import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DraftData {
  testId: string;
  partNum?: string;
  submittedAnswers: Record<string, string>;
  currentQuestionIndex: number;
  lastSaved: number;
  totalQuestions: number;
  answeredCount: number;
}

interface UseDraftReturn {
  saveDraft: (draftData: Omit<DraftData, 'lastSaved'>) => Promise<void>;
  loadDraft: (testId: string, partNum?: string) => Promise<DraftData | null>;
  deleteDraft: (testId: string, partNum?: string) => Promise<void>;
  getAllDrafts: () => Promise<DraftData[]>;
  isDraftExists: (testId: string, partNum?: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export const useDraft = (): UseDraftReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const DRAFT_PREFIX = 'test_draft_';
  
  // Generate unique key for draft
  const generateDraftKey = (testId: string, partNum?: string): string => {
    return `${DRAFT_PREFIX}${testId}${partNum ? `_part_${partNum}` : ''}`;
  };

  // Save draft to AsyncStorage
  const saveDraft = useCallback(async (draftData: Omit<DraftData, 'lastSaved'>): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const draftKey = generateDraftKey(draftData.testId, draftData.partNum);
      const draftWithTimestamp: DraftData = {
        ...draftData,
        lastSaved: Date.now(),
      };

      await AsyncStorage.setItem(draftKey, JSON.stringify(draftWithTimestamp));
      console.log('Draft saved successfully:', draftKey);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save draft';
      setError(errorMessage);
      console.error('Error saving draft:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load draft from AsyncStorage
  const loadDraft = useCallback(async (testId: string, partNum?: string): Promise<DraftData | null> => {
    try {
      setLoading(true);
      setError(null);

      const draftKey = generateDraftKey(testId, partNum);
      const draftJson = await AsyncStorage.getItem(draftKey);
      
      if (!draftJson) {
        return null;
      }

      const draftData: DraftData = JSON.parse(draftJson);
      console.log('Draft loaded successfully:', draftKey);
      return draftData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load draft';
      setError(errorMessage);
      console.error('Error loading draft:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete draft from AsyncStorage
  const deleteDraft = useCallback(async (testId: string, partNum?: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const draftKey = generateDraftKey(testId, partNum);
      await AsyncStorage.removeItem(draftKey);
      console.log('Draft deleted successfully:', draftKey);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete draft';
      setError(errorMessage);
      console.error('Error deleting draft:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get all saved drafts
  const getAllDrafts = useCallback(async (): Promise<DraftData[]> => {
    try {
      setLoading(true);
      setError(null);

      const allKeys = await AsyncStorage.getAllKeys();
      const draftKeys = allKeys.filter(key => key.startsWith(DRAFT_PREFIX));
      
      if (draftKeys.length === 0) {
        return [];
      }

      const draftValues = await AsyncStorage.multiGet(draftKeys);
      const drafts: DraftData[] = [];

      draftValues.forEach(([key, value]) => {
        if (value) {
          try {
            const draftData: DraftData = JSON.parse(value);
            drafts.push(draftData);
          } catch (parseErr) {
            console.error('Error parsing draft data for key:', key, parseErr);
          }
        }
      });

      // Sort by lastSaved timestamp (most recent first)
      drafts.sort((a, b) => b.lastSaved - a.lastSaved);
      
      console.log('All drafts loaded:', drafts.length);
      return drafts;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load drafts';
      setError(errorMessage);
      console.error('Error loading all drafts:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Check if draft exists
  const isDraftExists = useCallback(async (testId: string, partNum?: string): Promise<boolean> => {
    try {
      const draftKey = generateDraftKey(testId, partNum);
      const draftJson = await AsyncStorage.getItem(draftKey);
      return draftJson !== null;
    } catch (err) {
      console.error('Error checking draft existence:', err);
      return false;
    }
  }, []);

  // Clear error when component unmounts or error is resolved
  useEffect(() => {
    return () => {
      setError(null);
    };
  }, []);

  return {
    saveDraft,
    loadDraft,
    deleteDraft,
    getAllDrafts,
    isDraftExists,
    loading,
    error,
  };
};

export default useDraft;