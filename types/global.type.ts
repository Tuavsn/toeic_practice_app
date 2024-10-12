import { Timestamp } from "react-native-reanimated/lib/typescript/reanimated2/commonTypes"

interface BaseObject {
    id: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

interface Role extends BaseObject {
    name: string;
    description: string;
}

interface User extends BaseObject {
    email: string;
    avatar: string;
    role: string;
    target: number;
}

interface Course extends BaseObject {
    name: string;
    topic: string[];
    format: string;
    difficulty: Difficulty;
    lectures: Lecture[];
    assigments: Assignment[];
}

interface Lecture extends BaseObject {
    title: string;
    content: string;
    description: string;
}

interface Assignment extends BaseObject {
    require: number;
    totalQuestion: number;
    questionIds: string[];
}

interface Category extends BaseObject {
    format: string;
    year: number;
    tests: Test[];
}

interface Test extends BaseObject {
    name: string;
    totalUserAttemp: number;
    totalQuestion: number;
    totalScore: number;
    limitTime: number;
    questions: Question[];
    category: Category;
}

interface Question extends BaseObject {
    type: QuestionType;
    subQuestions: Question[];
    content: string;
    difficulty: Difficulty;
    topics: string[];
    resouces: Resource[];
    transcript: string;
    explanation: string;
    answers: string[];
    correctAnswer: string;
}

interface Resource {
    type: ResourceType;
    content: string;
}

// ENUM

enum Difficulty {
    EASY = 0,
    MEDIUM = 1,
    HARD = 2
}

enum QuestionType {
    SINGLE = "SINGLE",
    GROUP = "GROUP",
    SUBQUESTION = "SUBQUESTION"
}

enum ResourceType {
    PARAGRAPH = "PARAGRAPH",
    IMAGE = "IMAGE",
    AUDIO = "AUDIO"
}