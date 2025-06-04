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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

interface FloatingChatButtonProps {
  questionId: string;
  onModalStateChange?: (isOpen: boolean) => void;
}

import chatService from '@/services/chat.service';

const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ questionId, onModalStateChange }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [input, setInput] = useState('');
  const [messageLogs, setMessageLogs] = useState<ChatMessage[]>([]);
  const [isInitiated, setIsInitiated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const listRef = useRef<FlatList>(null);

  const scale = useRef(new Animated.Value(1)).current;
  const buttonPosition = useRef(new Animated.Value(0)).current;
  const keyboardVisible = useRef(false);

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

  useEffect(() => {
    const checkStoredSession = async () => {
      try {
        const storedSessionId = await AsyncStorage.getItem(`chat_session_${questionId}`);
        if (storedSessionId) {
          const sessionData = JSON.parse(storedSessionId);
          if (sessionData.expiry > Date.now()) {
            setSessionId(sessionData.id);
            setIsInitiated(true);

            const storedMessages = await AsyncStorage.getItem(`chat_messages_${questionId}`);
            if (storedMessages) {
              setMessageLogs(JSON.parse(storedMessages));
            }
          } else {
            await AsyncStorage.removeItem(`chat_session_${questionId}`);
            await AsyncStorage.removeItem(`chat_messages_${questionId}`);
          }
        }
      } catch (error) {
        console.error("Error checking stored session:", error);
        await AsyncStorage.removeItem(`chat_session_${questionId}`);
        await AsyncStorage.removeItem(`chat_messages_${questionId}`);
      }
    };

    if (modalVisible) {
      checkStoredSession();
    }
  }, [questionId, modalVisible]);

  // Store messages whenever they change
  useEffect(() => {
    const storeMessages = async () => {
      if (messageLogs.length > 0) {
        await AsyncStorage.setItem(`chat_messages_${questionId}`, JSON.stringify(messageLogs));
      }
    };

    storeMessages();
  }, [messageLogs, questionId]);

  // Notify parent component when modal state changes
  useEffect(() => {
    if (onModalStateChange) {
      onModalStateChange(modalVisible);
    }
  }, [modalVisible, onModalStateChange]);

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
  };

  const startChat = async () => {
    setIsLoading(true);

    try {
      const response = await chatService.startChat(questionId);

      if (response && response.data) {
        const { sessionId, chatResponse } = response.data;
        const assistantMessage = chatResponse.choices[0].message.content;

        // Store session ID with 24-hour expiry
        const expiryTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
        await AsyncStorage.setItem(
          `chat_session_${questionId}`,
          JSON.stringify({ id: sessionId, expiry: expiryTime })
        );

        setSessionId(sessionId);
        setIsInitiated(true);
        setMessageLogs([{ sender: "bot", text: assistantMessage }]);
      } else {
        // Handle error response
        setMessageLogs([{
          sender: "bot",
          text: "Sorry, there was an error connecting to the expert. Please try again later."
        }]);
      }
    } catch (error) {
      console.error("Error starting chat:", error);
      setMessageLogs([{
        sender: "bot",
        text: "Sorry, there was an error connecting to the expert. Please try again later."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (message: string) => {
    if (!message.trim() || !sessionId) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsLoading(true);

    const newMessageLogs: ChatMessage[] = [...messageLogs, { sender: "user", text: message }];
    setMessageLogs(newMessageLogs);
    setInput('');

    try {
      const response = await chatService.continueChat(questionId, sessionId, message);

      if (response && response.data) {
        const assistantMessage = response.data.chatResponse.choices[0].message.content;
        setMessageLogs([...newMessageLogs, { sender: "bot", text: assistantMessage }]);
      } else {
        // Handle error response
        setMessageLogs([...newMessageLogs, {
          sender: "bot",
          text: "Sorry, there was an error receiving a response. Please try again later."
        }]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessageLogs([...newMessageLogs, {
        sender: "bot",
        text: "Sorry, there was an error receiving a response. Please try again later."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.nativeEvent.key === 'Enter' && !e.nativeEvent.shiftKey) {
      if (!isLoading && input.trim()) {
        sendMessage(input);
      }
      e.preventDefault();
    }
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (listRef.current && messageLogs.length > 0) {
      setTimeout(() => {
        listRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messageLogs]);

  return (
    <>
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 150,
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
            backgroundColor: '#3B82F6', // blue-600
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
          <Ionicons name="chatbubble-ellipses" size={24} color="white" />
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
                <Text className="text-xl font-bold text-gray-800">Chat with Expert</Text>
                <TouchableOpacity onPress={handleCloseModal}>
                  <Ionicons name="close" size={24} color="#4B5563" />
                </TouchableOpacity>
              </View>

              {/* Chat messages */}
              <FlatList
                ref={listRef}
                data={messageLogs}
                className="flex-1 p-4"
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                  <View
                    className={`mb-3 flex-row ${item.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                  >
                    <View
                      className={`p-3 rounded-2xl max-w-4/5 ${item.sender === 'user'
                          ? 'bg-blue-500 rounded-tr-none'
                          : 'bg-gray-200 rounded-tl-none'
                        }`}
                    >
                      <Text
                        className={`${item.sender === 'user' ? 'text-white' : 'text-gray-800'
                          }`}
                      >
                        {item.text}
                      </Text>
                    </View>
                  </View>
                )}
                ListEmptyComponent={
                  !isInitiated && !isLoading ? (
                    <View className="flex-1 justify-center items-center p-8">
                      <Ionicons name="chatbubble-ellipses-outline" size={60} color="#3B82F6" />
                      <Text className="text-center text-gray-600 mt-4 mb-6">
                        Chat with an AI expert to get help with this question.
                      </Text>
                      <TouchableOpacity
                        onPress={startChat}
                        className="bg-blue-600 px-6 py-3 rounded-full"
                      >
                        <Text className="text-white font-bold">Start Chat</Text>
                      </TouchableOpacity>
                    </View>
                  ) : null
                }
                ListFooterComponent={
                  isLoading ? (
                    <View className="flex-row items-center p-3 bg-gray-100 rounded-2xl self-start mb-4">
                      <ActivityIndicator size="small" color="#3B82F6" />
                      <Text className="ml-2 text-gray-700">Thinking...</Text>
                    </View>
                  ) : null
                }
              />

              {/* Input area */}
              {isInitiated && (
                <View className="p-4 border-t border-gray-200">
                  <View className="flex-row items-center bg-gray-100 rounded-full px-4">
                    <TextInput
                      className="flex-1 py-2"
                      value={input}
                      onChangeText={setInput}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      multiline={false}
                      returnKeyType="send"
                      blurOnSubmit={true}
                      onSubmitEditing={() => {
                        if (input.trim() && !isLoading) {
                          sendMessage(input);
                        }
                      }}
                      editable={!isLoading}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        if (input.trim() && !isLoading) {
                          sendMessage(input);
                        }
                      }}
                      disabled={!input.trim() || isLoading}
                      className={`ml-2 ${!input.trim() || isLoading ? 'opacity-50' : ''}`}
                    >
                      <Ionicons
                        name="send"
                        size={24}
                        color="#3B82F6"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </>
  );
};

export default FloatingChatButton;