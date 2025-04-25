// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import { useState } from "react";
// import { FlatList, Text, TouchableOpacity, View } from "react-native";
// import Collapsible from "react-native-collapsible";
// import { SafeAreaView } from "react-native-safe-area-context";

// export default function CollapseList() {
//     const router = useRouter();

//     const [collapsed, setCollapsed] = useState<string | null>(null); // Trạng thái để kiểm soát dropdown

//     const toggleCollapse = (id: string) => {
//         setCollapsed(collapsed === id ? null : id); // Đổi trạng thái
//     };

//     const renderItem = ({ item } : { item: Lecture }) => (
//         <View className="mb-2">
//             <TouchableOpacity
//                 className="flex-row items-center justify-between p-4 border border-gray-300 rounded-lg bg-white"
//                 onPress={() => toggleCollapse(item.id)}
//             >
//                 <Text className="text-lg font-semibold text-gray-800">{item.title}</Text>
//                 <Ionicons
//                     name={collapsed === item.id ? "chevron-up" : "chevron-down"}
//                     size={20}
//                     color="#004B8D"
//                 />
//             </TouchableOpacity>
//             <Collapsible collapsed={collapsed !== item.id}>
//                 <View className="p-4 bg-gray-50 border border-gray-300 rounded-b-lg">
//                     {item.exercises.map((exercise, index) => (
//                         <TouchableOpacity 
//                             key={index} 
//                             className="flex-row items-center mb-2 border border-gray-300 rounded-lg p-4"
//                             onPress={() => router.push({pathname: '/(main)/lecture' })}
//                         >
//                             <Ionicons name="checkbox-outline" size={18} color="#004B8D" />
//                             <Text className="ml-2 text-gray-700">{exercise}</Text>
//                         </TouchableOpacity>
//                     ))}
//                 </View>
//             </Collapsible>
//         </View>
//     );

//     return (
//         <SafeAreaView className="flex-1 bg-gray-100">
//             <FlatList
//                 data={DATA}
//                 renderItem={renderItem}
//                 keyExtractor={item => item.id}
//                 contentContainerStyle={{ padding: 16 }}
//             />
//         </SafeAreaView>
//     )
// }