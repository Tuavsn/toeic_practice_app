import { useEffect, useState } from "react";
import { Text, View, Image, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Giả lập việc gọi API để lấy thông tin user
    const fetchProfile = async () => {
      try {
        // Mock API response
        const response = {
          email: "hoctuan79@gmail.com",
          avatar:
            "https://lh3.googleusercontent.com/a/ACg8ocLF7tNThBO5vpAormI96EMeeLffj1MYJTQilpKOa-VB1siSVA=s96-c",
          role: {
            name: "ADMIN",
            description:
              "Administrator with full access to all system functionalities",
          },
        };
        setProfile(response);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-lg font-semibold text-gray-700">
          Failed to load profile information.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Gradient Header */}
      <View className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 p-6 rounded-b-3xl">
        <Text className="text-white text-3xl font-bold text-center">
          Profile
        </Text>
      </View>

      <View
        className="mt-[-50px] items-center p-4"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        {/* Avatar */}
        <Image
          source={{ uri: profile.avatar }}
          className="w-28 h-28 rounded-full border-4 border-white"
        />
      </View>

      <View
        className="mt-6 mx-6 p-6 bg-white rounded-xl shadow-md"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        {/* Email */}
        <Text className="text-xl text-[#004B8D] font-bold">
          Email: {profile.email}
        </Text>

        {/* Role */}
        <Text className="text-lg text-[#004B8D] mt-4 font-medium">
          Role: {profile.role.name}
        </Text>
        <Text className="text-sm text-gray-600 mt-2">
          {profile.role.description}
        </Text>
      </View>
    </SafeAreaView>
  );
}
