import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import Header from "@/components/Header";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabsLayout() {
  return (
    <SafeAreaView className="flex-1">
      <Header />
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: true,
          tabBarIcon: ({ color, size }) => {
            let iconName;
            switch (route.name) {
              case "index":
                iconName = "home";
                break;
                case "flashcard/index":
                    iconName = "book";
                    break;
              case "search/index":
                iconName = "search";
                break;
              case "statistic/index":
                iconName = "bar-chart";
                break;
              default:
                iconName = "circle";
            }
            return <FontAwesome name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            position: 'absolute',
            left: 16,
            right: 16,
            height: 64,
            backgroundColor: '#fff',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            overflow: 'hidden',
            borderWidth: 0.5,
            borderColor: '#ccc',
            elevation: 5, // shadow on Android
          },
        })}
      >
        <Tabs.Screen name="index" options={{ tabBarLabel: "Home" }} />
        <Tabs.Screen name="flashcard/index" options={{ tabBarLabel: "Flash Card" }} />
        <Tabs.Screen name="search/index" options={{ tabBarLabel: "Search" }} />
        <Tabs.Screen name="statistic/index" options={{ tabBarLabel: "Stats" }} />
      </Tabs>
    </SafeAreaView>
  );
}
