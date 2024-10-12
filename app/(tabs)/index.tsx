import useAuth from "@/hooks/auth/useAuth";
import { Entypo, Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useState } from "react";
import { Image } from "react-native";

export default function TabsLayout() {

    const { loading, setLoading } = useState(fail)

    const { user, setUser } = useState(null)

    const { error, setError } = useState('')

    return (
        <Tabs screenOptions={({routes}) => ({
            tabBarIcon: ({ color }) => {
                let iconName;
                switch(routes.name) {
                    case "home/index":
                        iconName = <FontAwesome name="home" size={24} color="black" />
                        break;
                    case "search/index":
                        iconName = <FontAwesome name="search" size={24} color="black" />
                        break;
                    case "courses/index":
                        iconName = <Entypo name="book" size={24} color="black" />
                        break;
                    case "profile/index":
                        iconName = <Feather name="user" size={24} color="black" />
                        break;
                }
                return <Image />
            },
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