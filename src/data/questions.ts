// Question database for all levels - Curriculum Aligned
// Complete 50-level progressive math curriculum

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
  | 'block-stacking'
  | 'number-line-placement'
  | 'ten-frame'

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
  // Block-stacking
  operation?: 'add' | 'subtract' // For block-stacking questions
  firstNumber?: number // First number in operation
  secondNumber?: number // Second number in operation
  // Number line placement
  numberLineMin?: number // Minimum value on number line
  numberLineMax?: number // Maximum value on number line
  correctPosition?: number // The correct number to place on the line
  // Ten frame
  // correctPosition reused for ten-frame (number of dots to show)
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
  // UNIT 1: NUMBERS 1-10 (Levels 1-5)
  1: {
    title: "Numbers 1-10: Counting Basics",
    introduction: {
      title: "Let's Learn to Count!",
      content: [
        "Numbers help us count things!",
        "We use numbers everywhere: counting toys, friends, and stars!",
        "Let's practice counting from 1 to 10!"
      ],
      examples: [
        { number: "1", visual: "●", word: "one" },
        { number: "3", visual: "●●●", word: "three" },
        { number: "5", visual: "●●●●●", word: "five" }
      ]
    },
    questions: [
      {
        id: "1-1",
        levelId: 1,
        type: "visual-count" as QuestionType,
        question: "How many stars?",
        visualContent: "⭐",
        options: ["0", "1", "2", "3"],
        correctAnswer: "1",
        explanation: "There is 1 star!",
        xp: 10
      },
      {
        id: "1-2",
        levelId: 1,
        type: "fill-blank" as QuestionType,
        question: "2 + 0 = ___",
        correctAnswer: "2",
        explanation: "When we add 0, the number stays the same!",
        xp: 10
      },
      {
        id: "1-3",
        levelId: 1,
        type: "number-sequence" as QuestionType,
        question: "What comes after 2?",
        options: ["1", "2", "3", "4"],
        correctAnswer: "3",
        explanation: "After 2 comes 3!",
        xp: 10
      },
      {
        id: "1-4",
        levelId: 1,
        type: "ten-frame" as QuestionType,
        question: "Show 3 in the ten frame",
        correctPosition: 3,
        xp: 15
      },
      {
        id: "1-5",
        levelId: 1,
        type: "number-sequence" as QuestionType,
        question: "What comes after 4?",
        options: ["3", "4", "5", "6"],
        correctAnswer: "5",
        explanation: "After 4 comes 5!",
        xp: 10
      },
      {
        id: "1-7",
        levelId: 1,
        type: "number-sequence" as QuestionType,
        question: "What comes after 5?",
        options: ["4", "5", "6", "7"],
        correctAnswer: "6",
        explanation: "After 5 comes 6!",
        xp: 10
      },
      {
        id: "1-8",
        levelId: 1,
        type: "multiple-choice" as QuestionType,
        question: "Which number is bigger: 3 or 7?",
        options: ["3", "7", "They are the same", "0"],
        correctAnswer: "7",
        explanation: "7 is bigger than 3!",
        xp: 10
      },
      {
        id: "1-9",
        levelId: 1,
        type: "visual-count" as QuestionType,
        question: "Count the stars",
        visualContent: "⭐⭐⭐⭐⭐",
        options: ["4", "5", "6", "7"],
        correctAnswer: "5",
        explanation: "There are 5 stars!",
        xp: 10
      },
      {
        id: "1-10",
        levelId: 1,
        type: "number-sequence" as QuestionType,
        question: "What comes after 6?",
        options: ["5", "6", "7", "8"],
        correctAnswer: "7",
        explanation: "After 6 comes 7!",
        xp: 10
      }
    ]
  },

  2: {
    title: "Numbers 1-10: Counting to 10",
    introduction: {
      title: "Counting Higher!",
      content: [
        "Now let's count to 10!",
        "We're learning the bigger numbers!",
        "Can you count all the way to 10?"
      ],
      examples: [
        { number: "6", visual: "●●●●●●", word: "six" },
        { number: "8", visual: "●●●●●●●●", word: "eight" },
        { number: "10", visual: "●●●●●●●●●●", word: "ten" }
      ]
    },
    questions: [
      {
        id: "2-1",
        levelId: 2,
        type: "multiple-choice" as QuestionType,
        question: "Which is the correct way to write six?",
        options: ["5", "6", "7", "8"],
        correctAnswer: "6",
        explanation: "Six is written as 6!",
        xp: 10
      },
      {
        id: "2-2",
        levelId: 2,
        type: "number-sequence" as QuestionType,
        question: "What comes after 7?",
        options: ["6", "7", "8", "9"],
        correctAnswer: "8",
        explanation: "After 7 comes 8!",
        xp: 10
      },
      {
        id: "2-3",
        levelId: 2,
        type: "fill-blank" as QuestionType,
        question: "1 + 6 = ___",
        correctAnswer: "7",
        explanation: "1 plus 6 equals 7!",
        xp: 10
      },
      {
        id: "2-4",
        levelId: 2,
        type: "number-sequence" as QuestionType,
        question: "What comes after 8?",
        options: ["7", "8", "9", "10"],
        correctAnswer: "9",
        explanation: "After 8 comes 9!",
        xp: 10
      },
      {
        id: "2-5",
        levelId: 2,
        type: "multiple-choice" as QuestionType,
        question: "Which number comes between 7 and 9?",
        options: ["6", "7", "8", "9"],
        correctAnswer: "8",
        explanation: "8 comes between 7 and 9!",
        xp: 10
      },
      {
        id: "2-6",
        levelId: 2,
        type: "number-line-placement" as QuestionType,
        question: "Where does 5 go on the number line?",
        numberLineMin: 0,
        numberLineMax: 10,
        correctPosition: 5,
        xp: 15
      },
      {
        id: "2-7",
        levelId: 2,
        type: "number-sequence" as QuestionType,
        question: "What comes after 9?",
        options: ["8", "9", "10", "11"],
        correctAnswer: "10",
        explanation: "After 9 comes 10!",
        xp: 10
      },
      {
        id: "2-7",
        levelId: 2,
        type: "visual-count" as QuestionType,
        question: "Count the stars",
        visualContent: "⭐⭐⭐⭐⭐⭐⭐⭐⭐",
        options: ["8", "9", "10", "11"],
        correctAnswer: "9",
        explanation: "There are 9 stars!",
        xp: 10
      },
      {
        id: "2-8",
        levelId: 2,
        type: "multiple-choice" as QuestionType,
        question: "Which number is bigger: 5 or 9?",
        options: ["5", "9", "They are the same", "0"],
        correctAnswer: "9",
        explanation: "9 is bigger than 5!",
        xp: 10
      },
      {
        id: "2-9",
        levelId: 2,
        type: "visual-count" as QuestionType,
        question: "Count all the stars!",
        visualContent: "⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐",
        options: ["8", "9", "10", "11"],
        correctAnswer: "10",
        explanation: "There are 10 stars! Perfect count!",
        xp: 10
      },
      {
        id: "2-10",
        levelId: 2,
        type: "number-sequence" as QuestionType,
        question: "What comes before 5?",
        options: ["3", "4", "5", "6"],
        correctAnswer: "4",
        explanation: "Before 5 comes 4!",
        xp: 10
      }
    ]
  },

  3: {
    title: "Numbers: Comparing",
    introduction: {
      title: "Which is Bigger?",
      content: [
        "Let's compare numbers!",
        "Is 3 bigger than 2? Yes!",
        "Is 4 bigger than 9? No!"
      ],
      examples: [
        { number: "4 > 2", visual: "●●●● is more than ●●", word: "4 is bigger" },
        { number: "5 > 3", visual: "●●●●● is more than ●●●", word: "5 is bigger" },
        { number: "7 > 6", visual: "●●●●●●● is more than ●●●●●●", word: "7 is bigger" }
      ]
    },
    questions: [
      {
        id: "3-1",
        levelId: 3,
        type: "multiple-choice" as QuestionType,
        question: "Which is bigger: 2 or 5?",
        options: ["2", "5", "They are the same", "0"],
        correctAnswer: "5",
        explanation: "5 is bigger than 2!",
        xp: 10
      },
      {
        id: "3-2",
        levelId: 3,
        type: "multiple-choice" as QuestionType,
        question: "Which is smaller: 4 or 7?",
        options: ["4", "7", "They are the same", "0"],
        correctAnswer: "4",
        explanation: "4 is smaller than 7!",
        xp: 10
      },
      {
        id: "3-3",
        levelId: 3,
        type: "multiple-choice" as QuestionType,
        question: "Which is bigger: 6 or 3?",
        options: ["3", "6", "They are the same", "0"],
        correctAnswer: "6",
        explanation: "6 is bigger than 3!",
        xp: 10
      },
      {
        id: "3-4",
        levelId: 3,
        type: "multiple-choice" as QuestionType,
        question: "Which is smaller: 1 or 8?",
        options: ["1", "8", "They are the same", "0"],
        correctAnswer: "1",
        explanation: "1 is smaller than 8!",
        xp: 10
      },
      {
        id: "3-5",
        levelId: 3,
        type: "multiple-choice" as QuestionType,
        question: "Are 5 and 5 the same?",
        options: ["Yes", "No", "Maybe", "I don't know"],
        correctAnswer: "Yes",
        explanation: "Yes! 5 equals 5!",
        xp: 10
      },
      {
        id: "3-6",
        levelId: 3,
        type: "multiple-choice" as QuestionType,
        question: "Which is bigger: 9 or 2?",
        options: ["2", "9", "They are the same", "0"],
        correctAnswer: "9",
        explanation: "9 is bigger than 2!",
        xp: 10
      },
      {
        id: "3-7",
        levelId: 3,
        type: "multiple-choice" as QuestionType,
        question: "Which is smaller: 10 or 6?",
        options: ["6", "10", "They are the same", "0"],
        correctAnswer: "6",
        explanation: "6 is smaller than 10!",
        xp: 10
      },
      {
        id: "3-8",
        levelId: 3,
        type: "multiple-choice" as QuestionType,
        question: "Are 3 and 8 the same?",
        options: ["Yes", "No", "Maybe", "I don't know"],
        correctAnswer: "No",
        explanation: "No! 3 and 8 are different!",
        xp: 10
      },
      {
        id: "3-9",
        levelId: 3,
        type: "multiple-choice" as QuestionType,
        question: "Which is bigger: 7 or 7?",
        options: ["First 7", "Second 7", "They are the same", "Neither"],
        correctAnswer: "They are the same",
        explanation: "They are equal! Both are 7!",
        xp: 10
      },
      {
        id: "3-10",
        levelId: 3,
        type: "number-line-placement" as QuestionType,
        question: "Where does 8 go on the number line?",
        numberLineMin: 0,
        numberLineMax: 10,
        correctPosition: 8,
        xp: 15
      }
    ]
  },

  // UNIT 2: ADDITION BASICS (Levels 4-5, continuing later levels are Levels 6-10)
  4: {
    title: "Addition: First Steps",
    introduction: {
      title: "Adding Numbers!",
      content: [
        "Addition means putting numbers together!",
        "When we add, we combine two groups!",
        "The + symbol means 'plus' or 'add'!"
      ],
      examples: [
        { number: "1 + 1", visual: "● + ● = ●●", word: "equals 2" },
        { number: "2 + 1", visual: "●● + ● = ●●●", word: "equals 3" },
        { number: "1 + 2", visual: "● + ●● = ●●●", word: "equals 3" }
      ]
    },
    questions: [
      {
        id: "4-1",
        levelId: 4,
        type: "multiple-choice" as QuestionType,
        question: "What is 1 + 1?",
        options: ["1", "2", "3", "4"],
        correctAnswer: "2",
        explanation: "1 + 1 = 2! One thing plus one thing equals two things!",
        xp: 10
      },
      {
        id: "4-2",
        levelId: 4,
        type: "multiple-choice" as QuestionType,
        question: "What is 2 + 1?",
        options: ["1", "2", "3", "4"],
        correctAnswer: "3",
        explanation: "2 + 1 = 3! Start at 2, then count up 1 more!",
        xp: 10
      },
      {
        id: "4-3",
        levelId: 4,
        type: "multiple-choice" as QuestionType,
        question: "What is 1 + 2?",
        options: ["1", "2", "3", "4"],
        correctAnswer: "3",
        explanation: "1 + 2 = 3! We get the same answer!",
        xp: 10
      },
      {
        id: "4-4",
        levelId: 4,
        type: "multiple-choice" as QuestionType,
        question: "What is 2 + 2?",
        options: ["2", "3", "4", "5"],
        correctAnswer: "4",
        explanation: "2 + 2 = 4! Two plus two equals four!",
        xp: 10
      },
      {
        id: "4-5",
        levelId: 4,
        type: "multiple-choice" as QuestionType,
        question: "What is 0 + 3?",
        options: ["1", "2", "3", "4"],
        correctAnswer: "3",
        explanation: "0 + 3 = 3! Adding zero doesn't change the number!",
        xp: 10
      },
      {
        id: "4-6",
        levelId: 4,
        type: "multiple-choice" as QuestionType,
        question: "What is 3 + 1?",
        options: ["2", "3", "4", "5"],
        correctAnswer: "4",
        explanation: "3 + 1 = 4! Start at 3, then count up 1 more!",
        xp: 10
      },
      {
        id: "4-7",
        levelId: 4,
        type: "multiple-choice" as QuestionType,
        question: "What is 1 + 3?",
        options: ["2", "3", "4", "5"],
        correctAnswer: "4",
        explanation: "1 + 3 = 4! The order doesn't matter!",
        xp: 10
      },
      {
        id: "4-8",
        levelId: 4,
        type: "multiple-choice" as QuestionType,
        question: "What is 2 + 3?",
        options: ["3", "4", "5", "6"],
        correctAnswer: "5",
        explanation: "2 + 3 = 5! Count: 2... 3, 4, 5!",
        xp: 10
      },
      {
        id: "4-9",
        levelId: 4,
        type: "multiple-choice" as QuestionType,
        question: "What is 3 + 2?",
        options: ["3", "4", "5", "6"],
        correctAnswer: "5",
        explanation: "3 + 2 = 5! Same as 2 + 3!",
        xp: 10
      },
      {
        id: "4-10",
        levelId: 4,
        type: "multiple-choice" as QuestionType,
        question: "What is 1 + 4?",
        options: ["4", "5", "6", "7"],
        correctAnswer: "5",
        explanation: "1 + 4 = 5! Great adding!",
        xp: 10
      }
    ]
  },

  5: {
    title: "Addition: Sums to 10",
    introduction: {
      title: "Adding to Make 10!",
      content: [
        "Let's add bigger numbers!",
        "We're practicing making 10!",
        "Finding 'pairs' that make 10 is super helpful!"
      ],
      examples: [
        { number: "3 + 3", visual: "●●● + ●●● = ●●●●●●", word: "equals 6" },
        { number: "4 + 5", visual: "●●●● + ●●●●● = ●●●●●●●●●", word: "equals 9" },
        { number: "5 + 5", visual: "●●●●● + ●●●●● = ●●●●●●●●●●", word: "equals 10" }
      ]
    },
    questions: [
      {
        id: "5-1",
        levelId: 5,
        type: "multiple-choice" as QuestionType,
        question: "What is 3 + 3?",
        options: ["4", "5", "6", "7"],
        correctAnswer: "6",
        explanation: "3 + 3 = 6! This is called 'double 3'!",
        xp: 10
      },
      {
        id: "5-2",
        levelId: 5,
        type: "multiple-choice" as QuestionType,
        question: "What is 4 + 3?",
        options: ["5", "6", "7", "8"],
        correctAnswer: "7",
        explanation: "4 + 3 = 7! Count from 4: 5, 6, 7!",
        xp: 10
      },
      {
        id: "5-3",
        levelId: 5,
        type: "multiple-choice" as QuestionType,
        question: "What is 5 + 2?",
        options: ["6", "7", "8", "9"],
        correctAnswer: "7",
        explanation: "5 + 2 = 7! Start at 5: 6, 7!",
        xp: 10
      },
      {
        id: "5-4",
        levelId: 5,
        type: "multiple-choice" as QuestionType,
        question: "What is 5 + 4?",
        options: ["7", "8", "9", "10"],
        correctAnswer: "9",
        explanation: "5 + 4 = 9! Great work!",
        xp: 10
      },
      {
        id: "5-5",
        levelId: 5,
        type: "multiple-choice" as QuestionType,
        question: "What is 5 + 5?",
        options: ["8", "9", "10", "11"],
        correctAnswer: "10",
        explanation: "5 + 5 = 10! Double 5 equals 10! Perfect!",
        xp: 10
      },
      {
        id: "5-6",
        levelId: 5,
        type: "multiple-choice" as QuestionType,
        question: "What is 6 + 3?",
        options: ["7", "8", "9", "10"],
        correctAnswer: "9",
        explanation: "6 + 3 = 9! Count from 6: 7, 8, 9!",
        xp: 10
      },
      {
        id: "5-7",
        levelId: 5,
        type: "multiple-choice" as QuestionType,
        question: "What is 4 + 4?",
        options: ["6", "7", "8", "9"],
        correctAnswer: "8",
        explanation: "4 + 4 = 8! This is 'double 4'!",
        xp: 10
      },
      {
        id: "5-8",
        levelId: 5,
        type: "multiple-choice" as QuestionType,
        question: "What is 6 + 4?",
        options: ["8", "9", "10", "11"],
        correctAnswer: "10",
        explanation: "6 + 4 = 10! Another way to make 10!",
        xp: 10
      },
      {
        id: "5-9",
        levelId: 5,
        type: "multiple-choice" as QuestionType,
        question: "What is 7 + 3?",
        options: ["8", "9", "10", "11"],
        correctAnswer: "10",
        explanation: "7 + 3 = 10! One more way to make 10!",
        xp: 10
      },
      {
        id: "5-10",
        levelId: 5,
        type: "number-line-placement" as QuestionType,
        question: "Where does 3 go on the number line?",
        numberLineMin: 0,
        numberLineMax: 10,
        correctPosition: 3,
        xp: 15
      }
    ]
  },

  6: {
    title: "Addition: Sums up to 15",
    introduction: {
      title: "Adding Bigger Numbers!",
      content: [
        "Now we're adding numbers that go past 10!",
        "These are called 'addition facts'!",
        "Let's practice adding to 15!"
      ],
      examples: [
        { number: "6 + 4", visual: "●●●●●● + ●●●● = ●●●●●●●●●●", word: "equals 10" },
        { number: "7 + 5", visual: "●●●●●●● + ●●●●● = ●●●●●●●●●●●●", word: "equals 12" },
        { number: "8 + 7", visual: "●●●●●●●● + ●●●●●●● = ●●●●●●●●●●●●●●●", word: "equals 15" }
      ]
    },
    questions: [
      {
        id: "6-1",
        levelId: 6,
        type: "multiple-choice" as QuestionType,
        question: "What is 6 + 5?",
        options: ["10", "11", "12", "13"],
        correctAnswer: "11",
        explanation: "6 + 5 = 11! Start at 6 and count: 7, 8, 9, 10, 11!",
        xp: 15
      },
      {
        id: "6-2",
        levelId: 6,
        type: "multiple-choice" as QuestionType,
        question: "What is 7 + 4?",
        options: ["10", "11", "12", "13"],
        correctAnswer: "11",
        explanation: "7 + 4 = 11! Excellent!",
        xp: 15
      },
      {
        id: "6-3",
        levelId: 6,
        type: "multiple-choice" as QuestionType,
        question: "What is 7 + 5?",
        options: ["11", "12", "13", "14"],
        correctAnswer: "12",
        explanation: "7 + 5 = 12! Great adding!",
        xp: 15
      },
      {
        id: "6-4",
        levelId: 6,
        type: "multiple-choice" as QuestionType,
        question: "What is 8 + 4?",
        options: ["11", "12", "13", "14"],
        correctAnswer: "12",
        explanation: "8 + 4 = 12! Perfect!",
        xp: 15
      },
      {
        id: "6-5",
        levelId: 6,
        type: "multiple-choice" as QuestionType,
        question: "What is 8 + 5?",
        options: ["12", "13", "14", "15"],
        correctAnswer: "13",
        explanation: "8 + 5 = 13! You're doing great!",
        xp: 15
      },
      {
        id: "6-6",
        levelId: 6,
        type: "multiple-choice" as QuestionType,
        question: "What is 7 + 6?",
        options: ["12", "13", "14", "15"],
        correctAnswer: "13",
        explanation: "7 + 6 = 13! Almost to 15!",
        xp: 15
      },
      {
        id: "6-7",
        levelId: 6,
        type: "multiple-choice" as QuestionType,
        question: "What is 8 + 6?",
        options: ["13", "14", "15", "16"],
        correctAnswer: "14",
        explanation: "8 + 6 = 14! One more!",
        xp: 15
      },
      {
        id: "6-8",
        levelId: 6,
        type: "multiple-choice" as QuestionType,
        question: "What is 9 + 5?",
        options: ["13", "14", "15", "16"],
        correctAnswer: "14",
        explanation: "9 + 5 = 14! You're amazing!",
        xp: 15
      },
      {
        id: "6-9",
        levelId: 6,
        type: "multiple-choice" as QuestionType,
        question: "What is 8 + 7?",
        options: ["14", "15", "16", "17"],
        correctAnswer: "15",
        explanation: "8 + 7 = 15! Perfect sum!",
        xp: 15
      },
      {
        id: "6-10",
        levelId: 6,
        type: "multiple-choice" as QuestionType,
        question: "What is 9 + 6?",
        options: ["14", "15", "16", "17"],
        correctAnswer: "15",
        explanation: "9 + 6 = 15! Another way to make 15!",
        xp: 15
      }
    ]
  },

  7: {
    title: "Addition: Sums up to 20",
    introduction: {
      title: "Adding to Make 20!",
      content: [
        "We're going even higher with addition!",
        "Let's make numbers up to 20!",
        "These are great addition facts to remember!"
      ],
      examples: [
        { number: "10 + 5", visual: "●●●●●●●●●● + ●●●●● = ●●●●●●●●●●●●●●●", word: "equals 15" },
        { number: "9 + 9", visual: "●●●●●●●●● + ●●●●●●●●● = ●●●●●●●●●●●●●●●●●●", word: "equals 18" },
        { number: "10 + 10", visual: "●●●●●●●●●● + ●●●●●●●●●● = ●●●●●●●●●●●●●●●●●●●●", word: "equals 20" }
      ]
    },
    questions: [
      {
        id: "7-1",
        levelId: 7,
        type: "multiple-choice" as QuestionType,
        question: "What is 9 + 7?",
        options: ["15", "16", "17", "18"],
        correctAnswer: "16",
        explanation: "9 + 7 = 16! Good job!",
        xp: 15
      },
      {
        id: "7-2",
        levelId: 7,
        type: "multiple-choice" as QuestionType,
        question: "What is 8 + 8?",
        options: ["15", "16", "17", "18"],
        correctAnswer: "16",
        explanation: "8 + 8 = 16! Double 8 is 16!",
        xp: 15
      },
      {
        id: "7-3",
        levelId: 7,
        type: "multiple-choice" as QuestionType,
        question: "What is 9 + 8?",
        options: ["16", "17", "18", "19"],
        correctAnswer: "17",
        explanation: "9 + 8 = 17! Almost to 20!",
        xp: 15
      },
      {
        id: "7-4",
        levelId: 7,
        type: "multiple-choice" as QuestionType,
        question: "What is 10 + 7?",
        options: ["16", "17", "18", "19"],
        correctAnswer: "17",
        explanation: "10 + 7 = 17! Adding 10 is easy!",
        xp: 15
      },
      {
        id: "7-5",
        levelId: 7,
        type: "multiple-choice" as QuestionType,
        question: "What is 9 + 9?",
        options: ["17", "18", "19", "20"],
        correctAnswer: "18",
        explanation: "9 + 9 = 18! Double 9 is 18!",
        xp: 15
      },
      {
        id: "7-6",
        levelId: 7,
        type: "multiple-choice" as QuestionType,
        question: "What is 10 + 8?",
        options: ["17", "18", "19", "20"],
        correctAnswer: "18",
        explanation: "10 + 8 = 18! Good!",
        xp: 15
      },
      {
        id: "7-7",
        levelId: 7,
        type: "multiple-choice" as QuestionType,
        question: "What is 10 + 9?",
        options: ["18", "19", "20", "21"],
        correctAnswer: "19",
        explanation: "10 + 9 = 19! One away from 20!",
        xp: 15
      },
      {
        id: "7-8",
        levelId: 7,
        type: "multiple-choice" as QuestionType,
        question: "What is 10 + 10?",
        options: ["18", "19", "20", "21"],
        correctAnswer: "20",
        explanation: "10 + 10 = 20! Perfect! Double 10 is 20!",
        xp: 15
      },
      {
        id: "7-9",
        levelId: 7,
        type: "multiple-choice" as QuestionType,
        question: "What is 6 + 10?",
        options: ["15", "16", "17", "18"],
        correctAnswer: "16",
        explanation: "6 + 10 = 16! The order doesn't matter!",
        xp: 15
      },
      {
        id: "7-10",
        levelId: 7,
        type: "multiple-choice" as QuestionType,
        question: "What is 5 + 10?",
        options: ["14", "15", "16", "17"],
        correctAnswer: "15",
        explanation: "5 + 10 = 15! Addition master!",
        xp: 15
      }
    ]
  },

  8: {
    title: "Subtraction: First Steps",
    introduction: {
      title: "Taking Away!",
      content: [
        "Subtraction means taking away!",
        "When we subtract, we find how many are left!",
        "The - symbol means 'minus' or 'take away'!"
      ],
      examples: [
        { number: "3 - 1", visual: "●●● - ● = ●●", word: "equals 2" },
        { number: "5 - 2", visual: "●●●●● - ●● = ●●●", word: "equals 3" },
        { number: "4 - 3", visual: "●●●● - ●●● = ●", word: "equals 1" }
      ]
    },
    questions: [
      {
        id: "8-1",
        levelId: 8,
        type: "multiple-choice" as QuestionType,
        question: "What is 2 - 1?",
        options: ["0", "1", "2", "3"],
        correctAnswer: "1",
        explanation: "2 - 1 = 1! Start at 2, take away 1, you have 1 left!",
        xp: 15
      },
      {
        id: "8-2",
        levelId: 8,
        type: "multiple-choice" as QuestionType,
        question: "What is 3 - 1?",
        options: ["1", "2", "3", "4"],
        correctAnswer: "2",
        explanation: "3 - 1 = 2! Take one away from three!",
        xp: 15
      },
      {
        id: "8-3",
        levelId: 8,
        type: "multiple-choice" as QuestionType,
        question: "What is 3 - 2?",
        options: ["0", "1", "2", "3"],
        correctAnswer: "1",
        explanation: "3 - 2 = 1! Take two away from three!",
        xp: 15
      },
      {
        id: "8-4",
        levelId: 8,
        type: "multiple-choice" as QuestionType,
        question: "What is 4 - 1?",
        options: ["2", "3", "4", "5"],
        correctAnswer: "3",
        explanation: "4 - 1 = 3! Start at 4, go back 1!",
        xp: 15
      },
      {
        id: "8-5",
        levelId: 8,
        type: "multiple-choice" as QuestionType,
        question: "What is 5 - 1?",
        options: ["3", "4", "5", "6"],
        correctAnswer: "4",
        explanation: "5 - 1 = 4! Take one away from five!",
        xp: 15
      },
      {
        id: "8-6",
        levelId: 8,
        type: "multiple-choice" as QuestionType,
        question: "What is 5 - 2?",
        options: ["2", "3", "4", "5"],
        correctAnswer: "3",
        explanation: "5 - 2 = 3! Take two away from five!",
        xp: 15
      },
      {
        id: "8-7",
        levelId: 8,
        type: "multiple-choice" as QuestionType,
        question: "What is 4 - 2?",
        options: ["1", "2", "3", "4"],
        correctAnswer: "2",
        explanation: "4 - 2 = 2! Take two away from four!",
        xp: 15
      },
      {
        id: "8-8",
        levelId: 8,
        type: "multiple-choice" as QuestionType,
        question: "What is 6 - 2?",
        options: ["3", "4", "5", "6"],
        correctAnswer: "4",
        explanation: "6 - 2 = 4! Go back 2 from 6!",
        xp: 15
      },
      {
        id: "8-9",
        levelId: 8,
        type: "multiple-choice" as QuestionType,
        question: "What is 6 - 3?",
        options: ["2", "3", "4", "5"],
        correctAnswer: "3",
        explanation: "6 - 3 = 3! Half of 6 is 3!",
        xp: 15
      },
      {
        id: "8-10",
        levelId: 8,
        type: "multiple-choice" as QuestionType,
        question: "What is 5 - 3?",
        options: ["1", "2", "3", "4"],
        correctAnswer: "2",
        explanation: "5 - 3 = 2! Great subtraction!",
        xp: 15
      }
    ]
  },

  9: {
    title: "Subtraction: From 10s",
    introduction: {
      title: "Taking Away from 10!",
      content: [
        "Let's subtract from 10!",
        "These are very useful facts!",
        "Try to remember these!"
      ],
      examples: [
        { number: "10 - 3", visual: "●●●●●●●●●● - ●●● = ●●●●●●●", word: "equals 7" },
        { number: "10 - 5", visual: "●●●●●●●●●● - ●●●●● = ●●●●●", word: "equals 5" },
        { number: "10 - 7", visual: "●●●●●●●●●● - ●●●●●●● = ●●●", word: "equals 3" }
      ]
    },
    questions: [
      {
        id: "9-1",
        levelId: 9,
        type: "multiple-choice" as QuestionType,
        question: "What is 10 - 1?",
        options: ["8", "9", "10", "11"],
        correctAnswer: "9",
        explanation: "10 - 1 = 9! Start at 10, go back 1!",
        xp: 15
      },
      {
        id: "9-2",
        levelId: 9,
        type: "multiple-choice" as QuestionType,
        question: "What is 10 - 2?",
        options: ["7", "8", "9", "10"],
        correctAnswer: "8",
        explanation: "10 - 2 = 8! Go back 2 from 10!",
        xp: 15
      },
      {
        id: "9-3",
        levelId: 9,
        type: "multiple-choice" as QuestionType,
        question: "What is 10 - 3?",
        options: ["6", "7", "8", "9"],
        correctAnswer: "7",
        explanation: "10 - 3 = 7! Take three away from ten!",
        xp: 15
      },
      {
        id: "9-4",
        levelId: 9,
        type: "multiple-choice" as QuestionType,
        question: "What is 10 - 4?",
        options: ["5", "6", "7", "8"],
        correctAnswer: "6",
        explanation: "10 - 4 = 6! Excellent!",
        xp: 15
      },
      {
        id: "9-5",
        levelId: 9,
        type: "multiple-choice" as QuestionType,
        question: "What is 10 - 5?",
        options: ["4", "5", "6", "7"],
        correctAnswer: "5",
        explanation: "10 - 5 = 5! Half of 10 is 5!",
        xp: 15
      },
      {
        id: "9-6",
        levelId: 9,
        type: "multiple-choice" as QuestionType,
        question: "What is 10 - 6?",
        options: ["3", "4", "5", "6"],
        correctAnswer: "4",
        explanation: "10 - 6 = 4! Great work!",
        xp: 15
      },
      {
        id: "9-7",
        levelId: 9,
        type: "multiple-choice" as QuestionType,
        question: "What is 10 - 7?",
        options: ["2", "3", "4", "5"],
        correctAnswer: "3",
        explanation: "10 - 7 = 3! You're doing great!",
        xp: 15
      },
      {
        id: "9-8",
        levelId: 9,
        type: "multiple-choice" as QuestionType,
        question: "What is 10 - 8?",
        options: ["1", "2", "3", "4"],
        correctAnswer: "2",
        explanation: "10 - 8 = 2! Perfect!",
        xp: 15
      },
      {
        id: "9-9",
        levelId: 9,
        type: "multiple-choice" as QuestionType,
        question: "What is 10 - 9?",
        options: ["0", "1", "2", "3"],
        correctAnswer: "1",
        explanation: "10 - 9 = 1! Almost all taken away!",
        xp: 15
      },
      {
        id: "9-10",
        levelId: 9,
        type: "multiple-choice" as QuestionType,
        question: "What is 10 - 10?",
        options: ["0", "1", "2", "3"],
        correctAnswer: "0",
        explanation: "10 - 10 = 0! When you take everything away, you have nothing!",
        xp: 15
      }
    ]
  },

  10: {
    title: "Subtraction: All the Facts",
    introduction: {
      title: "Subtraction Master!",
      content: [
        "You've learned so much subtraction!",
        "Now let's practice all kinds of subtraction!",
        "You're becoming a subtraction expert!"
      ],
      examples: [
        { number: "8 - 3", visual: "●●●●●●●● - ●●● = ●●●●●", word: "equals 5" },
        { number: "9 - 4", visual: "●●●●●●●●● - ●●●● = ●●●●●", word: "equals 5" },
        { number: "12 - 5", visual: "●●●●●●●●●●●● - ●●●●● = ●●●●●●●", word: "equals 7" }
      ]
    },
    questions: [
      {
        id: "10-1",
        levelId: 10,
        type: "multiple-choice" as QuestionType,
        question: "What is 7 - 2?",
        options: ["4", "5", "6", "7"],
        correctAnswer: "5",
        explanation: "7 - 2 = 5! Go back 2 from 7!",
        xp: 15
      },
      {
        id: "10-2",
        levelId: 10,
        type: "multiple-choice" as QuestionType,
        question: "What is 8 - 3?",
        options: ["4", "5", "6", "7"],
        correctAnswer: "5",
        explanation: "8 - 3 = 5! Take 3 away from 8!",
        xp: 15
      },
      {
        id: "10-3",
        levelId: 10,
        type: "multiple-choice" as QuestionType,
        question: "What is 9 - 3?",
        options: ["5", "6", "7", "8"],
        correctAnswer: "6",
        explanation: "9 - 3 = 6! Great job!",
        xp: 15
      },
      {
        id: "10-4",
        levelId: 10,
        type: "multiple-choice" as QuestionType,
        question: "What is 8 - 4?",
        options: ["3", "4", "5", "6"],
        correctAnswer: "4",
        explanation: "8 - 4 = 4! Half of 8 is 4!",
        xp: 15
      },
      {
        id: "10-5",
        levelId: 10,
        type: "multiple-choice" as QuestionType,
        question: "What is 9 - 4?",
        options: ["4", "5", "6", "7"],
        correctAnswer: "5",
        explanation: "9 - 4 = 5! Excellent!",
        xp: 15
      },
      {
        id: "10-6",
        levelId: 10,
        type: "multiple-choice" as QuestionType,
        question: "What is 12 - 3?",
        options: ["8", "9", "10", "11"],
        correctAnswer: "9",
        explanation: "12 - 3 = 9! You're getting bigger numbers!",
        xp: 15
      },
      {
        id: "10-7",
        levelId: 10,
        type: "multiple-choice" as QuestionType,
        question: "What is 11 - 5?",
        options: ["5", "6", "7", "8"],
        correctAnswer: "6",
        explanation: "11 - 5 = 6! Perfect!",
        xp: 15
      },
      {
        id: "10-8",
        levelId: 10,
        type: "multiple-choice" as QuestionType,
        question: "What is 13 - 4?",
        options: ["8", "9", "10", "11"],
        correctAnswer: "9",
        explanation: "13 - 4 = 9! You're amazing!",
        xp: 15
      },
      {
        id: "10-9",
        levelId: 10,
        type: "multiple-choice" as QuestionType,
        question: "What is 15 - 5?",
        options: ["8", "9", "10", "11"],
        correctAnswer: "10",
        explanation: "15 - 5 = 10! Another way to make 10!",
        xp: 15
      },
      {
        id: "10-10",
        levelId: 10,
        type: "multiple-choice" as QuestionType,
        question: "What is 14 - 6?",
        options: ["7", "8", "9", "10"],
        correctAnswer: "8",
        explanation: "14 - 6 = 8! Subtraction expert!",
        xp: 15
      }
    ]
  },

  // UNIT 3: SUBTRACTION MASTERY (Levels 11-15)
  11: {
    title: "Subtraction: From Bigger Numbers",
    introduction: {
      title: "Subtracting from Larger Numbers!",
      content: [
        "Let's subtract from numbers bigger than 10!",
        "These are slightly trickier, but you can do it!",
        "Remember: start at the bigger number and count back!"
      ],
      examples: [
        { number: "12 - 3", visual: "●●●●●●●●●●●● - ●●● = ●●●●●●●●●", word: "equals 9" },
        { number: "15 - 4", visual: "●●●●●●●●●●●●●●● - ●●●● = ●●●●●●●●●●●", word: "equals 11" },
        { number: "14 - 5", visual: "●●●●●●●●●●●●●● - ●●●●● = ●●●●●●●●●", word: "equals 9" }
      ]
    },
    questions: [
      {
        id: "11-1",
        levelId: 11,
        type: "multiple-choice" as QuestionType,
        question: "What is 11 - 2?",
        options: ["8", "9", "10", "11"],
        correctAnswer: "9",
        explanation: "11 - 2 = 9! Go back 2 from 11!",
        xp: 15
      },
      {
        id: "11-2",
        levelId: 11,
        type: "multiple-choice" as QuestionType,
        question: "What is 12 - 3?",
        options: ["8", "9", "10", "11"],
        correctAnswer: "9",
        explanation: "12 - 3 = 9! Take 3 away from 12!",
        xp: 15
      },
      {
        id: "11-3",
        levelId: 11,
        type: "multiple-choice" as QuestionType,
        question: "What is 13 - 3?",
        options: ["9", "10", "11", "12"],
        correctAnswer: "10",
        explanation: "13 - 3 = 10! Very nice!",
        xp: 15
      },
      {
        id: "11-4",
        levelId: 11,
        type: "multiple-choice" as QuestionType,
        question: "What is 14 - 4?",
        options: ["9", "10", "11", "12"],
        correctAnswer: "10",
        explanation: "14 - 4 = 10! Half of 14 is 7, but this is 14 - 4 = 10!",
        xp: 15
      },
      {
        id: "11-5",
        levelId: 11,
        type: "multiple-choice" as QuestionType,
        question: "What is 13 - 5?",
        options: ["7", "8", "9", "10"],
        correctAnswer: "8",
        explanation: "13 - 5 = 8! Great job!",
        xp: 15
      },
      {
        id: "11-6",
        levelId: 11,
        type: "multiple-choice" as QuestionType,
        question: "What is 15 - 6?",
        options: ["8", "9", "10", "11"],
        correctAnswer: "9",
        explanation: "15 - 6 = 9! Excellent!",
        xp: 15
      },
      {
        id: "11-7",
        levelId: 11,
        type: "multiple-choice" as QuestionType,
        question: "What is 14 - 7?",
        options: ["6", "7", "8", "9"],
        correctAnswer: "7",
        explanation: "14 - 7 = 7! Half of 14!",
        xp: 15
      },
      {
        id: "11-8",
        levelId: 11,
        type: "multiple-choice" as QuestionType,
        question: "What is 16 - 5?",
        options: ["10", "11", "12", "13"],
        correctAnswer: "11",
        explanation: "16 - 5 = 11! You're doing great!",
        xp: 15
      },
      {
        id: "11-9",
        levelId: 11,
        type: "multiple-choice" as QuestionType,
        question: "What is 12 - 4?",
        options: ["7", "8", "9", "10"],
        correctAnswer: "8",
        explanation: "12 - 4 = 8! Good work!",
        xp: 15
      },
      {
        id: "11-10",
        levelId: 11,
        type: "multiple-choice" as QuestionType,
        question: "What is 17 - 6?",
        options: ["10", "11", "12", "13"],
        correctAnswer: "11",
        explanation: "17 - 6 = 11! Subtraction master!",
        xp: 15
      }
    ]
  },

  12: {
    title: "Subtraction: All Facts to 20",
    introduction: {
      title: "Subtraction from 20!",
      content: [
        "We're working with bigger numbers now!",
        "Let's subtract from numbers up to 20!",
        "These facts are important to memorize!"
      ],
      examples: [
        { number: "16 - 3", visual: "●●●●●●●●●●●●●●●● - ●●● = ●●●●●●●●●●●●", word: "equals 13" },
        { number: "18 - 7", visual: "●●●●●●●●●●●●●●●●●● - ●●●●●●● = ●●●●●●●●●●●", word: "equals 11" },
        { number: "20 - 10", visual: "●●●●●●●●●●●●●●●●●●●● - ●●●●●●●●●● = ●●●●●●●●●●", word: "equals 10" }
      ]
    },
    questions: [
      {
        id: "12-1",
        levelId: 12,
        type: "multiple-choice" as QuestionType,
        question: "What is 16 - 4?",
        options: ["11", "12", "13", "14"],
        correctAnswer: "12",
        explanation: "16 - 4 = 12! Good!",
        xp: 15
      },
      {
        id: "12-2",
        levelId: 12,
        type: "multiple-choice" as QuestionType,
        question: "What is 17 - 5?",
        options: ["11", "12", "13", "14"],
        correctAnswer: "12",
        explanation: "17 - 5 = 12! Perfect!",
        xp: 15
      },
      {
        id: "12-3",
        levelId: 12,
        type: "multiple-choice" as QuestionType,
        question: "What is 18 - 4?",
        options: ["13", "14", "15", "16"],
        correctAnswer: "14",
        explanation: "18 - 4 = 14! Nice work!",
        xp: 15
      },
      {
        id: "12-4",
        levelId: 12,
        type: "multiple-choice" as QuestionType,
        question: "What is 19 - 5?",
        options: ["13", "14", "15", "16"],
        correctAnswer: "14",
        explanation: "19 - 5 = 14! Excellent!",
        xp: 15
      },
      {
        id: "12-5",
        levelId: 12,
        type: "multiple-choice" as QuestionType,
        question: "What is 20 - 6?",
        options: ["13", "14", "15", "16"],
        correctAnswer: "14",
        explanation: "20 - 6 = 14! Amazing!",
        xp: 15
      },
      {
        id: "12-6",
        levelId: 12,
        type: "multiple-choice" as QuestionType,
        question: "What is 16 - 8?",
        options: ["7", "8", "9", "10"],
        correctAnswer: "8",
        explanation: "16 - 8 = 8! Half of 16!",
        xp: 15
      },
      {
        id: "12-7",
        levelId: 12,
        type: "multiple-choice" as QuestionType,
        question: "What is 18 - 9?",
        options: ["8", "9", "10", "11"],
        correctAnswer: "9",
        explanation: "18 - 9 = 9! Half of 18!",
        xp: 15
      },
      {
        id: "12-8",
        levelId: 12,
        type: "multiple-choice" as QuestionType,
        question: "What is 20 - 10?",
        options: ["8", "9", "10", "11"],
        correctAnswer: "10",
        explanation: "20 - 10 = 10! Half of 20!",
        xp: 15
      },
      {
        id: "12-9",
        levelId: 12,
        type: "multiple-choice" as QuestionType,
        question: "What is 15 - 8?",
        options: ["6", "7", "8", "9"],
        correctAnswer: "7",
        explanation: "15 - 8 = 7! Good!",
        xp: 15
      },
      {
        id: "12-10",
        levelId: 12,
        type: "multiple-choice" as QuestionType,
        question: "What is 17 - 8?",
        options: ["8", "9", "10", "11"],
        correctAnswer: "9",
        explanation: "17 - 8 = 9! Perfect!",
        xp: 15
      }
    ]
  },

  13: {
    title: "Subtraction: Review & Challenge",
    introduction: {
      title: "Subtraction Challenge!",
      content: [
        "Let's review all our subtraction facts!",
        "These are a mix of easier and harder problems!",
        "You're ready for this!"
      ],
      examples: [
        { number: "11 - 6", visual: "●●●●●●●●●●● - ●●●●●● = ●●●●●", word: "equals 5" },
        { number: "13 - 7", visual: "●●●●●●●●●●●●● - ●●●●●●● = ●●●●●●", word: "equals 6" },
        { number: "19 - 9", visual: "●●●●●●●●●●●●●●●●●● - ●●●●●●●●● = ●●●●●●●●●●", word: "equals 10" }
      ]
    },
    questions: [
      {
        id: "13-1",
        levelId: 13,
        type: "multiple-choice" as QuestionType,
        question: "What is 11 - 3?",
        options: ["7", "8", "9", "10"],
        correctAnswer: "8",
        explanation: "11 - 3 = 8! Good!",
        xp: 15
      },
      {
        id: "13-2",
        levelId: 13,
        type: "multiple-choice" as QuestionType,
        question: "What is 13 - 6?",
        options: ["6", "7", "8", "9"],
        correctAnswer: "7",
        explanation: "13 - 6 = 7! Nice!",
        xp: 15
      },
      {
        id: "13-3",
        levelId: 13,
        type: "multiple-choice" as QuestionType,
        question: "What is 15 - 7?",
        options: ["7", "8", "9", "10"],
        correctAnswer: "8",
        explanation: "15 - 7 = 8! Excellent!",
        xp: 15
      },
      {
        id: "13-4",
        levelId: 13,
        type: "multiple-choice" as QuestionType,
        question: "What is 14 - 6?",
        options: ["7", "8", "9", "10"],
        correctAnswer: "8",
        explanation: "14 - 6 = 8! Great!",
        xp: 15
      },
      {
        id: "13-5",
        levelId: 13,
        type: "multiple-choice" as QuestionType,
        question: "What is 18 - 8?",
        options: ["9", "10", "11", "12"],
        correctAnswer: "10",
        explanation: "18 - 8 = 10! Perfect!",
        xp: 15
      },
      {
        id: "13-6",
        levelId: 13,
        type: "multiple-choice" as QuestionType,
        question: "What is 12 - 7?",
        options: ["4", "5", "6", "7"],
        correctAnswer: "5",
        explanation: "12 - 7 = 5! Good work!",
        xp: 15
      },
      {
        id: "13-7",
        levelId: 13,
        type: "multiple-choice" as QuestionType,
        question: "What is 16 - 9?",
        options: ["6", "7", "8", "9"],
        correctAnswer: "7",
        explanation: "16 - 9 = 7! You're amazing!",
        xp: 15
      },
      {
        id: "13-8",
        levelId: 13,
        type: "multiple-choice" as QuestionType,
        question: "What is 11 - 7?",
        options: ["3", "4", "5", "6"],
        correctAnswer: "4",
        explanation: "11 - 7 = 4! Fantastic!",
        xp: 15
      },
      {
        id: "13-9",
        levelId: 13,
        type: "multiple-choice" as QuestionType,
        question: "What is 14 - 8?",
        options: ["5", "6", "7", "8"],
        correctAnswer: "6",
        explanation: "14 - 8 = 6! Excellent!",
        xp: 15
      },
      {
        id: "13-10",
        levelId: 13,
        type: "multiple-choice" as QuestionType,
        question: "What is 17 - 9?",
        options: ["7", "8", "9", "10"],
        correctAnswer: "8",
        explanation: "17 - 9 = 8! Subtraction expert!",
        xp: 15
      }
    ]
  },

  14: {
    title: "Mixed Operations: Add & Subtract",
    introduction: {
      title: "Adding AND Subtracting!",
      content: [
        "Now we're mixing addition and subtraction!",
        "You'll see different types of problems!",
        "Use everything you've learned!"
      ],
      examples: [
        { number: "8 + 3", visual: "●●●●●●●● + ●●● = ●●●●●●●●●●●", word: "equals 11" },
        { number: "14 - 5", visual: "●●●●●●●●●●●●●● - ●●●●● = ●●●●●●●●●", word: "equals 9" },
        { number: "6 + 7", visual: "●●●●●● + ●●●●●●● = ●●●●●●●●●●●●●", word: "equals 13" }
      ]
    },
    questions: [
      {
        id: "14-1",
        levelId: 14,
        type: "multiple-choice" as QuestionType,
        question: "What is 9 + 6?",
        options: ["14", "15", "16", "17"],
        correctAnswer: "15",
        explanation: "9 + 6 = 15! Great addition!",
        xp: 15
      },
      {
        id: "14-2",
        levelId: 14,
        type: "multiple-choice" as QuestionType,
        question: "What is 18 - 7?",
        options: ["10", "11", "12", "13"],
        correctAnswer: "11",
        explanation: "18 - 7 = 11! Good subtraction!",
        xp: 15
      },
      {
        id: "14-3",
        levelId: 14,
        type: "multiple-choice" as QuestionType,
        question: "What is 7 + 8?",
        options: ["14", "15", "16", "17"],
        correctAnswer: "15",
        explanation: "7 + 8 = 15! Nice!",
        xp: 15
      },
      {
        id: "14-4",
        levelId: 14,
        type: "multiple-choice" as QuestionType,
        question: "What is 13 - 8?",
        options: ["4", "5", "6", "7"],
        correctAnswer: "5",
        explanation: "13 - 8 = 5! Perfect!",
        xp: 15
      },
      {
        id: "14-5",
        levelId: 14,
        type: "multiple-choice" as QuestionType,
        question: "What is 8 + 9?",
        options: ["15", "16", "17", "18"],
        correctAnswer: "17",
        explanation: "8 + 9 = 17! Excellent!",
        xp: 15
      },
      {
        id: "14-6",
        levelId: 14,
        type: "multiple-choice" as QuestionType,
        question: "What is 19 - 8?",
        options: ["10", "11", "12", "13"],
        correctAnswer: "11",
        explanation: "19 - 8 = 11! Good!",
        xp: 15
      },
      {
        id: "14-7",
        levelId: 14,
        type: "multiple-choice" as QuestionType,
        question: "What is 6 + 9?",
        options: ["14", "15", "16", "17"],
        correctAnswer: "15",
        explanation: "6 + 9 = 15! Amazing!",
        xp: 15
      },
      {
        id: "14-8",
        levelId: 14,
        type: "multiple-choice" as QuestionType,
        question: "What is 16 - 7?",
        options: ["8", "9", "10", "11"],
        correctAnswer: "9",
        explanation: "16 - 7 = 9! Great!",
        xp: 15
      },
      {
        id: "14-9",
        levelId: 14,
        type: "multiple-choice" as QuestionType,
        question: "What is 7 + 7?",
        options: ["13", "14", "15", "16"],
        correctAnswer: "14",
        explanation: "7 + 7 = 14! Double 7!",
        xp: 15
      },
      {
        id: "14-10",
        levelId: 14,
        type: "multiple-choice" as QuestionType,
        question: "What is 15 - 9?",
        options: ["5", "6", "7", "8"],
        correctAnswer: "6",
        explanation: "15 - 9 = 6! Excellent work!",
        xp: 15
      }
    ]
  },

  15: {
    title: "Subtraction Mastery Test",
    introduction: {
      title: "You're a Subtraction Master!",
      content: [
        "This is your final subtraction level!",
        "You've learned so much!",
        "Let's prove you know all your subtraction facts!"
      ],
      examples: [
        { number: "15 - 4", visual: "●●●●●●●●●●●●●●● - ●●●● = ●●●●●●●●●●●", word: "equals 11" },
        { number: "11 - 4", visual: "●●●●●●●●●●● - ●●●● = ●●●●●●●", word: "equals 7" },
        { number: "20 - 5", visual: "●●●●●●●●●●●●●●●●●●●● - ●●●●● = ●●●●●●●●●●●●●●●", word: "equals 15" }
      ]
    },
    questions: [
      {
        id: "15-1",
        levelId: 15,
        type: "multiple-choice" as QuestionType,
        question: "What is 20 - 4?",
        options: ["15", "16", "17", "18"],
        correctAnswer: "16",
        explanation: "20 - 4 = 16! Perfect!",
        xp: 20
      },
      {
        id: "15-2",
        levelId: 15,
        type: "multiple-choice" as QuestionType,
        question: "What is 18 - 6?",
        options: ["11", "12", "13", "14"],
        correctAnswer: "12",
        explanation: "18 - 6 = 12! Excellent!",
        xp: 20
      },
      {
        id: "15-3",
        levelId: 15,
        type: "multiple-choice" as QuestionType,
        question: "What is 13 - 4?",
        options: ["8", "9", "10", "11"],
        correctAnswer: "9",
        explanation: "13 - 4 = 9! Great!",
        xp: 20
      },
      {
        id: "15-4",
        levelId: 15,
        type: "multiple-choice" as QuestionType,
        question: "What is 19 - 7?",
        options: ["11", "12", "13", "14"],
        correctAnswer: "12",
        explanation: "19 - 7 = 12! Good work!",
        xp: 20
      },
      {
        id: "15-5",
        levelId: 15,
        type: "multiple-choice" as QuestionType,
        question: "What is 14 - 5?",
        options: ["8", "9", "10", "11"],
        correctAnswer: "9",
        explanation: "14 - 5 = 9! Nice!",
        xp: 20
      },
      {
        id: "15-6",
        levelId: 15,
        type: "multiple-choice" as QuestionType,
        question: "What is 12 - 5?",
        options: ["6", "7", "8", "9"],
        correctAnswer: "7",
        explanation: "12 - 5 = 7! Perfect!",
        xp: 20
      },
      {
        id: "15-7",
        levelId: 15,
        type: "multiple-choice" as QuestionType,
        question: "What is 17 - 7?",
        options: ["9", "10", "11", "12"],
        correctAnswer: "10",
        explanation: "17 - 7 = 10! Fantastic!",
        xp: 20
      },
      {
        id: "15-8",
        levelId: 15,
        type: "multiple-choice" as QuestionType,
        question: "What is 11 - 5?",
        options: ["5", "6", "7", "8"],
        correctAnswer: "6",
        explanation: "11 - 5 = 6! Excellent!",
        xp: 20
      },
      {
        id: "15-9",
        levelId: 15,
        type: "multiple-choice" as QuestionType,
        question: "What is 16 - 6?",
        options: ["9", "10", "11", "12"],
        correctAnswer: "10",
        explanation: "16 - 6 = 10! Amazing!",
        xp: 20
      },
      {
        id: "15-10",
        levelId: 15,
        type: "multiple-choice" as QuestionType,
        question: "What is 12 - 6?",
        options: ["5", "6", "7", "8"],
        correctAnswer: "6",
        explanation: "12 - 6 = 6! Half of 12! Subtraction master!",
        xp: 20
      }
    ]
  },

  // UNIT 4: MULTIPLICATION BASICS (Levels 16-20)
  16: {
    title: "Multiplication: Skip Counting by 2s",
    introduction: {
      title: "Welcome to Multiplication!",
      content: [
        "Multiplication means groups!",
        "2 × 3 means 2 groups of 3 things!",
        "Let's start with groups of 2!"
      ],
      examples: [
        { number: "2 × 1", visual: "●● = 2", word: "1 group of 2" },
        { number: "2 × 2", visual: "●● + ●● = ●●●●", word: "2 groups of 2 = 4" },
        { number: "2 × 3", visual: "●● + ●● + ●● = ●●●●●●", word: "3 groups of 2 = 6" }
      ]
    },
    questions: [
      {
        id: "16-1",
        levelId: 16,
        type: "multiple-choice" as QuestionType,
        question: "What is 2 × 1?",
        options: ["1", "2", "3", "4"],
        correctAnswer: "2",
        explanation: "2 × 1 = 2! One group of 2!",
        xp: 20
      },
      {
        id: "16-2",
        levelId: 16,
        type: "multiple-choice" as QuestionType,
        question: "What is 2 × 2?",
        options: ["2", "3", "4", "5"],
        correctAnswer: "4",
        explanation: "2 × 2 = 4! Two groups of 2!",
        xp: 20
      },
      {
        id: "16-3",
        levelId: 16,
        type: "multiple-choice" as QuestionType,
        question: "What is 2 × 3?",
        options: ["4", "5", "6", "7"],
        correctAnswer: "6",
        explanation: "2 × 3 = 6! Three groups of 2!",
        xp: 20
      },
      {
        id: "16-4",
        levelId: 16,
        type: "multiple-choice" as QuestionType,
        question: "What is 2 × 4?",
        options: ["6", "7", "8", "9"],
        correctAnswer: "8",
        explanation: "2 × 4 = 8! Four groups of 2!",
        xp: 20
      },
      {
        id: "16-5",
        levelId: 16,
        type: "multiple-choice" as QuestionType,
        question: "What is 2 × 5?",
        options: ["8", "9", "10", "11"],
        correctAnswer: "10",
        explanation: "2 × 5 = 10! Five groups of 2!",
        xp: 20
      },
      {
        id: "16-6",
        levelId: 16,
        type: "multiple-choice" as QuestionType,
        question: "What is 3 × 2?",
        options: ["4", "5", "6", "7"],
        correctAnswer: "6",
        explanation: "3 × 2 = 6! Three times two!",
        xp: 20
      },
      {
        id: "16-7",
        levelId: 16,
        type: "multiple-choice" as QuestionType,
        question: "What is 4 × 2?",
        options: ["6", "7", "8", "9"],
        correctAnswer: "8",
        explanation: "4 × 2 = 8! Four times two!",
        xp: 20
      },
      {
        id: "16-8",
        levelId: 16,
        type: "multiple-choice" as QuestionType,
        question: "What is 5 × 2?",
        options: ["8", "9", "10", "11"],
        correctAnswer: "10",
        explanation: "5 × 2 = 10! Five times two!",
        xp: 20
      },
      {
        id: "16-9",
        levelId: 16,
        type: "multiple-choice" as QuestionType,
        question: "What is 6 × 2?",
        options: ["10", "11", "12", "13"],
        correctAnswer: "12",
        explanation: "6 × 2 = 12! Six times two!",
        xp: 20
      },
      {
        id: "16-10",
        levelId: 16,
        type: "multiple-choice" as QuestionType,
        question: "What is 2 × 6?",
        options: ["10", "11", "12", "13"],
        correctAnswer: "12",
        explanation: "2 × 6 = 12! Same as 6 × 2!",
        xp: 20
      }
    ]
  },

  17: {
    title: "Multiplication: Times Tables 3 & 4",
    introduction: {
      title: "Multiplying by 3 and 4!",
      content: [
        "Now let's multiply by 3 and 4!",
        "These are really useful to memorize!",
        "Let's practice!"
      ],
      examples: [
        { number: "3 × 2", visual: "●●● + ●●● = ●●●●●●", word: "3 times 2 = 6" },
        { number: "4 × 2", visual: "●●●● + ●●●● = ●●●●●●●●", word: "4 times 2 = 8" },
        { number: "3 × 3", visual: "●●● + ●●● + ●●● = ●●●●●●●●●", word: "3 times 3 = 9" }
      ]
    },
    questions: [
      {
        id: "17-1",
        levelId: 17,
        type: "multiple-choice" as QuestionType,
        question: "What is 3 × 1?",
        options: ["2", "3", "4", "5"],
        correctAnswer: "3",
        explanation: "3 × 1 = 3! One group of 3!",
        xp: 20
      },
      {
        id: "17-2",
        levelId: 17,
        type: "multiple-choice" as QuestionType,
        question: "What is 3 × 2?",
        options: ["4", "5", "6", "7"],
        correctAnswer: "6",
        explanation: "3 × 2 = 6! Two groups of 3!",
        xp: 20
      },
      {
        id: "17-3",
        levelId: 17,
        type: "multiple-choice" as QuestionType,
        question: "What is 3 × 3?",
        options: ["6", "7", "8", "9"],
        correctAnswer: "9",
        explanation: "3 × 3 = 9! Three groups of 3!",
        xp: 20
      },
      {
        id: "17-4",
        levelId: 17,
        type: "multiple-choice" as QuestionType,
        question: "What is 4 × 1?",
        options: ["3", "4", "5", "6"],
        correctAnswer: "4",
        explanation: "4 × 1 = 4! One group of 4!",
        xp: 20
      },
      {
        id: "17-5",
        levelId: 17,
        type: "multiple-choice" as QuestionType,
        question: "What is 4 × 2?",
        options: ["6", "7", "8", "9"],
        correctAnswer: "8",
        explanation: "4 × 2 = 8! Two groups of 4!",
        xp: 20
      },
      {
        id: "17-6",
        levelId: 17,
        type: "multiple-choice" as QuestionType,
        question: "What is 4 × 3?",
        options: ["10", "11", "12", "13"],
        correctAnswer: "12",
        explanation: "4 × 3 = 12! Three groups of 4!",
        xp: 20
      },
      {
        id: "17-7",
        levelId: 17,
        type: "multiple-choice" as QuestionType,
        question: "What is 3 × 4?",
        options: ["10", "11", "12", "13"],
        correctAnswer: "12",
        explanation: "3 × 4 = 12! Same as 4 × 3!",
        xp: 20
      },
      {
        id: "17-8",
        levelId: 17,
        type: "multiple-choice" as QuestionType,
        question: "What is 3 × 5?",
        options: ["12", "13", "14", "15"],
        correctAnswer: "15",
        explanation: "3 × 5 = 15! Five groups of 3!",
        xp: 20
      },
      {
        id: "17-9",
        levelId: 17,
        type: "multiple-choice" as QuestionType,
        question: "What is 4 × 4?",
        options: ["14", "15", "16", "17"],
        correctAnswer: "16",
        explanation: "4 × 4 = 16! Four groups of 4!",
        xp: 20
      },
      {
        id: "17-10",
        levelId: 17,
        type: "multiple-choice" as QuestionType,
        question: "What is 4 × 5?",
        options: ["16", "17", "18", "20"],
        correctAnswer: "20",
        explanation: "4 × 5 = 20! Five groups of 4!",
        xp: 20
      }
    ]
  },

  18: {
    title: "Multiplication: Times Tables 5 & 6",
    introduction: {
      title: "Multiplying by 5 and 6!",
      content: [
        "5s are fun because we skip count by 5s!",
        "6s help us build more facts!",
        "Let's go!"
      ],
      examples: [
        { number: "5 × 2", visual: "●●●●● + ●●●●● = ●●●●●●●●●●", word: "equals 10" },
        { number: "5 × 3", visual: "●●●●● + ●●●●● + ●●●●● = ●●●●●●●●●●●●●●●", word: "equals 15" },
        { number: "6 × 2", visual: "●●●●●● + ●●●●●● = ●●●●●●●●●●●●", word: "equals 12" }
      ]
    },
    questions: [
      {
        id: "18-1",
        levelId: 18,
        type: "multiple-choice" as QuestionType,
        question: "What is 5 × 1?",
        options: ["4", "5", "6", "7"],
        correctAnswer: "5",
        explanation: "5 × 1 = 5!",
        xp: 20
      },
      {
        id: "18-2",
        levelId: 18,
        type: "multiple-choice" as QuestionType,
        question: "What is 5 × 2?",
        options: ["8", "9", "10", "11"],
        correctAnswer: "10",
        explanation: "5 × 2 = 10! Perfect!",
        xp: 20
      },
      {
        id: "18-3",
        levelId: 18,
        type: "multiple-choice" as QuestionType,
        question: "What is 5 × 3?",
        options: ["12", "13", "14", "15"],
        correctAnswer: "15",
        explanation: "5 × 3 = 15! Skip count: 5, 10, 15!",
        xp: 20
      },
      {
        id: "18-4",
        levelId: 18,
        type: "multiple-choice" as QuestionType,
        question: "What is 5 × 4?",
        options: ["16", "17", "18", "20"],
        correctAnswer: "20",
        explanation: "5 × 4 = 20! Great!",
        xp: 20
      },
      {
        id: "18-5",
        levelId: 18,
        type: "multiple-choice" as QuestionType,
        question: "What is 6 × 1?",
        options: ["5", "6", "7", "8"],
        correctAnswer: "6",
        explanation: "6 × 1 = 6!",
        xp: 20
      },
      {
        id: "18-6",
        levelId: 18,
        type: "multiple-choice" as QuestionType,
        question: "What is 6 × 2?",
        options: ["10", "11", "12", "13"],
        correctAnswer: "12",
        explanation: "6 × 2 = 12! Nice!",
        xp: 20
      },
      {
        id: "18-7",
        levelId: 18,
        type: "multiple-choice" as QuestionType,
        question: "What is 6 × 3?",
        options: ["16", "17", "18", "19"],
        correctAnswer: "18",
        explanation: "6 × 3 = 18! Excellent!",
        xp: 20
      },
      {
        id: "18-8",
        levelId: 18,
        type: "multiple-choice" as QuestionType,
        question: "What is 6 × 4?",
        options: ["20", "22", "24", "26"],
        correctAnswer: "24",
        explanation: "6 × 4 = 24! Amazing!",
        xp: 20
      },
      {
        id: "18-9",
        levelId: 18,
        type: "multiple-choice" as QuestionType,
        question: "What is 5 × 5?",
        options: ["20", "22", "24", "25"],
        correctAnswer: "25",
        explanation: "5 × 5 = 25! Perfect square!",
        xp: 20
      },
      {
        id: "18-10",
        levelId: 18,
        type: "multiple-choice" as QuestionType,
        question: "What is 6 × 5?",
        options: ["28", "29", "30", "31"],
        correctAnswer: "30",
        explanation: "6 × 5 = 30! Great work!",
        xp: 20
      }
    ]
  },

  19: {
    title: "Multiplication: Times Tables 7 & 8",
    introduction: {
      title: "Multiplying by 7 and 8!",
      content: [
        "These are getting trickier!",
        "But you can do it!",
        "Practice makes perfect!"
      ],
      examples: [
        { number: "7 × 2", visual: "14 = 2 + 2 + 2 + 2 + 2 + 2 + 2", word: "seven 2s" },
        { number: "8 × 2", visual: "16 = 2 + 2 + 2 + 2 + 2 + 2 + 2 + 2", word: "eight 2s" },
        { number: "7 × 3", visual: "21 = 3 + 3 + 3 + 3 + 3 + 3 + 3", word: "seven 3s" }
      ]
    },
    questions: [
      {
        id: "19-1",
        levelId: 19,
        type: "multiple-choice" as QuestionType,
        question: "What is 7 × 1?",
        options: ["6", "7", "8", "9"],
        correctAnswer: "7",
        explanation: "7 × 1 = 7!",
        xp: 20
      },
      {
        id: "19-2",
        levelId: 19,
        type: "multiple-choice" as QuestionType,
        question: "What is 7 × 2?",
        options: ["12", "13", "14", "15"],
        correctAnswer: "14",
        explanation: "7 × 2 = 14! Skip count: 7, 14!",
        xp: 20
      },
      {
        id: "19-3",
        levelId: 19,
        type: "multiple-choice" as QuestionType,
        question: "What is 7 × 3?",
        options: ["18", "19", "20", "21"],
        correctAnswer: "21",
        explanation: "7 × 3 = 21! Good!",
        xp: 20
      },
      {
        id: "19-4",
        levelId: 19,
        type: "multiple-choice" as QuestionType,
        question: "What is 8 × 1?",
        options: ["7", "8", "9", "10"],
        correctAnswer: "8",
        explanation: "8 × 1 = 8!",
        xp: 20
      },
      {
        id: "19-5",
        levelId: 19,
        type: "multiple-choice" as QuestionType,
        question: "What is 8 × 2?",
        options: ["14", "15", "16", "17"],
        correctAnswer: "16",
        explanation: "8 × 2 = 16! Eight times two!",
        xp: 20
      },
      {
        id: "19-6",
        levelId: 19,
        type: "multiple-choice" as QuestionType,
        question: "What is 8 × 3?",
        options: ["22", "23", "24", "25"],
        correctAnswer: "24",
        explanation: "8 × 3 = 24! Nice!",
        xp: 20
      },
      {
        id: "19-7",
        levelId: 19,
        type: "multiple-choice" as QuestionType,
        question: "What is 7 × 4?",
        options: ["26", "27", "28", "29"],
        correctAnswer: "28",
        explanation: "7 × 4 = 28! Excellent!",
        xp: 20
      },
      {
        id: "19-8",
        levelId: 19,
        type: "multiple-choice" as QuestionType,
        question: "What is 8 × 4?",
        options: ["30", "31", "32", "33"],
        correctAnswer: "32",
        explanation: "8 × 4 = 32! Amazing!",
        xp: 20
      },
      {
        id: "19-9",
        levelId: 19,
        type: "multiple-choice" as QuestionType,
        question: "What is 7 × 5?",
        options: ["32", "33", "34", "35"],
        correctAnswer: "35",
        explanation: "7 × 5 = 35! Great!",
        xp: 20
      },
      {
        id: "19-10",
        levelId: 19,
        type: "multiple-choice" as QuestionType,
        question: "What is 8 × 5?",
        options: ["38", "39", "40", "41"],
        correctAnswer: "40",
        explanation: "8 × 5 = 40! Perfect!",
        xp: 20
      }
    ]
  },

  20: {
    title: "Multiplication: Times Tables 9 & 10",
    introduction: {
      title: "The Highest Times Tables!",
      content: [
        "We've almost completed all the times tables!",
        "9s and 10s are easier than you think!",
        "Let's master multiplication!"
      ],
      examples: [
        { number: "9 × 2", visual: "18 = 10 + 8", word: "equals 18" },
        { number: "10 × 5", visual: "50 = 5 with a zero", word: "equals 50" },
        { number: "9 × 3", visual: "27 = 30 - 3", word: "equals 27" }
      ]
    },
    questions: [
      {
        id: "20-1",
        levelId: 20,
        type: "multiple-choice" as QuestionType,
        question: "What is 9 × 1?",
        options: ["8", "9", "10", "11"],
        correctAnswer: "9",
        explanation: "9 × 1 = 9!",
        xp: 20
      },
      {
        id: "20-2",
        levelId: 20,
        type: "multiple-choice" as QuestionType,
        question: "What is 9 × 2?",
        options: ["16", "17", "18", "19"],
        correctAnswer: "18",
        explanation: "9 × 2 = 18! Good!",
        xp: 20
      },
      {
        id: "20-3",
        levelId: 20,
        type: "multiple-choice" as QuestionType,
        question: "What is 9 × 3?",
        options: ["24", "25", "26", "27"],
        correctAnswer: "27",
        explanation: "9 × 3 = 27! Nice!",
        xp: 20
      },
      {
        id: "20-4",
        levelId: 20,
        type: "multiple-choice" as QuestionType,
        question: "What is 9 × 4?",
        options: ["34", "35", "36", "37"],
        correctAnswer: "36",
        explanation: "9 × 4 = 36! Excellent!",
        xp: 20
      },
      {
        id: "20-5",
        levelId: 20,
        type: "multiple-choice" as QuestionType,
        question: "What is 10 × 1?",
        options: ["9", "10", "11", "12"],
        correctAnswer: "10",
        explanation: "10 × 1 = 10!",
        xp: 20
      },
      {
        id: "20-6",
        levelId: 20,
        type: "multiple-choice" as QuestionType,
        question: "What is 10 × 2?",
        options: ["18", "19", "20", "21"],
        correctAnswer: "20",
        explanation: "10 × 2 = 20! Add a zero!",
        xp: 20
      },
      {
        id: "20-7",
        levelId: 20,
        type: "multiple-choice" as QuestionType,
        question: "What is 10 × 3?",
        options: ["28", "29", "30", "31"],
        correctAnswer: "30",
        explanation: "10 × 3 = 30! Just add a zero!",
        xp: 20
      },
      {
        id: "20-8",
        levelId: 20,
        type: "multiple-choice" as QuestionType,
        question: "What is 10 × 5?",
        options: ["45", "48", "50", "52"],
        correctAnswer: "50",
        explanation: "10 × 5 = 50! Perfect!",
        xp: 20
      },
      {
        id: "20-9",
        levelId: 20,
        type: "multiple-choice" as QuestionType,
        question: "What is 9 × 5?",
        options: ["42", "43", "44", "45"],
        correctAnswer: "45",
        explanation: "9 × 5 = 45! Amazing!",
        xp: 20
      },
      {
        id: "20-10",
        levelId: 20,
        type: "multiple-choice" as QuestionType,
        question: "What is 10 × 10?",
        options: ["90", "95", "100", "105"],
        correctAnswer: "100",
        explanation: "10 × 10 = 100! MULTIPLICATION MASTER! 🎉",
        xp: 20
      }
    ]
  },

  // UNIT 5: DIVISION (LEVELS 21-25)
  21: {
  title: "Division Basics - Sharing Equally",
  introduction: {
    title: "Dividing Things Fairly",
    content: [
      "Division means sharing things into equal groups, or splitting things fairly.",
      "Division is the opposite of multiplication - just like subtraction is the opposite of addition!",
      "The ÷ symbol means 'divide' or 'split into groups'."
    ],
    examples: [
      { number: "If you have 6 cookies and want to share them fairly among 2 friends, each friend gets 6 ÷ 2 = 3 cookies", visual: "🍪🍪🍪 | 🍪🍪🍪", word: "6 ÷ 2 = 3" },
      { number: "If you have 8 apples and want to make 4 equal piles, each pile has 8 ÷ 4 = 2 apples", visual: "🍎🍎 | 🍎🍎 | 🍎🍎 | 🍎🍎", word: "8 ÷ 4 = 2" },
      { number: "If you have 10 pencils and want to share them among 5 people, each person gets 10 ÷ 5 = 2 pencils", visual: "✏️✏️ ✏️✏️ ✏️✏️ ✏️✏️ ✏️✏️", word: "10 ÷ 5 = 2" }
    ]
  },
  questions: [
    { id: "21-1", levelId: 21, type: "multiple-choice" as QuestionType, question: "If you have 4 toys and 2 kids, how many toys does each kid get? (4 ÷ 2 = ?)", options: ["1", "2", "3", "4"], correctAnswer: "2", explanation: "4 ÷ 2 = 2. When you split 4 toys equally between 2 kids, each gets 2 toys.", xp: 15 },
    { id: "21-2", levelId: 21, type: "multiple-choice" as QuestionType, question: "What is 6 ÷ 2?", options: ["2", "3", "4", "5"], correctAnswer: "3", explanation: "6 ÷ 2 = 3. Six split into 2 equal groups makes 3 in each group.", xp: 15 },
    { id: "21-3", levelId: 21, type: "multiple-choice" as QuestionType, question: "If you have 8 candies and 4 kids, how many candies per kid? (8 ÷ 4 = ?)", options: ["1", "2", "3", "4"], correctAnswer: "2", explanation: "8 ÷ 4 = 2. Each of 4 kids gets 2 candies.", xp: 15 },
    { id: "21-4", levelId: 21, type: "multiple-choice" as QuestionType, question: "What is 9 ÷ 3?", options: ["2", "3", "4", "5"], correctAnswer: "3", explanation: "9 ÷ 3 = 3. Nine split into 3 equal groups makes 3 in each group.", xp: 15 },
    { id: "21-5", levelId: 21, type: "multiple-choice" as QuestionType, question: "If 10 flowers are put into 5 vases equally, how many flowers per vase? (10 ÷ 5 = ?)", options: ["1", "2", "3", "4"], correctAnswer: "2", explanation: "10 ÷ 5 = 2. Each vase gets 2 flowers.", xp: 15 },
    { id: "21-6", levelId: 21, type: "multiple-choice" as QuestionType, question: "What is 12 ÷ 2?", options: ["4", "5", "6", "7"], correctAnswer: "6", explanation: "12 ÷ 2 = 6. Twelve split into 2 equal groups makes 6 in each group.", xp: 15 },
    { id: "21-7", levelId: 21, type: "multiple-choice" as QuestionType, question: "What is 15 ÷ 3?", options: ["4", "5", "6", "7"], correctAnswer: "5", explanation: "15 ÷ 3 = 5. Fifteen split into 3 equal groups makes 5 in each group.", xp: 15 },
    { id: "21-8", levelId: 21, type: "multiple-choice" as QuestionType, question: "If you have 20 coins and 4 piggy banks, how many coins per bank? (20 ÷ 4 = ?)", options: ["4", "5", "6", "7"], correctAnswer: "5", explanation: "20 ÷ 4 = 5. Each piggy bank gets 5 coins.", xp: 15 },
    { id: "21-9", levelId: 21, type: "multiple-choice" as QuestionType, question: "What is 14 ÷ 2?", options: ["6", "7", "8", "9"], correctAnswer: "7", explanation: "14 ÷ 2 = 7. Fourteen split into 2 equal groups makes 7 in each group.", xp: 15 },
    { id: "21-10", levelId: 21, type: "multiple-choice" as QuestionType, question: "What is 18 ÷ 2?", options: ["8", "9", "10", "11"], correctAnswer: "9", explanation: "18 ÷ 2 = 9. Eighteen split into 2 equal groups makes 9 in each group.", xp: 15 }
    ]
  },

  22: {
  title: "Division Facts - Times Tables Inverse",
  introduction: {
    title: "Using Multiplication to Understand Division",
    content: [
      "Remember multiplication? Division is the opposite!",
      "If 3 × 4 = 12, then 12 ÷ 3 = 4 and 12 ÷ 4 = 3",
      "Think: 'If I know 5 × 3 = 15, then I know 15 ÷ 5 = 3'"
    ],
    examples: [
      { number: "3 × 5 = 15, so 15 ÷ 3 = 5", visual: "⭐⭐⭐ ⭐⭐⭐ ⭐⭐⭐ ⭐⭐⭐ ⭐⭐⭐", word: "Division is multiplication reversed!" },
      { number: "4 × 6 = 24, so 24 ÷ 4 = 6", visual: "📦 with 6 items each = 24 total", word: "24 ÷ 4 = 6" },
      { number: "2 × 8 = 16, so 16 ÷ 2 = 8", visual: "Two groups of 8 = 16", word: "16 ÷ 2 = 8" }
    ]
  },
  questions: [
    { id: "22-1", levelId: 22, type: "multiple-choice" as QuestionType, question: "What is 12 ÷ 3? (Hint: 3 × 4 = 12)", options: ["3", "4", "5", "6"], correctAnswer: "4", explanation: "12 ÷ 3 = 4, because 3 × 4 = 12. Multiplication and division are opposites!", xp: 15 },
    { id: "22-2", levelId: 22, type: "multiple-choice" as QuestionType, question: "What is 16 ÷ 4? (Hint: 4 × 4 = 16)", options: ["3", "4", "5", "6"], correctAnswer: "4", explanation: "16 ÷ 4 = 4, because 4 × 4 = 16.", xp: 15 },
    { id: "22-3", levelId: 22, type: "multiple-choice" as QuestionType, question: "What is 20 ÷ 5? (Hint: 5 × 4 = 20)", options: ["3", "4", "5", "6"], correctAnswer: "4", explanation: "20 ÷ 5 = 4, because 5 × 4 = 20.", xp: 15 },
    { id: "22-4", levelId: 22, type: "multiple-choice" as QuestionType, question: "What is 24 ÷ 6? (Hint: 6 × 4 = 24)", options: ["3", "4", "5", "6"], correctAnswer: "4", explanation: "24 ÷ 6 = 4, because 6 × 4 = 24.", xp: 15 },
    { id: "22-5", levelId: 22, type: "multiple-choice" as QuestionType, question: "What is 18 ÷ 3? (Hint: 3 × 6 = 18)", options: ["5", "6", "7", "8"], correctAnswer: "6", explanation: "18 ÷ 3 = 6, because 3 × 6 = 18.", xp: 15 },
    { id: "22-6", levelId: 22, type: "multiple-choice" as QuestionType, question: "What is 25 ÷ 5? (Hint: 5 × 5 = 25)", options: ["4", "5", "6", "7"], correctAnswer: "5", explanation: "25 ÷ 5 = 5, because 5 × 5 = 25.", xp: 15 },
    { id: "22-7", levelId: 22, type: "multiple-choice" as QuestionType, question: "What is 30 ÷ 6? (Hint: 6 × 5 = 30)", options: ["4", "5", "6", "7"], correctAnswer: "5", explanation: "30 ÷ 6 = 5, because 6 × 5 = 30.", xp: 15 },
    { id: "22-8", levelId: 22, type: "multiple-choice" as QuestionType, question: "What is 35 ÷ 7? (Hint: 7 × 5 = 35)", options: ["4", "5", "6", "7"], correctAnswer: "5", explanation: "35 ÷ 7 = 5, because 7 × 5 = 35.", xp: 15 },
    { id: "22-9", levelId: 22, type: "multiple-choice" as QuestionType, question: "What is 40 ÷ 8? (Hint: 8 × 5 = 40)", options: ["4", "5", "6", "7"], correctAnswer: "5", explanation: "40 ÷ 8 = 5, because 8 × 5 = 40.", xp: 15 },
    { id: "22-10", levelId: 22, type: "multiple-choice" as QuestionType, question: "What is 45 ÷ 9? (Hint: 9 × 5 = 45)", options: ["4", "5", "6", "7"], correctAnswer: "5", explanation: "45 ÷ 9 = 5, because 9 × 5 = 45.", xp: 15 }
    ]
  },

  23: {
  title: "Division Facts - 2s, 3s, and 4s",
  introduction: {
    title: "Practicing Division with Times Tables",
    content: [
      "Now let's practice more division facts using what you learned from multiplication!",
      "These division facts come from the 2s, 3s, and 4s times tables.",
      "Remember: division is the opposite of multiplication."
    ],
    examples: [
      { number: "2 × 7 = 14, so 14 ÷ 2 = 7", visual: "🎱🎱 🎱🎱 🎱🎱 🎱🎱 🎱🎱 🎱🎱 🎱🎱", word: "14 ÷ 2 = 7" },
      { number: "3 × 8 = 24, so 24 ÷ 3 = 8", visual: "8 groups of 3", word: "24 ÷ 3 = 8" },
      { number: "4 × 9 = 36, so 36 ÷ 4 = 9", visual: "9 groups of 4", word: "36 ÷ 4 = 9" }
    ]
  },
  questions: [
    { id: "23-1", levelId: 23, type: "multiple-choice" as QuestionType, question: "What is 10 ÷ 2?", options: ["4", "5", "6", "7"], correctAnswer: "5", explanation: "10 ÷ 2 = 5. Think: 2 × 5 = 10", xp: 15 },
    { id: "23-2", levelId: 23, type: "multiple-choice" as QuestionType, question: "What is 21 ÷ 3?", options: ["5", "6", "7", "8"], correctAnswer: "7", explanation: "21 ÷ 3 = 7. Think: 3 × 7 = 21", xp: 15 },
    { id: "23-3", levelId: 23, type: "multiple-choice" as QuestionType, question: "What is 28 ÷ 4?", options: ["6", "7", "8", "9"], correctAnswer: "7", explanation: "28 ÷ 4 = 7. Think: 4 × 7 = 28", xp: 15 },
    { id: "23-4", levelId: 23, type: "multiple-choice" as QuestionType, question: "What is 16 ÷ 2?", options: ["7", "8", "9", "10"], correctAnswer: "8", explanation: "16 ÷ 2 = 8. Think: 2 × 8 = 16", xp: 15 },
    { id: "23-5", levelId: 23, type: "multiple-choice" as QuestionType, question: "What is 27 ÷ 3?", options: ["7", "8", "9", "10"], correctAnswer: "9", explanation: "27 ÷ 3 = 9. Think: 3 × 9 = 27", xp: 15 },
    { id: "23-6", levelId: 23, type: "multiple-choice" as QuestionType, question: "What is 32 ÷ 4?", options: ["7", "8", "9", "10"], correctAnswer: "8", explanation: "32 ÷ 4 = 8. Think: 4 × 8 = 32", xp: 15 },
    { id: "23-7", levelId: 23, type: "multiple-choice" as QuestionType, question: "What is 20 ÷ 2?", options: ["8", "9", "10", "11"], correctAnswer: "10", explanation: "20 ÷ 2 = 10. Think: 2 × 10 = 20", xp: 15 },
    { id: "23-8", levelId: 23, type: "multiple-choice" as QuestionType, question: "What is 30 ÷ 3?", options: ["8", "9", "10", "11"], correctAnswer: "10", explanation: "30 ÷ 3 = 10. Think: 3 × 10 = 30", xp: 15 },
    { id: "23-9", levelId: 23, type: "multiple-choice" as QuestionType, question: "What is 12 ÷ 2?", options: ["5", "6", "7", "8"], correctAnswer: "6", explanation: "12 ÷ 2 = 6. Think: 2 × 6 = 12", xp: 15 },
    { id: "23-10", levelId: 23, type: "multiple-choice" as QuestionType, question: "What is 15 ÷ 3?", options: ["4", "5", "6", "7"], correctAnswer: "5", explanation: "15 ÷ 3 = 5. Think: 3 × 5 = 15", xp: 15 }
    ]
  },

  24: {
  title: "Division Facts - 5s, 6s, 7s, and 8s",
  introduction: {
    title: "Larger Division Facts",
    content: [
      "Now you're ready for bigger division facts!",
      "These come from the 5s, 6s, 7s, and 8s times tables.",
      "You're getting really good at division - keep practicing!"
    ],
    examples: [
      { number: "5 × 6 = 30, so 30 ÷ 5 = 6", visual: "⭐ ⭐ ⭐ ⭐ ⭐ | ⭐ ⭐ ⭐ ⭐ ⭐ | ...", word: "30 ÷ 5 = 6" },
      { number: "6 × 7 = 42, so 42 ÷ 6 = 7", visual: "42 ÷ 6 = 7 groups", word: "42 ÷ 6 = 7" },
      { number: "7 × 8 = 56, so 56 ÷ 7 = 8", visual: "8 groups of 7", word: "56 ÷ 7 = 8" }
    ]
  },
  questions: [
    { id: "24-1", levelId: 24, type: "multiple-choice" as QuestionType, question: "What is 30 ÷ 5?", options: ["5", "6", "7", "8"], correctAnswer: "6", explanation: "30 ÷ 5 = 6. Think: 5 × 6 = 30", xp: 20 },
    { id: "24-2", levelId: 24, type: "multiple-choice" as QuestionType, question: "What is 42 ÷ 6?", options: ["6", "7", "8", "9"], correctAnswer: "7", explanation: "42 ÷ 6 = 7. Think: 6 × 7 = 42", xp: 20 },
    { id: "24-3", levelId: 24, type: "multiple-choice" as QuestionType, question: "What is 56 ÷ 7?", options: ["7", "8", "9", "10"], correctAnswer: "8", explanation: "56 ÷ 7 = 8. Think: 7 × 8 = 56", xp: 20 },
    { id: "24-4", levelId: 24, type: "multiple-choice" as QuestionType, question: "What is 40 ÷ 5?", options: ["7", "8", "9", "10"], correctAnswer: "8", explanation: "40 ÷ 5 = 8. Think: 5 × 8 = 40", xp: 20 },
    { id: "24-5", levelId: 24, type: "multiple-choice" as QuestionType, question: "What is 48 ÷ 6?", options: ["7", "8", "9", "10"], correctAnswer: "8", explanation: "48 ÷ 6 = 8. Think: 6 × 8 = 48", xp: 20 },
    { id: "24-6", levelId: 24, type: "multiple-choice" as QuestionType, question: "What is 63 ÷ 7?", options: ["8", "9", "10", "11"], correctAnswer: "9", explanation: "63 ÷ 7 = 9. Think: 7 × 9 = 63", xp: 20 },
    { id: "24-7", levelId: 24, type: "multiple-choice" as QuestionType, question: "What is 45 ÷ 5?", options: ["8", "9", "10", "11"], correctAnswer: "9", explanation: "45 ÷ 5 = 9. Think: 5 × 9 = 45", xp: 20 },
    { id: "24-8", levelId: 24, type: "multiple-choice" as QuestionType, question: "What is 54 ÷ 6?", options: ["8", "9", "10", "11"], correctAnswer: "9", explanation: "54 ÷ 6 = 9. Think: 6 × 9 = 54", xp: 20 },
    { id: "24-9", levelId: 24, type: "multiple-choice" as QuestionType, question: "What is 72 ÷ 8?", options: ["8", "9", "10", "11"], correctAnswer: "9", explanation: "72 ÷ 8 = 9. Think: 8 × 9 = 72", xp: 20 },
    { id: "24-10", levelId: 24, type: "multiple-choice" as QuestionType, question: "What is 50 ÷ 5?", options: ["9", "10", "11", "12"], correctAnswer: "10", explanation: "50 ÷ 5 = 10. Think: 5 × 10 = 50", xp: 20 }
    ]
  },

  25: {
  title: "Division Mastery - 9s and 10s",
  introduction: {
    title: "Division Master: The Highest Facts",
    content: [
      "You've learned so much about division! Now it's time for the biggest facts.",
      "These are division by 9s and 10s - the highest division facts!",
      "Master these and you'll be a Division Champion! 🏆"
    ],
    examples: [
      { number: "9 × 7 = 63, so 63 ÷ 9 = 7", visual: "63 items divided by 9", word: "63 ÷ 9 = 7" },
      { number: "10 × 8 = 80, so 80 ÷ 10 = 8", visual: "80 items in 10 equal groups", word: "80 ÷ 10 = 8" },
      { number: "9 × 9 = 81, so 81 ÷ 9 = 9", visual: "9 × 9 grid = 81 squares", word: "81 ÷ 9 = 9" }
    ]
  },
  questions: [
    { id: "25-1", levelId: 25, type: "multiple-choice" as QuestionType, question: "What is 36 ÷ 9?", options: ["3", "4", "5", "6"], correctAnswer: "4", explanation: "36 ÷ 9 = 4. Think: 9 × 4 = 36", xp: 20 },
    { id: "25-2", levelId: 25, type: "multiple-choice" as QuestionType, question: "What is 45 ÷ 9?", options: ["4", "5", "6", "7"], correctAnswer: "5", explanation: "45 ÷ 9 = 5. Think: 9 × 5 = 45", xp: 20 },
    { id: "25-3", levelId: 25, type: "multiple-choice" as QuestionType, question: "What is 54 ÷ 9?", options: ["5", "6", "7", "8"], correctAnswer: "6", explanation: "54 ÷ 9 = 6. Think: 9 × 6 = 54", xp: 20 },
    { id: "25-4", levelId: 25, type: "multiple-choice" as QuestionType, question: "What is 63 ÷ 9?", options: ["6", "7", "8", "9"], correctAnswer: "7", explanation: "63 ÷ 9 = 7. Think: 9 × 7 = 63", xp: 20 },
    { id: "25-5", levelId: 25, type: "multiple-choice" as QuestionType, question: "What is 72 ÷ 9?", options: ["7", "8", "9", "10"], correctAnswer: "8", explanation: "72 ÷ 9 = 8. Think: 9 × 8 = 72", xp: 20 },
    { id: "25-6", levelId: 25, type: "multiple-choice" as QuestionType, question: "What is 81 ÷ 9?", options: ["8", "9", "10", "11"], correctAnswer: "9", explanation: "81 ÷ 9 = 9. Think: 9 × 9 = 81 - DIVISION MASTER! 🏆", xp: 20 },
    { id: "25-7", levelId: 25, type: "multiple-choice" as QuestionType, question: "What is 60 ÷ 10?", options: ["5", "6", "7", "8"], correctAnswer: "6", explanation: "60 ÷ 10 = 6. Think: 10 × 6 = 60", xp: 20 },
    { id: "25-8", levelId: 25, type: "multiple-choice" as QuestionType, question: "What is 70 ÷ 10?", options: ["6", "7", "8", "9"], correctAnswer: "7", explanation: "70 ÷ 10 = 7. Think: 10 × 7 = 70", xp: 20 },
    { id: "25-9", levelId: 25, type: "multiple-choice" as QuestionType, question: "What is 80 ÷ 10?", options: ["7", "8", "9", "10"], correctAnswer: "8", explanation: "80 ÷ 10 = 8. Think: 10 × 8 = 80", xp: 20 },
    { id: "25-10", levelId: 25, type: "multiple-choice" as QuestionType, question: "What is 90 ÷ 10?", options: ["8", "9", "10", "11"], correctAnswer: "9", explanation: "90 ÷ 10 = 9. Think: 10 × 9 = 90. Congratulations, you're a DIVISION MASTER! 🎉", xp: 20 }
    ]
  },

  26: {
  title: "Fractions Basics - Halves and Quarters",
  introduction: {
    title: "Breaking Things Into Equal Parts",
    content: [
      "A fraction is a part of a whole thing that has been divided into equal pieces.",
      "When you split something into 2 equal parts, each part is 1/2 (called 'one half')",
      "When you split something into 4 equal parts, each part is 1/4 (called 'one quarter')"
    ],
    examples: [
      { number: "A pizza cut in half: 1/2 of the pizza", visual: "🍕 | 🍕", word: "Each piece is 1/2" },
      { number: "A chocolate bar cut into 4 pieces: 1/4 of the bar", visual: "🍫 🍫 | 🍫 🍫", word: "Each piece is 1/4" },
      { number: "An apple cut in half: 1/2 of the apple", visual: "🍎 | 🍎", word: "Each half is 1/2" }
    ]
  },
  questions: [
    { id: "26-1", levelId: 26, type: "multiple-choice" as QuestionType, question: "If you cut a pie in half, how many pieces do you have?", options: ["1", "2", "3", "4"], correctAnswer: "2", explanation: "When you cut something in half, you get 2 equal pieces. Each piece is 1/2 of the whole pie.", xp: 15 },
    { id: "26-2", levelId: 26, type: "multiple-choice" as QuestionType, question: "If you cut a pizza into 4 equal slices, what fraction is one slice?", options: ["1/2", "1/3", "1/4", "1/5"], correctAnswer: "1/4", explanation: "When something is cut into 4 equal parts, each part is 1/4 (one quarter).", xp: 15 },
    { id: "26-3", levelId: 26, type: "multiple-choice" as QuestionType, question: "What fraction of the pizza is this? 🍕 (half)", options: ["1/2", "1/3", "1/4", "1/5"], correctAnswer: "1/2", explanation: "This is half of the pizza, so the fraction is 1/2 (one half).", xp: 15 },
    { id: "26-4", levelId: 26, type: "multiple-choice" as QuestionType, question: "If you have a chocolate bar with 4 squares and eat 1 square, what fraction did you eat?", options: ["1/2", "1/3", "1/4", "1/5"], correctAnswer: "1/4", explanation: "One square out of 4 equals 1/4 of the chocolate bar.", xp: 15 },
    { id: "26-5", levelId: 26, type: "multiple-choice" as QuestionType, question: "What is bigger: 1/2 or 1/4?", options: ["1/2", "1/4", "They're equal", "Can't tell"], correctAnswer: "1/2", explanation: "1/2 is bigger than 1/4 because half of something is more than a quarter of it!", xp: 15 },
    { id: "26-6", levelId: 26, type: "multiple-choice" as QuestionType, question: "If a sandwich is cut in half, and you eat one half, how much sandwich is left?", options: ["1/2", "1/3", "1/4", "All of it"], correctAnswer: "1/2", explanation: "If you eat 1/2 of the sandwich, then 1/2 of the sandwich is left.", xp: 15 },
    { id: "26-7", levelId: 26, type: "multiple-choice" as QuestionType, question: "How many quarters are in one whole pizza?", options: ["1", "2", "3", "4"], correctAnswer: "4", explanation: "One whole pizza can be divided into 4 quarters (4 × 1/4 = 1 whole)", xp: 15 },
    { id: "26-9", levelId: 26, type: "multiple-choice" as QuestionType, question: "If you have a cookie and cut it into 4 equal pieces, what fraction is 2 pieces?", options: ["1/4", "2/4", "1/2", "2/2"], correctAnswer: "2/4", explanation: "2 pieces out of 4 is 2/4, which is the same as 1/2!", xp: 15 },
    { id: "26-10", levelId: 26, type: "multiple-choice" as QuestionType, question: "Which fraction is the largest piece?", options: ["1/4", "1/3", "1/2", "1/5"], correctAnswer: "1/2", explanation: "1/2 (half) is the largest of these fractions because it's more than the others.", xp: 15 }
    ]
  },

  27: {
  title: "Fractions - Comparing Sizes",
  introduction: {
    title: "Which Fraction is Bigger?",
    content: [
      "Now you'll learn how to compare fractions to see which is bigger!",
      "The bigger the bottom number, the smaller each piece is. 1/2 is bigger than 1/3!",
      "The smaller the bottom number, the bigger each piece is. 1/2 is bigger than 1/4!"
    ],
    examples: [
      { number: "1/2 vs 1/4: Half is bigger than a quarter", visual: "🍕🍕 vs 🍕", word: "1/2 > 1/4" },
      { number: "1/3 vs 1/4: A third is bigger than a quarter", visual: "three equal parts vs four equal parts", word: "1/3 > 1/4" },
      { number: "2/4 is the same as 1/2", visual: "Two quarters equal one half", word: "2/4 = 1/2" }
    ]
  },
  questions: [
    { id: "27-1", levelId: 27, type: "multiple-choice" as QuestionType, question: "Which is bigger: 1/2 or 1/3?", options: ["1/2", "1/3", "They're equal", "Can't tell"], correctAnswer: "1/2", explanation: "1/2 (half) is bigger than 1/3 (a third).", xp: 15 },
    { id: "27-2", levelId: 27, type: "multiple-choice" as QuestionType, question: "Which is bigger: 1/3 or 1/4?", options: ["1/3", "1/4", "They're equal", "Can't tell"], correctAnswer: "1/3", explanation: "1/3 is bigger than 1/4 because thirds are bigger pieces than quarters.", xp: 15 },
    { id: "27-3", levelId: 27, type: "multiple-choice" as QuestionType, question: "Which is bigger: 2/4 or 1/2?", options: ["2/4", "1/2", "They're equal", "Can't tell"], correctAnswer: "They're equal", explanation: "2/4 (two quarters) equals 1/2 (one half) - they're the same!", xp: 15 },
    { id: "27-4", levelId: 27, type: "multiple-choice" as QuestionType, question: "Which fraction is biggest: 1/4, 1/3, or 1/2?", options: ["1/4", "1/3", "1/2", "Can't tell"], correctAnswer: "1/2", explanation: "1/2 is the biggest piece because it's half of something!", xp: 15 },
    { id: "27-5", levelId: 27, type: "multiple-choice" as QuestionType, question: "Which is smallest: 1/2, 1/4, or 1/6?", options: ["1/2", "1/4", "1/6", "Can't tell"], correctAnswer: "1/6", explanation: "1/6 is the smallest because sixths are tiny pieces compared to halves!", xp: 15 },
    { id: "27-6", levelId: 27, type: "multiple-choice" as QuestionType, question: "Is 1/4 bigger or smaller than 1/3?", options: ["Bigger", "Smaller", "Equal", "Can't tell"], correctAnswer: "Smaller", explanation: "1/4 is smaller than 1/3. The bigger the bottom number, the smaller the pieces!", xp: 15 },
    { id: "27-7", levelId: 27, type: "multiple-choice" as QuestionType, question: "2/3 is bigger than 1/3 - True or False?", options: ["True", "False"], correctAnswer: "True", explanation: "True! 2/3 (two thirds) is twice as much as 1/3 (one third).", xp: 15 },
    { id: "27-8", levelId: 27, type: "multiple-choice" as QuestionType, question: "Which equals 1/2? (Choose the equal fraction)", options: ["2/3", "2/4", "3/4", "2/5"], correctAnswer: "2/4", explanation: "2/4 (two quarters) equals 1/2 (one half).", xp: 15 },
    { id: "27-9", levelId: 27, type: "multiple-choice" as QuestionType, question: "3/4 is almost a whole - is this True or False?", options: ["True", "False"], correctAnswer: "True", explanation: "True! 3/4 (three quarters) is just 1/4 away from being a whole pizza! 3/4 + 1/4 = 1", xp: 15 },
    { id: "27-10", levelId: 27, type: "multiple-choice" as QuestionType, question: "Put in order from smallest to biggest: 1/6, 1/2, 1/4", options: ["1/6, 1/4, 1/2", "1/2, 1/4, 1/6", "1/4, 1/6, 1/2", "Can't order them"], correctAnswer: "1/6, 1/4, 1/2", explanation: "From smallest to biggest: 1/6 < 1/4 < 1/2. Smaller bottom numbers = bigger pieces!", xp: 15 }
    ]
  },

  28: {
  title: "Fractions - Equal Fractions",
  introduction: {
    title: "Different Fractions, Same Amount",
    content: [
      "Did you know? 2/4 is the same as 1/2! They're just different ways to write the same amount.",
      "We call these 'equivalent fractions' - they look different but equal the same thing!",
      "3/6 also equals 1/2, and 4/8 also equals 1/2. Many fractions can equal the same amount!"
    ],
    examples: [
      { number: "1/2 = 2/4 = 3/6 - All are halves!", visual: "🍕 = 🍕🍕/🍕🍕 = 🍕🍕🍕/🍕🍕🍕🍕🍕🍕", word: "One half = two quarters = three sixths" },
      { number: "To make an equivalent fraction, multiply top AND bottom by the same number", visual: "1/2 × 2/2 = 2/4", word: "1/2 = 2/4" },
      { number: "3/4 and 6/8 are the same!", visual: "Three quarters = six eighths", word: "3/4 = 6/8" }
    ]
  },
  questions: [
    { id: "28-1", levelId: 28, type: "multiple-choice" as QuestionType, question: "Which fraction equals 1/2?", options: ["2/3", "2/4", "2/5", "2/6"], correctAnswer: "2/4", explanation: "1/2 = 2/4. Both are the same amount - half!", xp: 15 },
    { id: "28-2", levelId: 28, type: "multiple-choice" as QuestionType, question: "2/3 equals which fraction?", options: ["3/6", "4/6", "3/9", "4/8"], correctAnswer: "4/6", explanation: "2/3 = 4/6 (multiply top and bottom by 2). Both equal two-thirds!", xp: 15 },
    { id: "28-3", levelId: 28, type: "multiple-choice" as QuestionType, question: "Which is equivalent to 3/4?", options: ["6/8", "6/12", "5/8", "3/8"], correctAnswer: "6/8", explanation: "3/4 = 6/8 (multiply top and bottom by 2).", xp: 15 },
    { id: "28-4", levelId: 28, type: "multiple-choice" as QuestionType, question: "Is 1/3 = 2/6?", options: ["Yes", "No", "Can't tell"], correctAnswer: "Yes", explanation: "Yes! 1/3 = 2/6. Multiply 1/3 by 2/2 to get 2/6. Same amount!", xp: 15 },
    { id: "28-5", levelId: 28, type: "multiple-choice" as QuestionType, question: "Is 2/4 = 1/2?", options: ["Yes", "No", "Can't tell"], correctAnswer: "Yes", explanation: "Yes! 2/4 = 1/2. Two quarters equal one half!", xp: 15 },
    { id: "28-6", levelId: 28, type: "multiple-choice" as QuestionType, question: "4/8 equals which simpler fraction?", options: ["1/2", "1/3", "1/4", "2/3"], correctAnswer: "1/2", explanation: "4/8 = 1/2 (divide both top and bottom by 4). Simplified form!", xp: 15 },
    { id: "28-7", levelId: 28, type: "multiple-choice" as QuestionType, question: "What is 3/6 in simplest form?", options: ["1/2", "1/3", "1/4", "1/5"], correctAnswer: "1/2", explanation: "3/6 simplifies to 1/2 (divide both by 3). Same amount, simpler to write!", xp: 15 },
    { id: "28-8", levelId: 28, type: "multiple-choice" as QuestionType, question: "2/2 is equal to what?", options: ["1/2", "2/4", "1", "3/2"], correctAnswer: "1", explanation: "2/2 = 1 whole. Two halves make a whole!", xp: 15 },
    { id: "28-9", levelId: 28, type: "multiple-choice" as QuestionType, question: "Is 3/3 = 1 whole?", options: ["Yes", "No", "Can't tell"], correctAnswer: "Yes", explanation: "Yes! 3/3 = 1 whole. Three thirds make a complete whole!", xp: 15 },
    { id: "28-10", levelId: 28, type: "multiple-choice" as QuestionType, question: "To go from 1/4 to 2/8, what do you multiply by?", options: ["2/2", "3/3", "4/4", "5/5"], correctAnswer: "2/2", explanation: "1/4 × 2/2 = 2/8. Multiply top and bottom by 2!", xp: 15 }
    ]
  },

  29: {
  title: "Fractions - Adding and Subtracting",
  introduction: {
    title: "Putting Fractions Together and Taking Them Apart",
    content: [
      "You can add fractions together! 1/4 + 1/4 = 2/4 (which is 1/2!)",
      "You can also subtract fractions! 3/4 - 1/4 = 2/4 (which is 1/2!)",
      "When the bottom numbers are the same, just add or subtract the top numbers!"
    ],
    examples: [
      { number: "1/4 + 1/4 = 2/4 = 1/2", visual: "🍕 + 🍕 = 🍕🍕 (which is half!)", word: "Adding quarters" },
      { number: "2/3 - 1/3 = 1/3", visual: "Two thirds minus one third equals one third", word: "2/3 - 1/3 = 1/3" },
      { number: "1/2 + 1/4 = ... wait, we'll learn this later! (different bottom numbers)", visual: "Adding halves and quarters needs special tricks", word: "Save for later!" }
    ]
  },
  questions: [
    { id: "29-1", levelId: 29, type: "multiple-choice" as QuestionType, question: "What is 1/4 + 1/4?", options: ["1/4", "2/4", "1/8", "2/8"], correctAnswer: "2/4", explanation: "1/4 + 1/4 = 2/4 (or 1/2). Add the tops!", xp: 15 },
    { id: "29-2", levelId: 29, type: "multiple-choice" as QuestionType, question: "What is 1/3 + 1/3?", options: ["1/3", "2/3", "1/6", "2/6"], correctAnswer: "2/3", explanation: "1/3 + 1/3 = 2/3. Add the tops when bottoms are the same!", xp: 15 },
    { id: "29-3", levelId: 29, type: "multiple-choice" as QuestionType, question: "What is 3/4 - 1/4?", options: ["1/4", "2/4", "1/2", "3/8"], correctAnswer: "2/4", explanation: "3/4 - 1/4 = 2/4. Subtract the tops when bottoms are the same!", xp: 15 },
    { id: "29-4", levelId: 29, type: "multiple-choice" as QuestionType, question: "What is 4/6 - 1/6?", options: ["1/6", "2/6", "3/6", "4/6"], correctAnswer: "3/6", explanation: "4/6 - 1/6 = 3/6. Subtract the tops!", xp: 15 },
    { id: "29-5", levelId: 29, type: "multiple-choice" as QuestionType, question: "What is 2/5 + 2/5?", options: ["2/5", "4/5", "1/5", "4/10"], correctAnswer: "4/5", explanation: "2/5 + 2/5 = 4/5. Add the tops!", xp: 15 },
    { id: "29-6", levelId: 29, type: "multiple-choice" as QuestionType, question: "What is 5/6 - 2/6?", options: ["1/6", "2/6", "3/6", "4/6"], correctAnswer: "3/6", explanation: "5/6 - 2/6 = 3/6. Subtract the tops!", xp: 15 },
    { id: "29-7", levelId: 29, type: "multiple-choice" as QuestionType, question: "If you have 1/2 of a pie and eat 1/4 of a pie... wait, can we add 1/2 + 1/4 yet?", options: ["Yes, they're easy", "No, different bottoms", "Can't tell"], correctAnswer: "No, different bottoms", explanation: "Not yet! 1/2 and 1/4 have different bottom numbers. We'll learn this later!", xp: 15 },
    { id: "29-8", levelId: 29, type: "multiple-choice" as QuestionType, question: "What is 2/8 + 3/8?", options: ["3/8", "4/8", "5/8", "6/8"], correctAnswer: "5/8", explanation: "2/8 + 3/8 = 5/8. Add the tops when bottoms are the same!", xp: 15 },
    { id: "29-9", levelId: 29, type: "multiple-choice" as QuestionType, question: "What is 7/10 - 3/10?", options: ["3/10", "4/10", "5/10", "6/10"], correctAnswer: "4/10", explanation: "7/10 - 3/10 = 4/10. Subtract the tops!", xp: 15 },
    { id: "29-10", levelId: 29, type: "multiple-choice" as QuestionType, question: "What is 4/4 - 2/4?", options: ["1/4", "2/4", "3/4", "4/4"], correctAnswer: "2/4", explanation: "4/4 - 2/4 = 2/4 (which is 1/2!). Subtract the tops!", xp: 15 }
    ]
  },

  30: {
  title: "Fractions Mastery - Mixed Review",
  introduction: {
    title: "You're a Fractions Master!",
    content: [
      "You've learned halves, quarters, comparing fractions, equivalent fractions, and adding/subtracting!",
      "Now let's test everything you know about fractions in one final challenge.",
      "You're so close to becoming a full FRACTIONS MASTER! 🎓"
    ],
    examples: [
      { number: "Remember: 2/4 = 1/2 = halves", visual: "Two quarters = one half", word: "Equivalent fractions" },
      { number: "Remember: 1/2 + 1/4 needs different approach (coming later!)", visual: "Save for advanced fractions", word: "Future learning" },
      { number: "Remember: When bottoms match, just add/subtract the tops!", visual: "2/5 + 1/5 = 3/5", word: "Like operations" }
    ]
  },
  questions: [
    { id: "30-1", levelId: 30, type: "multiple-choice" as QuestionType, question: "Is 1/2 bigger than 1/3?", options: ["Yes", "No", "Equal"], correctAnswer: "Yes", explanation: "Yes! 1/2 is bigger than 1/3.", xp: 20 },
    { id: "30-2", levelId: 30, type: "multiple-choice" as QuestionType, question: "What is 1/4 + 1/4 + 1/4?", options: ["1/4", "2/4", "3/4", "4/4"], correctAnswer: "3/4", explanation: "1/4 + 1/4 + 1/4 = 3/4. Add all the tops!", xp: 20 },
    { id: "30-3", levelId: 30, type: "multiple-choice" as QuestionType, question: "Is 2/4 = 1/2?", options: ["Yes", "No", "Can't tell"], correctAnswer: "Yes", explanation: "Yes! 2/4 and 1/2 are equivalent fractions.", xp: 20 },
    { id: "30-4", levelId: 30, type: "multiple-choice" as QuestionType, question: "What is 5/8 - 2/8?", options: ["2/8", "3/8", "4/8", "5/8"], correctAnswer: "3/8", explanation: "5/8 - 2/8 = 3/8. Subtract the tops!", xp: 20 },
    { id: "30-5", levelId: 30, type: "multiple-choice" as QuestionType, question: "How many quarters equal one half?", options: ["1", "2", "3", "4"], correctAnswer: "2", explanation: "2 quarters (2/4) equal one half (1/2)!", xp: 20 },
    { id: "30-6", levelId: 30, type: "multiple-choice" as QuestionType, question: "What fraction is 3/3?", options: ["1/3", "2/3", "1 whole", "3/3"], correctAnswer: "1 whole", explanation: "3/3 = 1 whole. All three thirds make a complete whole!", xp: 20 },
    { id: "30-7", levelId: 30, type: "multiple-choice" as QuestionType, question: "Is 3/4 close to a whole pizza?", options: ["Yes", "No", "Exactly a whole"], correctAnswer: "Yes", explanation: "Yes! 3/4 is three-quarters of a pizza, very close to a whole!", xp: 20 },
    { id: "30-8", levelId: 30, type: "multiple-choice" as QuestionType, question: "What is 6/10 in simpler form?", options: ["1/2", "3/5", "2/5", "1/3"], correctAnswer: "3/5", explanation: "6/10 simplifies to 3/5 (divide both by 2). Same amount, simpler!", xp: 20 },
    { id: "30-9", levelId: 30, type: "multiple-choice" as QuestionType, question: "What is 1/6 + 2/6 + 2/6?", options: ["3/6", "4/6", "5/6", "6/6"], correctAnswer: "5/6", explanation: "1/6 + 2/6 + 2/6 = 5/6. Just one more sixth until a whole! Add the tops!", xp: 20 },
    { id: "30-10", levelId: 30, type: "multiple-choice" as QuestionType, question: "You've mastered division and fractions! Which statement is true?", options: ["All four operations are the same", "Division helped you understand fractions", "Fractions make no sense", "I'm now a FRACTIONS MASTER! 🎓"], correctAnswer: "I'm now a FRACTIONS MASTER! 🎓", explanation: "Congratulations! You're now a FRACTIONS MASTER! 🎓 You've learned division and fractions - amazing work!", xp: 20 }
    ]
  }
}

// Add placeholder content for levels 31-50
// Template system preserved for Levels 31-50
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
  (id: string, levelId: number): Question => {
    // 70% chance of block-stacking question
    const useBlockStacking = Math.random() < 0.7
    if (useBlockStacking) {
      const firstNum = Math.floor(Math.random() * 3) + 1
      const secondNum = Math.floor(Math.random() * 3) + 1
      return {
        id: `${levelId}-1`,
        levelId,
        type: 'block-stacking' as QuestionType,
        operation: 'add',
        firstNumber: firstNum,
        secondNumber: secondNum,
        correctAnswer: String(firstNum + secondNum),
        question: `What is ${firstNum} + ${secondNum}?`,
        explanation: `${firstNum} + ${secondNum} = ${firstNum + secondNum}`,
        xp: 15
      }
    }
    return {
      id: `${levelId}-1`,
      levelId,
      type: 'multiple-choice' as QuestionType,
      question: `What is ${levelId} + 2?`,
      options: [String(levelId + 1), String(levelId + 2), String(levelId + 3), String(levelId + 4)],
      correctAnswer: String(levelId + 2),
      explanation: `${levelId} + 2 = ${levelId + 2}`,
      xp: 10
    }
  },
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
  (id: string, levelId: number): Question => {
    // 70% chance of block-stacking question
    const useBlockStacking = Math.random() < 0.7
    if (useBlockStacking) {
      const firstNum = Math.floor(Math.random() * 3) + 1
      const secondNum = Math.floor(Math.random() * 3) + 1
      return {
        id: `${levelId}-3`,
        levelId,
        type: 'block-stacking' as QuestionType,
        operation: 'add',
        firstNumber: firstNum,
        secondNumber: secondNum,
        correctAnswer: String(firstNum + secondNum),
        question: `What is ${firstNum} + ${secondNum}?`,
        explanation: `${firstNum} + ${secondNum} = ${firstNum + secondNum}`,
        xp: 15
      }
    }
    return {
      id: `${levelId}-3`,
      levelId,
      type: 'multiple-choice' as QuestionType,
      question: `What is 1 + ${levelId}?`,
      options: [String(levelId), String(levelId + 1), String(levelId + 2), String(levelId + 3)],
      correctAnswer: String(levelId + 1),
      explanation: `1 + ${levelId} = ${levelId + 1}`,
      xp: 10
    }
  },
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
  (id: string, levelId: number): Question => {
    // 70% chance of block-stacking question
    const useBlockStacking = Math.random() < 0.7
    if (useBlockStacking) {
      const firstNum = Math.floor(Math.random() * 5) + 2
      const secondNum = Math.floor(Math.random() * firstNum) + 1
      return {
        id: `${levelId}-1`,
        levelId,
        type: 'block-stacking' as QuestionType,
        operation: 'subtract',
        firstNumber: firstNum,
        secondNumber: secondNum,
        correctAnswer: String(firstNum - secondNum),
        question: `What is ${firstNum} - ${secondNum}?`,
        explanation: `${firstNum} - ${secondNum} = ${firstNum - secondNum}`,
        xp: 15
      }
    }
    return {
      id: `${levelId}-1`,
      levelId,
      type: 'multiple-choice' as QuestionType,
      question: `What is ${levelId + 5} - 5?`,
      options: [String(levelId), String(levelId + 1), String(levelId + 2), String(levelId + 3)],
      correctAnswer: String(levelId + 0),
      explanation: `${levelId + 5} - 5 = ${levelId}`,
      xp: 10
    }
  },
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
  (id: string, levelId: number): Question => {
    // 70% chance of block-stacking question
    const useBlockStacking = Math.random() < 0.7
    if (useBlockStacking) {
      const firstNum = Math.floor(Math.random() * 5) + 2
      const secondNum = Math.floor(Math.random() * firstNum) + 1
      return {
        id: `${levelId}-3`,
        levelId,
        type: 'block-stacking' as QuestionType,
        operation: 'subtract',
        firstNumber: firstNum,
        secondNumber: secondNum,
        correctAnswer: String(firstNum - secondNum),
        question: `What is ${firstNum} - ${secondNum}?`,
        explanation: `${firstNum} - ${secondNum} = ${firstNum - secondNum}`,
        xp: 15
      }
    }
    return {
      id: `${levelId}-3`,
      levelId,
      type: 'multiple-choice' as QuestionType,
      question: `What is ${levelId} - 1?`,
      options: [String(levelId - 2), String(levelId - 1), String(levelId), String(levelId + 1)],
      correctAnswer: String(levelId - 1),
      explanation: `${levelId} - 1 = ${levelId - 1}`,
      xp: 10
    }
  },
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
    const q = [(id: string, levelId: number): Question => ({ id, levelId, type: "multiple-choice" as QuestionType, question: "If a bus leaves at 2:00 and arrives at 3:30, how long was the trip?", options: ["1 hour", "1.5 hours", "2 hours", "2.5 hours"], correctAnswer: "1.5 hours", explanation: "3:30 - 2:00 = 1.5 hours.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: "multiple-choice" as QuestionType, question: "If you have 10 cookies and eat 3, how many are left?", options: ["5", "6", "7", "8"], correctAnswer: "7", explanation: "10 - 3 = 7 cookies.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: "multiple-choice" as QuestionType, question: "Sarah has 5 toys and gets 3 more. How many toys does she have?", options: ["6", "7", "8", "9"], correctAnswer: "8", explanation: "5 + 3 = 8 toys.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: "multiple-choice" as QuestionType, question: "If a book has 20 pages and you read 8, how many pages are left?", options: ["10", "11", "12", "13"], correctAnswer: "12", explanation: "20 - 8 = 12 pages.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: "multiple-choice" as QuestionType, question: "Tom has 4 pencils. His friend gives him 4 more. How many does he have?", options: ["6", "7", "8", "9"], correctAnswer: "8", explanation: "4 + 4 = 8 pencils.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: "multiple-choice" as QuestionType, question: "A train leaves at 1:00 PM and arrives at 4:00 PM. How long was the trip?", options: ["2 hours", "3 hours", "4 hours", "5 hours"], correctAnswer: "3 hours", explanation: "4:00 - 1:00 = 3 hours.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: "multiple-choice" as QuestionType, question: "If you save $5 each week for 4 weeks, how much do you have?", options: ["$15", "$20", "$25", "$30"], correctAnswer: "$20", explanation: "5 × 4 = $20.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: "multiple-choice" as QuestionType, question: "A box has 12 crayons. You give 3 to a friend. How many are left?", options: ["7", "8", "9", "10"], correctAnswer: "9", explanation: "12 - 3 = 9 crayons.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: "multiple-choice" as QuestionType, question: "If 6 birds are on a tree and 3 fly away, how many are left?", options: ["2", "3", "4", "5"], correctAnswer: "3", explanation: "6 - 3 = 3 birds.", xp: 20 }),
    (id: string, levelId: number): Question => ({ id, levelId, type: "multiple-choice" as QuestionType, question: "A store has 15 items. If 6 are sold, how many are left?", options: ["8", "9", "10", "11"], correctAnswer: "9", explanation: "15 - 6 = 9 items.", xp: 20 })];
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
  questions: theme.questions.map((fn: (id: string, levelId: number) => Question, idx: number) => fn(`${levelId}-${idx + 1}`, levelId))
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
