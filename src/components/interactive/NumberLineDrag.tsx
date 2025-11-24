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

  // Reset state when question changes
  useEffect(() => {
    setCurrentPosition(startPosition ?? min)
    setHasSubmitted(false)
    setIsDragging(false)
  }, [question, correctAnswer, min, startPosition])

  // Handle drag position from mouse/touch
  const updatePositionFromEvent = (clientX: number) => {
    if (!containerRef.current || hasSubmitted) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(1, x / rect.width))
    
    // Convert percentage to number position
    const rawPosition = min + percentage * (max - min)
    
    // ALWAYS snap to nearest integer for accurate positioning
    const snappedPosition = Math.round(rawPosition)

    // Clamp to valid range
    const clampedPosition = Math.max(min, Math.min(max, snappedPosition))

    setCurrentPosition(clampedPosition)
  }

  const handleMouseDown = () => {
    if (!hasSubmitted) setIsDragging(true)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      updatePositionFromEvent(e.clientX)
    }
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging && e.touches.length > 0) {
      updatePositionFromEvent(e.touches[0].clientX)
    }
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  // Add global event listeners for mouse/touch move
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleDragEnd)
      window.addEventListener('touchmove', handleTouchMove)
      window.addEventListener('touchend', handleDragEnd)
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleDragEnd)
        window.removeEventListener('touchmove', handleTouchMove)
        window.removeEventListener('touchend', handleDragEnd)
      }
    }
  }, [isDragging])

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
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
      {/* Number Line Container - Clean */}
      <div
        className="relative w-full mb-8 select-none"
        style={{ minHeight: '200px' }}
      >
        {/* Inner container for perfect alignment */}
        <div ref={containerRef} className="relative w-full" style={{ height: '140px', paddingTop: '40px', paddingBottom: '40px' }}>
          {/* The Line - Traditional Number Line Style */}
          <div className="absolute left-0 right-0 h-1 bg-gray-800" style={{ top: '50%', transform: 'translateY(-50%)' }}></div>

          {/* Left Arrow */}
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3"
            style={{ zIndex: 1 }}
          >
            <div className="w-0 h-0 border-t-[6px] border-b-[6px] border-r-[10px] border-t-transparent border-b-transparent border-r-gray-800"></div>
          </div>

          {/* Right Arrow */}
          <div 
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3"
            style={{ zIndex: 1 }}
          >
            <div className="w-0 h-0 border-t-[6px] border-b-[6px] border-l-[10px] border-t-transparent border-b-transparent border-l-gray-800"></div>
          </div>

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
              {/* Tick Mark - Traditional Vertical Line */}
              <div
                className={`w-0.5 mx-auto mb-2 transition-all duration-200 ${
                  isCurrentAnswer && !hasSubmitted
                    ? 'bg-blue-600 h-8'
                    : isCorrectAnswer
                    ? 'bg-green-600 h-8'
                    : 'bg-gray-800 h-6'
                }`}
              ></div>

              {/* Number Label - Enhanced */}
              <div
                className={`text-center font-bold transition-all duration-200 ${
                  isCorrectAnswer
                    ? 'text-green-600 text-2xl scale-125'
                    : isWrongAnswer
                    ? 'text-red-600 text-xl'
                    : isCurrentAnswer && !hasSubmitted
                    ? 'text-blue-600 text-2xl font-extrabold'
                    : 'text-gray-800 text-lg'
                }`}
              >
                {num}
              </div>
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
          whileTap={{ scale: 1.1 }}
          animate={{
            scale: hasSubmitted ? 1 : isDragging ? 1.1 : 1,
            y: isDragging ? -5 : 0
          }}
        >
          <div className={`relative ${hasSubmitted ? 'pointer-events-none' : ''}`}>
            {/* Current Position Display - Above Marker */}
            <div
              className={`absolute -top-16 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl font-bold text-white text-xl shadow-lg border-2 ${
                hasSubmitted
                  ? Math.round(currentPosition) === correctAnswer
                    ? 'bg-green-600 border-green-500'
                    : 'bg-red-500 border-red-400'
                  : 'bg-blue-500 border-blue-400'
              }`}
            >
              <div className="flex items-center gap-2">
                {hasSubmitted && (
                  <span className="text-xl">
                    {Math.round(currentPosition) === correctAnswer ? '✓' : '✗'}
                  </span>
                )}
                <span>{Math.round(currentPosition)}</span>
              </div>
              {/* Arrow pointing down */}
              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[10px] border-l-transparent border-r-transparent ${
                  hasSubmitted
                    ? Math.round(currentPosition) === correctAnswer
                      ? 'border-t-green-600'
                      : 'border-t-red-500'
                    : 'border-t-blue-500'
                }`}
              ></div>
            </div>
          </div>
        </motion.div>

        </div>
      </div>

      {/* Submit Button */}
      {!hasSubmitted && (
        <div className="text-center">
          <motion.button
            onClick={handleSubmit}
            className="px-10 py-4 bg-green-500 hover:bg-green-600 text-white font-bold text-xl rounded-xl shadow-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Submit Answer
          </motion.button>
        </div>
      )}
    </div>
  )
}
