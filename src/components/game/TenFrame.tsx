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
 * then click Check to submit their answer.
 *
 * CRITICAL: This component uses refs extensively to prevent auto-submit bugs.
 * DO NOT convert refs to direct state/callback usage without understanding why.
 *
 * Manual submit strategy:
 * 1. Uses refs for placedDots, correctPosition, and onAnswer
 * 2. Registers submit function when dots are placed (enables Check button)
 * 3. Submit function closure captures refs (always has latest values)
 * 4. User must click Check to submit - no auto-submit on correct answer
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
  const onSubmitReadyRef = useRef(onSubmitReady)

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

  useEffect(() => {
    onSubmitReadyRef.current = onSubmitReady
  }, [onSubmitReady])

  // Reset state when question changes
  useEffect(() => {
    setPlacedDots(Array(10).fill(false))
    hasInteractedRef.current = false
    hasSubmittedRef.current = false
    // Clear submit function on new question
    if (onSubmitReadyRef.current) {
      onSubmitReadyRef.current(null)
    }
  }, [correctPosition])

  const handleFrameClick = (index: number) => {
    hasInteractedRef.current = true
    
    // Toggle the dot on/off
    const newPlaced = [...placedDots]
    newPlaced[index] = !newPlaced[index]
    setPlacedDots(newPlaced)

    // Calculate new dot count
    const newDotsPlaced = newPlaced.filter(d => d).length

    // Enable check button when user has placed any dots (let them check whenever they want)
    if (newDotsPlaced > 0 && onSubmitReadyRef.current) {
      // Register the submit function so user can click Check
      // Use ref to get the latest placedDots value when submit is actually called
      onSubmitReadyRef.current(() => {
        if (!hasSubmittedRef.current) {
          hasSubmittedRef.current = true
          // Check if the count matches the correct answer using refs for latest values
          const currentDotsPlaced = placedDotsRef.current.filter(d => d).length
          const isCorrect = currentDotsPlaced === correctPositionRef.current
          onAnswerRef.current(isCorrect)
        }
      })
    } else if (newDotsPlaced === 0 && onSubmitReadyRef.current) {
      // Disable check button if no dots are placed
      onSubmitReadyRef.current(null)
    }
  }

  const dotsPlaced = placedDots.filter(d => d).length

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
          <span className="text-4xl text-gray-400 font-bold">/</span>
          <span className="text-4xl text-gray-500 font-bold">{correctPosition}</span>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {dotsPlaced === 0 ? 'Tap to start filling' :
           dotsPlaced < correctPosition ? `${correctPosition - dotsPlaced} more to go` :
           dotsPlaced > correctPosition ? 'Too many dots selected!' : ''}
        </p>
      </div>

      {/* Ten Frame */}
      <div className="bg-white rounded-2xl p-6 border-4 border-gray-300">
        <div className="grid grid-cols-5 gap-3">
          {Array.from({ length: 10 }).map((_, index) => (
            <button
              key={index}
              onClick={() => handleFrameClick(index)}
              className={`w-16 h-16 rounded-lg border-4 transition-all transform hover:scale-105 ${
                placedDots[index]
                  ? 'bg-gradient-to-br from-blue-400 to-blue-600 border-blue-300'
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
