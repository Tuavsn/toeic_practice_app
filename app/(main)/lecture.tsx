import LectureScreen from "@/screens/lecture.screen";

interface LectureDetailProps {
    route: {
        params: {
            id: string;
            title: string;
            description: string;
            exercises: string[];
        };
    };
}

export default function Lecture({route} : LectureDetailProps) {
    return (
        <LectureScreen route={route}/>
    )
}