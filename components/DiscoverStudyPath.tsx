import { Image, Text, TouchableOpacity, View } from "react-native";

export default function DiscoverStudyPath() {
    return (
        // <TouchableOpacity className="p-2 bg-[#004B8D] rounded-3xl my-4">
        //     <View className="flex flex-row items-center p-4">
        //         <View className="basis-1/2">
        //             <Text className="text-white font-bold text-xl text-center">Gợi ý các bài học dành cho bạn</Text>
        //             <Text className="text-white font-bold p-2 text-center border border-white bg-[#FF5757] rounded-lg my-4">Bắt đầu ngay</Text>
        //         </View>
        //         <Image
        //             className="w-[80px] h-[100px] basis-1/2 p-4"
        //             source={require('@/assets/images/study-path.png')}
        //         />
        //     </View>
        // </TouchableOpacity>
        <TouchableOpacity className="p-2 bg-[#004B8D] rounded-3xl my-4">
            <View className="flex flex-row items-center p-4">
                <View className="basis-1/2">
                    <Text className="text-white font-bold text-xl text-center">Luyện tập cùng ToiecPractice</Text>
                    <Text className="text-white font-bold p-2 text-center border border-white bg-[#FF5757] rounded-lg my-4">Hoàn toàn miễn phí</Text>
                </View>
                <Image
                    className="w-[80px] h-[100px] basis-1/2 p-4"
                    source={require('@/assets/images/study-path.png')}
                />
            </View>
        </TouchableOpacity>
    )
}