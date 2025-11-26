'use client'

import { useState, useEffect, useRef } from 'react'

interface TenFrameProps {
  question: string
  correctPosition: number
  onAnswer: (isCorrect: boolean) => void
  onSubmitReady?: (submitFn: (() => void) | null) => void
}

/**
 * TenFrame Component - Interactive ten-frame counting exercise
 *
 * Displays a 5x2 grid of boxes where users tap to toggle dots on/off,
 * then submit their answer to check if they placed the correct number of dots.
 *
 * CRITICAL: This component uses refs extensively to prevent auto-submit bugs.
 * DO NOT convert refs to direct state/callback usage without understanding why.
 *
 * Auto-submit bug prevention strategy:
 * 1. Uses refs for placedDots, correctPosition, and onAnswer
 * 2. Registers submit function ONCE on mount (not on every render)
 * 3. Submit function closure captures refs (always has latest values)
 * 4. Prevents infinite re-render loops caused by parent callback changes
 */
export default function TenFrame({
  question,
  correctPosition,
  onAnswer,
  onSubmitReady,
}: TenFrameProps) {
  const [placedDots, setPlacedDots] = useState<boolean[]>(Array(10).fill(false))

  // Refs to prevent handleSubmit recreation and auto-submit bugs
  const placedDotsRef = useRef(placedDots)
  const correctPositionRef = useRef(correctPosition)
  const onAnswerRef = useRef(onAnswer)
  const hasInteractedRef = useRef(false)
  const hasSubmittedRef = useRef(false)

  // Keep refs in sync with current values
  useEffect(() => {
    placedDotsRef.current = placedDots
  }, [placedDots])

  useEffect(() => {
    correctPositionRef.current = correctPosition
  }, [correctPosition])

  useEffect(() => {
    onAnswerRef.current = onAnswer
  }, [onAnswer])

  // Reset state when question changes
  useEffect(() => {
    setPlacedDots(Array(10).fill(false))
    hasInteractedRef.current = false
    hasSubmittedRef.current = false
  }, [correctPosition])

  const handleFrameClick = (index: number) => {
    hasInteractedRef.current = true
    // Toggle the dot on/off
    const newPlaced = [...placedDots]
    newPlaced[index] = !newPlaced[index]
    setPlacedDots(newPlaced)
  }

  const dotsPlaced = placedDots.filter(d => d).length

  // Register submit function ONCE with parent
  useEffect(() => {
    if (onSubmitReady) {
      const submitFn = () => {
        // Only prevent submission if user DEFINITELY hasn't interacted
        // AND there are no dots placed (to catch edge cases)
        const currentDotsPlaced = placedDotsRef.current.filter(d => d).length
        if (!hasInteractedRef.current && currentDotsPlaced === 0) {
          return
        }

        // Prevent double submission
        if (hasSubmittedRef.current) {
          return
        }
        hasSubmittedRef.current = true

        const correct = currentDotsPlaced === correctPositionRef.current
        onAnswerRef.current(correct)
      }
      onSubmitReady(submitFn)

      return () => {
        onSubmitReady(null)
      }
    }
  }, [onSubmitReady]) // Only depends on onSubmitReady

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      {/* Question */}
      <div className="text-center">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{question}</h3>
        <p className="text-gray-600 text-base">
          Tap the boxes to show <span className="font-bold text-blue-600">{correctPosition}</span> dots
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
           'Too many dots selected!'}
        </p>
      </div>

      {/* Ten Frame */}
      <div className="bg-white rounded-2xl p-6 border-4 border-gray-300 shadow-lg">
        <div className="grid grid-cols-5 gap-3">
          {Array.from({ length: 10 }).map((_, index) => (
            <button
              key={index}
              onClick={() => handleFrameClick(index)}
              className={`w-16 h-16 rounded-lg border-4 transition-all transform hover:scale-105 ${
                placedDots[index]
                  ? 'bg-gradient-to-br from-blue-400 to-blue-600 border-blue-300 shadow-lg'
                  : 'bg-gray-100 border-gray-300 hover:border-gray-400 hover:bg-gray-200'
              }`}
            >
              {placedDots[index] && (
                <div className="text-4xl text-white">●</div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
