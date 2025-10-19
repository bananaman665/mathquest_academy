// Placement test questions - mix from different levels
// Placement test now samples from all 10 units (levels 1-50)
export const placementTestQuestions = [
  // Unit 1: Number Basics
  {
    id: 'pt1',
    levelDifficulty: 1,
    type: 'visual-count' as const,
    question: 'How many stars do you see?',
    visualContent: '⭐⭐⭐⭐',
    options: ['2', '3', '4', '5'],
    correctAnswer: '4',
    explanation: 'Count them: 1, 2, 3, 4. There are 4 stars!',
    xp: 10,
  },
  // Unit 2: Addition Adventures
  {
    id: 'pt2',
    levelDifficulty: 7,
    type: 'multiple-choice' as const,
    question: 'What is 6 + 3?',
    options: ['7', '8', '9', '10'],
    correctAnswer: '9',
    explanation: '6 + 3 = 9.',
    xp: 15,
  },
  // Unit 3: Subtraction Station
  {
    id: 'pt3',
    levelDifficulty: 12,
    type: 'multiple-choice' as const,
    question: 'What is 10 - 7?',
    options: ['2', '3', '4', '5'],
    correctAnswer: '3',
    explanation: '10 - 7 = 3.',
    xp: 15,
  },
  // Unit 4: Multiplication Magic
  {
    id: 'pt4',
    levelDifficulty: 17,
    type: 'multiple-choice' as const,
    question: 'What is 3 × 4?',
    options: ['7', '10', '12', '14'],
    correctAnswer: '12',
    explanation: '3 × 4 = 12.',
    xp: 20,
  },
  // Unit 5: Division Discovery
  {
    id: 'pt5',
    levelDifficulty: 22,
    type: 'multiple-choice' as const,
    question: 'What is 12 ÷ 3?',
    options: ['2', '3', '4', '5'],
    correctAnswer: '4',
    explanation: '12 ÷ 3 = 4.',
    xp: 20,
  },
  // Unit 6: Fraction Fun
  {
    id: 'pt6',
    levelDifficulty: 27,
    type: 'multiple-choice' as const,
    question: 'Which is bigger: 1/2 or 1/4?',
    options: ['1/2', '1/4', 'They are equal', '0'],
    correctAnswer: '1/2',
    explanation: '1/2 is bigger than 1/4.',
    xp: 20,
  },
  // Unit 7: Decimal Dimension
  {
    id: 'pt7',
    levelDifficulty: 32,
    type: 'multiple-choice' as const,
    question: 'What is 0.5 + 0.25?',
    options: ['0.55', '0.65', '0.75', '0.8'],
    correctAnswer: '0.75',
    explanation: '0.5 + 0.25 = 0.75.',
    xp: 25,
  },
  // Unit 8: Geometry Garden
  {
    id: 'pt8',
    levelDifficulty: 37,
    type: 'multiple-choice' as const,
    question: 'How many sides does a hexagon have?',
    options: ['5', '6', '7', '8'],
    correctAnswer: '6',
    explanation: 'A hexagon has 6 sides.',
    xp: 25,
  },
  // Unit 9: Measurement Mission
  {
    id: 'pt9',
    levelDifficulty: 42,
    type: 'multiple-choice' as const,
    question: 'How many minutes are in an hour?',
    options: ['30', '45', '60', '90'],
    correctAnswer: '60',
    explanation: 'There are 60 minutes in an hour.',
    xp: 25,
  },
  // Unit 10: Problem Solving Palace
  {
    id: 'pt10',
    levelDifficulty: 48,
    type: 'multiple-choice' as const,
    question: 'If you have 3 apples and get 2 more, how many do you have?',
    options: ['3', '4', '5', '6'],
    correctAnswer: '5',
    explanation: '3 + 2 = 5 apples.',
    xp: 25,
  },
]

export function calculatePlacementLevel(correctAnswers: number[]): number {
  // Get the highest level question they answered correctly
  const correctQuestions = placementTestQuestions.filter((_, index) => 
    correctAnswers.includes(index)
  )

  if (correctQuestions.length === 0) {
    return 1 // Start from the beginning
  }

  const highestCorrectLevel = Math.max(
    ...correctQuestions.map(q => q.levelDifficulty)
  )

  const accuracy = correctAnswers.length / placementTestQuestions.length

  // If all questions are correct, place at highest level in test
  if (accuracy === 1) {
    return highestCorrectLevel
  }

  // Otherwise, use previous logic
  if (accuracy >= 0.9 && highestCorrectLevel >= 12) {
    return 13 // Very advanced - start at level 13
  } else if (accuracy >= 0.8 && highestCorrectLevel >= 11) {
    return 11 // Strong subtraction - start at unit 3
  } else if (accuracy >= 0.7 && highestCorrectLevel >= 9) {
    return 9 // Strong addition - start late unit 2
  } else if (accuracy >= 0.6 && highestCorrectLevel >= 6) {
    return 6 // Good addition basics - start unit 2
  } else if (accuracy >= 0.5 && highestCorrectLevel >= 3) {
    return 4 // Good counting - start late unit 1
  } else if (highestCorrectLevel >= 2) {
    return 2 // Basic counting - level 2
  } else {
    return 1 // Start from the beginning
  }
}

export function getPlacementTestFeedback(startingLevel: number): {
  title: string
  message: string
  emoji: string
} {
  if (startingLevel >= 13) {
    return {
      title: 'Math Superstar! 🌟',
      message: "You're incredibly skilled! We'll start you at an advanced level where you can keep challenging yourself.",
      emoji: '🏆'
    }
  } else if (startingLevel >= 11) {
    return {
      title: 'Excellent Work! 🎉',
      message: "You have a strong understanding of addition and subtraction. Let's start with more advanced subtraction.",
      emoji: '⭐'
    }
  } else if (startingLevel >= 6) {
    return {
      title: 'Great Job! 👏',
      message: "You know your numbers well! We'll start you with addition to build on your skills.",
      emoji: '✨'
    }
  } else if (startingLevel >= 3) {
    return {
      title: 'Nice Start! 😊',
      message: "You're doing well with counting! Let's practice a bit more before moving to addition.",
      emoji: '🌈'
    }
  } else {
    return {
      title: 'Welcome! 🚀',
      message: "Let's start from the beginning and build a strong foundation together!",
      emoji: '🎯'
    }
  }
}
