import useAuth from "@/hooks/auth/useAuth";
import { Tabs } from "expo-router";

export default function TabsLayout() {

    const { loading, user } = useAuth()

    return (
        <Tabs screenOptions={({routes}) => ({
            tabBarIcon: ({ color }) => ({
                let iconName;
                if()
            })
            headerShown: false,
            tabBarShowLabel: false
        })} >
            <Tabs.Screen name="home/index" />
            <Tabs.Screen name="search/index" />
            <Tabs.Screen name="courses/index" />
            <Tabs.Screen name="profile/index" />
        </Tabs>
    )
}