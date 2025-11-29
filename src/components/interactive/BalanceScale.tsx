'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface BalanceScaleProps {
  question: string
  leftSide: number[]  // Values on left side
  rightSide: number[] // Values on right side
  missingValue?: number // Which index has the missing value (left side)
  correctAnswer: number
  showEquals?: boolean // Show as equation format
  onAnswer: (isCorrect: boolean, userAnswer: number) => void
  onSubmitReady?: (submitFn: (() => void) | null) => void
}

const BalanceScale = React.memo(function BalanceScale({
  question,
  leftSide,
  rightSide,
  missingValue = 0,
  correctAnswer,
  showEquals = true,
  onAnswer,
  onSubmitReady
}: BalanceScaleProps) {
  const [userAnswer, setUserAnswer] = useState<number>(0)
  const [hasSubmitted, setHasSubmitted] = useState(false)

  // Reset state when question changes
  useEffect(() => {
    setUserAnswer(0)
    setHasSubmitted(false)
  }, [question, correctAnswer])

  // Register submit function with parent
  useEffect(() => {
    if (onSubmitReady && !hasSubmitted) {
      if (userAnswer > 0) {
        onSubmitReady(() => handleSubmit)
      } else {
        onSubmitReady(null)
      }
    }
  }, [userAnswer, hasSubmitted, onSubmitReady])

  const calculateSideTotal = (side: number[], includeUser: boolean = false) => {
    const values = side.map((val, idx) => 
      idx === missingValue && includeUser ? userAnswer : val
    )
    return values.reduce((sum, val) => sum + (val || 0), 0)
  }

  const leftTotal = calculateSideTotal(leftSide, true)
  const rightTotal = calculateSideTotal(rightSide)

  const isBalanced = leftTotal === rightTotal
  const tiltAngle = hasSubmitted ? 0 : Math.max(-15, Math.min(15, (leftTotal - rightTotal) * 2))

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (hasSubmitted) return
    const value = e.target.value
    // Only allow positive integers
    if (value === '' || /^[0-9]+$/.test(value)) {
      setUserAnswer(value === '' ? 0 : parseInt(value))
    }
  }

  const handleSubmit = () => {
    if (hasSubmitted || userAnswer === 0) return
    const isCorrect = userAnswer === correctAnswer
    setHasSubmitted(true)
    onAnswer(isCorrect, userAnswer)
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-3 sm:p-6 overflow-hidden">
      {/* Number Input */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={userAnswer === 0 ? '' : userAnswer}
          onChange={handleInputChange}
          disabled={hasSubmitted}
          placeholder="?"
          className={`w-24 px-5 py-3 text-center text-3xl font-bold rounded-lg border-4 transition-all ${
            hasSubmitted
              ? userAnswer === correctAnswer
                ? 'bg-green-100 border-green-500 text-green-700'
                : 'bg-red-100 border-red-500 text-red-700'
              : 'bg-white border-blue-400 text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300'
          } ${hasSubmitted ? 'cursor-not-allowed' : ''}`}
        />
      </div>

      {/* Balance Scale Visualization */}
      <div className="bg-blue-50 rounded-xl p-4 sm:p-6 overflow-visible">
        <div className="relative h-56 sm:h-64">
          {/* Scale Base */}
          <div className="absolute bottom-10 sm:bottom-12 left-1/2 -translate-x-1/2 w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-b from-gray-600 to-gray-800 rounded-t-full">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 sm:w-4 h-8 sm:h-10 bg-gradient-to-b from-gray-500 to-gray-700"></div>
          </div>

          {/* Scale Beam */}
          <motion.div
            className="absolute bottom-26 sm:bottom-32 left-1/2 -translate-x-1/2 w-80 sm:w-96 h-3 sm:h-4 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 rounded-full origin-center"
            animate={{
              rotate: hasSubmitted
                ? isBalanced ? 0 : (leftTotal > rightTotal ? -8 : 8)
                : tiltAngle
            }}
            transition={{ type: 'spring', stiffness: 100, damping: 10 }}
          >
            {/* Center Pivot Point */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 bg-yellow-500 rounded-full border-2 border-yellow-600"></div>

            {/* Left Pan */}
            <motion.div
              className="absolute top-3 sm:top-4 -left-12 sm:-left-14 w-32 sm:w-36 h-20 sm:h-24 bg-gradient-to-br from-amber-200 to-amber-400 rounded-t-2xl border-2 border-amber-500"
              animate={{
                y: hasSubmitted
                  ? isBalanced ? 0 : (leftTotal > rightTotal ? -15 : 15)
                  : tiltAngle * -1.5
              }}
            >
              {/* Chain Links */}
              <div className="absolute -top-5 sm:-top-6 left-1/2 -translate-x-1/2 w-1 h-5 sm:h-6 bg-gray-700"></div>
              <div className="absolute -top-6 sm:-top-7 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-700 rounded-full"></div>

              {/* Left Values */}
              <div className="h-full flex flex-wrap items-center justify-center gap-1.5 p-2 sm:p-2.5">
                {leftSide.map((value, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0, y: -50 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, type: 'spring' }}
                    className={`relative ${
                      idx === missingValue && value === 0
                        ? 'w-10 sm:w-12 h-10 sm:h-12 border-2 border-dashed border-blue-400 bg-blue-100 rounded-lg flex items-center justify-center'
                        : 'w-9 sm:w-11 h-9 sm:h-11 bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-lg flex items-center justify-center'
                    }`}
                  >
                    <span className="text-base sm:text-lg font-bold">
                      {idx === missingValue && value === 0 ? (
                        userAnswer || '?'
                      ) : (
                        value
                      )}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Pan */}
            <motion.div
              className="absolute top-3 sm:top-4 -right-12 sm:-right-14 w-32 sm:w-36 h-20 sm:h-24 bg-gradient-to-br from-amber-200 to-amber-400 rounded-t-2xl border-2 border-amber-500"
              animate={{
                y: hasSubmitted
                  ? isBalanced ? 0 : (leftTotal > rightTotal ? 15 : -15)
                  : tiltAngle * 1.5
              }}
            >
              {/* Chain Links */}
              <div className="absolute -top-5 sm:-top-6 left-1/2 -translate-x-1/2 w-1 h-5 sm:h-6 bg-gray-700"></div>
              <div className="absolute -top-6 sm:-top-7 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-700 rounded-full"></div>

              {/* Right Values */}
              <div className="h-full flex flex-wrap items-center justify-center gap-1.5 p-2 sm:p-2.5">
                {rightSide.map((value, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0, y: -50 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ delay: (leftSide.length + idx) * 0.1, type: 'spring' }}
                    className="w-9 sm:w-11 h-9 sm:h-11 bg-gradient-to-br from-red-400 to-red-600 text-white rounded-lg flex items-center justify-center"
                  >
                    <span className="text-base sm:text-lg font-bold">{value}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
})

export default BalanceScale
