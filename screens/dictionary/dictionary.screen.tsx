import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// Định nghĩa các interface cho dữ liệu
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

const API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const TRANSLATION_API_URL = "https://api.mymemory.translated.net/get";
const DATAMUSE_API_URL = "https://api.datamuse.com/words";

const DictionaryScreen: React.FC = () => {
  const [word, setWord] = useState<string>('');
  const [results, setResults] = useState<DictionaryResult[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [translations, setTranslations] = useState<{ [key: string]: string }>({});
  const [translationLoading, setTranslationLoading] = useState<{ [key: string]: boolean }>({});
  const [showBookmarks, setShowBookmarks] = useState<boolean>(false);
  const [suggestedWords, setSuggestedWords] = useState<SuggestedWord[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  // Tìm kiếm danh sách từ gợi ý
  const searchSuggestedWords = async (searchTerm: string): Promise<void> => {
    if (!searchTerm.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập từ khóa cần tìm");
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

  // Tìm kiếm nghĩa của từ
  const searchWord = async (searchTerm: string): Promise<void> => {
    if (!searchTerm.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập từ khóa cần tìm");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResults(null); // Reset kết quả cũ
      setTranslations({}); // Reset bản dịch cũ
      setShowSuggestions(false); // Ẩn danh sách gợi ý

      console.log(`Đang tìm kiếm nghĩa của từ: ${searchTerm}`);
      const response = await axios.get<DictionaryResult[]>(`${API_URL}${searchTerm.toLowerCase()}`);

      if (response.data && response.data.length > 0) {
        setResults(response.data);

        // Thêm từ vào lịch sử
        if (!history.includes(searchTerm.toLowerCase())) {
          setHistory(prev => [searchTerm.toLowerCase(), ...prev.slice(0, 9)]);
        }
      } else {
        setError('Không tìm thấy kết quả cho từ này.');
      }
    } catch (err) {
      console.error("Lỗi khi tìm kiếm:", err);
      setError('Không tìm thấy từ này.');
    } finally {
      setLoading(false);
    }
  };

  // Lưu từ vào danh sách yêu thích
  const toggleBookmark = (wordToBookmark: string): void => {
    if (bookmarks.includes(wordToBookmark)) {
      setBookmarks(bookmarks.filter(item => item !== wordToBookmark));
    } else {
      setBookmarks([...bookmarks, wordToBookmark]);
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
        console.log(`Bản dịch cho '${englishWord}':`, response.data.responseData.translatedText);

        setTranslations(prev => ({
          ...prev,
          [defIndex]: response.data.responseData.translatedText
        }));
      } else {
        // Nếu không có bản dịch trả về
        console.warn('Không có dữ liệu bản dịch trả về', response.data);
        setTranslations(prev => ({
          ...prev,
          [defIndex]: "Không thể dịch"
        }));
      }
    } catch (err) {
      console.error('Lỗi dịch:', err);
      setTranslations(prev => ({
        ...prev,
        [defIndex]: "Lỗi khi dịch"
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

  // Component hiển thị danh sách từ gợi ý
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
                      <Text className="text-gray-700 font-medium">
                        {defIndex + 1}. {def.definition}
                      </Text>

                      {/* Ví dụ nếu có */}
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
        <Text className="p-3 text-lg font-medium text-gray-700">Lịch sử</Text>

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
                  setShowHistory(false);
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
  const BookmarksSection: React.FC<{ visible: boolean }> = ({ visible }) => {
    if (!visible) return null;

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
                  setShowBookmarks(false);
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
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="p-4 flex-1">
        <View className="flex-row items-center bg-white rounded-lg shadow-sm mb-4">
          <TextInput
            className="flex-1 py-3 px-4 text-gray-700"
            placeholder="Tìm kiếm từ..."
            value={word}
            onChangeText={setWord}
            onSubmitEditing={() => searchSuggestedWords(word)} // Thay đổi ở đây
          />

          <TouchableOpacity
            onPress={() => searchSuggestedWords(word)} // Thay đổi ở đây
            className="bg-blue-500 p-3 rounded-r-lg"
          >
            <Ionicons name="search" size={22} color="white" />
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-between mb-4">
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

        <HistorySection />
        <BookmarksSection visible={showBookmarks} />
        <SuggestionsSection /> 
        <ResultSection />
      </View>
    </SafeAreaView>
  );
};

export default DictionaryScreen;