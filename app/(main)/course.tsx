import CourseListScreen from "@/screens/courseList.screen";
import { useLocalSearchParams } from "expo-router";

export default function Course() {

    const { type } = useLocalSearchParams();

    return (
        <CourseListScreen type={type} />
    )
}