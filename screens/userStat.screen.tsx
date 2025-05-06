import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Dimensions, FlatList } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import useAuth from '@/hooks/auth/useAuth';
import Loader from '@/components/Loader';
import { router } from 'expo-router';
import userService from '@/services/user.service';

type TopicStat = {
  topic: {
    name: string;
    solution: string;
    overallSkill: string;
    active: boolean;
  };
  totalCorrect: number;
  totalIncorrect: number;
  averageTime: number;
  timeCount: number;
  totalTime: number;
};

type SkillStat = {
  skill: string;
  totalCorrect: number;
  totalIncorrect: number;
  totalTime: number;
};

type Result = {
  createdAt: string;
  testId: string;
  resultId: string;
  testName: string;
  result: string;
  totalTime: number;
  totalReadingScore: number;
  totalListeningScore: number;
  totalCorrectAnswer: number;
  totalIncorrectAnswer: number;
  totalSkipAnswer: number;
  type: string;
  parts: string;
};

type AccountStats = {
  topicStats: TopicStat[];
  skillStats: SkillStat[];
  results: Result[];
};

const StatScreen = () => {

  const defaultStat: AccountStats = {
    topicStats: [],
    skillStats: [],
    results: []
  }

  const {user, loading, toggleLoading} = useAuth();

  const [accountStat, setAccountStat] = useState<AccountStats>(defaultStat)

  const screenWidth = Dimensions.get('window').width;

  // Average scores calculation
  const totalListening = accountStat.skillStats.find((s) => s.skill === 'listening');
  const totalReading = accountStat.skillStats.find((s) => s.skill === 'reading');
  const averageListening = totalListening?.totalCorrect || 0;
  const averageReading = totalReading?.totalCorrect || 0;
  const remaining = 200 - (averageListening + averageReading);

  // Extract data for additional stats
  const totalTests = accountStat.results.length;
  const totalReadingScore = accountStat.results.reduce((sum, result) => sum + result.totalReadingScore, 0);
  const totalListeningScore = accountStat.results.reduce((sum, result) => sum + result.totalListeningScore, 0);
  const totalTestTime = accountStat.results.reduce((sum, result) => sum + result.totalTime, 0);

  const averageReadingScore = totalTests > 0 ? totalReadingScore / totalTests : 0;
  const averageListeningScore = totalTests > 0 ? totalListeningScore / totalTests : 0;
  const averageTestTime = totalTests > 0 ? totalTestTime / totalTests : 0;

  const pieChartData = [
    { name: 'Listening', population: averageListening, color: '#4CAF50', legendFontColor: '#333', legendFontSize: 12 },
    { name: 'Reading', population: averageReading, color: '#FFC107', legendFontColor: '#333', legendFontSize: 12 },
  ];

  // Accuracy calculation and truncate topic names
  const topicStats = accountStat.topicStats.slice(-3); // Get 3 latest topics
  const barChartData = {
    labels: topicStats.map((t) => {
      const words = t.topic.name.split(' ');
      return words.length > 3 ? `${words.slice(0, 4).join(' ')}...` : t.topic.name;
    }),
    datasets: [
      {
        data: topicStats.map((topic) =>
          topic.totalCorrect + topic.totalIncorrect > 0
            ? (topic.totalCorrect / (topic.totalCorrect + topic.totalIncorrect)) * 100
            : 0 // Đặt mặc định là 0 nếu không có câu trả lời
        ),
      },
    ],
  };

  const loginRequiredPopup = () => {
    alert("Vui lòng đăng nhập");
    router.push('/(drawer)/(tabs)')
  }

  useEffect(() => {
    const fetchAccountStat = async () => {
      toggleLoading()
      try {
          const accountStatResponse = await userService.getStat();
          const accountStat = await accountStatResponse.data;
          const parsedAccountStat: AccountStats = {
            topicStats: accountStat.data.topicStats.map((stat: any) => ({
                topic: {
                    name: stat.topic.name,
                    solution: stat.topic.solution,
                    overallSkill: stat.topic.overallSkill,
                    active: stat.topic.active,
                },
                totalCorrect: stat.totalCorrect,
                totalIncorrect: stat.totalIncorrect,
                averageTime: stat.averageTime,
                timeCount: stat.timeCount,
                totalTime: stat.totalTime,
            })),
            skillStats: accountStat.data.skillStats.map((stat: any) => ({
                skill: stat.skill,
                totalCorrect: stat.totalCorrect,
                totalIncorrect: stat.totalIncorrect,
                totalTime: stat.totalTime,
            })),
            results: accountStat.data.results.map((result: any) => ({
                createdAt: result.createdAt,
                testId: result.testId,
                resultId: result.resultId,
                testName: result.testName,
                result: result.result,
                totalTime: result.totalTime,
                totalReadingScore: result.totalReadingScore,
                totalListeningScore: result.totalListeningScore,
                totalCorrectAnswer: result.totalCorrectAnswer,
                totalIncorrectAnswer: result.totalIncorrectAnswer,
                totalSkipAnswer: result.totalSkipAnswer,
                type: result.type,
                parts: result.parts,
            })),
        };

        setAccountStat(parsedAccountStat);
      } catch (error) {
          console.error('Error fetching stat:', error);
      } finally {
          toggleLoading()
      }
    };
    user !== null ? fetchAccountStat() : loginRequiredPopup();
  }, [])

  return (
    <ScrollView className="flex-1 bg-gray-100 px-6 py-8">
    {
      loading ? (
          <Loader loadingText="Đang tải dữ liệu"/>
      ) : (
        <>
          {user !== null && (
            <View className='flex-1'>
              <View className="mb-6 p-6 bg-[#004B8D] rounded-lg shadow-lg border border-gray-200">
                <Text className="text-white text-2xl font-semibold text-center">
                  Đánh giá tổng quan
                </Text>
              </View>

              {/* Test Statistics */}
              <View className="bg-white rounded-2xl shadow-lg p-5 mb-6">
                <View className="py-3">
                  <Text className="text-lg text-gray-700">
                    Tổng số lần thực hiện bài kiểm tra: <Text className="font-bold">{totalTests}</Text>
                  </Text>
                </View>
                <View className="py-3">
                  <Text className="text-lg text-gray-700">
                    Điểm reading trung bình: <Text className="font-bold">{averageReadingScore.toFixed(2)}</Text>
                  </Text>
                </View>
                <View className="py-3">
                  <Text className="text-lg text-gray-700">
                    Điểm listening trung bình: <Text className="font-bold">{averageListeningScore.toFixed(2)}</Text>
                  </Text>
                </View>
              </View>

              {/* Pie Chart */}
              <View className="bg-white rounded-2xl shadow-lg p-5 mb-6">
                <Text className="text-xl font-semibold text-center text-gray-700 mb-4">
                  Tỷ lệ trả lời đúng
                </Text>
                <PieChart
                  data={pieChartData}
                  width={screenWidth - 40}
                  height={220}
                  chartConfig={{
                    backgroundColor: '#f9f9f9',
                    backgroundGradientFrom: '#f9f9f9',
                    backgroundGradientTo: '#f9f9f9',
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  }}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  absolute
                />
              </View>

              {/* Bar Chart */}
              <View className="bg-white rounded-2xl shadow-lg p-5 mb-6">
                <BarChart
                  data={barChartData}
                  width={screenWidth - 40}
                  height={220}
                  chartConfig={{
                    backgroundColor: '#f9f9f9',
                    backgroundGradientFrom: '#f9f9f9',
                    backgroundGradientTo: '#f9f9f9',
                    color: () => '#004B8D',
                    barPercentage: 0.5,
                  }}
                  yAxisLabel=""
                  yAxisSuffix="%"
                  style={{
                    borderRadius: 12,
                  }}
                  verticalLabelRotation={0}
                />
              </View>

              {/* Solution List */}
              <View className="bg-white rounded-2xl shadow-lg p-5 mb-20">
                <Text className="text-xl font-semibold text-center text-gray-700 mb-4">
                  Đề xuất cải thiện
                </Text>
                <FlatList
                  data={topicStats}
                  keyExtractor={(item, index) => `${item.topic.name}-${index}`}
                  renderItem={({ item }) => (
                    <View className="border-b border-gray-200 py-4">
                      <Text className="text-lg font-medium text-gray-800">{item.topic.name}</Text>
                      <Text className="text-sm text-gray-600">{item.topic.solution}</Text>
                    </View>
                  )}
                  scrollEnabled={false}
                />
              </View>
            </View>
          )}
        </>
      )
    }
    </ScrollView>
  );
};

export default StatScreen;
