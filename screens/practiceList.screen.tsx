import Loader from "@/components/Loader";
import useAuth from "@/hooks/auth/useAuth";
import questionService from "@/services/question.service";
import resultService from "@/services/result.service";
import { PracticeType, Question, Result } from "@/types/global.type";
import { FontAwesome5, Ionicons, MaterialIcons, AntDesign } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState, useRef } from "react";
import { 
  Button, 
  FlatList, 
  Text, 
  TouchableOpacity, 
  View,
  Dimensions,
  Animated
} from "react-native";
import Collapsible from "react-native-collapsible";
import { ActivityIndicator } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from 'expo-haptics';
import LottieView from 'lottie-react-native';

interface Practice {
    id: string;
    title: string;
    exercises: Question[];
}

const DATA: Practice[] = [
    { id: '1', title: 'Part 1: Photographs', exercises: [] },
    { id: '2', title: 'Part 2: Question-Response', exercises: [] },
    { id: '3', title: 'Part 3: Short Conversations', exercises: [] },
    { id: '4', title: 'Part 4: Talks', exercises: [] },
    { id: '5', title: 'Part 5: Incomplete Sentences', exercises: [] },
    { id: '6', title: 'Part 6: Text Completion', exercises: [] },
    { id: '7', title: 'Part 7: Reading Comprehension', exercises: [] },
];

interface PracticeListScreenProps {
    type: PracticeType;
}

const { width } = Dimensions.get('window');

export default function PracticeListScreen({ type }: PracticeListScreenProps) {
    const router = useRouter();
    const { user } = useAuth();
    const { loading, toggleLoading } = useAuth();
    
    const [collapseLoading, setCollapseLoading] = useState<{ [key: string]: boolean }>({});
    const [practices, setPractices] = useState<Practice[]>([]);
    const [collapsed, setCollapsed] = useState<string | null>(null);
    const [page, setPage] = useState<{ [key: string]: number }>({});
    const [pageSize, setPageSize] = useState(5);
    const [userAnswerIds, setUserAnswerIds] = useState<Set<string>>(new Set());
    
    // Animation references
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.95)).current;
    const rotateAnimations = useRef<{ [key: string]: Animated.Value }>({}).current;
    
    // Initialize rotation animations for each practice item
    useEffect(() => {
        DATA.forEach(practice => {
            rotateAnimations[practice.id] = new Animated.Value(0);
        });
    }, []);

    const handlePress = async (question: Question, questNum: number) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        await router.push({
            pathname: '/(main)/practice',
            params: { question: JSON.stringify(question), questNum: questNum + 1 },
        });
    };

    const fetchQuestions = async (practiceId: string) => {
        const selectedPractice = practices.find((practice) => practice.id === practiceId);
        const currentPage = page[practiceId] || 1;

        if (selectedPractice) {
            try {
                setCollapseLoading((prev) => ({ ...prev, [practiceId]: true }));
                const response = await questionService.getAllQuestions({
                    pageSize: pageSize,
                    partNum: practiceId,
                    current: currentPage,
                });
                const data = await response.data;
                setPractices((prevPractices) =>
                    prevPractices.map((practice) =>
                        practice.id === practiceId
                            ? { ...practice, exercises: data }
                            : practice
                    )
                );
            } catch (error) {
                console.error("Error fetching questions:", error);
            } finally {
                setCollapseLoading((prev) => ({ ...prev, [practiceId]: false }));
            }
        }
    };

    const toggleCollapse = (id: string) => {
        const isCollapsed = collapsed === id;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        
        // Rotate animation
        Animated.timing(rotateAnimations[id], {
            toValue: isCollapsed ? 0 : 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
        
        setCollapsed(isCollapsed ? null : id);
        
        if (!isCollapsed) {
            setPage((prev) => ({ ...prev, [id]: 1 }));
            fetchQuestions(id);
        }
    };

    useEffect(() => {
        const prepareData = async () => {
            let filteredData: Practice[] = [];
            if (type === PracticeType.LISTENING) {
                filteredData = DATA.filter((practice) => parseInt(practice.id) >= 1 && parseInt(practice.id) <= 4);
            } else if (type === PracticeType.READING) {
                filteredData = DATA.filter((practice) => parseInt(practice.id) >= 5 && parseInt(practice.id) <= 7);
            }
            setPractices(filteredData);
            
            // Start entrance animations
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                })
            ]).start();
        };
    
        prepareData();
        setCollapsed(null);
    }, [type]);

    const fetchUserResults = async () => {
        toggleLoading();
        try {
            const userAnswersResponse = await resultService.getAllResults({ pageSize: 999, type: 'QUESTION' });
            const userAnswersData = await userAnswersResponse.data;
            const userAnswerIdsSet = new Set<string>(userAnswersData.map((result: Result) => result.userAnswers[0].questionId));
            setUserAnswerIds(userAnswerIdsSet);
        } catch (error) {
            console.error('Error fetching result:', error);
        } finally {
            toggleLoading();
        }
    }

    useFocusEffect(
        useCallback(() => {
            user && fetchUserResults();
            setCollapsed(null);
        }, [type])
    );

    // Get difficulty color and icon
    const getDifficultyDetails = (difficulty: string) => {
        switch(difficulty) {
            case 'easy':
                return { color: '#4CAF50', bgColor: 'bg-green-100', textColor: 'text-green-700' };
            case 'medium':
                return { color: '#FF9800', bgColor: 'bg-orange-100', textColor: 'text-orange-700' };
            case 'hard':
                return { color: '#F44336', bgColor: 'bg-red-100', textColor: 'text-red-700' };
            default:
                return { color: '#9E9E9E', bgColor: 'bg-gray-100', textColor: 'text-gray-700' };
        }
    };

    // Get part icon based on practice ID
    const getPracticeIcon = (practiceId: string, type: PracticeType) => {
        const id = parseInt(practiceId);
        
        if (type === PracticeType.LISTENING) {
            switch(id) {
                case 1: return "image";
                case 2: return "question-answer";
                case 3: return "record-voice-over";
                case 4: return "mic";
                default: return "headset";
            }
        } else {
            switch(id) {
                case 5: return "text-fields";
                case 6: return "text-format";
                case 7: return "menu-book";
                default: return "book";
            }
        }
    };

    const renderExercises = (exercises: Question[], practiceId: string) => {
        const currentPage = page[practiceId] || 1;

        if(collapseLoading[practiceId]) {
            return (
                <View className="items-center justify-center py-8">
                    <LottieView
                        source={require('@/assets/animations/loading.json')}
                        autoPlay
                        loop
                        style={{ width: 100, height: 100 }}
                    />
                    <Text className="mt-2 text-base text-gray-600">Đang tải câu hỏi...</Text>
                </View>
            );
        }

        return (
            <>
                <FlatList
                    data={exercises}
                    renderItem={({ item, index }) => {
                        const questionNumber = (currentPage - 1) * pageSize + index + 1;
                        const difficulty = getDifficultyDetails(item.difficulty);
                        const isCompleted = userAnswerIds.has(item.id as string) ||
                            (item.subQuestions &&
                            item.subQuestions.some(subQuestion => userAnswerIds.has(subQuestion.id as string)));
                            
                        return (
                            <Animated.View 
                                style={{
                                    transform: [{ scale: fadeAnim }],
                                    opacity: fadeAnim 
                                }}
                                className="mb-2"
                            >
                                <TouchableOpacity
                                    className={`flex-row items-center p-3 bg-white rounded-lg border border-gray-200 ${isCompleted ? 'border-l-4 border-l-green-500 bg-green-50' : ''}`}
                                    onPress={() => handlePress(item, index)}
                                    activeOpacity={0.7}
                                >
                                    <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mr-3">
                                        <Text className="text-blue-600 font-bold text-base">{questionNumber}</Text>
                                    </View>
                                    
                                    <View className="flex-1">
                                        <View className="flex-row items-center">
                                            <Text className="text-gray-800 font-semibold text-base">
                                                Câu {questionNumber}
                                            </Text>
                                            {isCompleted && (
                                                <View className="flex-row items-center bg-green-500 rounded-full px-2 py-0.5 ml-2">
                                                    <Ionicons name="checkmark-circle" size={14} color="#fff" />
                                                    <Text className="text-white text-xs font-medium ml-1">Đã làm</Text>
                                                </View>
                                            )}
                                        </View>
                                        
                                        <View className="flex-row items-center mt-1">
                                            <View className={`flex-row items-center ${difficulty.bgColor} px-2 py-0.5 rounded-md mr-2`}>
                                                <MaterialIcons name={
                                                    difficulty.textColor.includes('green') ? "trending-down" : 
                                                    difficulty.textColor.includes('orange') ? "trending-flat" : "trending-up"
                                                } size={14} color={difficulty.color} />
                                                <Text className={`${difficulty.textColor} text-xs ml-1`}>
                                                    {item.difficulty}
                                                </Text>
                                            </View>
                                            
                                            {item.topic && (
                                                <View className="flex-row items-center bg-gray-100 px-2 py-0.5 rounded-md">
                                                    <AntDesign name="tag" size={12} color="#666" />
                                                    <Text className="text-gray-600 text-xs ml-1">{item.topic}</Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                    
                                    <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center">
                                        <FontAwesome5 
                                            name={type === PracticeType.LISTENING ? "headphones" : "book-reader"} 
                                            size={18} 
                                            color="#004B8D" 
                                        />
                                    </View>
                                </TouchableOpacity>
                            </Animated.View>
                        );
                    }}
                    keyExtractor={(item, index) => `${practiceId}-${index}`}
                    showsVerticalScrollIndicator={false}
                />
                
                <View className="flex-row justify-between items-center mt-4">
                    <TouchableOpacity
                        className={`flex-row items-center px-3 py-2 rounded-lg ${page[practiceId] === 1 ? 'bg-gray-200' : 'bg-blue-600'}`}
                        onPress={() => {
                            if (page[practiceId] > 1) {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setPage((prev) => ({ ...prev, [practiceId]: prev[practiceId] - 1 }));
                                fetchQuestions(practiceId);
                            }
                        }}
                        disabled={page[practiceId] === 1}
                    >
                        <Ionicons name="chevron-back" size={16} color={page[practiceId] === 1 ? "#718096" : "#fff"} />
                        <Text className={`ml-1 font-medium ${page[practiceId] === 1 ? 'text-gray-500' : 'text-white'}`}>
                            Previous
                        </Text>
                    </TouchableOpacity>
                    
                    <Text className="text-gray-600">Page {page[practiceId] || 1}</Text>
                    
                    <TouchableOpacity
                        className={`flex-row items-center px-3 py-2 rounded-lg ${exercises.length < pageSize ? 'bg-gray-200' : 'bg-blue-600'}`}
                        onPress={() => {
                            if (exercises.length >= pageSize) {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setPage((prev) => ({ ...prev, [practiceId]: (prev[practiceId] || 1) + 1 }));
                                fetchQuestions(practiceId);
                            }
                        }}
                        disabled={exercises.length < pageSize}
                    >
                        <Text className={`mr-1 font-medium ${exercises.length < pageSize ? 'text-gray-500' : 'text-white'}`}>
                            Next
                        </Text>
                        <Ionicons name="chevron-forward" size={16} color={exercises.length < pageSize ? "#718096" : "#fff"} />
                    </TouchableOpacity>
                </View>
            </>
        );
    };

    const renderItem = ({ item, index }: { item: Practice, index: number }) => {
        const spin = rotateAnimations[item.id].interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '180deg']
        });
        
        const isCollapsed = collapsed !== item.id;
        const practiceIcon = getPracticeIcon(item.id, type);
        
        return (
            <Animated.View 
                style={{
                    transform: [
                        { scale: scaleAnim },
                        { translateY: fadeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [50 * index, 0]
                        })}
                    ],
                    opacity: fadeAnim
                }}
                className="mb-3 overflow-hidden rounded-xl shadow-sm bg-white"
            >
                <TouchableOpacity
                    className={`flex-row items-center justify-between p-4 ${!isCollapsed ? 'bg-blue-50 border-b border-blue-100' : 'bg-white'}`}
                    onPress={() => toggleCollapse(item.id)}
                    activeOpacity={0.8}
                >
                    <View className="flex-row items-center flex-1">
                        <View className="w-11 h-11 rounded-full bg-blue-50 items-center justify-center mr-3">
                            <MaterialIcons name={practiceIcon} size={22} color="#004B8D" />
                        </View>
                        
                        <Text className="text-lg font-semibold text-gray-800">{item.title}</Text>
                    </View>
                    
                    <View className="w-8 h-8 items-center justify-center">
                        {collapseLoading[item.id] ? (
                            <ActivityIndicator size="small" color="#004B8D" />
                        ) : (
                            <Animated.View style={{ transform: [{ rotate: spin }] }}>
                                <Ionicons
                                    name="chevron-down"
                                    size={22}
                                    color="#004B8D"
                                />
                            </Animated.View>
                        )}
                    </View>
                </TouchableOpacity>
                
                <Collapsible collapsed={isCollapsed} duration={400} easing="easeOutCubic">
                    <View className="p-4 bg-gray-50">
                        {renderExercises(item.exercises, item.id)}
                    </View>
                </Collapsible>
            </Animated.View>
        );
    };

    const renderEmptyState = () => (
        <View className="items-center justify-center py-16">
            <LottieView
                source={
                    type === PracticeType.LISTENING 
                        ? require('@/assets/animations/listening.json')
                        : require('@/assets/animations/reading.json')
                }
                autoPlay
                loop
                style={{ width: 180, height: 180 }}
            />
            <Text className="text-xl font-bold text-gray-800 mt-4 mb-2">
                No {type === PracticeType.LISTENING ? 'Listening' : 'Reading'} Practices
            </Text>
            <Text className="text-base text-gray-600 text-center px-8">
                Please check back later or try refreshing the page
            </Text>
        </View>
    );

    const renderHeader = () => (
        <View className="mb-6 pb-4 border-b border-gray-200">
            <Text className="text-2xl font-bold text-blue-900 mb-1">
                {type === PracticeType.LISTENING ? 'Listening' : 'Reading'} Practice
            </Text>
            <Text className="text-base text-gray-600">
                Select a part to start practicing
            </Text>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            {loading ? (
                <Loader loadingText="Đang tải dữ liệu" />
            ) : (
                <FlatList
                    data={practices}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
                    ListHeaderComponent={renderHeader}
                    ListEmptyComponent={renderEmptyState}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}