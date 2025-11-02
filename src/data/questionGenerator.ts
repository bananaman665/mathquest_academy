/**
 * QUESTION GENERATOR SYSTEM
 * 
 * This file generates math questions dynamically instead of hardcoding thousands of questions.
 * 
 * HOW IT WORKS:
 * 1. Each level has a "configuration" that defines:
 *    - What type of math (addition, subtraction, etc.)
 *    - Number ranges (e.g., 1-10, 11-20, etc.)
 *    - Question types to use
 *    - Difficulty progression
 * 
 * 2. When a student starts a level, we generate questions on-the-fly with random numbers
 *    that fit the level's constraints
 * 
 * 3. Questions are deterministic per level/seed combo - same student sees same questions
 *    if they replay a level, but different students see different variants
 * 
 * BENEFITS:
 * - File stays tiny (configuration only, not 4000+ lines of hardcoded questions)
 * - Infinite variety (can generate unlimited questions)
 * - Easy to scale (just add more level configs)
 * - Consistent difficulty (random numbers always fit the operation type)
 */

import { Question, QuestionType } from './questions'

// Seeded random number generator for deterministic questions
class SeededRandom {
  private seed: number

  constructor(seed: number) {
    this.seed = seed
  }

  next(): number {
    const x = Math.sin(this.seed++) * 10000
    return x - Math.floor(x)
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min
  }

  shuffle<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }
}

// Level configuration for question generation
export interface LevelConfig {
  levelId: number
  unit: string // e.g., "Addition 1-10", "Subtraction 1-20"
  operation: 'addition' | 'subtraction' | 'multiplication' | 'division' | 'counting' | 'place-value' | 'fractions' | 'mixed'
  numberRange: { min: number; max: number }
  answerRange?: { min: number; max: number } // For subtraction (must be positive), division (no remainders), etc.
  questionTypes: QuestionType[] // Which question types this level should use
  totalQuestions: number // How many questions to generate per level
  difficulty: 'easy' | 'medium' | 'hard'
  allowNegatives?: boolean // For subtraction - can answers be negative?
  allowDecimals?: boolean // For division/fractions
  allowRemainders?: boolean // For division
  visualEmojis?: string[] // For visual counting questions
}

// All 50 levels configuration
export const levelConfigs: { [levelId: number]: LevelConfig } = {
  // UNIT 1: NUMBERS 1-10 (Levels 1-5)
  1: {
    levelId: 1,
    unit: "Counting 1-10",
    operation: 'counting',
    numberRange: { min: 1, max: 5 },
    questionTypes: ['bubble-pop', 'tap-select', 'ten-frame', 'multiple-choice'],
    totalQuestions: 10,
    difficulty: 'easy',
    visualEmojis: ['⭐', '🎈', '🍎', '🐶', '🚗']
  },
  2: {
    levelId: 2,
    unit: "Counting 1-10",
    operation: 'counting',
    numberRange: { min: 1, max: 10 },
    questionTypes: ['bubble-pop', 'tap-select', 'ten-frame', 'multiple-choice'],
    totalQuestions: 10,
    difficulty: 'easy',
    visualEmojis: ['⭐', '🎈', '🍎', '🐶', '🚗', '🌸', '⚽', '🎨']
  },
  3: {
    levelId: 3,
    unit: "Number Recognition 1-10",
    operation: 'counting',
    numberRange: { min: 1, max: 10 },
    questionTypes: ['number-sequence', 'multiple-choice', 'fill-blank'],
    totalQuestions: 10,
    difficulty: 'easy'
  },
  4: {
    levelId: 4,
    unit: "Number Order 1-10",
    operation: 'counting',
    numberRange: { min: 1, max: 10 },
    questionTypes: ['order-sequence', 'number-sequence', 'multiple-choice'],
    totalQuestions: 10,
    difficulty: 'medium'
  },
  5: {
    levelId: 5,
    unit: "Compare Numbers 1-10",
    operation: 'counting',
    numberRange: { min: 1, max: 10 },
    questionTypes: ['multiple-choice', 'true-false'],
    totalQuestions: 10,
    difficulty: 'medium'
  },

  // UNIT 2: ADDITION WITHIN 10 (Levels 6-10)
  6: {
    levelId: 6,
    unit: "Addition 0-5",
    operation: 'addition',
    numberRange: { min: 0, max: 5 },
    answerRange: { min: 0, max: 10 },
    questionTypes: ['ten-frame', 'multiple-choice', 'number-line-drag', 'balance-scale', 'block-stacking'],
    totalQuestions: 10,
    difficulty: 'easy',
    visualEmojis: ['⭐', '🍎', '🎈']
  },
  7: {
    levelId: 7,
    unit: "Addition 0-10",
    operation: 'addition',
    numberRange: { min: 0, max: 10 },
    answerRange: { min: 0, max: 10 },
    questionTypes: ['multiple-choice', 'number-line-drag', 'block-stacking', 'balance-scale'],
    totalQuestions: 10,
    difficulty: 'easy'
  },
  8: {
    levelId: 8,
    unit: "Addition Facts",
    operation: 'addition',
    numberRange: { min: 0, max: 10 },
    answerRange: { min: 0, max: 10 },
    questionTypes: ['multiple-choice', 'type-answer', 'fill-blank'],
    totalQuestions: 10,
    difficulty: 'medium'
  },
  9: {
    levelId: 9,
    unit: "Word Problems Addition",
    operation: 'addition',
    numberRange: { min: 1, max: 10 },
    answerRange: { min: 1, max: 10 },
    questionTypes: ['multiple-choice', 'type-answer'],
    totalQuestions: 10,
    difficulty: 'medium'
  },
  10: {
    levelId: 10,
    unit: "Addition Practice",
    operation: 'addition',
    numberRange: { min: 0, max: 10 },
    answerRange: { min: 0, max: 10 },
    questionTypes: ['multiple-choice', 'type-answer', 'number-line-drag', 'ten-frame', 'balance-scale'],
    totalQuestions: 10,
    difficulty: 'medium'
  },

  // UNIT 3: SUBTRACTION WITHIN 10 (Levels 11-15)
  11: {
    levelId: 11,
    unit: "Subtraction 0-5",
    operation: 'subtraction',
    numberRange: { min: 0, max: 5 },
    answerRange: { min: 0, max: 5 },
    questionTypes: ['ten-frame', 'multiple-choice', 'number-line-drag', 'balance-scale', 'block-stacking'],
    totalQuestions: 10,
    difficulty: 'easy',
    allowNegatives: false
  },
  12: {
    levelId: 12,
    unit: "Subtraction 0-10",
    operation: 'subtraction',
    numberRange: { min: 0, max: 10 },
    answerRange: { min: 0, max: 10 },
    questionTypes: ['multiple-choice', 'number-line-drag', 'block-stacking', 'balance-scale'],
    totalQuestions: 10,
    difficulty: 'easy',
    allowNegatives: false
  },
  13: {
    levelId: 13,
    unit: "Subtraction Facts",
    operation: 'subtraction',
    numberRange: { min: 0, max: 10 },
    answerRange: { min: 0, max: 10 },
    questionTypes: ['multiple-choice', 'type-answer', 'fill-blank'],
    totalQuestions: 10,
    difficulty: 'medium',
    allowNegatives: false
  },
  14: {
    levelId: 14,
    unit: "Word Problems Subtraction",
    operation: 'subtraction',
    numberRange: { min: 1, max: 10 },
    answerRange: { min: 0, max: 10 },
    questionTypes: ['multiple-choice', 'type-answer'],
    totalQuestions: 10,
    difficulty: 'medium',
    allowNegatives: false
  },
  15: {
    levelId: 15,
    unit: "Subtraction Practice",
    operation: 'subtraction',
    numberRange: { min: 0, max: 10 },
    answerRange: { min: 0, max: 10 },
    questionTypes: ['multiple-choice', 'type-answer', 'number-line-drag', 'ten-frame', 'balance-scale'],
    totalQuestions: 10,
    difficulty: 'medium',
    allowNegatives: false
  },

  // UNIT 4: ADDITION & SUBTRACTION WITHIN 20 (Levels 16-20)
  16: {
    levelId: 16,
    unit: "Addition 11-20",
    operation: 'addition',
    numberRange: { min: 1, max: 20 },
    answerRange: { min: 2, max: 20 },
    questionTypes: ['multiple-choice', 'number-line-drag', 'type-answer', 'balance-scale'],
    totalQuestions: 10,
    difficulty: 'medium'
  },
  17: {
    levelId: 17,
    unit: "Subtraction 11-20",
    operation: 'subtraction',
    numberRange: { min: 1, max: 20 },
    answerRange: { min: 0, max: 20 },
    questionTypes: ['multiple-choice', 'number-line-drag', 'type-answer', 'balance-scale'],
    totalQuestions: 10,
    difficulty: 'medium',
    allowNegatives: false
  },
  18: {
    levelId: 18,
    unit: "Mixed Operations 1-20",
    operation: 'mixed',
    numberRange: { min: 1, max: 20 },
    answerRange: { min: 0, max: 20 },
    questionTypes: ['multiple-choice', 'type-answer', 'fill-blank'],
    totalQuestions: 10,
    difficulty: 'medium'
  },
  19: {
    levelId: 19,
    unit: "Word Problems 1-20",
    operation: 'mixed',
    numberRange: { min: 1, max: 20 },
    answerRange: { min: 0, max: 20 },
    questionTypes: ['multiple-choice', 'type-answer'],
    totalQuestions: 10,
    difficulty: 'hard'
  },
  20: {
    levelId: 20,
    unit: "Practice 1-20",
    operation: 'mixed',
    numberRange: { min: 1, max: 20 },
    answerRange: { min: 0, max: 20 },
    questionTypes: ['multiple-choice', 'type-answer', 'number-line-drag'],
    totalQuestions: 10,
    difficulty: 'hard'
  },

  // UNIT 5: PLACE VALUE (Levels 21-25)
  21: {
    levelId: 21,
    unit: "Tens and Ones",
    operation: 'place-value',
    numberRange: { min: 10, max: 99 },
    questionTypes: ['multiple-choice', 'fill-blank'],
    totalQuestions: 10,
    difficulty: 'medium'
  },
  22: {
    levelId: 22,
    unit: "Counting by 10s",
    operation: 'counting',
    numberRange: { min: 10, max: 100 },
    questionTypes: ['multiple-choice', 'number-sequence', 'skip-counter'],
    totalQuestions: 10,
    difficulty: 'medium'
  },
  23: {
    levelId: 23,
    unit: "Compare 2-Digit Numbers",
    operation: 'counting',
    numberRange: { min: 10, max: 99 },
    questionTypes: ['multiple-choice', 'true-false'],
    totalQuestions: 10,
    difficulty: 'medium'
  },
  24: {
    levelId: 24,
    unit: "Hundreds Place",
    operation: 'place-value',
    numberRange: { min: 100, max: 999 },
    questionTypes: ['multiple-choice', 'fill-blank'],
    totalQuestions: 10,
    difficulty: 'hard'
  },
  25: {
    levelId: 25,
    unit: "Place Value Practice",
    operation: 'place-value',
    numberRange: { min: 1, max: 999 },
    questionTypes: ['multiple-choice', 'type-answer', 'fill-blank'],
    totalQuestions: 10,
    difficulty: 'hard'
  },

  // UNIT 6: ADDITION & SUBTRACTION WITHIN 100 (Levels 26-30)
  26: {
    levelId: 26,
    unit: "Addition 2-Digit",
    operation: 'addition',
    numberRange: { min: 10, max: 50 },
    answerRange: { min: 20, max: 100 },
    questionTypes: ['multiple-choice', 'type-answer'],
    totalQuestions: 10,
    difficulty: 'hard'
  },
  27: {
    levelId: 27,
    unit: "Subtraction 2-Digit",
    operation: 'subtraction',
    numberRange: { min: 10, max: 50 },
    answerRange: { min: 0, max: 50 },
    questionTypes: ['multiple-choice', 'type-answer'],
    totalQuestions: 10,
    difficulty: 'hard',
    allowNegatives: false
  },
  28: {
    levelId: 28,
    unit: "Regrouping Addition",
    operation: 'addition',
    numberRange: { min: 15, max: 99 },
    answerRange: { min: 30, max: 198 },
    questionTypes: ['multiple-choice', 'type-answer'],
    totalQuestions: 10,
    difficulty: 'hard'
  },
  29: {
    levelId: 29,
    unit: "Regrouping Subtraction",
    operation: 'subtraction',
    numberRange: { min: 20, max: 99 },
    answerRange: { min: 0, max: 79 },
    questionTypes: ['multiple-choice', 'type-answer'],
    totalQuestions: 10,
    difficulty: 'hard',
    allowNegatives: false
  },
  30: {
    levelId: 30,
    unit: "Mixed 2-Digit Operations",
    operation: 'mixed',
    numberRange: { min: 10, max: 99 },
    answerRange: { min: 0, max: 198 },
    questionTypes: ['multiple-choice', 'type-answer'],
    totalQuestions: 10,
    difficulty: 'hard'
  },

  // UNIT 7: MULTIPLICATION BASICS (Levels 31-35)
  31: {
    levelId: 31,
    unit: "Introduction to Multiplication",
    operation: 'multiplication',
    numberRange: { min: 1, max: 5 },
    answerRange: { min: 1, max: 25 },
    questionTypes: ['array-grid-builder', 'group-maker', 'multiple-choice'],
    totalQuestions: 10,
    difficulty: 'medium'
  },
  32: {
    levelId: 32,
    unit: "Times Tables 2, 5, 10",
    operation: 'multiplication',
    numberRange: { min: 1, max: 10 },
    answerRange: { min: 1, max: 100 },
    questionTypes: ['skip-counter', 'multiple-choice', 'type-answer'],
    totalQuestions: 10,
    difficulty: 'medium'
  },
  33: {
    levelId: 33,
    unit: "Times Tables 3, 4, 6",
    operation: 'multiplication',
    numberRange: { min: 1, max: 10 },
    answerRange: { min: 1, max: 60 },
    questionTypes: ['multiple-choice', 'type-answer', 'array-grid-builder'],
    totalQuestions: 10,
    difficulty: 'hard'
  },
  34: {
    levelId: 34,
    unit: "Times Tables 7, 8, 9",
    operation: 'multiplication',
    numberRange: { min: 1, max: 10 },
    answerRange: { min: 1, max: 90 },
    questionTypes: ['multiple-choice', 'type-answer'],
    totalQuestions: 10,
    difficulty: 'hard'
  },
  35: {
    levelId: 35,
    unit: "All Times Tables",
    operation: 'multiplication',
    numberRange: { min: 1, max: 12 },
    answerRange: { min: 1, max: 144 },
    questionTypes: ['multiple-choice', 'type-answer', 'fill-blank'],
    totalQuestions: 10,
    difficulty: 'hard'
  },

  // UNIT 8: DIVISION BASICS (Levels 36-40)
  36: {
    levelId: 36,
    unit: "Introduction to Division",
    operation: 'division',
    numberRange: { min: 2, max: 10 },
    answerRange: { min: 1, max: 10 },
    questionTypes: ['fair-share', 'group-maker', 'multiple-choice'],
    totalQuestions: 10,
    difficulty: 'medium',
    allowRemainders: false
  },
  37: {
    levelId: 37,
    unit: "Division by 2, 5, 10",
    operation: 'division',
    numberRange: { min: 2, max: 50 },
    answerRange: { min: 1, max: 10 },
    questionTypes: ['division-machine', 'multiple-choice', 'type-answer'],
    totalQuestions: 10,
    difficulty: 'medium',
    allowRemainders: false
  },
  38: {
    levelId: 38,
    unit: "Division Facts",
    operation: 'division',
    numberRange: { min: 3, max: 81 },
    answerRange: { min: 1, max: 12 },
    questionTypes: ['multiple-choice', 'type-answer'],
    totalQuestions: 10,
    difficulty: 'hard',
    allowRemainders: false
  },
  39: {
    levelId: 39,
    unit: "Division with Remainders",
    operation: 'division',
    numberRange: { min: 3, max: 50 },
    answerRange: { min: 1, max: 12 },
    questionTypes: ['multiple-choice', 'type-answer', 'division-machine'],
    totalQuestions: 10,
    difficulty: 'hard',
    allowRemainders: true
  },
  40: {
    levelId: 40,
    unit: "Multiplication & Division",
    operation: 'mixed',
    numberRange: { min: 1, max: 100 },
    answerRange: { min: 1, max: 100 },
    questionTypes: ['multiple-choice', 'type-answer'],
    totalQuestions: 10,
    difficulty: 'hard'
  },

  // UNIT 9: FRACTIONS (Levels 41-45)
  41: {
    levelId: 41,
    unit: "Introduction to Fractions",
    operation: 'fractions',
    numberRange: { min: 1, max: 8 },
    questionTypes: ['fraction-builder', 'multiple-choice', 'balance-scale'],
    totalQuestions: 10,
    difficulty: 'medium'
  },
  42: {
    levelId: 42,
    unit: "Comparing Fractions",
    operation: 'fractions',
    numberRange: { min: 1, max: 10 },
    questionTypes: ['multiple-choice', 'true-false', 'fraction-builder'],
    totalQuestions: 10,
    difficulty: 'hard'
  },
  43: {
    levelId: 43,
    unit: "Adding Fractions",
    operation: 'fractions',
    numberRange: { min: 1, max: 12 },
    questionTypes: ['multiple-choice', 'type-answer', 'fraction-builder'],
    totalQuestions: 10,
    difficulty: 'hard'
  },
  44: {
    levelId: 44,
    unit: "Subtracting Fractions",
    operation: 'fractions',
    numberRange: { min: 1, max: 12 },
    questionTypes: ['multiple-choice', 'type-answer'],
    totalQuestions: 10,
    difficulty: 'hard'
  },
  45: {
    levelId: 45,
    unit: "Fraction Practice",
    operation: 'fractions',
    numberRange: { min: 1, max: 12 },
    questionTypes: ['multiple-choice', 'type-answer', 'fraction-builder'],
    totalQuestions: 10,
    difficulty: 'hard'
  },

  // UNIT 10: ADVANCED TOPICS (Levels 46-50)
  46: {
    levelId: 46,
    unit: "Decimals",
    operation: 'mixed',
    numberRange: { min: 1, max: 100 },
    questionTypes: ['multiple-choice', 'type-answer'],
    totalQuestions: 10,
    difficulty: 'hard',
    allowDecimals: true
  },
  47: {
    levelId: 47,
    unit: "Money Math",
    operation: 'mixed',
    numberRange: { min: 1, max: 100 },
    questionTypes: ['money-counter', 'multiple-choice', 'type-answer'],
    totalQuestions: 10,
    difficulty: 'hard'
  },
  48: {
    levelId: 48,
    unit: "Time",
    operation: 'counting',
    numberRange: { min: 1, max: 12 },
    questionTypes: ['clock-setter', 'multiple-choice'],
    totalQuestions: 10,
    difficulty: 'hard'
  },
  49: {
    levelId: 49,
    unit: "Measurement",
    operation: 'mixed',
    numberRange: { min: 1, max: 100 },
    questionTypes: ['multiple-choice', 'type-answer', 'balance-scale'],
    totalQuestions: 10,
    difficulty: 'hard'
  },
  50: {
    levelId: 50,
    unit: "Master Review",
    operation: 'mixed',
    numberRange: { min: 1, max: 100 },
    answerRange: { min: 0, max: 200 },
    questionTypes: ['multiple-choice', 'type-answer', 'fill-blank'],
    totalQuestions: 15,
    difficulty: 'hard'
  }
}

/**
 * GENERATE QUESTIONS FOR A LEVEL
 * 
 * This is the main function that creates questions dynamically.
 * It takes a level ID and optional seed, then generates all questions for that level.
 */
export function generateQuestionsForLevel(
  levelId: number,
  seed: number = Date.now()
): Question[] {
  const config = levelConfigs[levelId]
  if (!config) {
    throw new Error(`No configuration found for level ${levelId}`)
  }

  const rng = new SeededRandom(seed)
  const questions: Question[] = []

  for (let i = 0; i < config.totalQuestions; i++) {
    // Pick a random question type from the config's allowed types
    const questionType = config.questionTypes[
      Math.floor(rng.next() * config.questionTypes.length)
    ]

    // Generate the question based on operation type and question type
    const question = generateQuestion(config, questionType, rng, i)
    questions.push(question)
  }

  return questions
}

/**
 * GENERATE A SINGLE QUESTION
 * 
 * Creates one question based on the level config and question type.
 * This is where the magic happens - random numbers that fit the constraints!
 */
function generateQuestion(
  config: LevelConfig,
  questionType: QuestionType,
  rng: SeededRandom,
  questionIndex: number
): Question {
  const { levelId, operation, numberRange, answerRange } = config

  // Generate numbers based on operation
  let num1: number, num2: number, answer: number

  switch (operation) {
    case 'addition':
      // For addition: generate two numbers, ensure answer is in range
      num1 = rng.nextInt(numberRange.min, numberRange.max)
      if (answerRange) {
        // Make sure num1 + num2 <= answerRange.max
        const maxNum2 = Math.min(numberRange.max, answerRange.max - num1)
        num2 = rng.nextInt(numberRange.min, maxNum2)
      } else {
        num2 = rng.nextInt(numberRange.min, numberRange.max)
      }
      answer = num1 + num2
      break

    case 'subtraction':
      // For subtraction: generate answer first, then num1 = answer + num2
      // This ensures we never get negative answers (unless config allows it)
      if (config.allowNegatives) {
        num1 = rng.nextInt(numberRange.min, numberRange.max)
        num2 = rng.nextInt(numberRange.min, numberRange.max)
        answer = num1 - num2
      } else {
        // Generate answer in range, then num2, then num1 = answer + num2
        answer = answerRange 
          ? rng.nextInt(answerRange.min, answerRange.max)
          : rng.nextInt(numberRange.min, numberRange.max)
        num2 = rng.nextInt(numberRange.min, numberRange.max)
        num1 = answer + num2
      }
      break

    case 'multiplication':
      // For multiplication: pick two factors
      num1 = rng.nextInt(numberRange.min, numberRange.max)
      num2 = rng.nextInt(numberRange.min, Math.min(numberRange.max, 12)) // Keep factors reasonable
      answer = num1 * num2
      break

    case 'division':
      // For division: generate answer and divisor, then dividend = answer * divisor
      // This ensures no remainders (unless config allows it)
      if (config.allowRemainders) {
        num2 = rng.nextInt(Math.max(2, numberRange.min), numberRange.max)
        num1 = rng.nextInt(num2, numberRange.max)
        answer = Math.floor(num1 / num2)
      } else {
        answer = answerRange
          ? rng.nextInt(answerRange.min, answerRange.max)
          : rng.nextInt(Math.max(1, numberRange.min), numberRange.max)
        num2 = rng.nextInt(Math.max(2, numberRange.min), Math.min(numberRange.max, 12))
        num1 = answer * num2
      }
      break

    case 'counting':
      num1 = rng.nextInt(numberRange.min, numberRange.max)
      num2 = 0
      answer = num1
      break

    case 'place-value':
    case 'fractions':
    case 'mixed':
    default:
      // For complex operations, pick random operation
      const ops = ['addition', 'subtraction']
      const randomOp = ops[Math.floor(rng.next() * ops.length)]
      
      if (randomOp === 'addition') {
        num1 = rng.nextInt(numberRange.min, numberRange.max)
        num2 = rng.nextInt(numberRange.min, numberRange.max)
        answer = num1 + num2
      } else {
        answer = rng.nextInt(numberRange.min, numberRange.max)
        num2 = rng.nextInt(numberRange.min, numberRange.max)
        num1 = answer + num2
      }
      break
  }

  // Now generate the question based on question type
  return generateQuestionByType(
    questionType,
    config,
    num1,
    num2,
    answer,
    rng,
    questionIndex
  )
}

/**
 * GENERATE QUESTION BY TYPE
 * 
 * Takes the numbers and creates a specific question format.
 * Each question type has its own structure.
 */
function generateQuestionByType(
  type: QuestionType,
  config: LevelConfig,
  num1: number,
  num2: number,
  answer: number,
  rng: SeededRandom,
  index: number
): Question {
  const { levelId, operation, visualEmojis } = config
  const id = `${levelId}-${index + 1}`

  // Generate wrong answers for multiple choice
  const generateWrongAnswers = (correct: number, count: number = 3): string[] => {
    const wrong = new Set<number>()
    while (wrong.size < count) {
      const offset = rng.nextInt(-5, 5)
      const wrongAnswer = correct + offset
      if (wrongAnswer !== correct && wrongAnswer >= 0) {
        wrong.add(wrongAnswer)
      }
    }
    return Array.from(wrong).map(String)
  }

  // Get operation symbol
  const getOperationSymbol = (): string => {
    switch (operation) {
      case 'addition': return '+'
      case 'subtraction': return '−'
      case 'multiplication': return '×'
      case 'division': return '÷'
      default: return '+'
    }
  }

  switch (type) {
    case 'multiple-choice': {
      const wrongAnswers = generateWrongAnswers(answer, 3)
      const allOptions = rng.shuffle([String(answer), ...wrongAnswers])
      
      let questionText: string
      if (operation === 'counting') {
        questionText = `What number comes after ${num1}?`
      } else {
        questionText = `${num1} ${getOperationSymbol()} ${num2} = ?`
      }

      return {
        id,
        levelId,
        type,
        question: questionText,
        options: allOptions,
        correctAnswer: String(answer),
        explanation: `${num1} ${getOperationSymbol()} ${num2} equals ${answer}`,
        hints: [
          operation === 'addition' ? `Try counting up from ${num1}` :
          operation === 'subtraction' ? `Try counting down from ${num1}` :
          `Think about your times tables`,
          `Take your time and work it out step by step`
        ],
        xp: 10
      }
    }

    case 'visual-count': {
      const emoji = visualEmojis ? visualEmojis[index % visualEmojis.length] : '⭐'
      const visual = emoji.repeat(num1)
      const wrongAnswers = generateWrongAnswers(num1, 3)
      const allOptions = rng.shuffle([String(num1), ...wrongAnswers])

      return {
        id,
        levelId,
        type,
        question: `Count the ${emoji}`,
        visualContent: visual,
        options: allOptions,
        correctAnswer: String(num1),
        explanation: `Count them: ${visual}. There are ${num1}!`,
        hints: [
          `Try counting each one slowly`,
          `Point to each ${emoji} as you count`
        ],
        xp: 10
      }
    }

    case 'number-line-drag': {
      // Smart range calculation to avoid overcrowding
      // Show maximum 10-12 numbers on the line
      const rangeSize = 10
      let min = Math.max(0, answer - Math.floor(rangeSize / 2))
      let max = min + rangeSize
      
      // If answer is near the start, adjust
      if (answer < rangeSize / 2) {
        min = 0
        max = rangeSize
      }

      return {
        id,
        levelId,
        type,
        question: `Where is ${answer} on the number line?`,
        numberLineMin: min,
        numberLineMax: max,
        numberLineDragCorrect: answer,
        correctAnswer: String(answer),
        explanation: `${answer} goes right here on the number line!`,
        hints: [
          `Look at the numbers on the line`,
          `Find where ${answer} should go between the other numbers`
        ],
        xp: 15
      }
    }

    case 'type-answer': {
      const questionText = `${num1} ${getOperationSymbol()} ${num2} = ?`

      return {
        id,
        levelId,
        type,
        question: questionText,
        correctAnswer: String(answer),
        acceptableAnswers: [String(answer)],
        explanation: `${num1} ${getOperationSymbol()} ${num2} equals ${answer}`,
        hints: [
          operation === 'addition' ? `Add ${num1} and ${num2} together` :
          operation === 'subtraction' ? `Take ${num2} away from ${num1}` :
          operation === 'multiplication' ? `${num1} groups of ${num2}` :
          `How many times does ${num2} go into ${num1}?`,
          `Work it out step by step`
        ],
        xp: 15
      }
    }

    case 'fill-blank': {
      const blanks = [
        { text: `${num1} ${getOperationSymbol()} ${num2} = ___`, answer: String(answer) }
      ]

      return {
        id,
        levelId,
        type,
        question: `Fill in the blank:`,
        blanks,
        correctAnswer: String(answer),
        explanation: `${num1} ${getOperationSymbol()} ${num2} equals ${answer}`,
        hints: [
          `What number makes this equation true?`,
          `Try solving ${num1} ${getOperationSymbol()} ${num2}`
        ],
        xp: 15
      }
    }

    case 'block-stacking': {
      return {
        id,
        levelId,
        type,
        question: operation === 'addition' 
          ? `${num1} + ${num2} = ?`
          : `${num1} - ${num2} = ?`,
        operation: operation === 'addition' ? 'add' : 'subtract',
        firstNumber: num1,
        secondNumber: num2,
        correctAnswer: String(answer),
        explanation: `${num1} ${getOperationSymbol()} ${num2} equals ${answer}`,
        hints: [
          operation === 'addition' ? `Stack them up and count the total` : `Remove blocks and count what's left`,
          `Count carefully!`
        ],
        xp: 15
      }
    }

    case 'ten-frame': {
      return {
        id,
        levelId,
        type,
        question: `Count the dots`,
        correctPosition: answer,
        correctAnswer: String(answer),
        explanation: `There are ${answer} dots in the ten frame!`,
        hints: [
          `Count the dots in each row`,
          `Each row can hold 5 dots`
        ],
        xp: 10
      }
    }

    case 'bubble-pop': {
      // Generate numbers to show in bubbles (target + some extra numbers)
      const target = num1 // The number we want students to count to
      const allNumbers = Array.from({ length: target + 3 }, (_, i) => i + 1) // e.g., for target=5, show 1-8
      const correctNumbers = Array.from({ length: target }, (_, i) => i + 1) // e.g., [1,2,3,4,5]
      
      return {
        id,
        levelId,
        type,
        question: `Pop the bubbles from 1 to ${target}`,
        bubbleNumbers: allNumbers,
        bubbleCorrectAnswers: correctNumbers,
        correctAnswer: String(target),
        explanation: `Great job! You counted from 1 to ${target}!`,
        hints: [
          `Start with bubble number 1`,
          `Pop the bubbles in order: 1, 2, 3...`
        ],
        xp: 15
      }
    }

    case 'balance-scale': {
      // For balance scale: left side has known value, right side needs to be balanced
      // In addition: left = num1, right = answer - num1  (so left + right = answer)
      // In subtraction: left = answer, right = num1 - answer (so left + right = num1)
      const leftSide = operation === 'addition' ? num1 : answer
      const rightSide = operation === 'addition' ? (answer - num1) : (num1 - answer)
      
      return {
        id,
        levelId,
        type,
        question: operation === 'addition' 
          ? `${leftSide} + ? = ${answer}`
          : `? + ${rightSide} = ${num1}`,
        balanceLeft: leftSide,
        balanceRight: rightSide,
        balanceItem: '⚖️',
        correctAnswer: String(rightSide),
        explanation: `${leftSide} + ${rightSide} = ${leftSide + rightSide}`,
        hints: [
          `What number balances the scale?`,
          `Think about what you need to add`
        ],
        xp: 15
      }
    }

    case 'array-grid-builder': {
      return {
        id,
        levelId,
        type,
        question: `${num1} × ${num2} = ?`,
        firstNumber: num1,
        secondNumber: num2,
        correctAnswer: String(answer),
        explanation: `${num1} rows × ${num2} columns = ${answer} items`,
        hints: [
          `Count all the items in the grid`,
          `Multiply rows times columns`
        ],
        xp: 15
      }
    }

    case 'skip-counter': {
      const skipBy = num2 || 5
      const jumps = Math.floor(num1 / skipBy)
      
      return {
        id,
        levelId,
        type,
        question: `Skip count by ${skipBy}s. What number do you land on after ${jumps} jumps?`,
        skipCountBy: skipBy,
        skipCountJumps: jumps,
        correctAnswer: String(skipBy * jumps),
        explanation: `Counting by ${skipBy}s ${jumps} times: ${skipBy * jumps}`,
        hints: [
          `Count by ${skipBy}s: ${skipBy}, ${skipBy * 2}, ${skipBy * 3}...`,
          `Jump ${jumps} times`
        ],
        xp: 15
      }
    }

    case 'fair-share': {
      const groups = num2 || 4
      const perGroup = Math.floor(num1 / groups)
      
      return {
        id,
        levelId,
        type,
        question: `${num1} ÷ ${groups} = ?`,
        fairShareTotal: num1,
        fairShareGroups: groups,
        fairShareEmoji: '🍪',
        correctAnswer: String(perGroup),
        explanation: `${num1} ÷ ${groups} = ${perGroup} cookies each`,
        hints: [
          `Divide the total by the number of friends`,
          `Make equal groups`
        ],
        xp: 15
      }
    }

    case 'division-machine': {
      return {
        id,
        levelId,
        type,
        question: `${num1} ÷ ${num2} = ?`,
        divisionDividend: num1,
        divisionDivisor: num2,
        divisionEmoji: '⭐',
        correctAnswer: String(answer),
        explanation: `${num1} ÷ ${num2} = ${answer}`,
        hints: [
          `Divide to find the answer`,
          `Use division to find out`
        ],
        xp: 15
      }
    }

    default: {
      // Fallback to multiple choice
      const wrongAnswers = generateWrongAnswers(answer, 3)
      const allOptions = rng.shuffle([String(answer), ...wrongAnswers])

      return {
        id,
        levelId,
        type: 'multiple-choice',
        question: `${num1} ${getOperationSymbol()} ${num2} = ?`,
        options: allOptions,
        correctAnswer: String(answer),
        explanation: `${num1} ${getOperationSymbol()} ${num2} equals ${answer}`,
        hints: [`Work it out step by step`],
        xp: 10
      }
    }
  }
}

/**
 * HELPER: Get questions for a level (with caching)
 * 
 * This is what your app will call. It generates questions once per user session
 * and caches them so the student sees the same questions if they replay.
 */
export function getQuestionsForLevel(levelId: number, userId?: string): Question[] {
  // Use userId as seed so each user gets different questions, but consistent per user
  const seed = userId 
    ? userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), levelId * 1000)
    : levelId * 1000

  return generateQuestionsForLevel(levelId, seed)
}
