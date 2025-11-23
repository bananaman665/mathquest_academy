'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface BalanceScaleProps {
  question: string
  leftSide: number[]  // Values on left side
  rightSide: number[] // Values on right side
  missingValue?: number // Which index has the missing value (left side)
  correctAnswer: number
  showEquals?: boolean // Show as equation format
  onAnswer: (isCorrect: boolean, userAnswer: number) => void
}

export default function BalanceScale({
  question,
  leftSide,
  rightSide,
  missingValue = 0,
  correctAnswer,
  showEquals = true,
  onAnswer
}: BalanceScaleProps) {
  const [userAnswer, setUserAnswer] = useState<number>(0)
  const [hasSubmitted, setHasSubmitted] = useState(false)

  // Reset state when question changes
  useEffect(() => {
    setUserAnswer(0)
    setHasSubmitted(false)
  }, [question, correctAnswer])

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

  const handleNumberClick = (num: number) => {
    if (hasSubmitted) return
    setUserAnswer(num)
  }

  const handleSubmit = () => {
    if (hasSubmitted || userAnswer === 0) return
    const isCorrect = userAnswer === correctAnswer
    setHasSubmitted(true)
    onAnswer(isCorrect, userAnswer)
  }

  const handleClear = () => {
    if (!hasSubmitted) {
      setUserAnswer(0)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
      {/* Question */}
      <div className="text-center mb-4 sm:mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{question}</h3>
        {showEquals && (
          <p className="text-lg sm:text-2xl text-gray-600">
            Find the missing value to balance the scale
          </p>
        )}
      </div>

      {/* Balance Scale Visualization - Adjusted for mobile */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-xl p-4 sm:p-8 mb-4 sm:mb-6 overflow-visible">
        <div className="relative h-64 sm:h-80">
          {/* Scale Base - Smaller */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 sm:w-32 h-20 sm:h-32 bg-gradient-to-b from-gray-600 to-gray-800 rounded-t-full">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 sm:w-4 h-10 sm:h-16 bg-gradient-to-b from-gray-500 to-gray-700"></div>
          </div>

          {/* Scale Beam - Responsive width */}
          <motion.div
            className="absolute bottom-20 sm:bottom-32 left-1/2 -translate-x-1/2 w-72 sm:w-96 h-3 sm:h-4 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 rounded-full shadow-2xl origin-center"
            animate={{
              rotate: hasSubmitted 
                ? isBalanced ? 0 : (leftTotal > rightTotal ? -8 : 8)
                : tiltAngle
            }}
            transition={{ type: 'spring', stiffness: 100, damping: 10 }}
          >
            {/* Center Pivot Point */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 sm:w-6 h-4 sm:h-6 bg-yellow-500 rounded-full border-2 sm:border-4 border-yellow-600 shadow-lg"></div>

            {/* Left Pan - Responsive */}
            <motion.div
              className="absolute top-3 sm:top-4 -left-12 sm:-left-16 w-32 sm:w-40 h-24 sm:h-32 bg-gradient-to-br from-amber-200 to-amber-400 rounded-t-3xl border-2 sm:border-4 border-amber-500 shadow-xl"
              animate={{
                y: hasSubmitted
                  ? isBalanced ? 0 : (leftTotal > rightTotal ? -20 : 20)
                  : tiltAngle * -1.5
              }}
            >
              {/* Chain Links */}
              <div className="absolute -top-6 sm:-top-8 left-1/2 -translate-x-1/2 w-1 h-6 sm:h-8 bg-gray-700"></div>
              <div className="absolute -top-8 sm:-top-10 left-1/2 -translate-x-1/2 w-2 sm:w-3 h-2 sm:h-3 bg-gray-700 rounded-full"></div>

              {/* Left Values */}
              <div className="h-full flex flex-wrap items-center justify-center gap-1 sm:gap-2 p-2 sm:p-3">
                {leftSide.map((value, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0, y: -50 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, type: 'spring' }}
                    className={`relative ${
                      idx === missingValue && value === 0
                        ? 'w-12 sm:w-16 h-12 sm:h-16 border-2 sm:border-4 border-dashed border-blue-400 bg-blue-100 rounded-xl flex items-center justify-center'
                        : 'w-10 sm:w-14 h-10 sm:h-14 bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg'
                    }`}
                  >
                    <span className="text-lg sm:text-2xl font-bold">
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

            {/* Right Pan - Responsive */}
            <motion.div
              className="absolute top-3 sm:top-4 -right-12 sm:-right-16 w-32 sm:w-40 h-24 sm:h-32 bg-gradient-to-br from-amber-200 to-amber-400 rounded-t-3xl border-2 sm:border-4 border-amber-500 shadow-xl"
              animate={{
                y: hasSubmitted
                  ? isBalanced ? 0 : (leftTotal > rightTotal ? 20 : -20)
                  : tiltAngle * 1.5
              }}
            >
              {/* Chain Links */}
              <div className="absolute -top-6 sm:-top-8 left-1/2 -translate-x-1/2 w-1 h-6 sm:h-8 bg-gray-700"></div>
              <div className="absolute -top-8 sm:-top-10 left-1/2 -translate-x-1/2 w-2 sm:w-3 h-2 sm:h-3 bg-gray-700 rounded-full"></div>

              {/* Right Values */}
              <div className="h-full flex flex-wrap items-center justify-center gap-1 sm:gap-2 p-2 sm:p-3">
                {rightSide.map((value, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0, y: -50 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ delay: (leftSide.length + idx) * 0.1, type: 'spring' }}
                    className="w-10 sm:w-14 h-10 sm:h-14 bg-gradient-to-br from-red-400 to-red-600 text-white rounded-xl flex items-center justify-center shadow-lg"
                  >
                    <span className="text-lg sm:text-2xl font-bold">{value}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Balance Status Indicator */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2">
            <motion.div
              animate={{
                scale: isBalanced && userAnswer > 0 ? [1, 1.2, 1] : 1,
                opacity: isBalanced && userAnswer > 0 ? 1 : 0.3
              }}
              transition={{ duration: 0.5, repeat: isBalanced && !hasSubmitted ? Infinity : 0 }}
              className={`text-4xl ${
                isBalanced && userAnswer > 0 ? '⚖️' : '❓'
              }`}
            >
              {isBalanced && userAnswer > 0 ? '⚖️' : '⚖️'}
            </motion.div>
            <p className={`text-center font-bold ${
              isBalanced && userAnswer > 0 ? 'text-green-600' : 'text-gray-400'
            }`}>
              {isBalanced && userAnswer > 0 ? 'Balanced!' : 'Not Balanced'}
            </p>
          </div>
        </div>
      </div>

      {/* Equation Display */}
      {showEquals && (
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="text-center">
            <p className="text-xl sm:text-3xl font-bold text-gray-800 mb-2">
              {leftSide.map((val, idx) => (
                <span key={idx}>
                  {idx > 0 && ' + '}
                  <span className={idx === missingValue && val === 0 ? 'text-blue-600' : ''}>
                    {idx === missingValue && val === 0 ? (userAnswer || '?') : val}
                  </span>
                </span>
              ))}
              {' = '}
              {rightSide.map((val, idx) => (
                <span key={idx}>
                  {idx > 0 && ' + '}
                  {val}
                </span>
              ))}
            </p>
            <p className="text-lg sm:text-xl text-gray-600">
              {leftTotal} {isBalanced ? '=' : leftTotal > rightTotal ? '>' : '<'} {rightTotal}
            </p>
          </div>
        </div>
      )}

      {/* Number Selector */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-xl p-4 sm:p-6 mb-4 sm:mb-6">
        <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 text-center">
          Select the Missing Value:
        </h4>
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              disabled={hasSubmitted}
              className={`h-12 sm:h-16 rounded-xl font-bold text-lg sm:text-xl transition-all ${
                userAnswer === num
                  ? hasSubmitted
                    ? num === correctAnswer
                      ? 'bg-green-500 text-white border-4 border-green-600 shadow-lg'
                      : 'bg-red-500 text-white border-4 border-red-600 shadow-lg'
                    : 'bg-blue-500 text-white border-4 border-blue-600 shadow-lg'
                  : hasSubmitted
                  ? num === correctAnswer
                    ? 'bg-green-100 text-green-800 border-2 border-green-400'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 active:scale-95'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 sm:gap-4 justify-center mb-4 sm:mb-6">
        <button
          onClick={handleClear}
          disabled={hasSubmitted || userAnswer === 0}
          className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold text-white transition-all text-sm sm:text-base ${
            hasSubmitted || userAnswer === 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gray-500 hover:bg-gray-600 active:scale-95'
          }`}
        >
          Clear
        </button>

        <button
          onClick={handleSubmit}
          disabled={hasSubmitted || userAnswer === 0}
          className={`px-6 sm:px-8 py-2 sm:py-3 rounded-full font-bold text-white text-base sm:text-lg transition-all ${
            hasSubmitted || userAnswer === 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 active:scale-95 shadow-lg'
          }`}
        >
          Submit Answer
        </button>
      </div>

      {/* Result Message */}
      {hasSubmitted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 sm:p-6 rounded-lg text-center font-bold text-base sm:text-lg ${
            userAnswer === correctAnswer
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {userAnswer === correctAnswer ? (
            <>
              🎉 Perfect! The scale is balanced!
              <br />
              <span className="text-sm">Both sides equal {leftTotal}!</span>
            </>
          ) : (
            <>
              ❌ Not quite. The correct answer is {correctAnswer}.
              <br />
              <span className="text-sm">
                With {correctAnswer}, both sides would equal {rightTotal}.
              </span>
            </>
          )}
        </motion.div>
      )}
    </div>
  )
}
