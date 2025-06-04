import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Keyboard,
  Animated,
  ScrollView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

// Định nghĩa các interface cho dữ liệu từ điển
interface Phonetic {
  text?: string;
  audio?: string;
}

interface Definition {
  definition: string;
  example?: string;
  synonyms?: string[];
  antonyms?: string[];
}

interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
  synonyms?: string[];
  antonyms?: string[];
}

interface DictionaryResult {
  word: string;
  phonetics: Phonetic[];
  meanings: Meaning[];
  sourceUrls?: string[];
  license?: {
    name: string;
    url: string;
  };
}

interface TranslationResponse {
  responseData: {
    translatedText: string;
  };
  responseStatus: number;
  responseDetails: string;
}

interface SuggestedWord {
  word: string;
  score: number;
}

interface FloatingDictionaryProps {
  // Optional callback to be notified when the modal opens/closes
  onModalStateChange?: (isOpen: boolean) => void;
}

const API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const TRANSLATION_API_URL = "https://api.mymemory.translated.net/get";
const DATAMUSE_API_URL = "https://api.datamuse.com/words";
const HISTORY_STORAGE_KEY = "dictionary_history";
const BOOKMARKS_STORAGE_KEY = "dictionary_bookmarks";

const FloatingDictionary: React.FC<FloatingDictionaryProps> = ({ onModalStateChange }) => {
  // UI state
  const [modalVisible, setModalVisible] = useState(false);
  const [word, setWord] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [showBookmarks, setShowBookmarks] = useState<boolean>(false);

  // Data state
  const [results, setResults] = useState<DictionaryResult[] | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [translations, setTranslations] = useState<{ [key: string]: string }>({});
  const [translationLoading, setTranslationLoading] = useState<{ [key: string]: boolean }>({});
  
  // Suggestion state (new)
  const [suggestedWords, setSuggestedWords] = useState<SuggestedWord[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  
  // Animation refs
  const scale = useRef(new Animated.Value(1)).current;
  const buttonPosition = useRef(new Animated.Value(0)).current;
  const keyboardVisible = useRef(false);

  // Load history and bookmarks from AsyncStorage
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const savedHistory = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
        if (savedHistory) {
          setHistory(JSON.parse(savedHistory));
        }

        const savedBookmarks = await AsyncStorage.getItem(BOOKMARKS_STORAGE_KEY);
        if (savedBookmarks) {
          setBookmarks(JSON.parse(savedBookmarks));
        }
      } catch (error) {
        console.error("Error loading saved dictionary data:", error);
      }
    };

    if (modalVisible) {
      loadSavedData();
    }
  }, [modalVisible]);

  // Listen for keyboard events to adjust button position
  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        keyboardVisible.current = true;
        Animated.timing(buttonPosition, {
          toValue: -100, // Move up when keyboard shows
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    );
    
    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        keyboardVisible.current = false;
        Animated.timing(buttonPosition, {
          toValue: 0, // Return to original position
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  // Notify parent component when modal state changes
  useEffect(() => {
    if (onModalStateChange) {
      onModalStateChange(modalVisible);
    }
  }, [modalVisible, onModalStateChange]);

  // Save history to AsyncStorage whenever it changes
  useEffect(() => {
    const saveHistory = async () => {
      if (history.length > 0) {
        await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
      }
    };
    
    saveHistory();
  }, [history]);

  // Save bookmarks to AsyncStorage whenever they change
  useEffect(() => {
    const saveBookmarks = async () => {
      if (bookmarks.length > 0) {
        await AsyncStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
      }
    };
    
    saveBookmarks();
  }, [bookmarks]);

  // Button press animation
  const animateButton = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setShowHistory(false);
    setShowBookmarks(false);
    setShowSuggestions(false);
    setResults(null);
    setError(null);
  };

  // Tìm kiếm danh sách từ gợi ý (new)
  const searchSuggestedWords = async (searchTerm: string): Promise<void> => {
    if (!searchTerm.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập từ cần tra cứu");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResults(null); // Reset kết quả cũ
      setSuggestedWords([]); // Reset từ gợi ý cũ

      console.log(`Đang tìm kiếm từ gợi ý cho: ${searchTerm}`);
      
      // Sử dụng API Datamuse để tìm từ gợi ý
      const response = await axios.get<SuggestedWord[]>(`${DATAMUSE_API_URL}?sp=${searchTerm}*&max=15`);
      
      if (response.data && response.data.length > 0) {
        setSuggestedWords(response.data);
        setShowSuggestions(true);
        setShowHistory(false);
        setShowBookmarks(false);
        
        // Haptic feedback for successful suggestion search
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        // Nếu không có từ gợi ý, thử tìm kiếm trực tiếp từ đó
        await searchWord(searchTerm);
      }
    } catch (err) {
      console.error("Lỗi khi tìm từ gợi ý:", err);
      // Nếu có lỗi khi tìm từ gợi ý, thử tìm kiếm trực tiếp từ đó
      await searchWord(searchTerm);
    } finally {
      setLoading(false);
    }
  };

  // Tìm kiếm từ
  const searchWord = async (searchTerm: string): Promise<void> => {
    if (!searchTerm.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập từ cần tra cứu");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResults(null); // Reset kết quả cũ
      setShowHistory(false);
      setShowBookmarks(false);
      setShowSuggestions(false);
      setTranslations({}); // Reset bản dịch cũ

      console.log(`Đang tìm kiếm từ: ${searchTerm}`);
      const response = await axios.get<DictionaryResult[]>(`${API_URL}${searchTerm.toLowerCase()}`);
      
      if (response.data && response.data.length > 0) {
        setResults(response.data);
        
        // Thêm từ vào lịch sử
        if (!history.includes(searchTerm.toLowerCase())) {
          setHistory(prev => [searchTerm.toLowerCase(), ...prev.slice(0, 9)]);
        }

        // Haptic feedback for successful search
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        setError('Không có kết quả cho từ này.');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } catch (err) {
      console.error("Lỗi khi tìm kiếm:", err);
      setError('Không tìm thấy từ này trong từ điển.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  // Lưu từ vào danh sách yêu thích
  const toggleBookmark = (wordToBookmark: string): void => {
    if (bookmarks.includes(wordToBookmark)) {
      setBookmarks(bookmarks.filter(item => item !== wordToBookmark));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      setBookmarks([...bookmarks, wordToBookmark]);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  // Dịch sang tiếng Việt
  const translateToVietnamese = async (englishWord: string, defIndex: string): Promise<void> => {
    try {
      // Đánh dấu đang tải bản dịch
      setTranslationLoading(prev => ({
        ...prev,
        [defIndex]: true
      }));

      // Kiểm tra nếu đã có bản dịch trong cache
      if (translations[defIndex]) {
        setTranslationLoading(prev => ({
          ...prev,
          [defIndex]: false
        }));
        return;
      }

      // Sử dụng API dịch với tham số rõ ràng hơn
      const response = await axios.get<TranslationResponse>(
        `${TRANSLATION_API_URL}?q=${encodeURIComponent(englishWord)}&langpair=en|vi`
      );

      if (response.data && response.data.responseData) {
        setTranslations(prev => ({
          ...prev,
          [defIndex]: response.data.responseData.translatedText
        }));
      } else {
        setTranslations(prev => ({
          ...prev,
          [defIndex]: "Không thể dịch"
        }));
      }
    } catch (err) {
      console.error('Lỗi dịch', err);
      setTranslations(prev => ({
        ...prev,
        [defIndex]: "Lỗi dịch"
      }));
    } finally {
      setTranslationLoading(prev => ({
        ...prev,
        [defIndex]: false
      }));
    }
  };

  // Tải bản dịch cho tất cả các định nghĩa
  useEffect(() => {
    if (results) {
      results.forEach((result, resultIndex) => {
        result.meanings.forEach((meaning, meaningIndex) => {
          meaning.definitions.forEach((def, defIndex) => {
            const key = `${resultIndex}-${meaningIndex}-${defIndex}`;
            translateToVietnamese(def.definition, key);
          });
        });
      });
    }
  }, [results]);

  // Component hiển thị từ gợi ý (new)
  const SuggestionsSection: React.FC = () => {
    if (!showSuggestions || suggestedWords.length === 0) return null;

    return (
      <View className="bg-white rounded-lg shadow-sm mb-4">
        <Text className="p-3 text-lg font-medium text-gray-700">Từ gợi ý</Text>
        
        <FlatList
          data={suggestedWords}
          keyExtractor={(item) => item.word}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setWord(item.word);
                searchWord(item.word);
              }}
              className="p-3 border-t border-gray-100 flex-row justify-between"
            >
              <Text className="text-gray-700">{item.word}</Text>
              <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };

  // Component hiển thị kết quả
  const ResultSection: React.FC = () => {
    if (loading) {
      return (
        <View className="flex items-center justify-center py-8">
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      );
    }

    if (error) {
      return (
        <View className="bg-red-50 p-4 rounded-lg my-4">
          <Text className="text-red-500 text-center">{error}</Text>
        </View>
      );
    }

    if (!results || results.length === 0) {
      return null;
    }

    return (
      <ScrollView className="flex-1">
        {results.map((result, resultIndex) => (
          <View key={resultIndex} className="bg-white rounded-lg p-4 shadow-sm mb-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-2xl font-bold text-gray-800">{result.word}</Text>
              <TouchableOpacity
                onPress={() => toggleBookmark(result.word)}
                className="p-2"
              >
                <Ionicons
                  name={bookmarks.includes(result.word) ? "bookmark" : "bookmark-outline"}
                  size={24}
                  color="#3b82f6"
                />
              </TouchableOpacity>
            </View>

            {/* Phần Phonetics nếu có */}
            {result.phonetics && result.phonetics.length > 0 && result.phonetics[0].text && (
              <Text className="text-gray-500 mb-3">{result.phonetics[0].text}</Text>
            )}

            {result.meanings && result.meanings.map((meaning, meaningIndex) => (
              <View key={meaningIndex} className="mb-3">
                <Text className="text-blue-500 font-medium mb-1">
                  {meaning.partOfSpeech}
                </Text>

                {meaning.definitions && meaning.definitions.map((def, defIndex) => {
                  const translationKey = `${resultIndex}-${meaningIndex}-${defIndex}`;
                  return (
                    <View key={defIndex} className="mb-2 pl-2 border-l-2 border-gray-200">
                      {/* Định nghĩa tiếng Anh */}
                      <Text className="text-gray-700">{defIndex + 1}. {def.definition}</Text>

                      {def.example && (
                        <Text className="text-gray-500 italic mt-1">
                          <Text className="font-medium">Ví dụ: </Text>
                          "{def.example}"
                        </Text>
                      )}

                      {/* Bản dịch tiếng Việt */}
                      <View className="flex-row items-center mt-1">
                        <Text className="text-gray-600 font-medium mr-1">Nghĩa: </Text>
                        {translationLoading[translationKey] ? (
                          <ActivityIndicator size="small" color="#22c55e" />
                        ) : (
                          <Text className="text-green-600">
                            {translations[translationKey] || "Đang dịch..."}
                          </Text>
                        )}
                      </View>
                    </View>
                  );
                })}

                {/* Hiển thị từ đồng nghĩa */}
                {meaning.synonyms && meaning.synonyms.length > 0 && (
                  <View className="mt-2">
                    <Text className="text-gray-700 font-medium">Từ đồng nghĩa:</Text>
                    <Text className="text-gray-600">{meaning.synonyms.slice(0, 5).join(", ")}</Text>
                  </View>
                )}
                
                {/* Hiển thị từ trái nghĩa */}
                {meaning.antonyms && meaning.antonyms.length > 0 && (
                  <View className="mt-2">
                    <Text className="text-gray-700 font-medium">Từ trái nghĩa:</Text>
                    <Text className="text-gray-600">{meaning.antonyms.slice(0, 5).join(", ")}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    );
  };

  // Hiển thị lịch sử tìm kiếm
  const HistorySection: React.FC = () => {
    if (!showHistory) return null;

    return (
      <View className="bg-white rounded-lg shadow-sm mb-4">
        <Text className="p-3 text-lg font-medium text-gray-700">Lịch sử tìm kiếm</Text>

        {history.length === 0 ? (
          <Text className="p-3 text-gray-500 italic">Chưa có lịch sử tìm kiếm</Text>
        ) : (
          <FlatList
            data={history}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setWord(item);
                  searchWord(item);
                }}
                className="p-3 border-t border-gray-100 flex-row justify-between"
              >
                <Text className="text-gray-700">{item}</Text>
                <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    );
  };

  // Hiển thị danh sách từ đã đánh dấu
  const BookmarksSection: React.FC = () => {
    if (!showBookmarks) return null;

    return (
      <View className="bg-white rounded-lg shadow-sm mb-4">
        <Text className="p-3 text-lg font-medium text-gray-700">Từ đã lưu</Text>

        {bookmarks.length === 0 ? (
          <Text className="p-3 text-gray-500 italic">Chưa có từ nào được lưu</Text>
        ) : (
          <FlatList
            data={bookmarks}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setWord(item);
                  searchWord(item);
                }}
                className="p-3 border-t border-gray-100 flex-row justify-between"
              >
                <Text className="text-gray-700">{item}</Text>
                <TouchableOpacity
                  onPress={() => toggleBookmark(item)}
                  className="p-1"
                >
                  <Ionicons name="close-circle" size={20} color="#ef4444" />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    );
  };

  return (
    <>
      <Animated.View 
        style={{
          position: 'absolute',
          bottom: 90, // Đặt cao hơn so với FloatingChatButton
          right: 10,
          transform: [
            { scale },
            { translateY: buttonPosition }
          ],
          zIndex: 1000,
        }}
      >
        <TouchableOpacity
          onPress={animateButton}
          style={{
            backgroundColor: '#10B981', // green-500
            width: 45,
            height: 45,
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 3,
          }}
        >
          <Ionicons name="book" size={24} color="white" />
        </TouchableOpacity>
      </Animated.View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <SafeAreaView className="flex-1 bg-black bg-opacity-30">
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 justify-end"
          >
            <View className="bg-white rounded-t-3xl h-3/4 shadow-lg">
              {/* Header */}
              <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
                <Text className="text-xl font-bold text-gray-800">Từ Điển Anh-Việt</Text>
                <TouchableOpacity onPress={handleCloseModal}>
                  <Ionicons name="close" size={24} color="#4B5563" />
                </TouchableOpacity>
              </View>

              {/* Search bar */}
              <View className="flex-row items-center bg-gray-100 mx-4 my-3 rounded-full px-4">
                <TextInput
                  className="flex-1 py-2"
                  placeholder="Nhập từ tiếng Anh..."
                  value={word}
                  onChangeText={setWord}
                  returnKeyType="search"
                  onSubmitEditing={() => searchSuggestedWords(word)}
                  blurOnSubmit={true}
                />
                <TouchableOpacity
                  onPress={() => searchSuggestedWords(word)}
                  disabled={loading || !word.trim()}
                  className={`${!word.trim() || loading ? 'opacity-50' : ''}`}
                >
                  <Ionicons name="search" size={22} color="#3b82f6" />
                </TouchableOpacity>
              </View>
              
              {/* Buttons */}
              <View className="flex-row justify-between px-4 mb-3">
                <TouchableOpacity
                  onPress={() => {
                    setShowHistory(!showHistory);
                    if (showBookmarks) setShowBookmarks(false);
                    if (showSuggestions) setShowSuggestions(false);
                  }}
                  className={`${showHistory ? 'bg-blue-500' : 'bg-white'} p-2 rounded-lg shadow-sm flex-row items-center`}
                >
                  <Ionicons
                    name="time-outline"
                    size={18}
                    color={showHistory ? "white" : "#3b82f6"}
                  />
                  <Text className={`${showHistory ? 'text-white' : 'text-blue-500'} ml-1`}>
                    Lịch sử
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setShowBookmarks(!showBookmarks);
                    if (showHistory) setShowHistory(false);
                    if (showSuggestions) setShowSuggestions(false);
                  }}
                  className={`${showBookmarks ? 'bg-blue-500' : 'bg-white'} p-2 rounded-lg shadow-sm flex-row items-center`}
                >
                  <Ionicons
                    name="bookmark"
                    size={18}
                    color={showBookmarks ? "white" : "#3b82f6"}
                  />
                  <Text className={`${showBookmarks ? 'text-white' : 'text-blue-500'} ml-1`}>
                    Đã lưu ({bookmarks.length})
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Content area */}
              <View className="flex-1 px-4 pb-4">
                <HistorySection />
                <BookmarksSection />
                <SuggestionsSection />
                <ResultSection />
                
                {/* Initial state - Empty content */}
                {!loading && !error && !results && !showHistory && !showBookmarks && !showSuggestions && (
                  <View className="flex-1 justify-center items-center">
                    <Ionicons name="book-outline" size={60} color="#10B981" />
                    <Text className="text-center text-gray-600 mt-4 px-6">
                      Nhập từ tiếng Anh để tra cứu nghĩa và cách phát âm
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </>
  );
};

export default FloatingDictionary;