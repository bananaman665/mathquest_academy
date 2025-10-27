'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

interface NumberLineDragProps {
  min: number
  max: number
  correctAnswer: number
  question: string
  onAnswer: (isCorrect: boolean, userAnswer: number) => void
  showJumps?: boolean // Show jump visualization for addition/subtraction
  startPosition?: number // For jump problems
}

export default function NumberLineDrag({
  min,
  max,
  correctAnswer,
  question,
  onAnswer,
  showJumps = false,
  startPosition
}: NumberLineDragProps) {
  const [currentPosition, setCurrentPosition] = useState<number>(startPosition ?? min)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const numbers = Array.from({ length: max - min + 1 }, (_, i) => min + i)
  const snapThreshold = 0.4 // How close to snap

  const handleDrag = (clientX: number) => {
    if (!containerRef.current || hasSubmitted) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(1, x / rect.width))
    
    // Convert percentage to number position
    const rawPosition = min + percentage * (max - min)
    
    // Snap to nearest integer
    const snappedPosition = Math.round(rawPosition)
    
    // Check if close enough to snap
    if (Math.abs(rawPosition - snappedPosition) < snapThreshold) {
      setCurrentPosition(snappedPosition)
    } else {
      setCurrentPosition(rawPosition)
    }
  }

  const handleMouseDown = () => setIsDragging(true)
  
  const handleMouseUp = () => setIsDragging(false)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleDrag(e.clientX)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleDrag(e.touches[0].clientX)
    }
  }

  const handleSubmit = () => {
    if (hasSubmitted) return
    const roundedAnswer = Math.round(currentPosition)
    const isCorrect = roundedAnswer === correctAnswer
    setHasSubmitted(true)
    setCurrentPosition(roundedAnswer) // Snap to final position
    onAnswer(isCorrect, roundedAnswer)
  }

  // Calculate marker position percentage
  const getPositionPercentage = (num: number) => {
    return ((num - min) / (max - min)) * 100
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      {/* Question */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{question}</h3>
        {showJumps && startPosition !== undefined && (
          <p className="text-lg text-gray-600">
            Start at {startPosition}, where do you end?
          </p>
        )}
      </div>

      {/* Number Line Container */}
      <div
        ref={containerRef}
        className="relative w-full h-32 mb-8 cursor-pointer select-none"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        {/* The Line */}
        <div className="absolute top-1/2 left-0 right-0 h-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full shadow-lg"></div>

        {/* Number Markers */}
        {numbers.map((num) => {
          const percentage = getPositionPercentage(num)
          const isCurrentAnswer = Math.round(currentPosition) === num
          const isCorrectAnswer = hasSubmitted && num === correctAnswer
          const isWrongAnswer = hasSubmitted && Math.round(currentPosition) === num && num !== correctAnswer

          return (
            <div
              key={num}
              className="absolute"
              style={{
                left: `${percentage}%`,
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            >
              {/* Tick Mark */}
              <div
                className={`w-1 h-8 mx-auto mb-2 transition-all duration-200 ${
                  isCurrentAnswer && !hasSubmitted
                    ? 'bg-yellow-400 h-12 w-2 shadow-lg'
                    : 'bg-gray-400'
                }`}
              ></div>

              {/* Number Label */}
              <div
                className={`text-center font-bold transition-all duration-200 ${
                  isCorrectAnswer
                    ? 'text-green-600 text-2xl scale-125'
                    : isWrongAnswer
                    ? 'text-red-600 text-xl'
                    : isCurrentAnswer && !hasSubmitted
                    ? 'text-blue-600 text-xl'
                    : 'text-gray-700 text-lg'
                }`}
              >
                {num}
              </div>

              {/* Highlight Circle */}
              {isCurrentAnswer && !hasSubmitted && (
                <motion.div
                  className="absolute top-1/2 left-1/2 w-12 h-12 bg-yellow-300 rounded-full -z-10"
                  style={{ transform: 'translate(-50%, -50%)' }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: 0.3 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </div>
          )
        })}

        {/* Draggable Marker */}
        <motion.div
          className="absolute top-1/2 cursor-grab active:cursor-grabbing z-20"
          style={{
            left: `${getPositionPercentage(currentPosition)}%`,
            transform: 'translate(-50%, -50%)'
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
          drag="x"
          dragConstraints={containerRef}
          dragElastic={0}
          whileDrag={{ scale: 1.2 }}
          animate={{
            scale: hasSubmitted ? 1 : isDragging ? 1.2 : 1
          }}
        >
          <div className={`relative ${hasSubmitted ? 'pointer-events-none' : ''}`}>
            {/* Marker Arrow */}
            <div
              className={`w-0 h-0 border-l-[20px] border-r-[20px] border-t-[30px] border-l-transparent border-r-transparent transition-colors duration-200 ${
                hasSubmitted
                  ? Math.round(currentPosition) === correctAnswer
                    ? 'border-t-green-500'
                    : 'border-t-red-500'
                  : isDragging
                  ? 'border-t-yellow-500'
                  : 'border-t-blue-500'
              } drop-shadow-lg`}
            ></div>

            {/* Current Position Display */}
            <div
              className={`absolute -top-16 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full font-bold text-white text-xl shadow-xl ${
                hasSubmitted
                  ? Math.round(currentPosition) === correctAnswer
                    ? 'bg-green-500'
                    : 'bg-red-500'
                  : 'bg-blue-500'
              }`}
            >
              {Math.round(currentPosition)}
            </div>
          </div>
        </motion.div>

        {/* Jump Visualization (for addition/subtraction) */}
        {showJumps && startPosition !== undefined && !hasSubmitted && (
          <motion.div
            className="absolute top-1/2 h-1 bg-orange-400 border-2 border-orange-600"
            style={{
              left: `${getPositionPercentage(startPosition)}%`,
              width: `${Math.abs(getPositionPercentage(currentPosition) - getPositionPercentage(startPosition))}%`,
              transform: 'translateY(-50%)'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
          >
            {/* Arrow at end */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-0 h-0 border-l-[12px] border-t-[8px] border-b-[8px] border-l-orange-600 border-t-transparent border-b-transparent"
              style={{
                right: currentPosition > startPosition ? '-12px' : 'auto',
                left: currentPosition < startPosition ? '-12px' : 'auto',
                transform: currentPosition < startPosition ? 'rotate(180deg) translateY(50%)' : 'translateY(-50%)'
              }}
            ></div>
          </motion.div>
        )}
      </div>

      {/* Current Answer Display */}
      <div className="text-center mb-6">
        <div className="text-lg text-gray-600">
          Your answer: <span className="font-bold text-2xl text-blue-600">{Math.round(currentPosition)}</span>
        </div>
      </div>

      {/* Submit Button */}
      {!hasSubmitted && (
        <div className="text-center">
          <button
            onClick={handleSubmit}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-xl rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Submit Answer
          </button>
        </div>
      )}

      {/* Result */}
      {hasSubmitted && (
        <motion.div
          className="text-center"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
        >
          {Math.round(currentPosition) === correctAnswer ? (
            <div className="bg-green-100 border-4 border-green-500 rounded-2xl p-6">
              <div className="text-6xl mb-2">🎉</div>
              <div className="text-2xl font-bold text-green-700">Perfect!</div>
              <div className="text-lg text-green-600 mt-2">
                {correctAnswer} is the correct answer!
              </div>
            </div>
          ) : (
            <div className="bg-red-100 border-4 border-red-500 rounded-2xl p-6">
              <div className="text-6xl mb-2">🤔</div>
              <div className="text-2xl font-bold text-red-700">Not quite!</div>
              <div className="text-lg text-red-600 mt-2">
                The correct answer is {correctAnswer}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
