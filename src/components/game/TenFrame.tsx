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
  const [placedDots, setPlacedDots] = useState<boolean[]>(Array(10).fill(false))

  const dotsPlaced = placedDots.filter(d => d).length

  const handleFrameClick = (index: number) => {
    // Only allow filling in sequential order from left to right
    if (placedDots[index]) {
      // Already filled - do nothing (no toggle)
      return
    }

    // Fill this box and all previous boxes
    const newPlaced = Array(10).fill(false)
    for (let i = 0; i <= index; i++) {
      newPlaced[i] = true
    }
    setPlacedDots(newPlaced)
  }

  const handleClearAll = () => {
    setPlacedDots(Array(10).fill(false))
  }

  const handleSubmit = useCallback(() => {
    // Check if first N boxes are filled in sequence
    const correctPattern = placedDots.slice(0, correctPosition).every(d => d) &&
                          placedDots.slice(correctPosition).every(d => !d)
    onAnswer(correctPattern)
  }, [placedDots, correctPosition, onAnswer])

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
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{question}</h3>
        <p className="text-gray-600 text-base">
          Click the boxes from left to right to fill in <span className="font-bold text-blue-600">{correctPosition}</span> dots
        </p>
      </div>

      {/* Counter Display */}
      <div className="text-center">
        <div className="inline-flex items-baseline gap-2 bg-gray-100 px-6 py-3 rounded-xl border-2 border-gray-300">
          <span className={`text-4xl font-black ${
            dotsPlaced === correctPosition ? 'text-green-600' :
            dotsPlaced > correctPosition ? 'text-red-600' :
            'text-gray-600'
          }`}>
            {dotsPlaced}
          </span>
          <span className="text-2xl text-gray-400 font-bold">/</span>
          <span className="text-2xl text-gray-500 font-bold">{correctPosition}</span>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {dotsPlaced === 0 ? 'Tap to start filling' :
           dotsPlaced === correctPosition ? 'Perfect! Click Check to submit' :
           dotsPlaced < correctPosition ? `${correctPosition - dotsPlaced} more to go` :
           'Too many! Click Clear to reset'}
        </p>
      </div>

      {/* Ten Frame */}
      <div className="bg-white rounded-2xl p-6 border-2 border-gray-300">
        <div className="flex flex-col gap-3">
          {/* Top Row (0-4) */}
          <div className="grid grid-cols-5 gap-3 pb-3 border-b-2 border-gray-300">
            {Array.from({ length: 5 }).map((_, index) => (
              <button
                key={index}
                onClick={() => handleFrameClick(index)}
                className={`w-16 h-16 rounded-lg border-4 ${
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
          {/* Bottom Row (5-9) */}
          <div className="grid grid-cols-5 gap-3">
            {Array.from({ length: 5 }).map((_, index) => {
              const actualIndex = index + 5
              return (
                <button
                  key={actualIndex}
                  onClick={() => handleFrameClick(actualIndex)}
                  className={`w-16 h-16 rounded-lg border-4 ${
                    placedDots[actualIndex]
                      ? 'bg-gradient-to-br from-blue-400 to-blue-600 border-blue-300'
                      : 'bg-gray-100 border-gray-300 hover:border-gray-400 hover:bg-gray-200'
                  }`}
                >
                  {placedDots[actualIndex] && (
                    <div className="text-3xl text-white">●</div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Clear Button */}
      {dotsPlaced > 0 && (
        <button
          onClick={handleClearAll}
          className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold rounded-lg"
        >
          Clear All
        </button>
      )}
    </div>
  )
}
