import StatScreen from "@/screens/user/userStat.screen"
import { SafeAreaView } from "react-native-safe-area-context"

export default function StatisticTabItem() {
  return (
    <SafeAreaView className="flex-1">
      <StatScreen />
    </SafeAreaView>
  )
}