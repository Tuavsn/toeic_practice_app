import Loader from "@/components/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";

export default function index() {

  const [isFirstLoad, setIsFirstLoad] = useState(true)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkFirstLoad = async () => {
      const firstLoad = await AsyncStorage.getItem('firstLoad');
      if (firstLoad === 'false') {
        setIsFirstLoad(false)
      }
      setLoading(false)
    }
    checkFirstLoad()
  }, [])

  if (loading) return (
    <Loader />
  )

  return (
    <Redirect href={isFirstLoad ? "/welcome-intro" : "/(drawer)/"} />
  )
}