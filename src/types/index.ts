export interface User {
  id: string
  email: string
  username?: string
  name?: string
  avatar?: string
  totalXP: number
  currentLevel: number
  streak: number
  longestStreak: number
  questionsAnswered: number
  correctAnswers: number
  createdAt: Date
  updatedAt: Date
  lastActiveAt: Date
}

export interface Question {
  id: string
  topicId: string
  question: string
  questionType: QuestionType
  difficulty: Difficulty
  options: string[]
  correctAnswer: string
  explanation?: string
  hints: string[]
  imageUrl?: string
  baseXP: number
}

export interface Topic {
  id: string
  name: string
  description?: string
  level: number
  orderIndex: number
  requiredXP: number
}

export interface UserProgress {
  id: string
  userId: string
  topicId: string
  completed: boolean
  accuracy: number
  totalAttempts: number
  correctCount: number
  lastReviewed?: Date
  nextReview?: Date
}

export interface QuestionAttempt {
  id: string
  userId: string
  questionId: string
  sessionId?: string
  userAnswer: string
  isCorrect: boolean
  timeSpent: number
  hintsUsed: number
  xpEarned: number
  createdAt: Date
}

export interface LearningSession {
  id: string
  userId: string
  startTime: Date
  endTime?: Date
  totalXP: number
  questionsAnswered: number
  accuracy: number
  sessionType: SessionType
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: AchievementCategory
  requirement: string
  xpReward: number
}

export interface UserAchievement {
  id: string
  userId: string
  achievementId: string
  earnedAt: Date
  xpEarned: number
  achievement: Achievement
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  FILL_BLANK = 'FILL_BLANK',
  DRAG_DROP = 'DRAG_DROP',
  TRUE_FALSE = 'TRUE_FALSE',
  EQUATION = 'EQUATION',
  TEN_FRAME = 'TEN_FRAME',
  NUMBER_LINE = 'NUMBER_LINE',
  // New Interactive Types
  NUMBER_LINE_DRAG = 'NUMBER_LINE_DRAG',
  FRACTION_BUILDER = 'FRACTION_BUILDER',
  CLOCK_SETTER = 'CLOCK_SETTER',
  MONEY_COUNTER = 'MONEY_COUNTER',
  ARRAY_BUILDER = 'ARRAY_BUILDER',
  BALANCE_SCALE = 'BALANCE_SCALE',
  SHAPE_COMPOSER = 'SHAPE_COMPOSER',
  GRAPH_PLOTTER = 'GRAPH_PLOTTER',
  FILL_THE_JAR = 'FILL_THE_JAR',
  // Multiplication/Division Interactive Types
  ARRAY_GRID_BUILDER = 'ARRAY_GRID_BUILDER',
  GROUP_MAKER = 'GROUP_MAKER',
  SKIP_COUNTER = 'SKIP_COUNTER',
  FAIR_SHARE = 'FAIR_SHARE',
  DIVISION_MACHINE = 'DIVISION_MACHINE'
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export enum SessionType {
  REGULAR = 'REGULAR',
  BONUS_ROUND = 'BONUS_ROUND',
  SPEED_CHALLENGE = 'SPEED_CHALLENGE',
  REVIEW = 'REVIEW'
}

export enum AchievementCategory {
  PROGRESS = 'PROGRESS',
  SKILL = 'SKILL',
  STREAK = 'STREAK',
  SPECIAL = 'SPECIAL'
}