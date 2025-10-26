'use client'

import { useState, useEffect } from 'react'
import { Trash2, Plus } from 'lucide-react'

interface BlockStackingQuestionProps {
  firstNumber: number
  secondNumber: number
  operation: 'add' | 'subtract'
  correctAnswer: number
  onAnswer: (isCorrect: boolean) => void
  question: string
}

export default function BlockStackingQuestion({
  firstNumber,
  secondNumber,
  operation,
  correctAnswer,
  onAnswer,
  question,
}: BlockStackingQuestionProps) {
  const [stackedBlocks, setStackedBlocks] = useState<number>(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  // Initialize blocks based on operation
  useEffect(() => {
    if (operation === 'add') {
      setStackedBlocks(firstNumber)
    } else if (operation === 'subtract') {
      setStackedBlocks(firstNumber)
    }
  }, [operation, firstNumber])

  const handleAddBlock = () => {
    if (operation === 'add') {
      // For addition, add up to firstNumber + secondNumber
      if (stackedBlocks < firstNumber + secondNumber) {
        setStackedBlocks(stackedBlocks + 1)
      }
    }
  }

  const handleRemoveBlock = () => {
    if (operation === 'subtract') {
      // For subtraction, allow removal down to 0
      if (stackedBlocks > 0) {
        setStackedBlocks(stackedBlocks - 1)
      }
    } else if (operation === 'add') {
      // For addition, allow removal down to firstNumber
      if (stackedBlocks > firstNumber) {
        setStackedBlocks(stackedBlocks - 1)
      }
    }
  }

  const handleSubmit = () => {
    const correct = stackedBlocks === correctAnswer
    setIsCorrect(correct)
    setShowFeedback(true)
    onAnswer(correct)
  }

  const handleReset = () => {
    setShowFeedback(false)
    if (operation === 'add') {
      setStackedBlocks(firstNumber)
    } else {
      setStackedBlocks(firstNumber)
    }
  }

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      {/* Question */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-4">{question}</h3>
        <p className="text-gray-300 text-lg">
          {operation === 'add'
            ? `Add ${secondNumber} more block${secondNumber !== 1 ? 's' : ''} to the stack`
            : `Remove ${secondNumber} block${secondNumber !== 1 ? 's' : ''} from the stack`}
        </p>
      </div>

      {/* Block Stack Visualization */}
      <div className="flex flex-col items-center gap-4">
        {/* Stacked blocks */}
        <div className="flex flex-col-reverse items-center gap-2 min-h-64">
          {Array.from({ length: stackedBlocks }).map((_, idx) => (
            <div
              key={idx}
              className="w-24 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg shadow-lg border-2 border-blue-300 animate-pulse"
              style={{
                animationDelay: `${idx * 0.1}s`,
              }}
            />
          ))}
          {stackedBlocks === 0 && (
            <div className="text-gray-400 text-lg font-semibold">No blocks yet</div>
          )}
        </div>

        {/* Block count indicator */}
        <div className="text-2xl font-bold text-white bg-slate-700 px-6 py-2 rounded-lg">
          Total: {stackedBlocks}
        </div>
      </div>

      {/* Controls */}
      {!showFeedback && (
        <div className="flex gap-4 flex-wrap justify-center">
          {operation === 'add' && (
            <button
              onClick={handleAddBlock}
              disabled={stackedBlocks >= firstNumber + secondNumber}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Block
            </button>
          )}

          {operation === 'subtract' && (
            <button
              onClick={handleRemoveBlock}
              disabled={stackedBlocks <= 0}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              Remove Block
            </button>
          )}

          {operation === 'add' && stackedBlocks > firstNumber && (
            <button
              onClick={handleRemoveBlock}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              Remove Block
            </button>
          )}

          <button
            onClick={handleSubmit}
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Submit Answer
          </button>
        </div>
      )}

      {/* Feedback */}
      {showFeedback && (
        <div className="w-full max-w-md">
          <div
            className={`p-6 rounded-lg text-center font-bold text-lg ${
              isCorrect
                ? 'bg-green-500/20 text-green-300 border-2 border-green-500'
                : 'bg-red-500/20 text-red-300 border-2 border-red-500'
            }`}
          >
            {isCorrect ? (
              <div>
                <div className="text-2xl mb-2">🎉 Correct!</div>
                <div>You stacked {stackedBlocks} blocks!</div>
              </div>
            ) : (
              <div>
                <div className="text-2xl mb-2">❌ Not quite right</div>
                <div>You stacked {stackedBlocks}, but the answer is {correctAnswer}</div>
              </div>
            )}
          </div>

          {!isCorrect && (
            <button
              onClick={handleReset}
              className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      )}
    </div>
  )
}
