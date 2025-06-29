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

export interface Lecture extends BaseObject {
  name: string;
  content: string;
  topic: Topic[];
  practiceQuestions: Question[];
}

export interface Assignment {
  require: number;
  totalQuestion: number;
  questionIds: string[];
}

export interface Category extends BaseObject {
  format: string;
  year: number;
  tests: Test[];
}

export interface Topic extends BaseObject {
  name: string;
  solution: string;
  overallSkill: string;
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

export interface TestInfo extends BaseObject {
  name: string;
  totalUserAttempt: number;
  totalQuestion: number;
  totalScore: number;
  limitTime: number;
  resultsOverview: any[];
  topicsOverview: {
    partNum: number;
    topicNames: string[];
  }[];
}

export interface Question extends BaseObject {
  questionNum: number;
  partNum: number;
  type: QuestionType;
  subQuestions: Question[];
  content: string;
  difficulty: Difficulty;
  topic: Topic[];
  resources: Resource[];
  transcript: string;
  explanation: string;
  answers: string[];
  correctAnswer: string;
}

export interface AnswerPair extends BaseObject {
  questionId: string;
  userAnswer: string;
  timeSpent: number;
}

export interface SubmitRequest extends BaseObject {
  userAnswer: AnswerPair[] | AnswerPair;
  totalSeconds: number;
  testId: string;
  parts: string;
  type: string;
}

export interface Result extends BaseObject {
  testId: string;
  totalTime: number;
  totalReadingScore: number;
  totalListeningScore: number;
  totalCorrectAnswer: number;
  totalIncorrectAnswer: number;
  totalSkipAnswer: number;
  type: string;  // practice or fulltest
  parts: string;  // Practice parts
  userAnswers: UserAnswer[];
}

export interface UserAnswer extends BaseObject {
  questionId: string;
  listTopics: Topic[];
  userAnswer: string;
  solution: string;
  correct: boolean;
  timeSpent: number;
  questionNum: number;
  partNum: number;
  type: QuestionType;
  subUserAnswer: UserAnswer[];
  content: string;
  difficulty: Difficulty;
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

export interface Comment {
  id: string;
  content: string;
  userId: string;
  userDisplayName: string;
  userAvatarUrl: string;
  parentId: string | null;
  rootId: string | null;
  mentionedUserIds: string[];
  targetType: CommentTargetType;
  targetId: string;
  likeCounts: number;
  directReplyCount: number;
  level: number;
  deleted: boolean;
  deleteReasonTag: DeleteReasonTagComment | null;
  deleteReason: string | null;
  isLikedByCurrentUser: boolean;
  createdAt: string; // ISO string representation of Instant
  active: boolean;
  probInsult: number;
  probThreat: number;
  probHateSpeech: number;
  probSpam: number;
  probSevereToxicity: number;
  probObscene: number;
}

export interface CreateCommentRequest {
  content: string;
  targetType: CommentTargetType;
  targetId: string;
  parentId?: string | null; // null if root comment
  mentionedUserIds?: string[]; // Optional list of mentioned user IDs
}

export interface DeleteCommentRequest {
  reasonTag: DeleteReasonTagComment;
  reason?: string; // Optional additional explanation
}

// Pagination metadata
export interface PaginationMeta {
  current: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

// Generic paginated response structure
export interface PaginatedResponse<T> {
  meta: PaginationMeta;
  result?: T[]
}

// Interface for our ApiResponse
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  statusCode: number;
  meta?: PaginationMeta;
}

export interface Deck {
  id: number;
  title: string;
  description?: string;
  imageUrl?: string;
  created_at: string;
  updated_at: string;
}

export interface Card {
  id: number;
  deck_id: number;
  front_text: string;
  back_text: string;
  created_at: string;
  updated_at: string;
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

export enum PracticeType {
  LISTENING = "listening",
  READING = "reading",
  VOCABULRARY = "vocabulary",
  GRAMMAR = "grammar"
}

export enum CommentTargetType {
  TEST = 'TEST',
  LECTURE = 'LECTURE'
}

export enum DeleteReasonTagComment {
  SPAM = 'SPAM',
  INAPPROPRIATE = 'INAPPROPRIATE',
  OFFENSIVE = 'OFFENSIVE',
  OFF_TOPIC = 'OFF_TOPIC',
  OTHER = 'OTHER'
}