/**
 * QUESTIONS.TS - STREAMLINED VERSION
 * 
 * This file now uses the question generator system instead of hardcoding thousands of questions.
 * 
 * OLD WAY: 4000+ lines of hardcoded questions
 * NEW WAY: ~200 lines of configuration + generator creates questions dynamically
 * 
 * Questions are generated based on level configuration, ensuring:
 * - Addition questions only add (never subtract)
 * - Subtraction questions only subtract (and never go negative)
 * - Numbers fit the level's difficulty range
 * - Questions are consistent per user but varied across users
 */

// Re-export types from question generator
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
  | 'bubble-pop'
  // New Interactive Types (Month 1)
  | 'number-line-drag'
  | 'fraction-builder'
  | 'clock-setter'
  | 'graph-plotter'
  | 'money-counter'
  | 'array-builder'
  | 'balance-scale'
  | 'shape-composer'
  | 'fill-the-jar'
  // Multiplication/Division Interactive Types
  | 'array-grid-builder'
  | 'group-maker'
  | 'skip-counter'
  | 'fair-share'
  | 'division-machine'

export interface Question {
  id: string
  levelId: number
  type: QuestionType
  question: string
  visualContent?: string // For star counting: "⭐⭐⭐"
  options?: string[]
  correctAnswer?: string
  explanation?: string
  hints?: string[] // Helpful guidance without giving away the answer
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
  // Bubble pop
  bubbleNumbers?: number[] // All numbers to show in bubbles
  bubbleCorrectAnswers?: number[] // Numbers that should be popped
  
  // New Interactive Types (Month 1)
  // Number Line Drag (enhanced version of number-line-placement)
  numberLineDragCorrect?: number // The correct position to drag marker to
  
  // Fraction Builder
  fractionNumerator?: number
  fractionDenominator?: number
  fractionVisual?: string // SVG or emoji representation
  
  // Clock Setter
  clockHour?: number
  clockMinute?: number
  clockFormat?: '12h' | '24h'
  
  // Graph Plotter
  graphData?: Array<{ x: number; y: number; label?: string }>
  graphType?: 'bar' | 'line' | 'scatter'
  
  // Money Counter
  moneyCoins?: Array<{ value: number; count: number; emoji: string }>
  moneyTotal?: number
  
  // Array Builder (Multiplication)
  arrayRows?: number
  arrayColumns?: number
  arrayEmoji?: string
  
  // Balance Scale
  balanceLeft?: number
  balanceRight?: number
  balanceItem?: string
  
  // Shape Composer
  shapeTargetSvg?: string
  shapePieces?: string[]
  
  // Fill the Jar
  jarCapacity?: number
  jarFilled?: number
  jarUnit?: string
  
  // Array Grid Builder (Multiplication)
  // firstNumber and secondNumber reused for rows/columns
  
  // Group Maker (Multiplication/Division)
  groupSize?: number
  numberOfGroups?: number
  groupEmoji?: string
  
  // Skip Counter (Multiplication)
  skipCountBy?: number // Number to skip count by (e.g., 2, 5, 10)
  skipCountJumps?: number // Number of jumps to make
  
  // Fair Share (Division)
  fairShareTotal?: number // Total items to share
  fairShareGroups?: number // Number of groups to share among
  fairShareEmoji?: string // Emoji for items (e.g., '🍪', '🍕')
  
  // Division Machine
  divisionDividend?: number // Total items to divide
  divisionDivisor?: number // Size of each group
  divisionEmoji?: string // Emoji for items (e.g., '⭐', '🎯')
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

// Import the question generator
import { getQuestionsForLevel as generateQuestions } from './questionGenerator'

// Level introductions (keep the educational content)
const levelIntroductions: { [levelId: number]: { title: string; introduction: { title: string; content: string[]; examples: Array<{ number: string; visual: string; word: string }> } } } = {
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
    }
  },
  6: {
    title: "Addition Within 10",
    introduction: {
      title: "Let's Learn Addition!",
      content: [
        "Addition means putting things together!",
        "When we add, we get more!",
        "The + symbol means 'plus' or 'add'"
      ],
      examples: [
        { number: "2 + 1", visual: "●● + ●", word: "three" },
        { number: "3 + 2", visual: "●●● + ●●", word: "five" }
      ]
    }
  },
  11: {
    title: "Subtraction Within 10",
    introduction: {
      title: "Let's Learn Subtraction!",
      content: [
        "Subtraction means taking things away!",
        "When we subtract, we get less!",
        "The − symbol means 'minus' or 'subtract'"
      ],
      examples: [
        { number: "5 − 1", visual: "●●●●● → ●●●●", word: "four" },
        { number: "3 − 2", visual: "●●● → ●", word: "one" }
      ]
    }
  },
  16: {
    title: "Addition & Subtraction Within 20",
    introduction: {
      title: "Bigger Numbers!",
      content: [
        "Now we'll work with numbers up to 20!",
        "Use what you learned with 1-10!",
        "Take your time and think it through!"
      ],
      examples: [
        { number: "10 + 5", visual: "●●●●●●●●●● + ●●●●●", word: "fifteen" },
        { number: "15 − 3", visual: "", word: "twelve" }
      ]
    }
  },
  21: {
    title: "Place Value",
    introduction: {
      title: "Understanding Place Value!",
      content: [
        "Numbers have different places: ones, tens, hundreds!",
        "The position of a digit tells us its value!",
        "42 has 4 tens and 2 ones!"
      ],
      examples: [
        { number: "23", visual: "2 tens, 3 ones", word: "twenty-three" },
        { number: "57", visual: "5 tens, 7 ones", word: "fifty-seven" }
      ]
    }
  },
  31: {
    title: "Multiplication Basics",
    introduction: {
      title: "Let's Learn Multiplication!",
      content: [
        "Multiplication is repeated addition!",
        "3 × 4 means '3 groups of 4'!",
        "It's a faster way to add the same number many times!"
      ],
      examples: [
        { number: "2 × 3", visual: "●● + ●● + ●● = 6", word: "six" },
        { number: "3 × 4", visual: "●●●● + ●●●● + ●●●● = 12", word: "twelve" }
      ]
    }
  },
  36: {
    title: "Division Basics",
    introduction: {
      title: "Let's Learn Division!",
      content: [
        "Division means sharing equally!",
        "12 ÷ 3 means '12 shared among 3 groups'!",
        "It's the opposite of multiplication!"
      ],
      examples: [
        { number: "6 ÷ 2", visual: "●●● | ●●●", word: "three" },
        { number: "12 ÷ 4", visual: "●●● | ●●● | ●●● | ●●●", word: "three" }
      ]
    }
  },
  41: {
    title: "Introduction to Fractions",
    introduction: {
      title: "Let's Learn Fractions!",
      content: [
        "Fractions are parts of a whole!",
        "½ means 'one half' - one piece out of two!",
        "The top number is what we have, the bottom is how many pieces total!"
      ],
      examples: [
        { number: "½", visual: "◐", word: "one half" },
        { number: "¼", visual: "◔", word: "one quarter" }
      ]
    }
  }
}

// Build the complete level content using the generator
export const levelContent: { [levelId: number]: LevelData } = {}

// Generate content for all 50 levels
for (let levelId = 1; levelId <= 50; levelId++) {
  const intro = levelIntroductions[levelId] || {
    title: `Level ${levelId}`,
    introduction: {
      title: `Welcome to Level ${levelId}!`,
      content: ["Let's practice math!", "Do your best!"],
      examples: []
    }
  }

  levelContent[levelId] = {
    title: intro.title,
    introduction: intro.introduction,
    questions: [] // Questions will be generated on-demand
  }
}

/**
 * GET QUESTIONS FOR A LEVEL
 * 
 * This function generates questions dynamically using the questionGenerator.
 * It's called whenever a student starts or continues a level.
 * 
 * @param levelId - The level number (1-50)
 * @param userId - Optional user ID to ensure consistent questions per user
 * @returns Array of questions for the level
 */
export function getQuestionsForLevel(levelId: number, userId?: string): Question[] {
  // Generate questions using the generator system
  return generateQuestions(levelId, userId)
}

/**
 * GET INTRODUCTION FOR A LEVEL
 * 
 * Returns the educational introduction content for a level.
 * This is static content that explains concepts before questions begin.
 */
export function getIntroductionForLevel(levelId: number) {
  const level = levelContent[levelId]
  return level ? level.introduction : null
}

/**
 * GET LEVEL TITLE
 * 
 * Returns the title of a level.
 */
export function getLevelTitle(levelId: number): string {
  const level = levelContent[levelId]
  return level ? level.title : `Level ${levelId}`
}
