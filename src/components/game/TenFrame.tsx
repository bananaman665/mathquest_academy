'use client'

import { useState, useEffect } from 'react'

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
  const [placedDots, setPlacedDots] = useState<boolean[]>(Array(10).fill(false))

  // Register submit function with parent
  useEffect(() => {
    if (onSubmitReady) {
      onSubmitReady(() => handleSubmit)
    }
    return () => {
      if (onSubmitReady) {
        onSubmitReady(null)
      }
    }
  }, [onSubmitReady, placedDots])

  const handleFrameClick = (index: number) => {
    // Toggle the dot on/off
    const newPlaced = [...placedDots]
    newPlaced[index] = !newPlaced[index]
    setPlacedDots(newPlaced)
  }

  const handleSubmit = () => {
    const dotsPlaced = placedDots.filter(d => d).length
    const correct = dotsPlaced === correctPosition
    onAnswer(correct)
  }

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
      <div className="bg-white rounded-2xl p-8 border-2 border-gray-300">
        <div className="grid grid-cols-5 gap-3">
          {Array.from({ length: 10 }).map((_, index) => (
            <button
              key={index}
              onClick={() => handleFrameClick(index)}
              className={`w-16 h-16 rounded-lg border-4 hover:scale-105 ${
                placedDots[index]
                  ? 'bg-gradient-to-br from-blue-400 to-blue-600 border-blue-300'
                  : 'bg-gray-100 border-gray-300 hover:border-gray-400 hover:bg-gray-200'
              }`}
            >
              {placedDots[index] && (
                <div className="text-3xl text-white">●</div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
