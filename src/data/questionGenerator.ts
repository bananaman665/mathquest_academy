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
    unit: "Addition 1-5",
    operation: 'addition',
    numberRange: { min: 1, max: 5 },
    answerRange: { min: 2, max: 10 },
    questionTypes: ['ten-frame', 'multiple-choice', 'number-line-drag', 'balance-scale', 'block-stacking'],
    totalQuestions: 10,
    difficulty: 'easy',
    visualEmojis: ['⭐', '🍎', '🎈']
  },
  7: {
    levelId: 7,
    unit: "Addition 1-10",
    operation: 'addition',
    numberRange: { min: 1, max: 10 },
    answerRange: { min: 2, max: 20 },
    questionTypes: ['multiple-choice', 'number-line-drag', 'block-stacking', 'balance-scale'],
    totalQuestions: 10,
    difficulty: 'easy'
  },
  8: {
    levelId: 8,
    unit: "Addition Facts",
    operation: 'addition',
    numberRange: { min: 1, max: 10 },
    answerRange: { min: 2, max: 20 },
    questionTypes: ['multiple-choice', 'type-answer', 'fill-blank'],
    totalQuestions: 10,
    difficulty: 'medium'
  },
  9: {
    levelId: 9,
    unit: "Word Problems Addition",
    operation: 'addition',
    numberRange: { min: 1, max: 10 },
    answerRange: { min: 2, max: 20 },
    questionTypes: ['multiple-choice', 'type-answer'],
    totalQuestions: 10,
    difficulty: 'medium'
  },
  10: {
    levelId: 10,
    unit: "Addition Practice",
    operation: 'addition',
    numberRange: { min: 1, max: 10 },
    answerRange: { min: 2, max: 20 },
    questionTypes: ['multiple-choice', 'type-answer', 'number-line-drag', 'ten-frame', 'balance-scale'],
    totalQuestions: 10,
    difficulty: 'medium'
  },

  // UNIT 3: SUBTRACTION WITHIN 10 (Levels 11-15)
  11: {
    levelId: 11,
    unit: "Subtraction 1-5",
    operation: 'subtraction',
    numberRange: { min: 1, max: 5 },
    answerRange: { min: 0, max: 5 },
    questionTypes: ['ten-frame', 'multiple-choice', 'number-line-drag', 'balance-scale', 'block-stacking'],
    totalQuestions: 10,
    difficulty: 'easy',
    allowNegatives: false
  },
  12: {
    levelId: 12,
    unit: "Subtraction 1-10",
    operation: 'subtraction',
    numberRange: { min: 1, max: 10 },
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
    numberRange: { min: 1, max: 10 },
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
    numberRange: { min: 1, max: 10 },
    answerRange: { min: 0, max: 10 },
    questionTypes: ['multiple-choice', 'type-answer', 'number-line-drag', 'ten-frame', 'balance-scale'],
    totalQuestions: 10,
    difficulty: 'medium',
    allowNegatives: false
  },

  // UNIT 4: ADDITION & SUBTRACTION WITHIN 100 (Levels 16-20)
  16: {
    levelId: 16,
    unit: "Addition 2-Digit",
    operation: 'addition',
    numberRange: { min: 10, max: 50 },
    answerRange: { min: 20, max: 100 },
    questionTypes: ['multiple-choice', 'type-answer'],
    totalQuestions: 10,
    difficulty: 'hard'
  },
  17: {
    levelId: 17,
    unit: "Subtraction 2-Digit",
    operation: 'subtraction',
    numberRange: { min: 10, max: 50 },
    answerRange: { min: 0, max: 50 },
    questionTypes: ['multiple-choice', 'type-answer'],
    totalQuestions: 10,
    difficulty: 'hard',
    allowNegatives: false
  },
  18: {
    levelId: 18,
    unit: "Regrouping Addition",
    operation: 'addition',
    numberRange: { min: 15, max: 99 },
    answerRange: { min: 30, max: 198 },
    questionTypes: ['multiple-choice', 'type-answer'],
    totalQuestions: 10,
    difficulty: 'hard'
  },
  19: {
    levelId: 19,
    unit: "Regrouping Subtraction",
    operation: 'subtraction',
    numberRange: { min: 20, max: 99 },
    answerRange: { min: 0, max: 79 },
    questionTypes: ['multiple-choice', 'type-answer'],
    totalQuestions: 10,
    difficulty: 'hard',
    allowNegatives: false
  },
  20: {
    levelId: 20,
    unit: "Mixed 2-Digit Operations",
    operation: 'mixed',
    numberRange: { min: 10, max: 99 },
    answerRange: { min: 0, max: 198 },
    questionTypes: ['multiple-choice', 'type-answer'],
    totalQuestions: 10,
    difficulty: 'hard'
  },

  // UNIT 5: MULTIPLICATION BASICS (Levels 21-25)
  21: {
    levelId: 21,
    unit: "Introduction to Multiplication",
    operation: 'multiplication',
    numberRange: { min: 1, max: 5 },
    answerRange: { min: 1, max: 25 },
    questionTypes: ['array-grid-builder', 'group-maker', 'multiple-choice'],
    totalQuestions: 10,
    difficulty: 'medium'
  },
  22: {
    levelId: 22,
    unit: "Times Tables 2, 5, 10",
    operation: 'multiplication',
    numberRange: { min: 1, max: 10 },
    answerRange: { min: 1, max: 100 },
    questionTypes: ['skip-counter', 'multiple-choice', 'type-answer'],
    totalQuestions: 10,
    difficulty: 'medium'
  },
  23: {
    levelId: 23,
    unit: "Times Tables 3, 4, 6",
    operation: 'multiplication',
    numberRange: { min: 1, max: 10 },
    answerRange: { min: 1, max: 60 },
    questionTypes: ['multiple-choice', 'type-answer', 'array-grid-builder'],
    totalQuestions: 10,
    difficulty: 'hard'
  },
  24: {
    levelId: 24,
    unit: "Times Tables 7, 8, 9",
    operation: 'multiplication',
    numberRange: { min: 1, max: 10 },
    answerRange: { min: 1, max: 90 },
    questionTypes: ['multiple-choice', 'type-answer'],
    totalQuestions: 10,
    difficulty: 'hard'
  },
  25: {
    levelId: 25,
    unit: "All Times Tables",
    operation: 'multiplication',
    numberRange: { min: 1, max: 12 },
    answerRange: { min: 1, max: 144 },
    questionTypes: ['multiple-choice', 'type-answer', 'fill-blank'],
    totalQuestions: 10,
    difficulty: 'hard'
  },

  // UNIT 6: DIVISION BASICS (Levels 26-30)
  26: {
    levelId: 26,
    unit: "Introduction to Division",
    operation: 'division',
    numberRange: { min: 2, max: 10 },
    answerRange: { min: 1, max: 10 },
    questionTypes: ['fair-share', 'group-maker', 'multiple-choice'],
    totalQuestions: 10,
    difficulty: 'medium',
    allowRemainders: false
  },
  27: {
    levelId: 27,
    unit: "Division by 2, 5, 10",
    operation: 'division',
    numberRange: { min: 2, max: 50 },
    answerRange: { min: 1, max: 10 },
    questionTypes: ['division-machine', 'multiple-choice', 'type-answer'],
    totalQuestions: 10,
    difficulty: 'medium',
    allowRemainders: false
  },
  28: {
    levelId: 28,
    unit: "Division Facts",
    operation: 'division',
    numberRange: { min: 3, max: 81 },
    answerRange: { min: 1, max: 12 },
    questionTypes: ['multiple-choice', 'type-answer'],
    totalQuestions: 10,
    difficulty: 'hard',
    allowRemainders: false
  },
  29: {
    levelId: 29,
    unit: "Division with Remainders",
    operation: 'division',
    numberRange: { min: 3, max: 50 },
    answerRange: { min: 1, max: 12 },
    questionTypes: ['multiple-choice', 'type-answer', 'division-machine'],
    totalQuestions: 10,
    difficulty: 'hard',
    allowRemainders: true
  },
  30: {
    levelId: 30,
    unit: "Multiplication & Division Practice",
    operation: 'mixed',
    numberRange: { min: 1, max: 100 },
    answerRange: { min: 1, max: 100 },
    questionTypes: ['multiple-choice', 'type-answer'],
    totalQuestions: 10,
    difficulty: 'hard'
  },

  // UNIT 7: ADDITION & SUBTRACTION WITHIN 20 (Levels 31-35)
  31: {
    levelId: 31,
    unit: "Addition 11-20",
    operation: 'addition',
    numberRange: { min: 1, max: 20 },
    answerRange: { min: 2, max: 20 },
    questionTypes: ['multiple-choice', 'number-line-drag', 'type-answer', 'balance-scale'],
    totalQuestions: 10,
    difficulty: 'medium'
  },
  32: {
    levelId: 32,
    unit: "Subtraction 11-20",
    operation: 'subtraction',
    numberRange: { min: 1, max: 20 },
    answerRange: { min: 0, max: 20 },
    questionTypes: ['multiple-choice', 'number-line-drag', 'type-answer', 'balance-scale'],
    totalQuestions: 10,
    difficulty: 'medium',
    allowNegatives: false
  },
  33: {
    levelId: 33,
    unit: "Mixed Operations 1-20",
    operation: 'mixed',
    numberRange: { min: 1, max: 20 },
    answerRange: { min: 0, max: 20 },
    questionTypes: ['multiple-choice', 'type-answer', 'fill-blank'],
    totalQuestions: 10,
    difficulty: 'medium'
  },
  34: {
    levelId: 34,
    unit: "Word Problems 1-20",
    operation: 'mixed',
    numberRange: { min: 1, max: 20 },
    answerRange: { min: 0, max: 20 },
    questionTypes: ['multiple-choice', 'type-answer'],
    totalQuestions: 10,
    difficulty: 'hard'
  },
  35: {
    levelId: 35,
    unit: "Practice 1-20",
    operation: 'mixed',
    numberRange: { min: 1, max: 20 },
    answerRange: { min: 0, max: 20 },
    questionTypes: ['multiple-choice', 'type-answer', 'number-line-drag'],
    totalQuestions: 10,
    difficulty: 'hard'
  },

  // UNIT 8: PLACE VALUE (Levels 36-40)
  36: {
    levelId: 36,
    unit: "Tens and Ones",
    operation: 'place-value',
    numberRange: { min: 10, max: 99 },
    questionTypes: ['multiple-choice', 'fill-blank'],
    totalQuestions: 10,
    difficulty: 'medium'
  },
  37: {
    levelId: 37,
    unit: "Counting by 10s",
    operation: 'place-value',
    numberRange: { min: 10, max: 100 },
    questionTypes: ['multiple-choice', 'number-sequence', 'type-answer'],
    totalQuestions: 10,
    difficulty: 'medium'
  },
  38: {
    levelId: 38,
    unit: "Compare 2-Digit Numbers",
    operation: 'place-value',
    numberRange: { min: 10, max: 99 },
    questionTypes: ['multiple-choice', 'type-answer'],
    totalQuestions: 10,
    difficulty: 'medium'
  },
  39: {
    levelId: 39,
    unit: "Hundreds Place",
    operation: 'place-value',
    numberRange: { min: 100, max: 999 },
    questionTypes: ['multiple-choice', 'fill-blank'],
    totalQuestions: 10,
    difficulty: 'hard'
  },
  40: {
    levelId: 40,
    unit: "Place Value Practice",
    operation: 'place-value',
    numberRange: { min: 1, max: 999 },
    questionTypes: ['multiple-choice', 'type-answer', 'fill-blank'],
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
    questionTypes: ['multiple-choice', 'type-answer'],
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
    questionTypes: ['multiple-choice', 'type-answer', 'fraction-builder'],
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

  // UNIT 10: DECIMALS (Levels 46-50)
  46: {
    levelId: 46,
    unit: "Introduction to Decimals",
    operation: 'mixed',
    numberRange: { min: 0, max: 10 },
    questionTypes: ['multiple-choice', 'type-answer', 'number-line-drag'],
    totalQuestions: 10,
    difficulty: 'hard',
    allowDecimals: true
  },
  47: {
    levelId: 47,
    unit: "Tenths and Hundredths",
    operation: 'mixed',
    numberRange: { min: 0, max: 10 },
    questionTypes: ['multiple-choice', 'type-answer', 'fill-blank'],
    totalQuestions: 10,
    difficulty: 'hard',
    allowDecimals: true
  },
  48: {
    levelId: 48,
    unit: "Adding Decimals",
    operation: 'addition',
    numberRange: { min: 0, max: 20 },
    questionTypes: ['multiple-choice', 'type-answer'],
    totalQuestions: 10,
    difficulty: 'hard',
    allowDecimals: true
  },
  49: {
    levelId: 49,
    unit: "Subtracting Decimals",
    operation: 'subtraction',
    numberRange: { min: 0, max: 20 },
    questionTypes: ['multiple-choice', 'type-answer'],
    totalQuestions: 10,
    difficulty: 'hard',
    allowDecimals: true
  },
  50: {
    levelId: 50,
    unit: "Decimal Master",
    operation: 'mixed',
    numberRange: { min: 0, max: 50 },
    answerRange: { min: 0, max: 100 },
    questionTypes: ['multiple-choice', 'type-answer', 'fill-blank'],
    totalQuestions: 15,
    difficulty: 'hard',
    allowDecimals: true
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
  // Track the actual operation used (important for mixed/place-value)
  let actualOperation = operation

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
      // Debug logging for addition with 0
      if (process.env.NODE_ENV === 'development' && (num2 === 0 || num1 === 0)) {
        console.log(`[DEBUG] Addition: ${num1} + ${num2} = ${answer}`)
      }
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
      num1 = rng.nextInt(numberRange.min, Math.min(numberRange.max, 12)) // Keep factors reasonable
      num2 = rng.nextInt(numberRange.min, Math.min(numberRange.max, 12))
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
        // Generate divisor first (the number we're dividing by)
        num2 = rng.nextInt(Math.max(2, numberRange.min), Math.min(numberRange.max, 12))
        
        // Generate answer (quotient) - ensure it's within a reasonable range
        answer = answerRange
          ? rng.nextInt(answerRange.min, answerRange.max)
          : rng.nextInt(Math.max(1, numberRange.min), Math.min(10, numberRange.max))
        
        // Calculate dividend (num1 = answer * num2)
        num1 = answer * num2
        
        // Validate that num1 is within numberRange, regenerate if not
        if (num1 > numberRange.max) {
          // Recalculate with smaller answer
          answer = Math.floor(numberRange.max / num2)
          num1 = answer * num2
        }
      }
      break

    case 'counting':
      num1 = rng.nextInt(numberRange.min, numberRange.max - 1) // Ensure we can add 1
      num2 = 0
      answer = num1 + 1 // The number that comes AFTER num1
      break

    case 'place-value':
      // Generate a number for place value questions
      // For levels 21-25: focus on tens, ones, hundreds place
      num1 = rng.nextInt(numberRange.min, numberRange.max)
      
      // Determine what place value to ask about based on number size
      if (num1 >= 100) {
        // Ask about hundreds, tens, or ones
        const placeType = rng.nextInt(1, 3) // 1=hundreds, 2=tens, 3=ones
        if (placeType === 1) {
          answer = Math.floor(num1 / 100) // Hundreds digit
          num2 = 100 // Store place type
        } else if (placeType === 2) {
          answer = Math.floor((num1 % 100) / 10) // Tens digit
          num2 = 10
        } else {
          answer = num1 % 10 // Ones digit
          num2 = 1
        }
      } else if (num1 >= 10) {
        // Ask about tens or ones
        const placeType = rng.nextInt(1, 2) // 1=tens, 2=ones
        if (placeType === 1) {
          answer = Math.floor(num1 / 10) // Tens digit
          num2 = 10
        } else {
          answer = num1 % 10 // Ones digit
          num2 = 1
        }
      } else {
        // Single digit, just ask about the value
        answer = num1
        num2 = 1
      }
      break

    case 'fractions':
      // Generate proper fraction questions
      // num1 = numerator, num2 = denominator, answer = correct numerator
      if (levelId === 41) {
        // Level 41: Introduction - Simple fractions (1/2, 1/4, 1/3, 2/3, 3/4)
        const commonFractions = [
          [1, 2], // 1/2
          [1, 4], // 1/4
          [3, 4], // 3/4
          [1, 3], // 1/3
          [2, 3], // 2/3
        ]
        const fraction = commonFractions[rng.nextInt(0, commonFractions.length - 1)]
        num1 = fraction[0] // numerator
        num2 = fraction[1] // denominator
        answer = num1 // for fraction identification
      } else if (levelId === 42) {
        // Level 42: Comparing Fractions (same denominator)
        num2 = rng.nextInt(2, 8) // denominator
        num1 = rng.nextInt(1, num2 - 1) // numerator
        answer = rng.nextInt(1, num2 - 1) // second numerator to compare
      } else if (levelId === 43) {
        // Level 43: Adding Fractions (same denominator)
        num2 = rng.nextInt(2, 8) // denominator
        num1 = rng.nextInt(1, num2 - 1) // first numerator
        const num3 = rng.nextInt(1, num2 - num1) // second numerator
        answer = num1 + num3 // sum of numerators
      } else if (levelId === 44) {
        // Level 44: Subtracting Fractions (same denominator)
        num2 = rng.nextInt(2, 8) // denominator
        answer = rng.nextInt(1, num2 - 1) // result numerator
        num1 = rng.nextInt(answer + 1, num2) // starting numerator (must be larger)
      } else {
        // Level 45: Mixed fraction practice
        num2 = rng.nextInt(2, 8) // denominator
        num1 = rng.nextInt(1, num2) // numerator
        answer = num1
      }
      actualOperation = 'fractions'
      break

    case 'mixed':
    default:
      // For mixed operations, choose operations based on curriculum progression
      // Levels 1-20: Only addition and subtraction (before multiplication is taught)
      // Levels 21+: All four operations (after multiplication/division are introduced)
      const ops = levelId >= 21 
        ? ['addition', 'subtraction', 'multiplication', 'division']
        : ['addition', 'subtraction']
      const randomOp = ops[Math.floor(rng.next() * ops.length)] as 'addition' | 'subtraction' | 'multiplication' | 'division'
      
      // Track the actual operation used for display (instead of trying to reassign const operation)
      actualOperation = randomOp
      
      if (randomOp === 'addition') {
        num1 = rng.nextInt(numberRange.min, numberRange.max)
        num2 = rng.nextInt(numberRange.min, numberRange.max)
        answer = num1 + num2
      } else if (randomOp === 'subtraction') {
        // Generate answer first to avoid negatives
        answer = rng.nextInt(numberRange.min, numberRange.max)
        num2 = rng.nextInt(numberRange.min, numberRange.max)
        num1 = answer + num2
      } else if (randomOp === 'multiplication') {
        // Keep multiplication factors reasonable (1-12)
        num1 = rng.nextInt(Math.max(1, numberRange.min), Math.min(numberRange.max, 12))
        num2 = rng.nextInt(Math.max(1, numberRange.min), Math.min(numberRange.max, 12))
        answer = num1 * num2
      } else {
        // Division: generate answer and divisor, then dividend = answer * divisor
        // This ensures no remainders
        num2 = rng.nextInt(Math.max(2, numberRange.min), Math.min(numberRange.max, 12))
        answer = rng.nextInt(Math.max(1, numberRange.min), Math.min(10, numberRange.max))
        num1 = answer * num2
        
        // Validate that num1 is within numberRange
        if (num1 > numberRange.max) {
          answer = Math.floor(numberRange.max / num2)
          num1 = answer * num2
        }
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
    questionIndex,
    actualOperation // Pass the actual operation used for correct symbol display
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
  index: number,
  actualOperation: string // The actual operation used (important for mixed/place-value)
): Question {
  const { levelId, visualEmojis } = config
  const id = `${levelId}-${index + 1}`
  // Use actualOperation instead of config.operation for symbol display
  const operation = actualOperation as 'addition' | 'subtraction' | 'multiplication' | 'division' | 'counting' | 'place-value' | 'fractions' | 'mixed'


  // Generate wrong answers for multiple choice
  const generateWrongAnswers = (correct: number, count: number = 3, isFraction: boolean = false, denominator?: number): string[] => {
    const wrong = new Set<string>()
    
    if (isFraction && denominator) {
      // For fractions, generate wrong numerators
      while (wrong.size < count) {
        const offset = rng.nextInt(-3, 3)
        const wrongNumerator = correct + offset
        if (wrongNumerator !== correct && wrongNumerator > 0 && wrongNumerator < denominator) {
          wrong.add(`${wrongNumerator}/${denominator}`)
        }
      }
      // Ensure we have enough wrong answers
      while (wrong.size < count) {
        const randomNum = rng.nextInt(1, denominator)
        if (randomNum !== correct) {
          wrong.add(`${randomNum}/${denominator}`)
        }
      }
    } else {
      // Regular number wrong answers
      while (wrong.size < count) {
        const offset = rng.nextInt(-5, 5)
        const wrongAnswer = correct + offset
        if (wrongAnswer !== correct && wrongAnswer >= 0) {
          wrong.add(String(wrongAnswer))
        }
      }
    }
    return Array.from(wrong)
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
      // Generate wrong answers based on operation type
      const isFraction = operation === 'fractions'
      
      let wrongAnswers: string[]
      let correctAnswerString: string
      
      if (isFraction && levelId === 42) {
        // Level 42: Comparison - provide the two fractions as options
        const fraction1 = `${num1}/${num2}`
        const fraction2 = `${answer}/${num2}`
        const greater = num1 > answer ? fraction1 : fraction2
        correctAnswerString = greater
        wrongAnswers = [num1 > answer ? fraction2 : fraction1] // The other fraction
        // Add some other fractions as distractors
        const distractor1 = `${Math.max(1, num1 - 1)}/${num2}`
        const distractor2 = `${Math.min(num2 - 1, answer + 1)}/${num2}`
        if (distractor1 !== fraction1 && distractor1 !== fraction2) wrongAnswers.push(distractor1)
        if (distractor2 !== fraction1 && distractor2 !== fraction2 && wrongAnswers.length < 3) wrongAnswers.push(distractor2)
      } else if (isFraction && (levelId === 41 || levelId === 45)) {
        // Levels 41, 45: Identify fractions
        wrongAnswers = generateWrongAnswers(answer, 3, true, num2)
        correctAnswerString = `${num1}/${num2}`
      } else if (isFraction && (levelId === 43 || levelId === 44)) {
        // Levels 43, 44: Add/subtract fractions - answer is a fraction
        wrongAnswers = generateWrongAnswers(answer, 3, true, num2)
        correctAnswerString = `${answer}/${num2}`
      } else {
        // Regular operations
        wrongAnswers = generateWrongAnswers(answer, 3, false)
        correctAnswerString = String(answer)
      }
        
      const allOptions = rng.shuffle([correctAnswerString, ...wrongAnswers])
      
      let questionText: string
      let explanationText: string
      
      if (operation === 'counting') {
        questionText = `What number comes after ${num1}?`
        explanationText = `The number after ${num1} is ${answer}. We count: ${num1}, ${answer}!`
      } else if (operation === 'place-value') {
        // Place value questions
        const placeNames = { 1: 'ones', 10: 'tens', 100: 'hundreds' }
        const placeName = placeNames[num2 as keyof typeof placeNames] || 'ones'
        
        // Vary the question format for different levels
        const questionFormats = [
          `What is the ${placeName} digit in ${num1}?`,
          `In the number ${num1}, what digit is in the ${placeName} place?`,
          `What number is in the ${placeName} place of ${num1}?`
        ]
        questionText = questionFormats[index % questionFormats.length]
        explanationText = `In ${num1}, the ${placeName} digit is ${answer}`
      } else if (operation === 'fractions') {
        // Fraction questions
        if (levelId === 41) {
          // Level 41: Identify fractions
          questionText = `What fraction is shown?`
          explanationText = `The fraction is ${num1}/${num2} (${num1} out of ${num2} parts)`
        } else if (levelId === 42) {
          // Level 42: Compare fractions
          questionText = `Which is greater: ${num1}/${num2} or ${answer}/${num2}?`
          const greater = num1 > answer ? num1 : answer
          explanationText = `${greater}/${num2} is greater because ${greater} parts is more than ${num1 === greater ? answer : num1} parts`
        } else if (levelId === 43) {
          // Level 43: Add fractions
          const num3 = answer - num1 // second addend
          questionText = `${num1}/${num2} + ${num3}/${num2} = ?`
          explanationText = `${num1}/${num2} + ${num3}/${num2} = ${answer}/${num2}`
        } else if (levelId === 44) {
          // Level 44: Subtract fractions
          const subtrahend = num1 - answer
          questionText = `${num1}/${num2} − ${subtrahend}/${num2} = ?`
          explanationText = `${num1}/${num2} − ${subtrahend}/${num2} = ${answer}/${num2}`
        } else {
          // Level 45: Mixed
          questionText = `What fraction is ${num1} out of ${num2}?`
          explanationText = `${num1} out of ${num2} is ${num1}/${num2}`
        }
      } else {
        questionText = `${num1} ${getOperationSymbol()} ${num2} = ?`
        explanationText = `${num1} ${getOperationSymbol()} ${num2} equals ${answer}`
      }

      return {
        id,
        levelId,
        type,
        question: questionText,
        options: allOptions,
        correctAnswer: correctAnswerString,
        explanation: explanationText,
        hints: [
          operation === 'addition' ? `Try counting up from ${num1}` :
          operation === 'subtraction' ? `Try counting down from ${num1}` :
          operation === 'counting' ? `Count forward: ${num1}, ${answer}...` :
          operation === 'place-value' ? `Look at each digit's position in the number` :
          operation === 'fractions' ? `Look at how many parts are shaded` :
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
      let questionText: string
      let explanationText: string
      let correctAnswerString: string
      let acceptableAnswersList: string[]
      
      if (operation === 'counting') {
        // For counting questions - "What number comes after X?"
        questionText = `What number comes after ${num1}?`
        explanationText = `The number after ${num1} is ${answer}`
        correctAnswerString = String(answer)
        acceptableAnswersList = [String(answer)]
      } else if (operation === 'place-value') {
        // Place value questions
        const placeNames = { 1: 'ones', 10: 'tens', 100: 'hundreds' }
        const placeName = placeNames[num2 as keyof typeof placeNames] || 'ones'
        questionText = `In the number ${num1}, what digit is in the ${placeName} place?`
        explanationText = `In ${num1}, the ${placeName} digit is ${answer}`
        correctAnswerString = String(answer)
        acceptableAnswersList = [String(answer)]
      } else if (operation === 'fractions') {
        // Fraction questions
        if (levelId === 42) {
          // Comparison
          const fraction1 = `${num1}/${num2}`
          const fraction2 = `${answer}/${num2}`
          const greater = num1 > answer ? fraction1 : fraction2
          questionText = `Which is greater: ${fraction1} or ${fraction2}? (Type the larger fraction)`
          explanationText = `${greater} is greater because ${num1 > answer ? num1 : answer} parts is more than ${num1 > answer ? answer : num1} parts`
          correctAnswerString = greater
          acceptableAnswersList = [greater]
        } else if (levelId === 43) {
          // Addition
          const num3 = answer - num1
          questionText = `${num1}/${num2} + ${num3}/${num2} = ? (Type as fraction like 3/4)`
          explanationText = `${num1}/${num2} + ${num3}/${num2} = ${answer}/${num2}`
          correctAnswerString = `${answer}/${num2}`
          acceptableAnswersList = [`${answer}/${num2}`]
        } else if (levelId === 44) {
          // Subtraction
          const subtrahend = num1 - answer
          questionText = `${num1}/${num2} − ${subtrahend}/${num2} = ? (Type as fraction like 2/5)`
          explanationText = `${num1}/${num2} − ${subtrahend}/${num2} = ${answer}/${num2}`
          correctAnswerString = `${answer}/${num2}`
          acceptableAnswersList = [`${answer}/${num2}`]
        } else {
          // Default fraction identification
          questionText = `What fraction is ${num1} out of ${num2}? (Type as fraction)`
          explanationText = `${num1} out of ${num2} is ${num1}/${num2}`
          correctAnswerString = `${num1}/${num2}`
          acceptableAnswersList = [`${num1}/${num2}`]
        }
      } else {
        questionText = `${num1} ${getOperationSymbol()} ${num2} = ?`
        explanationText = `${num1} ${getOperationSymbol()} ${num2} equals ${answer}`
        correctAnswerString = String(answer)
        acceptableAnswersList = [String(answer)]
      }

      return {
        id,
        levelId,
        type,
        question: questionText,
        correctAnswer: correctAnswerString,
        acceptableAnswers: acceptableAnswersList,
        explanation: explanationText,
        hints: [
          operation === 'counting' ? `Count forward: ${num1}, ${answer}...` :
          operation === 'addition' ? `Add ${num1} and ${num2} together` :
          operation === 'subtraction' ? `Take ${num2} away from ${num1}` :
          operation === 'multiplication' ? `${num1} groups of ${num2}` :
          operation === 'place-value' ? `Look at each digit's position in ${num1}` :
          operation === 'fractions' ? `Remember to use fraction format like 3/4` :
          `How many times does ${num2} go into ${num1}?`,
          `Work it out step by step`
        ],
        xp: 15
      }
    }

    case 'number-sequence': {
      if (operation === 'place-value' && levelId === 37) {
        // Counting by 10s sequence: "10, 20, 30, __, 50"
        const skipBy = 10
        const start = Math.floor(num1 / skipBy) * skipBy // Round to nearest 10
        const sequence = [start, start + skipBy, start + skipBy * 2, start + skipBy * 4]
        const missingIndex = 3 // Missing the 4th number
        const correctAnswer = start + skipBy * 3
        
        const wrongAnswers = generateWrongAnswers(correctAnswer, 3)
        const allOptions = rng.shuffle([String(correctAnswer), ...wrongAnswers])
        
        return {
          id,
          levelId,
          type: 'multiple-choice',
          question: `Fill in the missing number: ${sequence[0]}, ${sequence[1]}, ${sequence[2]}, __, ${sequence[3]}`,
          options: allOptions,
          correctAnswer: String(correctAnswer),
          explanation: `When counting by ${skipBy}s: ${sequence[0]}, ${sequence[1]}, ${sequence[2]}, ${correctAnswer}, ${sequence[3]}`,
          hints: [
            `Count by ${skipBy}s`,
            `What number comes between ${sequence[2]} and ${sequence[3]}?`
          ],
          xp: 10
        }
      } else {
        // Default number sequence - use the pre-calculated answer
        const wrongAnswers = generateWrongAnswers(answer, 3)
        const allOptions = rng.shuffle([String(answer), ...wrongAnswers])
        
        return {
          id,
          levelId,
          type: 'multiple-choice',
          question: `What comes next? ${num1 - 2}, ${num1 - 1}, ${num1}, __`,
          options: allOptions,
          correctAnswer: String(answer),
          explanation: `The next number is ${answer}`,
          hints: [`Count forward by 1`, `What number comes after ${num1}?`],
          xp: 10
        }
      }
    }

    case 'fill-blank': {
      let questionText: string
      let blanks: Array<{ text: string; answer: string }>
      let explanationText: string
      
      if (operation === 'counting') {
        // For counting questions - "What number comes after X?"
        questionText = `What number comes after ${num1}?`
        blanks = [{ text: `${num1}, ___`, answer: String(answer) }]
        explanationText = `The number after ${num1} is ${answer}`
        if (process.env.NODE_ENV === 'development') {
          console.log(`[FILL-BLANK-COUNTING] Question: "${questionText}", Answer: ${answer}`)
        }
      } else if (operation === 'place-value') {
        // Place value questions
        const placeNames = { 1: 'ones', 10: 'tens', 100: 'hundreds' }
        const placeName = placeNames[num2 as keyof typeof placeNames] || 'ones'
        questionText = `What digit is in the ${placeName} place?`
        blanks = [{ text: `${num1} → ___`, answer: String(answer) }]
        explanationText = `In ${num1}, the ${placeName} digit is ${answer}`
      } else {
        questionText = `Fill in the blank:`
        blanks = [{ text: `${num1} ${getOperationSymbol()} ${num2} = ___`, answer: String(answer) }]
        explanationText = `${num1} ${getOperationSymbol()} ${num2} equals ${answer}`
      }

      return {
        id,
        levelId,
        type,
        question: questionText,
        blanks,
        correctAnswer: String(answer),
        explanation: explanationText,
        hints: [
          operation === 'counting' ? `Count forward from ${num1}` :
          `What number makes this equation true?`,
          operation === 'counting' ? `What comes next?` :
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
      // For balance scale: Show equation format where user finds missing value
      // Question: num1 + ? = answer
      // Left side: num1 + missing (user selects)
      // Right side: answer (the total we want)
      // Correct answer: answer - num1
      
      const missingValue = operation === 'addition' 
        ? answer - num1  // For 3 + ? = 10, missing = 7
        : num1 - answer  // For subtraction
      
      return {
        id,
        levelId,
        type,
        question: operation === 'addition' 
          ? `${num1} + ? = ${answer}`
          : `? + ${num2} = ${num1}`,
        balanceLeft: num1,           // The known number on left side
        balanceRight: answer,        // The total on right side
        balanceItem: '⚖️',
        correctAnswer: String(missingValue),
        explanation: `${num1} + ${missingValue} = ${answer}`,
        hints: [
          `What number balances the scale?`,
          `Think: ${num1} + ? = ${answer}`
        ],
        xp: 15
      }
    }

    case 'fraction-builder': {
      // For fractions: num1 = numerator, num2 = denominator
      const numerator = num1
      const denominator = num2 || 4 // Default to quarters if not specified
      
      let questionText: string
      let correctAnswer: string
      let explanationText: string
      
      if (levelId === 41) {
        // Introduction: "What fraction is shown?"
        questionText = `What fraction is shown?`
        correctAnswer = `${numerator}/${denominator}`
        explanationText = `The fraction shows ${numerator} out of ${denominator} parts: ${numerator}/${denominator}`
      } else if (levelId === 42) {
        // Comparing: Show two fractions
        questionText = `Which fraction is larger?`
        correctAnswer = numerator > answer ? `${numerator}/${denominator}` : `${answer}/${denominator}`
        explanationText = `${correctAnswer} is larger because it has more shaded parts`
      } else if (levelId === 43) {
        // Adding: Calculate sum
        const num3 = answer - numerator
        questionText = `${numerator}/${denominator} + ${num3}/${denominator} = ?`
        correctAnswer = `${answer}/${denominator}`
        explanationText = `${numerator}/${denominator} + ${num3}/${denominator} = ${answer}/${denominator}`
      } else if (levelId === 44) {
        // Subtracting: Calculate difference
        const subtrahend = numerator - answer
        questionText = `${numerator}/${denominator} − ${subtrahend}/${denominator} = ?`
        correctAnswer = `${answer}/${denominator}`
        explanationText = `${numerator}/${denominator} − ${subtrahend}/${denominator} = ${answer}/${denominator}`
      } else {
        // Level 45: Mixed practice
        questionText = `What fraction is shown?`
        correctAnswer = `${numerator}/${denominator}`
        explanationText = `The fraction is ${numerator}/${denominator}`
      }
      
      return {
        id,
        levelId,
        type,
        question: questionText,
        fractionNumerator: numerator,
        fractionDenominator: denominator,
        correctAnswer,
        explanation: explanationText,
        hints: [
          `Look at how many parts are shaded`,
          `Count the total number of equal parts`
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
      // Fallback to multiple choice for unknown question types (tap-select, ten-frame, bubble-pop, etc.)
      const wrongAnswers = generateWrongAnswers(answer, 3)
      const allOptions = rng.shuffle([String(answer), ...wrongAnswers])

      let questionText: string
      let explanationText: string
      
      if (operation === 'counting') {
        questionText = `What number comes after ${num1}?`
        explanationText = `The number after ${num1} is ${answer}. We count: ${num1}, ${answer}!`
      } else {
        questionText = `${num1} ${getOperationSymbol()} ${num2} = ?`
        explanationText = `${num1} ${getOperationSymbol()} ${num2} equals ${answer}`
      }

      return {
        id,
        levelId,
        type: 'multiple-choice',
        question: questionText,
        options: allOptions,
        correctAnswer: String(answer),
        explanation: explanationText,
        hints: [
          operation === 'counting' ? `Count forward: ${num1}, ${answer}...` : `Work it out step by step`
        ],
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
