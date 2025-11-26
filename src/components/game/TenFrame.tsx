'use client'

import { useState, useEffect, useCallback } from 'react'

interface TenFrameProps {
  question: string
  correctPosition: number
  onAnswer: (isCorrect: boolean) => void
  onSubmitReady?: (submitFn: (() => void) | null) => void
}

export default function TenFrame({
  question,
  correctPosition,
  onAnswer,
  onSubmitReady,
}: TenFrameProps) {
  const [userAnswer, setUserAnswer] = useState<string>('')

  const handleSubmit = useCallback(() => {
    const answer = parseInt(userAnswer)
    const isCorrect = answer === correctPosition
    onAnswer(isCorrect)
  }, [userAnswer, correctPosition, onAnswer])

  // Register submit function with parent
  useEffect(() => {
    if (onSubmitReady) {
      onSubmitReady(handleSubmit)
    }
    return () => {
      if (onSubmitReady) {
        onSubmitReady(null)
      }
    }
  }, [onSubmitReady, handleSubmit])

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      {/* Question */}
      <div className="text-center">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{question}</h3>
      </div>

      {/* Ten Frame - Display Only */}
      <div className="bg-white rounded-2xl p-6 border-4 border-gray-300 shadow-lg">
        <div className="flex flex-col gap-3">
          {/* Top Row (0-4) */}
          <div className="grid grid-cols-5 gap-3 pb-3 border-b-4 border-gray-400">
            {Array.from({ length: 5 }).map((_, index) => {
              const hasDot = index < correctPosition
              return (
                <div
                  key={index}
                  className={`w-16 h-16 rounded-lg border-4 ${
                    hasDot
                      ? 'bg-gradient-to-br from-blue-400 to-blue-600 border-blue-300'
                      : 'bg-gray-100 border-gray-300'
                  } flex items-center justify-center`}
                >
                  {hasDot && (
                    <div className="text-4xl text-white">●</div>
                  )}
                </div>
              )
            })}
          </div>
          {/* Bottom Row (5-9) */}
          <div className="grid grid-cols-5 gap-3">
            {Array.from({ length: 5 }).map((_, index) => {
              const actualIndex = index + 5
              const hasDot = actualIndex < correctPosition
              return (
                <div
                  key={actualIndex}
                  className={`w-16 h-16 rounded-lg border-4 ${
                    hasDot
                      ? 'bg-gradient-to-br from-blue-400 to-blue-600 border-blue-300'
                      : 'bg-gray-100 border-gray-300'
                  } flex items-center justify-center`}
                >
                  {hasDot && (
                    <div className="text-4xl text-white">●</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Answer Input */}
      <div className="text-center">
        <p className="text-lg text-gray-700 mb-3 font-semibold">
          How many dots do you see?
        </p>
        <input
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Type your answer"
          className="w-32 px-4 py-3 text-2xl font-bold text-center border-4 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
          min="0"
          max="10"
        />
      </div>
    </div>
  )
}
