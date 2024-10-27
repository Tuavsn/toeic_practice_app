import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import Header from "@/components/header/Header";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabsLayout() {
    return (
        <SafeAreaView className="flex-1">
            <Header />
            <Tabs screenOptions={({ route }) => ({
                tabBarIcon: ({ color }) => {
                    let iconName;
                    switch(route.name) {
                        case "index":
                            iconName = <FontAwesome name="home" size={30} color="#004B8D" />
                            break;
                        case "search/index":
                            iconName = <FontAwesome name="search" size={30} color="#004B8D" />
                            break;
                        case "statistic/index":
                            iconName = <FontAwesome name="bar-chart" size={30} color="#004B8D" />
                            break;
                    }
                    return iconName
                },  
                headerShown: false,
                tabBarShowLabel: false,
            })} >
                <Tabs.Screen name="index"/>
                <Tabs.Screen name="search/index"/>
                <Tabs.Screen name="statistic/index"/>
            </Tabs>
        </SafeAreaView>
    )
}