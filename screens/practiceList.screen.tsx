import { useEffect, useRef } from "react";
import { PracticeType } from "@/types/global.type";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { 
  Text, 
  TouchableOpacity, 
  View,
  Dimensions,
  Animated,
  FlatList
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from 'expo-haptics';
import LottieView from 'lottie-react-native';

interface Practice {
    id: string;
    title: string;
    icon: string;
}

const LISTENING_PRACTICES: Practice[] = [
    { id: '1', title: 'Part 1: Photographs', icon: 'image' },
    { id: '2', title: 'Part 2: Question-Response', icon: 'question-answer' },
    { id: '3', title: 'Part 3: Short Conversations', icon: 'record-voice-over' },
    { id: '4', title: 'Part 4: Talks', icon: 'mic' },
];

const READING_PRACTICES: Practice[] = [
    { id: '5', title: 'Part 5: Incomplete Sentences', icon: 'text-fields' },
    { id: '6', title: 'Part 6: Text Completion', icon: 'text-format' },
    { id: '7', title: 'Part 7: Reading Comprehension', icon: 'menu-book' },
];

interface PracticeListScreenProps {
    type: PracticeType;
}

const { width } = Dimensions.get('window');

export default function PracticeListScreen({ type }: PracticeListScreenProps) {
    const router = useRouter();
    
    // Animation references
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.95)).current;
    
    // Start entrance animations
    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1, 
                duration: 600,
                useNativeDriver: true
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true
            })
        ]).start();
    }, [type]);

    const handlePracticePress = (practiceId: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push({
            pathname: '/(main)/practice',
            params: { partNum: practiceId }
        });
    };

    const practices = type === PracticeType.LISTENING 
        ? LISTENING_PRACTICES 
        : READING_PRACTICES;

    const renderItem = ({ item, index }: { item: Practice; index: number }) => (
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
            className="mb-4"
        >
            <TouchableOpacity
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                onPress={() => handlePracticePress(item.id)}
                activeOpacity={0.8}
            >
                <View className="flex-row items-center p-5">
                    <View className="w-14 h-14 rounded-full bg-blue-100 items-center justify-center mr-4">
                        <MaterialIcons name={item.icon} size={28} color="#004B8D" />
                    </View>
                    
                    <View className="flex-1">
                        <Text className="text-lg font-semibold text-gray-800">{item.title}</Text>
                        <Text className="text-gray-600 mt-1">
                            {type === PracticeType.LISTENING 
                                ? 'Practice your listening skills'
                                : 'Improve your reading comprehension'}
                        </Text>
                    </View>
                    
                    <Ionicons name="chevron-forward" size={24} color="#004B8D" />
                </View>
            </TouchableOpacity>
        </Animated.View>
    );

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
            <FlatList
                data={practices}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={renderEmptyState}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}