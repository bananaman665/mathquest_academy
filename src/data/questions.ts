// Question database for all levels
// We'll move this to the actual database later, but for now it's easier to iterate

export type GameMode = 
  | 'normal'          // Regular lesson with hearts
  | 'speed-round'     // 60 seconds, solve as many as possible
  | 'lightning'       // 10 seconds per question
  | 'perfect-streak'  // Get 10 in a row correct
  | 'boss-battle'     // Harder questions, more XP

export type QuestionType =
  | 'multiple-choice'
  | 'visual-count'
  | 'number-sequence'
  | 'drag-and-drop'
  | 'fill-blank'
  | 'tap-select'
  | 'order-sequence'
  | 'audio'
  | 'picture-choice'
  | 'true-false'
  | 'highlight'
  | 'mini-game'
  | 'type-answer'
  | 'match-equation'

export interface Question {
  id: string
  levelId: number
  type: QuestionType
  question: string
  visualContent?: string // For star counting: "⭐⭐⭐"
  options?: string[]
  correctAnswer?: string
  explanation?: string
  xp: number
  // Drag-and-drop
  pairs?: Array<{ left: string; right: string }>
  // Fill-in-the-blank
  blanks?: Array<{ text: string; answer: string }>
  // Tap-select
  tapOptions?: string[]
  tapCorrect?: string[]
  // Order-sequence
  sequence?: string[]
  sequenceCorrect?: string[]
  // Audio
  audioUrl?: string
  // Picture-choice
  images?: Array<{ url: string; label: string }>
  imageCorrect?: string
  // True/False
  statement?: string
  isTrue?: boolean
  // Highlight
  highlightOptions?: string[]
  highlightCorrect?: string[]
  // Mini-game
  gameType?: string
  // Type-answer
  acceptableAnswers?: string[] // Multiple acceptable answers for typed input
  // Match-equation
  equations?: Array<{ equation: string; answer: string }>
}

export interface LevelData {
  title: string;
  introduction: {
    title: string;
    content: string[];
    examples: Array<{ number: string; visual: string; word: string }>;
  };
  questions: Question[];
}

export const levelContent: { [levelId: number]: LevelData } = {
  // UNIT 1: ADDITION BASICS
  1: {
    title: "Addition: Numbers 1-10",
    introduction: {
      title: "Welcome to Addition!",
      content: [
        "Addition means putting numbers together!",
        "When you add, you're finding the total of two numbers.",
        "The + symbol means 'plus' or 'add'. Let's practice!"
      ],
      examples: [
        { number: "2 + 1", visual: "●● + ● = ●●●", word: "equals 3" },
        { number: "3 + 2", visual: "●●● + ●● = ●●●●●", word: "equals 5" },
        { number: "4 + 3", visual: "●●●● + ●●● = ●●●●●●●", word: "equals 7" },
      ]
    },
  questions: [
      {
        id: "1-1",
        levelId: 1,
        type: "multiple-choice" as QuestionType,
        question: "What is 1 + 1?",
        options: ["1", "2", "3", "4"],
        correctAnswer: "2",
        explanation: "1 + 1 = 2! When you add 1 and 1 together, you get 2.",
        xp: 10
      },
      {
        id: "1-2",
        levelId: 1,
        type: "multiple-choice" as QuestionType,
        question: "What is 2 + 1?",
        options: ["2", "3", "4", "5"],
        correctAnswer: "3",
        explanation: "2 + 1 = 3! Start at 2, then count up 1 more: 3!",
        xp: 10
      },
      {
        id: "1-3",
        levelId: 1,
        type: "multiple-choice" as QuestionType,
        question: "What is 3 + 2?",
        options: ["4", "5", "6", "7"],
        correctAnswer: "5",
        explanation: "3 + 2 = 5! Count it: 1, 2, 3 (pause) 4, 5!",
        xp: 10
      },
      {
        id: "1-4",
        levelId: 1,
        type: "multiple-choice" as QuestionType,
        question: "What is 4 + 1?",
        options: ["3", "4", "5", "6"],
        correctAnswer: "5",
        explanation: "4 + 1 = 5! When you add 1 to 4, you get 5!",
        xp: 10
      },
      {
        id: "1-5",
        levelId: 1,
        type: "multiple-choice" as QuestionType,
        question: "What is 2 + 2?",
        options: ["2", "3", "4", "5"],
        correctAnswer: "4",
        explanation: "2 + 2 = 4! This is an important one to remember!",
        xp: 10
      },
      {
        id: "1-6",
        levelId: 1,
        type: "multiple-choice" as QuestionType,
        question: "What is 5 + 2?",
        options: ["6", "7", "8", "9"],
        correctAnswer: "7",
        explanation: "5 + 2 = 7! Start at 5, then count: 6, 7!",
        xp: 10
      },
      {
        id: "1-7",
        levelId: 1,
        type: "multiple-choice" as QuestionType,
        question: "What is 3 + 3?",
        options: ["5", "6", "7", "8"],
        correctAnswer: "6",
        explanation: "3 + 3 = 6! Double 3 equals 6!",
        xp: 10
      },
      {
        id: "1-8",
        levelId: 1,
        type: "multiple-choice" as QuestionType,
        question: "What is 4 + 3?",
        options: ["6", "7", "8", "9"],
        correctAnswer: "7",
        explanation: "4 + 3 = 7! Count from 4: 5, 6, 7!",
        xp: 10
      },
      {
        id: "1-9",
        levelId: 1,
        type: "multiple-choice" as QuestionType,
        question: "What is 5 + 5?",
        options: ["8", "9", "10", "11"],
        correctAnswer: "10",
        explanation: "5 + 5 = 10! This is a great one to memorize!",
        xp: 10
      },
      {
        id: "1-10",
        levelId: 1,
        type: "multiple-choice" as QuestionType,
        question: "What is 6 + 4?",
        options: ["9", "10", "11", "12"],
        correctAnswer: "10",
        explanation: "6 + 4 = 10! Another way to make 10!",
        xp: 10
      }
    ]
  },

  2: {
    title: "Numbers 6-10",
    introduction: {
      title: "More Numbers!",
      content: [
        "Now let's learn bigger numbers!",
        "We'll count from 6 to 10.",
        "Keep counting with the stars!"
      ],
      examples: [
        { number: "6", visual: "⭐⭐⭐⭐⭐⭐", word: "six" },
        { number: "7", visual: "⭐⭐⭐⭐⭐⭐⭐", word: "seven" },
        { number: "8", visual: "⭐⭐⭐⭐⭐⭐⭐⭐", word: "eight" },
        { number: "9", visual: "⭐⭐⭐⭐⭐⭐⭐⭐⭐", word: "nine" },
        { number: "10", visual: "⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐", word: "ten" },
      ]
    },
    questions: [
      {
        id: "2-1",
        levelId: 2,
        type: "visual-count" as QuestionType,
        question: "Count the stars! How many?",
        visualContent: "⭐⭐⭐⭐⭐⭐",
        options: ["5", "6", "7", "8"],
        correctAnswer: "6",
        explanation: "Great! There are 6 stars!",
        xp: 10
      },
      {
        id: "2-2",
        levelId: 2,
        type: "number-sequence" as QuestionType,
        question: "What comes after 7?",
        options: ["6", "7", "8", "9"],
        correctAnswer: "8",
        explanation: "That's right! After 7 comes 8!",
        xp: 10
      },
      {
        id: "2-3",
        levelId: 2,
        type: "visual-count" as QuestionType,
        question: "How many stars do you see?",
        visualContent: "⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐",
        options: ["8", "9", "10", "11"],
        correctAnswer: "10",
        explanation: "Perfect! You counted all 10 stars!",
        xp: 10
      },
      {
        id: "2-4",
        levelId: 2,
        type: "multiple-choice" as QuestionType,
        question: "Which number is this? 9",
        options: ["seven", "eight", "nine", "ten"],
        correctAnswer: "nine",
        explanation: "Correct! 9 is called 'nine'!",
        xp: 10
      },
      {
        id: "2-5",
        levelId: 2,
        type: "visual-count" as QuestionType,
        question: "Count carefully! How many stars?",
        visualContent: "⭐⭐⭐⭐⭐⭐⭐⭐",
        options: ["6", "7", "8", "9"],
        correctAnswer: "8",
        explanation: "Excellent! There are 8 stars!",
        xp: 10
      },
      {
        id: "2-6",
        levelId: 2,
        type: "number-sequence" as QuestionType,
        question: "What comes after 9?",
        options: ["8", "9", "10", "11"],
        correctAnswer: "10",
        explanation: "Yes! After 9 comes 10!",
        xp: 10
      },
      {
        id: "2-7",
        levelId: 2,
        type: "visual-count" as QuestionType,
        question: "How many stars?",
        visualContent: "⭐⭐⭐⭐⭐⭐⭐",
        options: ["6", "7", "8", "9"],
        correctAnswer: "7",
        explanation: "Great counting! There are 7 stars!",
        xp: 10
      },
      {
        id: "2-8",
        levelId: 2,
        type: "number-sequence" as QuestionType,
        question: "What comes after 5?",
        options: ["4", "5", "6", "7"],
        correctAnswer: "6",
        explanation: "Right! After 5 comes 6!",
        xp: 10
      },
      {
        id: "2-9",
        levelId: 2,
        type: "visual-count" as QuestionType,
        question: "Count the stars!",
        visualContent: "⭐⭐⭐⭐⭐⭐⭐⭐⭐",
        options: ["7", "8", "9", "10"],
        correctAnswer: "9",
        explanation: "Perfect! There are 9 stars!",
        xp: 10
      },
      {
        id: "2-10",
        levelId: 2,
        type: "multiple-choice" as QuestionType,
        question: "Which is the biggest number?",
        options: ["6", "8", "10", "7"],
        correctAnswer: "10",
        explanation: "Correct! 10 is the biggest number we've learned!",
        xp: 10
      }
    ]
  },

  3: {
    title: "Counting Practice",
    introduction: {
      title: "Let's Practice Counting!",
      content: [
        "Now you know numbers 1-10!",
        "Let's practice counting them in order.",
        "You're becoming a counting expert!"
      ],
      examples: [
        { number: "1-10", visual: "⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐", word: "one through ten" }
      ]
    },
    questions: [
      {
        id: "3-1",
        levelId: 3,
        type: "number-sequence" as QuestionType,
        question: "What comes between 3 and 5?",
        options: ["2", "3", "4", "5"],
        correctAnswer: "4",
        explanation: "Between 3 and 5 is 4! (3, 4, 5)",
        xp: 15
      },
      {
        id: "3-2",
        levelId: 3,
        type: "visual-count" as QuestionType,
        question: "How many stars?",
        visualContent: "⭐⭐⭐⭐⭐⭐⭐⭐",
        options: ["6", "7", "8", "9"],
        correctAnswer: "8",
        explanation: "Great! You counted 8 stars!",
        xp: 15
      },
      {
        id: "3-3",
        levelId: 3,
        type: "multiple-choice" as QuestionType,
        question: "What number comes before 7?",
        options: ["5", "6", "7", "8"],
        correctAnswer: "6",
        explanation: "Yes! Before 7 comes 6!",
        xp: 15
      },
      {
        id: "3-4",
        levelId: 3,
        type: "visual-count" as QuestionType,
        question: "Count these stars!",
        visualContent: "⭐⭐⭐⭐⭐",
        options: ["3", "4", "5", "6"],
        correctAnswer: "5",
        explanation: "Perfect! There are 5 stars!",
        xp: 15
      },
      {
        id: "3-5",
        levelId: 3,
        type: "number-sequence" as QuestionType,
        question: "What comes after 8?",
        options: ["7", "8", "9", "10"],
        correctAnswer: "9",
        explanation: "Correct! After 8 comes 9!",
        xp: 15
      },
      {
        id: "3-6",
        levelId: 3,
        type: "visual-count" as QuestionType,
        question: "How many stars do you see?",
        visualContent: "⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐",
        options: ["8", "9", "10", "11"],
        correctAnswer: "10",
        explanation: "Excellent! You counted all 10 stars!",
        xp: 15
      },
      {
        id: "3-7",
        levelId: 3,
        type: "multiple-choice" as QuestionType,
        question: "Which number is between 5 and 7?",
        options: ["4", "5", "6", "7"],
        correctAnswer: "6",
        explanation: "That's right! 6 is between 5 and 7!",
        xp: 15
      },
      {
        id: "3-8",
        levelId: 3,
        type: "visual-count" as QuestionType,
        question: "Count the stars!",
        visualContent: "⭐⭐⭐⭐⭐⭐",
        options: ["4", "5", "6", "7"],
        correctAnswer: "6",
        explanation: "Perfect! There are 6 stars!",
        xp: 15
      },
      {
        id: "3-9",
        levelId: 3,
        type: "number-sequence" as QuestionType,
        question: "What number comes before 4?",
        options: ["2", "3", "4", "5"],
        correctAnswer: "3",
        explanation: "Great! Before 4 comes 3!",
        xp: 15
      },
      {
        id: "3-10",
        levelId: 3,
        type: "multiple-choice" as QuestionType,
        question: "What is the smallest number?",
        options: ["1", "5", "3", "10"],
        correctAnswer: "1",
        explanation: "Correct! 1 is the smallest number!",
        xp: 15
      }
    ]
  }
}

// Add placeholder content for levels 4–50
// Automatically generate sample real questions for levels 4–50
const unitThemes = [
  { start: 4, end: 5, type: "number-sequence", topic: "Number Matching", questions: [
  (id: string, levelId: number): Question => ({
      id: `${levelId}-1`,
      levelId,
  type: 'number-sequence' as QuestionType,
      question: "Which number comes after 7?",
      options: ["6", "7", "8", "9"],
      correctAnswer: "8",
      explanation: "After 7 comes 8!",
      xp: 10
    }),
  (id: string, levelId: number): Question => ({
      id: `${levelId}-2`,
      levelId,
  type: 'number-sequence' as QuestionType,
      question: "Which number comes before 10?",
      options: ["8", "9", "10", "11"],
      correctAnswer: "9",
      explanation: "Before 10 comes 9!",
      xp: 10
    }),
  (id: string, levelId: number): Question => ({
      id: `${levelId}-3`,
      levelId,
  type: 'number-sequence' as QuestionType,
      question: "What comes after 5?",
      options: ["4", "5", "6", "7"],
      correctAnswer: "6",
      explanation: "After 5 comes 6!",
      xp: 10
    }),
  (id: string, levelId: number): Question => ({
      id: `${levelId}-4`,
      levelId,
  type: 'number-sequence' as QuestionType,
      question: "What comes before 8?",
      options: ["6", "7", "8", "9"],
      correctAnswer: "7",
      explanation: "Before 8 comes 7!",
      xp: 10
    }),
  (id: string, levelId: number): Question => ({
      id: `${levelId}-5`,
      levelId,
  type: 'visual-count' as QuestionType,
      question: "How many stars?",
      visualContent: "⭐⭐⭐⭐⭐⭐⭐⭐",
      options: ["6", "7", "8", "9"],
      correctAnswer: "8",
      explanation: "There are 8 stars!",
      xp: 10
    }),
  (id: string, levelId: number): Question => ({
      id: `${levelId}-6`,
      levelId,
  type: 'number-sequence' as QuestionType,
      question: "What comes after 9?",
      options: ["8", "9", "10", "11"],
      correctAnswer: "10",
      explanation: "After 9 comes 10!",
      xp: 10
    }),
  (id: string, levelId: number): Question => ({
      id: `${levelId}-7`,
      levelId,
  type: 'visual-count' as QuestionType,
      question: "Count the stars!",
      visualContent: "⭐⭐⭐⭐⭐⭐",
      options: ["4", "5", "6", "7"],
      correctAnswer: "6",
      explanation: "You counted 6 stars!",
      xp: 10
    }),
  (id: string, levelId: number): Question => ({
      id: `${levelId}-8`,
      levelId,
  type: 'number-sequence' as QuestionType,
      question: "What comes before 3?",
      options: ["1", "2", "3", "4"],
      correctAnswer: "2",
      explanation: "Before 3 comes 2!",
      xp: 10
    }),
  (id: string, levelId: number): Question => ({
      id: `${levelId}-9`,
      levelId,
  type: 'visual-count' as QuestionType,
      question: "How many stars do you see?",
      visualContent: "⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐",
      options: ["8", "9", "10", "11"],
      correctAnswer: "10",
      explanation: "Perfect! There are 10 stars!",
      xp: 10
    }),
  (id: string, levelId: number): Question => ({
      id: `${levelId}-10`,
      levelId,
  type: 'number-sequence' as QuestionType,
      question: "What comes after 4?",
      options: ["3", "4", "5", "6"],
      correctAnswer: "5",
      explanation: "After 4 comes 5!",
      xp: 10
    })
  ]},
  { start: 6, end: 10, type: "multiple-choice", topic: "Addition", questions: [
  (id: string, levelId: number): Question => ({
      id: `${levelId}-1`,
      levelId,
  type: 'multiple-choice' as QuestionType,
      question: `What is ${levelId} + 2?`,
      options: [String(levelId + 1), String(levelId + 2), String(levelId + 3), String(levelId + 4)],
      correctAnswer: String(levelId + 2),
      explanation: `${levelId} + 2 = ${levelId + 2}`,
      xp: 10
    }),
  (id: string, levelId: number): Question => ({
      id: `${levelId}-2`,
      levelId,
  type: 'multiple-choice' as QuestionType,
      question: `What is ${levelId + 1} + 3?`,
      options: [String(levelId + 2), String(levelId + 3), String(levelId + 4), String(levelId + 5)],
      correctAnswer: String(levelId + 4),
      explanation: `${levelId + 1} + 3 = ${levelId + 4}`,
      xp: 10
    }),
  (id: string, levelId: number): Question => ({
      id: `${levelId}-3`,
      levelId,
  type: 'multiple-choice' as QuestionType,
      question: `What is 1 + ${levelId}?`,
      options: [String(levelId), String(levelId + 1), String(levelId + 2), String(levelId + 3)],
      correctAnswer: String(levelId + 1),
      explanation: `1 + ${levelId} = ${levelId + 1}`,
      xp: 10
    }),
  (id: string, levelId: number): Question => ({
      id: `${levelId}-4`,
      levelId,
  type: 'multiple-choice' as QuestionType,
      question: `What is ${levelId - 2} + 4?`,
      options: [String(levelId), String(levelId + 1), String(levelId + 2), String(levelId + 3)],
      correctAnswer: String(levelId + 2),
      explanation: `${levelId - 2} + 4 = ${levelId + 2}`,
      xp: 10
    }),
  (id: string, levelId: number): Question => ({
      id: `${levelId}-5`,
      levelId,
  type: 'multiple-choice' as QuestionType,
      question: `What is 3 + ${levelId - 1}?`,
      options: [String(levelId), String(levelId + 1), String(levelId + 2), String(levelId + 3)],
      correctAnswer: String(levelId + 2),
      explanation: `3 + ${levelId - 1} = ${levelId + 2}`,
      xp: 10
    }),
  (id: string, levelId: number): Question => ({
      id: `${levelId}-6`,
      levelId,
  type: 'multiple-choice' as QuestionType,
      question: `What is ${levelId} + 1?`,
      options: [String(levelId - 1), String(levelId), String(levelId + 1), String(levelId + 2)],
      correctAnswer: String(levelId + 1),
      explanation: `${levelId} + 1 = ${levelId + 1}`,
      xp: 10
    }),
  (id: string, levelId: number): Question => ({
      id: `${levelId}-7`,
      levelId,
  type: 'multiple-choice' as QuestionType,
      question: `What is 5 + ${levelId - 3}?`,
      options: [String(levelId), String(levelId + 1), String(levelId + 2), String(levelId + 3)],
      correctAnswer: String(levelId + 2),
      explanation: `5 + ${levelId - 3} = ${levelId + 2}`,
      xp: 10
    }),
  (id: string, levelId: number): Question => ({
      id: `${levelId}-8`,
      levelId,
  type: 'multiple-choice' as QuestionType,
      question: `What is ${levelId - 1} + 2?`,
      options: [String(levelId - 1), String(levelId), String(levelId + 1), String(levelId + 2)],
      correctAnswer: String(levelId + 1),
      explanation: `${levelId - 1} + 2 = ${levelId + 1}`,
      xp: 10
    }),
  (id: string, levelId: number): Question => ({
      id: `${levelId}-9`,
      levelId,
  type: 'multiple-choice' as QuestionType,
      question: `What is 2 + ${levelId}?`,
      options: [String(levelId), String(levelId + 1), String(levelId + 2), String(levelId + 3)],
      correctAnswer: String(levelId + 2),
      explanation: `2 + ${levelId} = ${levelId + 2}`,
      xp: 10
    }),
  (id: string, levelId: number): Question => ({
      id: `${levelId}-10`,
      levelId,
  type: 'multiple-choice' as QuestionType,
      question: `What is ${levelId} + ${levelId}?`,
      options: [String(levelId), String(levelId + levelId - 1), String(levelId + levelId), String(levelId + levelId + 1)],
      correctAnswer: String(levelId + levelId),
      explanation: `${levelId} + ${levelId} = ${levelId + levelId}`,
      xp: 10
    })
  ]},
  { start: 11, end: 15, type: "multiple-choice", topic: "Subtraction", questions: [
  (id: string, levelId: number): Question => ({
      id: `${levelId}-1`,
      levelId,
  type: 'multiple-choice' as QuestionType,
      question: `What is ${levelId + 5} - 5?`,
      options: [String(levelId), String(levelId + 1), String(levelId + 2), String(levelId + 3)],
      correctAnswer: String(levelId + 0),
      explanation: `${levelId + 5} - 5 = ${levelId}`,
      xp: 10
    }),
  (id: string, levelId: number): Question => ({
      id: `${levelId}-2`,
      levelId,
  type: 'multiple-choice' as QuestionType,
      question: `What is ${levelId + 7} - 2?`,
      options: [String(levelId + 4), String(levelId + 5), String(levelId + 6), String(levelId + 7)],
      correctAnswer: String(levelId + 5),
      explanation: `${levelId + 7} - 2 = ${levelId + 5}`,
      xp: 10
    }),
  (id: string, levelId: number): Question => ({
      id: `${levelId}-3`,
      levelId,
  type: 'multiple-choice' as QuestionType,
      question: `What is ${levelId} - 1?`,
      options: [String(levelId - 2), String(levelId - 1), String(levelId), String(levelId + 1)],
      correctAnswer: String(levelId - 1),
      explanation: `${levelId} - 1 = ${levelId - 1}`,
      xp: 10
    }),
  (id: string, levelId: number): Question => ({
      id: `${levelId}-4`,
      levelId,
  type: 'multiple-choice' as QuestionType,
      question: `What is ${levelId + 3} - 3?`,
      options: [String(levelId - 1), String(levelId), String(levelId + 1), String(levelId + 2)],
      correctAnswer: String(levelId),
      explanation: `${levelId + 3} - 3 = ${levelId}`,
      xp: 10
    }),
  (id: string, levelId: number): Question => ({
      id: `${levelId}-5`,
      levelId,
  type: 'multiple-choice' as QuestionType,
      question: `What is ${levelId + 8} - 4?`,
      options: [String(levelId + 3), String(levelId + 4), String(levelId + 5), String(levelId + 6)],
      correctAnswer: String(levelId + 4),
      explanation: `${levelId + 8} - 4 = ${levelId + 4}`,
      xp: 10
    }),
  (id: string, levelId: number): Question => ({
      id: `${levelId}-6`,
      levelId,
  type: 'multiple-choice' as QuestionType,
      question: `What is ${levelId + 10} - 5?`,
      options: [String(levelId + 4), String(levelId + 5), String(levelId + 6), String(levelId + 7)],
      correctAnswer: String(levelId + 5),
      explanation: `${levelId + 10} - 5 = ${levelId + 5}`,
      xp: 10
    }),
  (id: string, levelId: number): Question => ({
      id: `${levelId}-7`,
      levelId,
  type: 'multiple-choice' as QuestionType,
      question: `What is ${levelId + 2} - 2?`,
      options: [String(levelId - 1), String(levelId), String(levelId + 1), String(levelId + 2)],
      correctAnswer: String(levelId),
      explanation: `${levelId + 2} - 2 = ${levelId}`,
      xp: 10
    }),
  (id: string, levelId: number): Question => ({
      id: `${levelId}-8`,
      levelId,
  type: 'multiple-choice' as QuestionType,
      question: `What is ${levelId + 6} - 3?`,
      options: [String(levelId + 2), String(levelId + 3), String(levelId + 4), String(levelId + 5)],
      correctAnswer: String(levelId + 3),
      explanation: `${levelId + 6} - 3 = ${levelId + 3}`,
      xp: 10
    }),
  (id: string, levelId: number): Question => ({
      id: `${levelId}-9`,
      levelId,
  type: 'multiple-choice' as QuestionType,
      question: `What is ${levelId + 4} - 4?`,
      options: [String(levelId - 1), String(levelId), String(levelId + 1), String(levelId + 2)],
      correctAnswer: String(levelId),
      explanation: `${levelId + 4} - 4 = ${levelId}`,
      xp: 10
    }),
  (id: string, levelId: number): Question => ({
      id: `${levelId}-10`,
      levelId,
  type: 'multiple-choice' as QuestionType,
      question: `What is ${levelId + levelId} - ${levelId}?`,
      options: [String(levelId - 1), String(levelId), String(levelId + 1), String(levelId + 2)],
      correctAnswer: String(levelId),
      explanation: `${levelId + levelId} - ${levelId} = ${levelId}`,
      xp: 10
    })
  ]},
  { start: 16, end: 20, type: "multiple-choice", topic: "Multiplication", questions: [
  (id: string, levelId: number): Question => ({
      id: `${levelId}-1`,
      levelId,
  type: 'multiple-choice' as QuestionType,
      question: `What is 2 × 3?`,
      options: ["4", "5", "6", "7"],
      correctAnswer: "6",
      explanation: `2 × 3 = 6`,
      xp: 15
    }),
  (id: string, levelId: number): Question => ({
      id: `${levelId}-2`,
      levelId,
  type: 'multiple-choice' as QuestionType,
      question: `What is 3 × 4?`,
      options: ["10", "11", "12", "13"],
      correctAnswer: "12",
      explanation: `3 × 4 = 12`,
      xp: 15
    }),
  (id: string, levelId: number): Question => ({
      id: `${levelId}-3`,
      levelId,
  type: 'multiple-choice' as QuestionType,
      question: `What is 2 × 5?`,
      options: ["8", "9", "10", "11"],
      correctAnswer: "10",
      explanation: `2 × 5 = 10`,
      xp: 15
    }),
  (id: string, levelId: number): Question => ({
      id: `${levelId}-4`,
      levelId,
  type: 'multiple-choice' as QuestionType,
      question: `What is 4 × 2?`,
      options: ["6", "7", "8", "9"],
      correctAnswer: "8",
      explanation: `4 × 2 = 8`,
      xp: 15
    }),
  (id: string, levelId: number): Question => ({
      id: `${levelId}-5`,
      levelId,
  type: 'multiple-choice' as QuestionType,
      question: `What is 3 × 3?`,
      options: ["6", "7", "8", "9"],
      correctAnswer: "9",
      explanation: `3 × 3 = 9`,
      xp: 15
    }),
  (id: string, levelId: number): Question => ({
      id: `${levelId}-6`,
      levelId,
  type: 'multiple-choice' as QuestionType,
      question: `What is 5 × 2?`,
      options: ["8", "9", "10", "11"],
      correctAnswer: "10",
      explanation: `5 × 2 = 10`,
      xp: 15
    }),
  (id: string, levelId: number): Question => ({
      id: `${levelId}-7`,
      levelId,
  type: 'multiple-choice' as QuestionType,
      question: `What is 2 × 2?`,
      options: ["2", "3", "4", "5"],
      correctAnswer: "4",
      explanation: `2 × 2 = 4`,
      xp: 15
    }),
  (id: string, levelId: number): Question => ({
      id: `${levelId}-8`,
      levelId,
  type: 'multiple-choice' as QuestionType,
      question: `What is 4 × 3?`,
      options: ["10", "11", "12", "13"],
      correctAnswer: "12",
      explanation: `4 × 3 = 12`,
      xp: 15
    }),
  (id: string, levelId: number): Question => ({
      id: `${levelId}-9`,
      levelId,
  type: 'multiple-choice' as QuestionType,
      question: `What is 3 × 5?`,
      options: ["13", "14", "15", "16"],
      correctAnswer: "15",
      explanation: `3 × 5 = 15`,
      xp: 15
    }),
  (id: string, levelId: number): Question => ({
      id: `${levelId}-10`,
      levelId,
  type: 'multiple-choice' as QuestionType,
      question: `What is 2 × 4?`,
      options: ["6", "7", "8", "9"],
      correctAnswer: "8",
      explanation: `2 × 4 = 8`,
      xp: 15
    })
  ]},
  { start: 21, end: 25, type: "multiple-choice", topic: "Division", questions: Array(10).fill(null).map((_, idx) => {
    const templates = [
      (id: string, levelId: number): Question => ({ id, levelId, type: 'multiple-choice' as QuestionType, question: "What is 10 ÷ 2?", options: ["3", "4", "5", "6"], correctAnswer: "5", explanation: "10 ÷ 2 = 5", xp: 15 }),
      (id: string, levelId: number): Question => ({ id, levelId, type: 'multiple-choice' as QuestionType, question: "What is 12 ÷ 3?", options: ["3", "4", "5", "6"], correctAnswer: "4", explanation: "12 ÷ 3 = 4", xp: 15 }),
      (id: string, levelId: number): Question => ({ id, levelId, type: 'multiple-choice' as QuestionType, question: "What is 15 ÷ 3?", options: ["4", "5", "6", "7"], correctAnswer: "5", explanation: "15 ÷ 3 = 5", xp: 15 }),
      (id: string, levelId: number): Question => ({ id, levelId, type: 'multiple-choice' as QuestionType, question: "What is 20 ÷ 4?", options: ["4", "5", "6", "7"], correctAnswer: "5", explanation: "20 ÷ 4 = 5", xp: 15 }),
      (id: string, levelId: number): Question => ({ id, levelId, type: 'multiple-choice' as QuestionType, question: "What is 18 ÷ 2?", options: ["7", "8", "9", "10"], correctAnswer: "9", explanation: "18 ÷ 2 = 9", xp: 15 }),
      (id: string, levelId: number): Question => ({ id, levelId, type: 'multiple-choice' as QuestionType, question: "What is 16 ÷ 4?", options: ["3", "4", "5", "6"], correctAnswer: "4", explanation: "16 ÷ 4 = 4", xp: 15 }),
      (id: string, levelId: number): Question => ({ id, levelId, type: 'multiple-choice' as QuestionType, question: "What is 25 ÷ 5?", options: ["4", "5", "6", "7"], correctAnswer: "5", explanation: "25 ÷ 5 = 5", xp: 15 }),
      (id: string, levelId: number): Question => ({ id, levelId, type: 'multiple-choice' as QuestionType, question: "What is 14 ÷ 2?", options: ["6", "7", "8", "9"], correctAnswer: "7", explanation: "14 ÷ 2 = 7", xp: 15 }),
      (id: string, levelId: number): Question => ({ id, levelId, type: 'multiple-choice' as QuestionType, question: "What is 21 ÷ 3?", options: ["6", "7", "8", "9"], correctAnswer: "7", explanation: "21 ÷ 3 = 7", xp: 15 }),
      (id: string, levelId: number): Question => ({ id, levelId, type: 'multiple-choice' as QuestionType, question: "What is 24 ÷ 4?", options: ["5", "6", "7", "8"], correctAnswer: "6", explanation: "24 ÷ 4 = 6", xp: 15 }),
    ];
    return templates[idx];
  })},
  { start: 26, end: 30, type: "multiple-choice", topic: "Fractions", questions: Array(10).fill(null).map((_, idx) => {
    const q = [(id: string, levelId: number): Question => ({ id, levelId, type: 'multiple-choice' as QuestionType, question: "Which is bigger: 1/2 or 1/4?", options: ["1/2", "1/4", "They are equal", "0"], correctAnswer: "1/2", explanation: "1/2 is bigger than 1/4.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: 'multiple-choice' as QuestionType, question: "What is 1/2 + 1/4?", options: ["3/4", "1/2", "1/4", "1"], correctAnswer: "3/4", explanation: "1/2 + 1/4 = 3/4.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: 'multiple-choice' as QuestionType, question: "What is 1/3 of 9?", options: ["2", "3", "4", "5"], correctAnswer: "3", explanation: "1/3 of 9 = 3.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: 'multiple-choice' as QuestionType, question: "Which is bigger: 1/3 or 1/2?", options: ["1/3", "1/2", "They are equal", "0"], correctAnswer: "1/2", explanation: "1/2 is bigger than 1/3.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: 'multiple-choice' as QuestionType, question: "What is 2/4 simplified?", options: ["1/4", "1/2", "2/3", "1"], correctAnswer: "1/2", explanation: "2/4 = 1/2.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: 'multiple-choice' as QuestionType, question: "What is 1/2 of 10?", options: ["4", "5", "6", "7"], correctAnswer: "5", explanation: "1/2 of 10 = 5.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: 'multiple-choice' as QuestionType, question: "What is 3/4 - 1/4?", options: ["1/4", "1/2", "2/4", "3/4"], correctAnswer: "1/2", explanation: "3/4 - 1/4 = 2/4 = 1/2.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: 'multiple-choice' as QuestionType, question: "Which is bigger: 2/3 or 1/2?", options: ["2/3", "1/2", "They are equal", "0"], correctAnswer: "2/3", explanation: "2/3 is bigger than 1/2.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: 'multiple-choice' as QuestionType, question: "What is 1/4 of 12?", options: ["2", "3", "4", "5"], correctAnswer: "3", explanation: "1/4 of 12 = 3.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: 'multiple-choice' as QuestionType, question: "What is 1/2 + 1/2?", options: ["1/2", "1", "2", "1/4"], correctAnswer: "1", explanation: "1/2 + 1/2 = 1.", xp: 20 })];
    return q[idx];
  })},
  { start: 31, end: 35, type: "multiple-choice", topic: "Decimals", questions: Array(10).fill(null).map((_, idx) => {
    const q = [(id: string, levelId: number): Question => ({ id, levelId, type: 'multiple-choice' as QuestionType, question: "What is 0.5 + 0.25?", options: ["0.55", "0.65", "0.75", "0.8"], correctAnswer: "0.75", explanation: "0.5 + 0.25 = 0.75.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: 'multiple-choice' as QuestionType, question: "Which is greater: 0.8 or 0.75?", options: ["0.8", "0.75", "They are equal", "0.7"], correctAnswer: "0.8", explanation: "0.8 is greater than 0.75.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: 'multiple-choice' as QuestionType, question: "What is 0.3 + 0.4?", options: ["0.6", "0.7", "0.8", "0.9"], correctAnswer: "0.7", explanation: "0.3 + 0.4 = 0.7.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: 'multiple-choice' as QuestionType, question: "What is 1.0 - 0.5?", options: ["0.3", "0.4", "0.5", "0.6"], correctAnswer: "0.5", explanation: "1.0 - 0.5 = 0.5.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: 'multiple-choice' as QuestionType, question: "Which is greater: 0.9 or 0.09?", options: ["0.9", "0.09", "They are equal", "0"], correctAnswer: "0.9", explanation: "0.9 is greater than 0.09.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: 'multiple-choice' as QuestionType, question: "What is 0.6 + 0.3?", options: ["0.7", "0.8", "0.9", "1.0"], correctAnswer: "0.9", explanation: "0.6 + 0.3 = 0.9.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: 'multiple-choice' as QuestionType, question: "What is 0.25 × 4?", options: ["0.5", "1", "1.5", "2"], correctAnswer: "1", explanation: "0.25 × 4 = 1.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: 'multiple-choice' as QuestionType, question: "What is 2.5 - 1.5?", options: ["0.5", "1", "1.5", "2"], correctAnswer: "1", explanation: "2.5 - 1.5 = 1.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: 'multiple-choice' as QuestionType, question: "Which is greater: 0.5 or 0.50?", options: ["0.5", "0.50", "They are equal", "0"], correctAnswer: "They are equal", explanation: "0.5 and 0.50 are equal.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: 'multiple-choice' as QuestionType, question: "What is 0.1 + 0.9?", options: ["0.9", "1", "1.1", "1.2"], correctAnswer: "1", explanation: "0.1 + 0.9 = 1.", xp: 20 })];
    return q[idx];
  })},
  { start: 36, end: 40, type: "multiple-choice", topic: "Geometry", questions: Array(10).fill(null).map((_, idx) => {
    const q = [(id: string, levelId: number): Question => ({ id, levelId, type: 'multiple-choice' as QuestionType, question: "How many sides does a hexagon have?", options: ["5", "6", "7", "8"], correctAnswer: "6", explanation: "A hexagon has 6 sides.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: "multiple-choice" as QuestionType, question: "What shape has 4 equal sides and 4 right angles?", options: ["Square", "Rectangle", "Triangle", "Circle"], correctAnswer: "Square", explanation: "A square has 4 equal sides and 4 right angles.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: "multiple-choice" as QuestionType, question: "How many sides does a triangle have?", options: ["2", "3", "4", "5"], correctAnswer: "3", explanation: "A triangle has 3 sides.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: "multiple-choice" as QuestionType, question: "How many sides does a pentagon have?", options: ["4", "5", "6", "7"], correctAnswer: "5", explanation: "A pentagon has 5 sides.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: "multiple-choice" as QuestionType, question: "What shape has no sides?", options: ["Circle", "Square", "Triangle", "Rectangle"], correctAnswer: "Circle", explanation: "A circle has no sides.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: "multiple-choice" as QuestionType, question: "How many corners does a square have?", options: ["2", "3", "4", "5"], correctAnswer: "4", explanation: "A square has 4 corners.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: "multiple-choice" as QuestionType, question: "What is a shape with 8 sides called?", options: ["Pentagon", "Hexagon", "Heptagon", "Octagon"], correctAnswer: "Octagon", explanation: "An octagon has 8 sides.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: "multiple-choice" as QuestionType, question: "How many sides does a rectangle have?", options: ["2", "3", "4", "5"], correctAnswer: "4", explanation: "A rectangle has 4 sides.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: "multiple-choice" as QuestionType, question: "What shape is a stop sign?", options: ["Circle", "Square", "Triangle", "Octagon"], correctAnswer: "Octagon", explanation: "A stop sign is an octagon.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: "multiple-choice" as QuestionType, question: "How many corners does a triangle have?", options: ["2", "3", "4", "5"], correctAnswer: "3", explanation: "A triangle has 3 corners.", xp: 20 })];
    return q[idx];
  })},
  { start: 41, end: 45, type: "multiple-choice", topic: "Measurement", questions: Array(10).fill(null).map((_, idx) => {
    const q = [(id: string, levelId: number): Question => ({ id, levelId, type: "multiple-choice" as QuestionType, question: "How many minutes are in an hour?", options: ["30", "45", "60", "90"], correctAnswer: "60", explanation: "There are 60 minutes in an hour.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: "multiple-choice" as QuestionType, question: "How many centimeters in a meter?", options: ["10", "100", "1000", "1"], correctAnswer: "100", explanation: "There are 100 centimeters in a meter.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: "multiple-choice" as QuestionType, question: "How many seconds in a minute?", options: ["30", "45", "60", "90"], correctAnswer: "60", explanation: "There are 60 seconds in a minute.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: "multiple-choice" as QuestionType, question: "How many hours in a day?", options: ["12", "20", "24", "30"], correctAnswer: "24", explanation: "There are 24 hours in a day.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: "multiple-choice" as QuestionType, question: "How many days in a week?", options: ["5", "6", "7", "8"], correctAnswer: "7", explanation: "There are 7 days in a week.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: "multiple-choice" as QuestionType, question: "How many millimeters in a centimeter?", options: ["5", "10", "100", "1000"], correctAnswer: "10", explanation: "There are 10 millimeters in a centimeter.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: "multiple-choice" as QuestionType, question: "How many meters in a kilometer?", options: ["10", "100", "1000", "10000"], correctAnswer: "1000", explanation: "There are 1000 meters in a kilometer.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: "multiple-choice" as QuestionType, question: "How many months in a year?", options: ["10", "11", "12", "13"], correctAnswer: "12", explanation: "There are 12 months in a year.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: "multiple-choice" as QuestionType, question: "How many weeks in a month (approximately)?", options: ["2", "3", "4", "5"], correctAnswer: "4", explanation: "There are approximately 4 weeks in a month.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: "multiple-choice" as QuestionType, question: "How many inches in a foot?", options: ["10", "12", "15", "20"], correctAnswer: "12", explanation: "There are 12 inches in a foot.", xp: 20 })];
    return q[idx];
  })},
  { start: 46, end: 50, type: "multiple-choice", topic: "Problem Solving", questions: Array(10).fill(null).map((_, idx) => {
    const q = [(id: string, levelId: number): Question => ({ id, levelId, type: "multiple-choice" as QuestionType, question: "If you have 3 apples and get 2 more, how many do you have?", options: ["3", "4", "5", "6"], correctAnswer: "5", explanation: "3 + 2 = 5 apples.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: "multiple-choice" as QuestionType, question: "If a bus leaves at 2:00 and arrives at 3:30, how long was the trip?", options: ["1 hour", "1.5 hours", "2 hours", "2.5 hours"], correctAnswer: "1.5 hours", explanation: "3:30 - 2:00 = 1.5 hours.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: "multiple-choice" as QuestionType, question: "If you have 10 cookies and eat 3, how many are left?", options: ["5", "6", "7", "8"], correctAnswer: "7", explanation: "10 - 3 = 7 cookies.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: "multiple-choice" as QuestionType, question: "Sarah has 5 toys and gets 3 more. How many toys does she have?", options: ["6", "7", "8", "9"], correctAnswer: "8", explanation: "5 + 3 = 8 toys.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: "multiple-choice" as QuestionType, question: "If a book has 20 pages and you read 8, how many pages are left?", options: ["10", "11", "12", "13"], correctAnswer: "12", explanation: "20 - 8 = 12 pages.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: "multiple-choice" as QuestionType, question: "Tom has 4 pencils. His friend gives him 4 more. How many does he have?", options: ["6", "7", "8", "9"], correctAnswer: "8", explanation: "4 + 4 = 8 pencils.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: "multiple-choice" as QuestionType, question: "A train leaves at 1:00 PM and arrives at 4:00 PM. How long was the trip?", options: ["2 hours", "3 hours", "4 hours", "5 hours"], correctAnswer: "3 hours", explanation: "4:00 - 1:00 = 3 hours.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: "multiple-choice" as QuestionType, question: "If you save $5 each week for 4 weeks, how much do you have?", options: ["$15", "$20", "$25", "$30"], correctAnswer: "$20", explanation: "5 × 4 = $20.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: "multiple-choice" as QuestionType, question: "A box has 12 crayons. You give 3 to a friend. How many are left?", options: ["7", "8", "9", "10"], correctAnswer: "9", explanation: "12 - 3 = 9 crayons.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: "multiple-choice" as QuestionType, question: "If 6 birds are on a tree and 3 fly away, how many are left?", options: ["2", "3", "4", "5"], correctAnswer: "3", explanation: "6 - 3 = 3 birds.", xp: 20 })];
    return q[idx];
  })}
]

for (const theme of unitThemes) {
  for (let levelId = theme.start; levelId <= theme.end; levelId++) {
    if (!levelContent[levelId]) {
      levelContent[levelId] = {
        title: `Level ${levelId} - ${theme.topic}`,
        introduction: {
          title: `Welcome to Level ${levelId}!`,
          content: [
            `This lesson covers ${theme.topic}.`,
            "Try your best to answer each question!"
          ],
          examples: []
        },
  questions: theme.questions.map(fn => fn(`${levelId}-1`, levelId) as Question)
      }
    }
  }
}

// Helper function to get questions for a level
export function getQuestionsForLevel(levelId: number): Question[] {
  const level = levelContent[levelId as keyof typeof levelContent]
  return level ? level.questions : []
}

// Helper function to get introduction for a level
export function getIntroductionForLevel(levelId: number) {
  const level = levelContent[levelId as keyof typeof levelContent]
  return level ? level.introduction : null
}
