import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function UserHistory() {

    const [activeTab, setActiveTab] = useState('Tab 1');

    return (
        <View className='p-4 bg-white rounded-3xl mb-6' style={{
            shadowColor: "#171717",
            elevation: 4
        }}>
            {/* Header với 2 cột */}
            <View className='flex-row justify-around mb-4'>
                <TouchableOpacity
                        onPress={() => setActiveTab('Tab 1')}
                        className={`flex-1 items-center pb-2 border-b-2 ${activeTab === 'Tab 1' ? 'border-blue-500' : 'border-transparent'}`}
                >
                    <Text className={`font-bold text-lg ${activeTab === 'Tab 1' ? 'text-blue-500' : 'text-gray-500'}`}>Luyện tập</Text>
                </TouchableOpacity>

                {/* Tab 2 */}
                <TouchableOpacity
                    onPress={() => setActiveTab('Tab 2')}
                    className={`flex-1 items-center pb-2 border-b-2 ${activeTab === 'Tab 2' ? 'border-blue-500' : 'border-transparent'}`}
                >
                    <Text className={`font-bold text-lg ${activeTab === 'Tab 2' ? 'text-blue-500' : 'text-gray-500'}`}>Luyện thi</Text>
                </TouchableOpacity>
            </View>

            {/* Các thẻ card con dạng row */}
            <View className='space-y-4'>
                <View className='p-3 bg-gray-100 rounded-lg flex-row items-center justify-around' style={{elevation: 1}}>
                    <Text className='text-gray-800 p-2'>Test 1</Text>
                    <View>
                        <Text className='text-gray-800 p-1'>Tổng điểm: 700</Text>
                        <Text className='text-gray-800 p-1'>Correct: 160/200</Text>
                    </View>
                </View>
                <View className='p-3 bg-gray-100 rounded-lg flex-row items-center justify-around' style={{elevation: 1}}>
                    <Text className='text-gray-800 p-2'>Test 2</Text>
                    <View>
                        <Text className='text-gray-800 p-1'>Tổng điểm: 700</Text>
                        <Text className='text-gray-800 p-1'>Correct: 160/200</Text>
                    </View>
                </View>
                <View className='p-3 bg-gray-100 rounded-lg flex-row items-center justify-around' style={{elevation: 1}}>
                    <Text className='text-gray-800 p-2'>Test 3</Text>
                    <View>
                        <Text className='text-gray-800 p-1'>Tổng điểm: 700</Text>
                        <Text className='text-gray-800 p-1'>Correct: 160/200</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}