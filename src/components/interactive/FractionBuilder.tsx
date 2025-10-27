'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface FractionBuilderProps {
  denominator: number // 2, 3, 4, 8, etc.
  correctNumerator: number
  question: string
  onAnswer: (isCorrect: boolean, userAnswer: string) => void
  shape?: 'circle' | 'rectangle'
}

export default function FractionBuilder({
  denominator,
  correctNumerator,
  question,
  onAnswer,
  shape = 'circle'
}: FractionBuilderProps) {
  const [filledSegments, setFilledSegments] = useState<Set<number>>(new Set())
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const segments = Array.from({ length: denominator }, (_, i) => i)

  const toggleSegment = (index: number) => {
    if (hasSubmitted) return

    const newFilled = new Set(filledSegments)
    if (newFilled.has(index)) {
      newFilled.delete(index)
    } else {
      newFilled.add(index)
    }
    setFilledSegments(newFilled)
  }

  const handleSubmit = () => {
    if (hasSubmitted) return
    const numerator = filledSegments.size
    const isCorrect = numerator === correctNumerator
    setHasSubmitted(true)
    onAnswer(isCorrect, `${numerator}/${denominator}`)
  }

  const handleReset = () => {
    setFilledSegments(new Set())
    setHasSubmitted(false)
  }

  const numerator = filledSegments.size

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      {/* Question */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{question}</h3>
        <p className="text-lg text-gray-600">Tap the segments to fill them</p>
      </div>

      {/* Shape Display */}
      <div className="flex justify-center mb-8">
        {shape === 'circle' ? (
          <CircleShape
            segments={segments}
            filledSegments={filledSegments}
            onToggle={toggleSegment}
            hasSubmitted={hasSubmitted}
            isCorrect={numerator === correctNumerator}
          />
        ) : (
          <RectangleShape
            segments={segments}
            filledSegments={filledSegments}
            onToggle={toggleSegment}
            hasSubmitted={hasSubmitted}
            isCorrect={numerator === correctNumerator}
          />
        )}
      </div>

      {/* Fraction Display */}
      <div className="text-center mb-6">
        <div className="inline-block">
          <div className="text-center">
            <div className={`text-6xl font-bold transition-colors duration-300 ${
              hasSubmitted
                ? numerator === correctNumerator
                  ? 'text-green-600'
                  : 'text-red-600'
                : 'text-blue-600'
            }`}>
              {numerator}
            </div>
            <div className="w-full h-1 bg-gray-800 my-2"></div>
            <div className="text-6xl font-bold text-gray-800">{denominator}</div>
          </div>
        </div>

        {/* Fraction Name */}
        <div className="mt-4 text-xl text-gray-700">
          {numerator === 0 ? 'None selected' : 
           numerator === denominator ? 'One whole' :
           `${numerator} out of ${denominator}`}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center gap-4">
        {!hasSubmitted ? (
          <>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gray-500 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Clear All
            </button>
            <button
              onClick={handleSubmit}
              disabled={numerator === 0}
              className={`px-8 py-3 font-bold text-lg rounded-full shadow-lg transition-all duration-200 ${
                numerator === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-xl transform hover:scale-105'
              }`}
            >
              Submit Answer
            </button>
          </>
        ) : (
          <button
            onClick={() => onAnswer(numerator === correctNumerator, `${numerator}/${denominator}`)}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Continue
          </button>
        )}
      </div>

      {/* Result */}
      {hasSubmitted && (
        <motion.div
          className="mt-8 text-center"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
        >
          {numerator === correctNumerator ? (
            <div className="bg-green-100 border-4 border-green-500 rounded-2xl p-6">
              <div className="text-6xl mb-2">🎉</div>
              <div className="text-2xl font-bold text-green-700">Excellent!</div>
              <div className="text-lg text-green-600 mt-2">
                You built {correctNumerator}/{denominator} perfectly!
              </div>
            </div>
          ) : (
            <div className="bg-red-100 border-4 border-red-500 rounded-2xl p-6">
              <div className="text-6xl mb-2">🤔</div>
              <div className="text-2xl font-bold text-red-700">Not quite!</div>
              <div className="text-lg text-red-600 mt-2">
                You made {numerator}/{denominator}, but the answer is {correctNumerator}/{denominator}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

// Circle Shape Component
function CircleShape({
  segments,
  filledSegments,
  onToggle,
  hasSubmitted,
  isCorrect
}: {
  segments: number[]
  filledSegments: Set<number>
  onToggle: (index: number) => void
  hasSubmitted: boolean
  isCorrect: boolean
}) {
  const size = 300
  const centerX = size / 2
  const centerY = size / 2
  const radius = size / 2 - 10

  return (
    <svg width={size} height={size} className="drop-shadow-2xl">
      {/* Outer circle */}
      <circle
        cx={centerX}
        cy={centerY}
        r={radius}
        fill="none"
        stroke="#374151"
        strokeWidth="4"
      />

      {/* Segments */}
      {segments.map((index) => {
        const angleStep = (2 * Math.PI) / segments.length
        const startAngle = index * angleStep - Math.PI / 2
        const endAngle = (index + 1) * angleStep - Math.PI / 2

        const x1 = centerX + radius * Math.cos(startAngle)
        const y1 = centerY + radius * Math.sin(startAngle)
        const x2 = centerX + radius * Math.cos(endAngle)
        const y2 = centerY + radius * Math.sin(endAngle)

        const isFilled = filledSegments.has(index)
        const fillColor = hasSubmitted
          ? isCorrect
            ? isFilled ? '#10b981' : '#f3f4f6'
            : isFilled ? '#ef4444' : '#f3f4f6'
          : isFilled
          ? '#3b82f6'
          : '#f3f4f6'

        // Create path for segment
        const largeArcFlag = angleStep > Math.PI ? 1 : 0
        const pathData = `
          M ${centerX} ${centerY}
          L ${x1} ${y1}
          A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
          Z
        `

        return (
          <g key={index}>
            <path
              d={pathData}
              fill={fillColor}
              stroke="#374151"
              strokeWidth="2"
              onClick={() => onToggle(index)}
              className={`transition-all duration-300 ${
                hasSubmitted ? 'cursor-default' : 'cursor-pointer hover:opacity-80'
              }`}
            />
            {/* Line from center */}
            <line
              x1={centerX}
              y1={centerY}
              x2={x1}
              y2={y1}
              stroke="#374151"
              strokeWidth="2"
            />
          </g>
        )
      })}
    </svg>
  )
}

// Rectangle Shape Component
function RectangleShape({
  segments,
  filledSegments,
  onToggle,
  hasSubmitted,
  isCorrect
}: {
  segments: number[]
  filledSegments: Set<number>
  onToggle: (index: number) => void
  hasSubmitted: boolean
  isCorrect: boolean
}) {
  const segmentWidth = 60
  const segmentHeight = 200

  return (
    <div className="flex gap-1">
      {segments.map((index) => {
        const isFilled = filledSegments.has(index)
        const bgColor = hasSubmitted
          ? isCorrect
            ? isFilled ? 'bg-green-500' : 'bg-gray-200'
            : isFilled ? 'bg-red-500' : 'bg-gray-200'
          : isFilled
          ? 'bg-blue-500'
          : 'bg-gray-200'

        return (
          <motion.div
            key={index}
            className={`${bgColor} border-4 border-gray-800 rounded-lg transition-all duration-300 ${
              hasSubmitted ? 'cursor-default' : 'cursor-pointer hover:opacity-80'
            }`}
            style={{
              width: segmentWidth,
              height: segmentHeight
            }}
            onClick={() => onToggle(index)}
            whileHover={hasSubmitted ? {} : { scale: 1.05 }}
            whileTap={hasSubmitted ? {} : { scale: 0.95 }}
          />
        )
      })}
    </div>
  )
}
