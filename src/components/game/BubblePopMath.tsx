'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Bubble {
  id: string
  value: number
  x: number // horizontal position (0-100%)
  speed: number // speed multiplier
  startDelay: number // delay before starting to rise
}

interface BubblePopMathProps {
  question: string
  numbers: number[] // all numbers to show in bubbles
  correctAnswers: number[] // numbers that should be popped
  onAnswer: (isCorrect: boolean) => void
}

export default function BubblePopMath({ question, numbers, correctAnswers, onAnswer }: BubblePopMathProps) {
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const [poppedIds, setPoppedIds] = useState<Set<string>>(new Set())
  const [poppedCorrect, setPoppedCorrect] = useState<Set<number>>(new Set())
  const [poppedWrong, setPoppedWrong] = useState<Set<number>>(new Set())
  const [hasSubmitted, setHasSubmitted] = useState(false)

  // Initialize bubbles with random positions and speeds
  useEffect(() => {
    const initialBubbles: Bubble[] = numbers.map((num, index) => ({
      id: `bubble-${index}-${num}`,
      value: num,
      x: Math.random() * 80 + 10, // 10-90% to keep bubbles visible
      speed: 0.8 + Math.random() * 0.4, // 0.8-1.2x speed
      startDelay: Math.random() * 1000, // 0-1s delay
    }))
    setBubbles(initialBubbles)
  }, [numbers])

  const handleBubblePop = (bubble: Bubble) => {
    if (hasSubmitted || poppedIds.has(bubble.id)) return

    // Add to popped set
    setPoppedIds(prev => new Set([...prev, bubble.id]))

    // Check if this number should be popped
    if (correctAnswers.includes(bubble.value)) {
      setPoppedCorrect(prev => new Set([...prev, bubble.value]))
    } else {
      setPoppedWrong(prev => new Set([...prev, bubble.value]))
    }
  }

  // Auto-submit when all correct answers are popped
  useEffect(() => {
    if (hasSubmitted) return
    
    const allCorrectPopped = correctAnswers.every(num => poppedCorrect.has(num))
    
    if (allCorrectPopped && poppedCorrect.size > 0) {
      setHasSubmitted(true)
      // Check if any wrong bubbles were popped
      const isFullyCorrect = poppedWrong.size === 0
      setTimeout(() => onAnswer(isFullyCorrect), 500)
    }
  }, [poppedCorrect, poppedWrong, correctAnswers, hasSubmitted, onAnswer])

  return (
    <div className="relative w-full h-[500px] bg-gradient-to-b from-blue-100 to-blue-50 rounded-3xl border-2 border-blue-200 overflow-hidden">
      {/* Question at top */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-blue-500 to-blue-400 text-white p-6 text-center shadow-lg z-10">
        <h3 className="text-2xl font-bold mb-2">{question}</h3>
        <p className="text-sm opacity-90">Tap the bubbles with correct answers!</p>
      </div>

      {/* Score indicator */}
      <div className="absolute top-24 left-4 bg-white/90 rounded-xl px-4 py-2 shadow-lg z-10">
        <div className="text-sm font-semibold text-gray-700">
          Correct: <span className="text-green-600">{poppedCorrect.size}</span> / {correctAnswers.length}
        </div>
        {poppedWrong.size > 0 && (
          <div className="text-sm font-semibold text-red-600">
            Wrong: {poppedWrong.size}
          </div>
        )}
      </div>

      {/* Bubbles container */}
      <div className="absolute inset-0 pt-32 z-20">
        <AnimatePresence>
          {bubbles.map((bubble) => {
            const isPopped = poppedIds.has(bubble.id)
            const isCorrect = correctAnswers.includes(bubble.value)
            const wasCorrectlyPopped = poppedCorrect.has(bubble.value)
            const wasWronglyPopped = poppedWrong.has(bubble.value)

            if (isPopped) return null

            return (
              <motion.button
                key={bubble.id}
                className={`absolute cursor-pointer transition-all duration-200 z-30 ${
                  hasSubmitted ? 'pointer-events-none' : ''
                }`}
                style={{
                  left: `${bubble.x}%`,
                  zIndex: 30,
                }}
                initial={{ bottom: '-100px', opacity: 0 }}
                animate={{ 
                  bottom: '100%', 
                  opacity: 1,
                }}
                exit={{
                  scale: [1, 1.5, 0],
                  opacity: [1, 0.5, 0],
                  transition: { duration: 0.3 }
                }}
                transition={{
                  duration: 8 / bubble.speed,
                  delay: bubble.startDelay / 1000,
                  ease: 'linear',
                }}
                onClick={() => handleBubblePop(bubble)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {/* Bubble with gradient */}
                <div className="relative">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-blue-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
                  
                  {/* Main bubble */}
                  <div className={`relative w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold shadow-xl border-4
                    ${isCorrect 
                      ? 'bg-gradient-to-br from-green-300 to-green-400 border-green-200' 
                      : 'bg-gradient-to-br from-blue-300 to-blue-400 border-blue-200'
                    }`}
                  >
                    {/* Shine effect */}
                    <div className="absolute top-2 left-2 w-8 h-8 bg-white/60 rounded-full blur-sm"></div>
                    
                    {/* Number - high contrast with white background circle */}
                    <div className="relative z-10 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-inner">
                      <span className="text-gray-900 text-4xl font-black">
                        {bubble.value}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.button>
            )
          })}
        </AnimatePresence>

        {/* Pop effects for correct answers */}
        {Array.from(poppedCorrect).map((num) => (
          <motion.div
            key={`pop-correct-${num}`}
            className="absolute top-1/2 left-1/2 text-6xl"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: [0, 2, 0], opacity: [1, 1, 0] }}
            transition={{ duration: 1 }}
          >
            ✨
          </motion.div>
        ))}

        {/* Pop effects for wrong answers */}
        {Array.from(poppedWrong).map((num) => (
          <motion.div
            key={`pop-wrong-${num}`}
            className="absolute top-1/2 left-1/2 text-6xl"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: [0, 1.5, 0], opacity: [1, 1, 0] }}
            transition={{ duration: 0.8 }}
          >
            ❌
          </motion.div>
        ))}
      </div>

      {/* Completion message */}
      {hasSubmitted && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className={`text-8xl`}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', duration: 0.6 }}
          >
            {poppedWrong.size === 0 ? '🎉' : '😅'}
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
