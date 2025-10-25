import Link from 'next/link'
import { getQuestionsForLevel, getIntroductionForLevel, Question, GameMode } from '@/data/questions'
import LevelWrapper from './LevelWrapper'

// Determine game mode based on level position
// Pattern: 3 classic levels, then 1 special level (repeating)
function getGameModeForLevel(levelId: number): GameMode {
  // Every 4th level is a special challenge
  if (levelId % 4 === 0) {
    // Use a seeded random based on level ID to ensure consistency
    // Each 4th level gets randomly assigned one special mode, but it's always the same for that level
    const specialModes: GameMode[] = ['speed-round', 'lightning', 'perfect-streak', 'boss-battle']
    
    // Create a deterministic "random" selection based on levelId
    const seed = levelId * 12345 // Simple seed multiplier
    const index = Math.abs(seed) % specialModes.length
    
    return specialModes[index]
  }
  
  // Levels 1, 2, 3, 5, 6, 7, 9, 10, 11, etc. = Normal classic levels
  return 'normal'
}

// Helper function to randomly convert questions to type-answer or match-equation
function randomizeQuestionTypes(questions: Question[]): Question[] {
  return questions.map(q => {
    const rand = Math.random()
    
    // 10% chance to convert to type-answer
    if (rand < 0.1 && (q.type === 'multiple-choice' || q.type === 'visual-count' || q.type === 'number-sequence') && q.correctAnswer) {
      // Create acceptableAnswers with unique variations
      const baseAnswer = q.correctAnswer.trim()
      const acceptableAnswers = [
        baseAnswer,
        baseAnswer.toLowerCase(),
        baseAnswer.toUpperCase()
      ]
      
      // Add numeric variations if it's a number
      if (!isNaN(Number(baseAnswer))) {
        const num = parseInt(baseAnswer)
        acceptableAnswers.push(num.toString())
      }
      
      // Remove duplicates
      const uniqueAnswers = Array.from(new Set(acceptableAnswers))
      
      return {
        ...q,
        type: 'type-answer' as const,
        correctAnswer: baseAnswer,
        acceptableAnswers: uniqueAnswers,
        options: undefined // Remove options for type-answer
      }
    }
    
    // 10% chance to convert to match-equation (if question has numeric answer)
    if (rand >= 0.1 && rand < 0.2 && (q.type === 'multiple-choice' || q.type === 'number-sequence') && q.correctAnswer && !isNaN(Number(q.correctAnswer))) {
      const answer = q.correctAnswer
      const num = parseInt(answer)
      
      // Create simple equations that equal the answer
      const equations = [
        { equation: `${num} + 0`, answer: answer },
        { equation: `${num - 1} + 1`, answer: answer },
        { equation: `${num + 1} - 1`, answer: answer },
      ].filter(e => parseInt(e.equation.split(/[+\-]/)[0]) >= 0) // Keep only valid equations
      
      if (equations.length >= 2) {
        return {
          ...q,
          type: 'match-equation' as const,
          question: 'Drag each equation to its answer:',
          equations: equations.slice(0, 3),
          options: undefined
        }
      }
    }
    
    return q
  })
}

export default async function LevelPage({ params }: { params: Promise<{ levelId: string }> }) {
  const { levelId: levelIdString } = await params
  const levelId = parseInt(levelIdString)
  const introduction = getIntroductionForLevel(levelId)
  const baseQuestions = getQuestionsForLevel(levelId)
  
  // Randomize 10% of questions to new types
  const questions = randomizeQuestionTypes(baseQuestions)

  if (!introduction || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Level Not Found</h1>
          <Link href="/learn" className="text-blue-600 hover:underline">
            Back to Learning Path
          </Link>
        </div>
      </div>
    )
  }

  // Automatically determine game mode based on level number (Duolingo-style)
  const gameMode = getGameModeForLevel(levelId)

  return (
    <LevelWrapper 
      levelId={levelId} 
      introduction={introduction} 
      questions={questions}
      gameMode={gameMode}
    />
  )
}