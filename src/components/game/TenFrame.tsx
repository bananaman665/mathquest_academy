'use client'

import { useState } from 'react'
import { PartyPopper, X } from 'lucide-react'

interface TenFrameProps {
  question: string
  correctPosition: number
  onAnswer: (isCorrect: boolean) => void
}

export default function TenFrame({
  question,
  correctPosition,
  onAnswer,
}: TenFrameProps) {
  const [placedDots, setPlacedDots] = useState<boolean[]>(Array(10).fill(false))
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const handleFrameClick = (index: number) => {
    // Toggle the dot on/off
    const newPlaced = [...placedDots]
    newPlaced[index] = !newPlaced[index]
    setPlacedDots(newPlaced)
  }

  const handleSubmit = () => {
    const dotsPlaced = placedDots.filter(d => d).length
    const correct = dotsPlaced === correctPosition
    setIsCorrect(correct)
    setShowFeedback(true)
    onAnswer(correct)
  }

  const handleReset = () => {
    setPlacedDots(Array(10).fill(false))
    setShowFeedback(false)
  }

  const dotsPlaced = placedDots.filter(d => d).length

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      {/* Question */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">{question}</h3>
        <p className="text-gray-700 text-lg">
          Tap the boxes to show <span className="font-bold text-blue-600">{correctPosition}</span>
        </p>
      </div>

      {/* Ten Frame */}
      <div className="bg-white rounded-2xl p-8 border-2 border-gray-300 shadow-lg">
        <div className="grid grid-cols-5 gap-3">
          {Array.from({ length: 10 }).map((_, index) => (
            <button
              key={index}
              onClick={() => handleFrameClick(index)}
              disabled={showFeedback}
              className={`w-16 h-16 rounded-lg border-4 transition-all transform hover:scale-105 ${
                placedDots[index]
                  ? 'bg-gradient-to-br from-blue-400 to-blue-600 border-blue-300 shadow-lg shadow-blue-500/50'
                  : 'bg-gray-100 border-gray-300 hover:border-gray-400 hover:bg-gray-200'
              } ${showFeedback ? 'cursor-not-allowed' : ''}`}
            >
              {placedDots[index] && (
                <div className="text-3xl text-white">●</div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      {!showFeedback && (
        <button
          onClick={handleSubmit}
          disabled={dotsPlaced !== correctPosition}
          className={`px-8 py-3 rounded-lg font-bold text-lg transition-colors ${
            dotsPlaced === correctPosition
              ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg'
              : 'bg-gray-300 cursor-not-allowed text-gray-600'
          }`}
        >
          Check Answer
        </button>
      )}

      {/* Feedback */}
      {showFeedback && (
        <div className="w-full max-w-md">
          <div
            className={`p-6 rounded-lg text-center font-bold text-lg ${
              isCorrect
                ? 'bg-green-50 text-green-700 border-2 border-green-500'
                : 'bg-red-50 text-red-700 border-2 border-red-500'
            }`}
          >
            {isCorrect ? (
              <div>
                <div className="text-2xl mb-2 flex items-center justify-center gap-2">
                  <PartyPopper className="w-6 h-6" />
                  Perfect!
                </div>
                <div>You showed {correctPosition} in the ten frame!</div>
              </div>
            ) : (
              <div>
                <div className="text-2xl mb-2 flex items-center justify-center gap-2">
                  <X className="w-6 h-6" />
                  Not quite
                </div>
                <div>You placed {dotsPlaced}, but the answer is {correctPosition}</div>
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
