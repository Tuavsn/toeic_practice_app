export interface BaseObject {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Role extends BaseObject {
    name: string;
    description: string;
}

export interface User extends BaseObject {
    email?: string;
    avatar?: string;
    role?: string;
    token?: string;
}

export interface Course extends BaseObject {
    name: string;
    topic: string[];
    format: string;
    difficulty: Difficulty;
    lectures: Lecture[];
    assigments: Assignment[];
}

export interface Lecture extends BaseObject {
    title: string;
    content: string;
    description: string;
}

export interface Assignment extends BaseObject {
    require: number;
    totalQuestion: number;
    questionIds: string[];
}

export interface Category extends BaseObject {
    format: string;
    year: number;
    tests: Test[];
}

export interface Test extends BaseObject {
    name: string;
    totalUserAttemp: number;
    totalQuestion: number;
    totalScore: number;
    limitTime: number;
    questions: Question[];
    category: Category;
}

export interface Question extends BaseObject {
    partNum: number;
    type: QuestionType;
    subQuestions: Question[];
    content: string;
    difficulty: Difficulty;
    topics: string[];
    resources: Resource[];
    transcript: string;
    explanation: string;
    answers: string[];
    correctAnswer: string;
}

export interface Resource {
    type: ResourceType;
    content: string;
}

export interface BannerDataTypes {
    bannerImageUrl: any;
}

// ENUM

export enum Difficulty {
    EASY = 0,
    MEDIUM = 1,
    HARD = 2
}

export enum QuestionType {
    SINGLE = "single",
    GROUP = "group",
    SUBQUESTION = "subquestion"
}

export enum ResourceType {
    PARAGRAPH = "paragraph",
    IMAGE = "image",
    AUDIO = "audio"
}