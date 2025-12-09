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
  | 'array-division'
  | 'remainder-boxes'

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
  
  // Array Division (Division - Visual Array)
  arrayDivisionTotal?: number // Total items in array
  arrayDivisionDivisor?: number // Divisor (rows or columns)
  
  // Remainder Boxes (Division with Remainders)
  remainderTotal?: number // Total items to divide
  remainderPerBox?: number // Items per box
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
        "We start counting at 1 and go up in order: 1, 2, 3, 4, 5...",
        "The dots below show exactly how many each number represents!",
        "Count the dots carefully for each number - this helps you understand what each number means!"
      ],
      examples: [
        { number: "1", visual: "●", word: "1" },
        { number: "2", visual: "●●", word: "2" },
        { number: "3", visual: "●●●", word: "3" },
        { number: "4", visual: "●●●●", word: "4" },
        { number: "5", visual: "●●●●●", word: "5" },
        { number: "6", visual: "●●●●●●", word: "6" },
        { number: "7", visual: "●●●●●●●", word: "7" },
        { number: "8", visual: "●●●●●●●●", word: "8" },
        { number: "9", visual: "●●●●●●●●●", word: "9" },
        { number: "10", visual: "●●●●●●●●●●", word: "10" }
      ]
    }
  },
  6: {
    title: "Addition Within 10",
    introduction: {
      title: "Let's Learn Addition!",
      content: [
        "Addition means putting groups of things together!",
        "When we add, we combine 2 or more numbers to get a total.",
        "The + symbol means 'plus' or 'add' - it tells us to put things together.",
        "Example: If you have 2 apples and get 3 more, you ADD them: 2 + 3 = 5 apples total!",
        "The = symbol means 'equals' - it shows us the answer!",
        "Let's see how addition works with dots:"
      ],
      examples: [
        { number: "1 + 1 = 2", visual: "● + ● = ●●", word: "1 plus 1 equals 2" },
        { number: "2 + 1 = 3", visual: "●● + ● = ●●●", word: "2 plus 1 equals 3" },
        { number: "2 + 2 = 4", visual: "●● + ●● = ●●●●", word: "2 plus 2 equals 4" },
        { number: "3 + 2 = 5", visual: "●●● + ●● = ●●●●●", word: "3 plus 2 equals 5" },
        { number: "4 + 3 = 7", visual: "●●●● + ●●● = ●●●●●●●", word: "4 plus 3 equals 7" },
        { number: "5 + 5 = 10", visual: "●●●●● + ●●●●● = ●●●●●●●●●●", word: "5 plus 5 equals 10" }
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
        "The answer is always smaller than the 1st number (unless you subtract 0).",
        "Watch how we take dots away:"
      ],
      examples: [
        { number: "2 − 1 = 1", visual: "●● → ●", word: "2 minus 1 equals 1" },
        { number: "3 − 1 = 2", visual: "●●● → ●●", word: "3 minus 1 equals 2" },
        { number: "4 − 2 = 2", visual: "●●●● → ●●", word: "4 minus 2 equals 2" },
        { number: "5 − 2 = 3", visual: "●●●●● → ●●●", word: "5 minus 2 equals 3" },
        { number: "6 − 3 = 3", visual: "●●●●●● → ●●●", word: "6 minus 3 equals 3" },
        { number: "10 − 4 = 6", visual: "●●●●●●●●●● → ●●●●●●", word: "10 minus 4 equals 6" }
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
        "A helpful strategy: Break numbers into 10s and 1s.",
        "Example: 13 is 10 + 3. So 13 + 4 = 10 + 3 + 4 = 10 + 7 = 17",
        "Another strategy: Count on or count back in your head.",
        "For 15 − 3, start at 15 and count back: 14, 13, 12. Answer is 12!"
      ],
      examples: [
        { number: "10 + 1 = 11", visual: "●●●●●●●●●● + ● = 11", word: "10 plus 1 equals 11" },
        { number: "10 + 5 = 15", visual: "●●●●●●●●●● + ●●●●● = 15", word: "10 plus 5 equals 15" },
        { number: "12 + 3 = 15", visual: "12 + 3", word: "12 plus 3 equals 15" },
        { number: "15 − 3 = 12", visual: "15 − 3", word: "15 minus 3 equals 12" },
        { number: "18 − 5 = 13", visual: "18 − 5", word: "18 minus 5 equals 13" },
        { number: "11 + 9 = 20", visual: "11 + 9", word: "11 plus 9 equals 20" }
      ]
    }
  },
  21: {
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
        { number: "2 × 3 = 6", visual: "●● + ●● + ●● = ●●●●●●", word: "2 times 3 equals 6" },
        { number: "3 × 3 = 9", visual: "●●● + ●●● + ●●● = 9", word: "3 times 3 equals 9" },
        { number: "4 × 2 = 8", visual: "●●●● + ●●●● = 8", word: "4 times 2 equals 8" },
        { number: "3 × 4 = 12", visual: "●●●● + ●●●● + ●●●● = 12", word: "3 times 4 equals 12" },
        { number: "5 × 2 = 10", visual: "●●●●● + ●●●●● = 10", word: "5 times 2 equals 10" },
        { number: "2 × 10 = 20", visual: "2 groups of 10", word: "2 times 10 equals 20" }
      ]
    }
  },
  31: {
    title: "Addition & Subtraction Within 20",
    introduction: {
      title: "Review: Adding & Subtracting to 20!",
      content: [
        "Let's practice our addition and subtraction skills with numbers up to 20!",
        "Remember: Addition means putting groups together to find the total.",
        "Subtraction means taking away to find what's left.",
        "A helpful strategy: Break numbers into 10s and 1s.",
        "Example: 13 + 4 = 10 + 3 + 4 = 10 + 7 = 17",
        "For 15 − 3, count back from 15: 14, 13, 12. The answer is 12!"
      ],
      examples: [
        { number: "10 + 1 = 11", visual: "●●●●●●●●●● + ● = 11", word: "10 plus 1 equals 11" },
        { number: "10 + 5 = 15", visual: "●●●●●●●●●● + ●●●●● = 15", word: "10 plus 5 equals 15" },
        { number: "12 + 3 = 15", visual: "12 + 3", word: "12 plus 3 equals 15" },
        { number: "15 − 3 = 12", visual: "15 − 3", word: "15 minus 3 equals 12" },
        { number: "18 − 5 = 13", visual: "18 − 5", word: "18 minus 5 equals 13" },
        { number: "11 + 9 = 20", visual: "11 + 9", word: "11 plus 9 equals 20" }
      ]
    }
  },
  26: {
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
        { number: "6 ÷ 2 = 3", visual: "●●● | ●●●", word: "6 divided by 2 equals 3" },
        { number: "8 ÷ 2 = 4", visual: "●●●● | ●●●●", word: "8 divided by 2 equals 4" },
        { number: "9 ÷ 3 = 3", visual: "●●● | ●●● | ●●●", word: "9 divided by 3 equals 3" },
        { number: "10 ÷ 2 = 5", visual: "●●●●● | ●●●●●", word: "10 divided by 2 equals 5" },
        { number: "12 ÷ 3 = 4", visual: "●●●● | ●●●● | ●●●●", word: "12 divided by 3 equals 4" },
        { number: "15 ÷ 5 = 3", visual: "3 groups of 5", word: "15 divided by 5 equals 3" }
      ]
    }
  },
  36: {
    title: "Place Value",
    introduction: {
      title: "Understanding Place Value!",
      content: [
        "Every digit in a number has a 'place' that tells us its value!",
        "In a 2-digit number, the 1st digit is the TENS place, the 2nd is the ONES place.",
        "Example: In the number 42, the 4 is in the 10s place (worth 40) and 2 is in the 1s place (worth 2).",
        "So 42 = 40 + 2 = 4 tens and 2 ones!",
        "This is super important for understanding bigger numbers and doing math!",
        "The position of a digit changes its value - that's why we call it 'place value'!"
      ],
      examples: [
        { number: "23", visual: "2 tens, 3 ones (●●●●●●●●●● + ●●●●●●●●●● + ●●●)", word: "23" },
        { number: "35", visual: "3 tens, 5 ones (30 + 5)", word: "35" },
        { number: "42", visual: "4 tens, 2 ones (40 + 2)", word: "42" },
        { number: "57", visual: "5 tens, 7 ones (50 + 7)", word: "57" },
        { number: "68", visual: "6 tens, 8 ones (60 + 8)", word: "68" },
        { number: "91", visual: "9 tens, 1 one (90 + 1)", word: "91" }
      ]
    }
  },
  41: {
    title: "Introduction to Fractions",
    introduction: {
      title: "Let's Learn Fractions!",
      content: [
        "Fractions represent parts of a whole - like slices of a pizza!",
        "A fraction has 2 numbers: the top (numerator) and bottom (denominator).",
        "The bottom number tells us how many equal parts the whole is divided into.",
        "The top number tells us how many of those parts we have.",
        "Example: ½ means the whole is divided into 2 equal parts, and we have 1 of them.",
        "Fractions help us share things fairly and measure amounts that aren't whole numbers!"
      ],
      examples: [
        { number: "½", visual: "◐ (1 out of 2 equal parts)", word: "1 half" },
        { number: "¼", visual: "◔ (1 out of 4 equal parts)", word: "1 quarter" },
        { number: "¾", visual: "◕ (3 out of 4 equal parts)", word: "3 quarters" },
        { number: "⅓", visual: "1 out of 3 equal parts", word: "1 third" },
        { number: "⅔", visual: "2 out of 3 equal parts", word: "2 thirds" },
        { number: "⅕", visual: "1 out of 5 equal parts", word: "1 fifth" }
      ]
    }
  },
  42: {
    title: "Comparing Fractions",
    introduction: {
      title: "Compare Fractions!",
      content: [
        "We can compare fractions to see which is bigger!",
        "When fractions have the same bottom number (denominator), compare the top numbers.",
        "The fraction with the larger numerator is greater.",
        "Example: ¾ is greater than ½ because 3 parts out of 4 is more than 2 parts out of 4.",
        "Visual comparison helps - imagine two identical pizzas, one with more slices eaten!"
      ],
      examples: [
        { number: "½ vs ¼", visual: "◐ > ◔", word: "1 half is greater than 1 quarter" },
        { number: "¾ vs ½", visual: "◕ > ◐", word: "3 quarters is greater than 1 half" },
        { number: "⅔ vs ⅓", visual: "2/3 > 1/3", word: "2 thirds is greater than 1 third" }
      ]
    }
  },
  43: {
    title: "Adding Fractions",
    introduction: {
      title: "Add Fractions!",
      content: [
        "We can add fractions when they have the same denominator (bottom number)!",
        "Just add the numerators (top numbers) and keep the denominator the same.",
        "Example: ¼ + ¼ = 2/4 (we add 1 + 1 = 2, keep the 4)",
        "Think of it like combining slices of the same-sized pizza!",
        "Remember: Only add the top numbers, the bottom number stays the same!"
      ],
      examples: [
        { number: "¼ + ¼ = ½", visual: "1/4 + 1/4 = 2/4", word: "one quarter plus one quarter equals two quarters" },
        { number: "⅓ + ⅓ = ⅔", visual: "1/3 + 1/3 = 2/3", word: "one third plus one third equals two thirds" },
        { number: "⅕ + ⅕ = ⅖", visual: "1/5 + 1/5 = 2/5", word: "one fifth plus one fifth equals two fifths" }
      ]
    }
  },
  44: {
    title: "Subtracting Fractions",
    introduction: {
      title: "Subtract Fractions!",
      content: [
        "We can subtract fractions when they have the same denominator!",
        "Just subtract the numerators (top numbers) and keep the denominator the same.",
        "Example: ¾ − ¼ = 2/4 (we subtract 3 − 1 = 2, keep the 4)",
        "Think of it like taking away slices from a pizza!",
        "Remember: Only subtract the top numbers, the bottom number stays the same!"
      ],
      examples: [
        { number: "¾ − ¼ = ½", visual: "3/4 - 1/4 = 2/4", word: "three quarters minus one quarter equals two quarters" },
        { number: "⅔ − ⅓ = ⅓", visual: "2/3 - 1/3 = 1/3", word: "two thirds minus one third equals one third" },
        { number: "⅘ − ⅕ = ⅗", visual: "4/5 - 1/5 = 3/5", word: "four fifths minus one fifth equals three fifths" }
      ]
    }
  },
  45: {
    title: "Fraction Practice",
    introduction: {
      title: "Practice Fractions!",
      content: [
        "Time to practice everything you've learned about fractions!",
        "Remember: Fractions show parts of a whole.",
        "When adding or subtracting, keep the denominator the same.",
        "When comparing, look at the numerators if denominators match.",
        "Take your time and visualize the fractions - you've got this!"
      ],
      examples: [
        { number: "½", visual: "◐ (1 out of 2)", word: "one half" },
        { number: "¾", visual: "◕ (3 out of 4)", word: "three quarters" },
        { number: "⅓ + ⅓ = ⅔", visual: "1/3 + 1/3 = 2/3", word: "adding fractions" },
        { number: "¾ − ¼ = ½", visual: "3/4 - 1/4 = 2/4", word: "subtracting fractions" }
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
