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
        "Numbers help us count things around us!",
        "Each number represents a quantity - how many of something we have.",
        "We start counting at 1 (one) and go up in order: 1, 2, 3, 4, 5...",
        "The dots below show exactly how many each number represents!",
        "Count the dots carefully for each number - this helps you understand what each number means!"
      ],
      examples: [
        { number: "1", visual: "●", word: "one" },
        { number: "2", visual: "●●", word: "two" },
        { number: "3", visual: "●●●", word: "three" },
        { number: "4", visual: "●●●●", word: "four" },
        { number: "5", visual: "●●●●●", word: "five" },
        { number: "6", visual: "●●●●●●", word: "six" },
        { number: "7", visual: "●●●●●●●", word: "seven" },
        { number: "8", visual: "●●●●●●●●", word: "eight" },
        { number: "9", visual: "●●●●●●●●●", word: "nine" },
        { number: "10", visual: "●●●●●●●●●●", word: "ten" }
      ]
    }
  },
  6: {
    title: "Addition Within 10",
    introduction: {
      title: "Let's Learn Addition!",
      content: [
        "Addition means putting groups of things together!",
        "When we add, we combine two or more numbers to get a total.",
        "The + symbol means 'plus' or 'add' - it tells us to put things together.",
        "Example: If you have 2 apples and get 3 more, you ADD them: 2 + 3 = 5 apples total!",
        "The = symbol means 'equals' - it shows us the answer!",
        "Let's see how addition works with dots:"
      ],
      examples: [
        { number: "1 + 1 = 2", visual: "● + ● = ●●", word: "one plus one equals two" },
        { number: "2 + 1 = 3", visual: "●● + ● = ●●●", word: "two plus one equals three" },
        { number: "2 + 2 = 4", visual: "●● + ●● = ●●●●", word: "two plus two equals four" },
        { number: "3 + 2 = 5", visual: "●●● + ●● = ●●●●●", word: "three plus two equals five" },
        { number: "4 + 3 = 7", visual: "●●●● + ●●● = ●●●●●●●", word: "four plus three equals seven" },
        { number: "5 + 5 = 10", visual: "●●●●● + ●●●●● = ●●●●●●●●●●", word: "five plus five equals ten" }
      ]
    }
  },
  11: {
    title: "Subtraction Within 10",
    introduction: {
      title: "Let's Learn Subtraction!",
      content: [
        "Subtraction means taking things away from a group!",
        "When we subtract, we remove some items and count what's left.",
        "The − symbol means 'minus' or 'subtract' - it tells us to take away.",
        "Example: If you have 5 cookies and eat 2, you SUBTRACT: 5 − 2 = 3 cookies left!",
        "The answer is always smaller than the first number (unless you subtract 0).",
        "Watch how we take dots away:"
      ],
      examples: [
        { number: "2 − 1 = 1", visual: "●● → ●", word: "two minus one equals one" },
        { number: "3 − 1 = 2", visual: "●●● → ●●", word: "three minus one equals two" },
        { number: "4 − 2 = 2", visual: "●●●● → ●●", word: "four minus two equals two" },
        { number: "5 − 2 = 3", visual: "●●●●● → ●●●", word: "five minus two equals three" },
        { number: "6 − 3 = 3", visual: "●●●●●● → ●●●", word: "six minus three equals three" },
        { number: "10 − 4 = 6", visual: "●●●●●●●●●● → ●●●●●●", word: "ten minus four equals six" }
      ]
    }
  },
  16: {
    title: "Addition & Subtraction Within 20",
    introduction: {
      title: "Working with Bigger Numbers!",
      content: [
        "Now we're ready to work with numbers all the way up to 20!",
        "These are bigger numbers, but we use the same addition and subtraction skills.",
        "A helpful strategy: Break numbers into tens and ones.",
        "Example: 13 is 10 + 3. So 13 + 4 = 10 + 3 + 4 = 10 + 7 = 17",
        "Another strategy: Count on or count back in your head.",
        "For 15 − 3, start at 15 and count back: 14, 13, 12. Answer is 12!"
      ],
      examples: [
        { number: "10 + 1 = 11", visual: "●●●●●●●●●● + ● = 11", word: "ten plus one equals eleven" },
        { number: "10 + 5 = 15", visual: "●●●●●●●●●● + ●●●●● = 15", word: "ten plus five equals fifteen" },
        { number: "12 + 3 = 15", visual: "12 + 3", word: "twelve plus three equals fifteen" },
        { number: "15 − 3 = 12", visual: "15 − 3", word: "fifteen minus three equals twelve" },
        { number: "18 − 5 = 13", visual: "18 − 5", word: "eighteen minus five equals thirteen" },
        { number: "11 + 9 = 20", visual: "11 + 9", word: "eleven plus nine equals twenty" }
      ]
    }
  },
  21: {
    title: "Place Value",
    introduction: {
      title: "Understanding Place Value!",
      content: [
        "Every digit in a number has a 'place' that tells us its value!",
        "In a two-digit number, the first digit is the TENS place, the second is the ONES place.",
        "Example: In the number 42, the 4 is in the tens place (worth 40) and 2 is in the ones place (worth 2).",
        "So 42 = 40 + 2 = 4 tens and 2 ones!",
        "This is super important for understanding bigger numbers and doing math!",
        "The position of a digit changes its value - that's why we call it 'place value'!"
      ],
      examples: [
        { number: "23", visual: "2 tens, 3 ones (●●●●●●●●●● + ●●●●●●●●●● + ●●●)", word: "twenty-three" },
        { number: "35", visual: "3 tens, 5 ones (30 + 5)", word: "thirty-five" },
        { number: "42", visual: "4 tens, 2 ones (40 + 2)", word: "forty-two" },
        { number: "57", visual: "5 tens, 7 ones (50 + 7)", word: "fifty-seven" },
        { number: "68", visual: "6 tens, 8 ones (60 + 8)", word: "sixty-eight" },
        { number: "91", visual: "9 tens, 1 one (90 + 1)", word: "ninety-one" }
      ]
    }
  },
  31: {
    title: "Multiplication Basics",
    introduction: {
      title: "Let's Learn Multiplication!",
      content: [
        "Multiplication is a faster way to add the same number multiple times!",
        "The × symbol means 'times' or 'groups of'.",
        "Example: 3 × 4 means '3 groups of 4' or '4 added together 3 times'.",
        "So 3 × 4 = 4 + 4 + 4 = 12. Much faster than adding!",
        "The numbers being multiplied are called 'factors', and the answer is the 'product'.",
        "Multiplication makes math easier when working with groups or repeated addition!"
      ],
      examples: [
        { number: "2 × 3 = 6", visual: "●● + ●● + ●● = ●●●●●●", word: "two times three equals six" },
        { number: "3 × 3 = 9", visual: "●●● + ●●● + ●●● = 9", word: "three times three equals nine" },
        { number: "4 × 2 = 8", visual: "●●●● + ●●●● = 8", word: "four times two equals eight" },
        { number: "3 × 4 = 12", visual: "●●●● + ●●●● + ●●●● = 12", word: "three times four equals twelve" },
        { number: "5 × 2 = 10", visual: "●●●●● + ●●●●● = 10", word: "five times two equals ten" },
        { number: "2 × 10 = 20", visual: "2 groups of 10", word: "two times ten equals twenty" }
      ]
    }
  },
  36: {
    title: "Division Basics",
    introduction: {
      title: "Let's Learn Division!",
      content: [
        "Division means sharing things equally into groups!",
        "The ÷ symbol means 'divided by' - it tells us to split things up fairly.",
        "Example: 12 ÷ 3 means 'split 12 into 3 equal groups' - each group gets 4!",
        "Division is the opposite of multiplication. If 3 × 4 = 12, then 12 ÷ 3 = 4.",
        "We can think of it as: 'How many times does this number fit into that number?'",
        "Division helps us share things fairly and solve real-world problems!"
      ],
      examples: [
        { number: "6 ÷ 2 = 3", visual: "●●● | ●●●", word: "six divided by two equals three" },
        { number: "8 ÷ 2 = 4", visual: "●●●● | ●●●●", word: "eight divided by two equals four" },
        { number: "9 ÷ 3 = 3", visual: "●●● | ●●● | ●●●", word: "nine divided by three equals three" },
        { number: "10 ÷ 2 = 5", visual: "●●●●● | ●●●●●", word: "ten divided by two equals five" },
        { number: "12 ÷ 3 = 4", visual: "●●●● | ●●●● | ●●●●", word: "twelve divided by three equals four" },
        { number: "15 ÷ 5 = 3", visual: "3 groups of 5", word: "fifteen divided by five equals three" }
      ]
    }
  },
  41: {
    title: "Introduction to Fractions",
    introduction: {
      title: "Let's Learn Fractions!",
      content: [
        "Fractions represent parts of a whole - like slices of a pizza!",
        "A fraction has two numbers: the top (numerator) and bottom (denominator).",
        "The bottom number tells us how many equal parts the whole is divided into.",
        "The top number tells us how many of those parts we have.",
        "Example: ½ means the whole is divided into 2 equal parts, and we have 1 of them.",
        "Fractions help us share things fairly and measure amounts that aren't whole numbers!"
      ],
      examples: [
        { number: "½", visual: "◐ (1 out of 2 equal parts)", word: "one half" },
        { number: "¼", visual: "◔ (1 out of 4 equal parts)", word: "one quarter" },
        { number: "¾", visual: "◕ (3 out of 4 equal parts)", word: "three quarters" },
        { number: "⅓", visual: "1 out of 3 equal parts", word: "one third" },
        { number: "⅔", visual: "2 out of 3 equal parts", word: "two thirds" },
        { number: "⅕", visual: "1 out of 5 equal parts", word: "one fifth" }
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
