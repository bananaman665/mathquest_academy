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
  const [allBubbles, setAllBubbles] = useState<Bubble[]>([])
  const [activeBubbles, setActiveBubbles] = useState<Bubble[]>([])
  const [poppedIds, setPoppedIds] = useState<Set<string>>(new Set())
  const [poppedCorrect, setPoppedCorrect] = useState<Set<number>>(new Set())
  const [poppedWrong, setPoppedWrong] = useState<Set<number>>(new Set())
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Initialize all bubbles
  useEffect(() => {
    const initialBubbles: Bubble[] = numbers.map((num, index) => ({
      id: `bubble-${index}-${num}`,
      value: num,
      x: (index % 2 === 0) ? 25 : 65, // Alternate between left and right sides
      speed: 0.9 + Math.random() * 0.2, // 0.9-1.1x speed (more consistent)
      startDelay: 0,
    }))
    setAllBubbles(initialBubbles)
    setCurrentIndex(0)
  }, [numbers])

  // Show 2 bubbles at a time
  useEffect(() => {
    if (allBubbles.length === 0 || hasSubmitted) return

    const showNextBubbles = () => {
      const nextBubbles = allBubbles.slice(currentIndex, currentIndex + 2)
      if (nextBubbles.length > 0) {
        setActiveBubbles(prev => [...prev, ...nextBubbles])
        setCurrentIndex(prev => prev + 2)
      }
    }

    // Show first 2 bubbles immediately
    if (currentIndex === 0) {
      showNextBubbles()
    }
  }, [allBubbles, currentIndex, hasSubmitted])

  // When a bubble is popped or reaches the top, show next ones
  useEffect(() => {
    if (hasSubmitted || currentIndex >= allBubbles.length) return

    const timer = setTimeout(() => {
      const nextBubbles = allBubbles.slice(currentIndex, currentIndex + 2)
      if (nextBubbles.length > 0) {
        setActiveBubbles(prev => [...prev, ...nextBubbles])
        setCurrentIndex(prev => prev + 2)
      }
    }, 3000) // Show next pair every 3 seconds

    return () => clearTimeout(timer)
  }, [currentIndex, allBubbles, hasSubmitted])

  const handleBubblePop = (bubble: Bubble) => {
    if (hasSubmitted || poppedIds.has(bubble.id)) return

    // Add to popped set
    setPoppedIds(prev => new Set([...prev, bubble.id]))
    
    // Remove from active bubbles
    setActiveBubbles(prev => prev.filter(b => b.id !== bubble.id))

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
    <div className="relative w-full h-[600px] bg-gradient-to-b from-blue-400 via-cyan-300 to-blue-200 rounded-3xl border-4 border-blue-300 overflow-hidden shadow-2xl">
      {/* Decorative bubbles in background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full blur-xl"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-white rounded-full blur-lg"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-white rounded-full blur-2xl"></div>
        <div className="absolute bottom-40 right-1/3 w-12 h-12 bg-white rounded-full blur-md"></div>
      </div>

      {/* Question at top - Enhanced */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-white p-6 text-center shadow-2xl z-10 border-b-4 border-white/30">
        <h3 className="text-2xl sm:text-3xl font-bold mb-2 drop-shadow-lg">{question}</h3>
        <p className="text-sm sm:text-base font-semibold opacity-95 flex items-center justify-center gap-2">
          <span className="text-2xl">👆</span>
          <span>Tap the bubbles with correct answers!</span>
        </p>
      </div>

      {/* Bubbles container */}
      <div className="absolute inset-0 pt-36">
        <AnimatePresence mode="popLayout">
          {activeBubbles.map((bubble) => {
            const isPopped = poppedIds.has(bubble.id)
            if (isPopped) return null

            const isCorrect = correctAnswers.includes(bubble.value)

            return (
              <motion.div
                key={bubble.id}
                className="absolute"
                style={{
                  left: `${bubble.x}%`,
                  width: '120px',
                  height: '120px',
                }}
                initial={{ 
                  y: 600,
                  opacity: 0,
                  scale: 0.5
                }}
                animate={{ 
                  y: -700,
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  scale: [1, 1.3, 0],
                  opacity: 0,
                  rotate: 360,
                  transition: { duration: 0.4 }
                }}
                transition={{
                  duration: 8 / bubble.speed,
                  ease: 'linear',
                }}
                onAnimationComplete={() => {
                  // Remove bubble when it reaches the top
                  setActiveBubbles(prev => prev.filter(b => b.id !== bubble.id))
                }}
              >
                <button
                  className="w-full h-full relative"
                  onClick={() => handleBubblePop(bubble)}
                  disabled={hasSubmitted}
                >
                  {/* Main bubble circle - Enhanced */}
                  <div 
                    className={`w-full h-full rounded-full flex items-center justify-center shadow-2xl border-[6px] transition-transform hover:scale-105 active:scale-95 ${
                      isCorrect 
                        ? 'bg-gradient-to-br from-green-300 via-emerald-400 to-green-300 border-green-400 shadow-green-500/50' 
                        : 'bg-gradient-to-br from-blue-300 via-cyan-400 to-blue-300 border-blue-400 shadow-blue-500/50'
                    }`}
                  >
                    {/* Multiple shine effects for depth */}
                    <div className="absolute top-4 left-4 w-10 h-10 bg-white/80 rounded-full blur-md pointer-events-none"></div>
                    <div className="absolute top-6 left-6 w-6 h-6 bg-white/60 rounded-full blur-sm pointer-events-none"></div>
                    <div className="absolute bottom-8 right-8 w-8 h-8 bg-white/30 rounded-full blur-lg pointer-events-none"></div>
                    
                    {/* Number display - Bigger and bolder */}
                    <span className="text-6xl font-black text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] relative z-10" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
                      {bubble.value}
                    </span>
                  </div>
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* Pop effects for correct answers - Enhanced */}
        {Array.from(poppedCorrect).map((num, index) => (
          <motion.div
            key={`pop-correct-${num}-${index}`}
            className="absolute top-1/2 left-1/2 text-7xl pointer-events-none"
            initial={{ scale: 0, opacity: 1, rotate: -45 }}
            animate={{ 
              scale: [0, 1.5, 0], 
              opacity: [1, 1, 0],
              rotate: [0, 180, 360],
              y: [-20, -60, -100]
            }}
            transition={{ duration: 1.2 }}
          >
            ✨
          </motion.div>
        ))}

        {/* Pop effects for wrong answers - Enhanced */}
        {Array.from(poppedWrong).map((num, index) => (
          <motion.div
            key={`pop-wrong-${num}-${index}`}
            className="absolute top-1/2 left-1/2 text-6xl pointer-events-none"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ 
              scale: [0, 1.3, 0], 
              opacity: [1, 1, 0],
              rotate: [0, -30, 30, 0]
            }}
            transition={{ duration: 0.9 }}
          >
            ❌
          </motion.div>
        ))}
      </div>

      {/* Completion message - Enhanced */}
      {hasSubmitted && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-blue-900/30 to-purple-900/30 backdrop-blur-md z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="text-center"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', duration: 0.6 }}
          >
            <div className="text-9xl mb-4">
              {poppedWrong.size === 0 ? '🎉' : '😅'}
            </div>
            <div className="bg-white rounded-2xl px-8 py-4 shadow-2xl">
              <div className="text-2xl font-bold text-gray-800">
                {poppedWrong.size === 0 ? 'Perfect!' : 'Good Try!'}
              </div>
              <div className="text-lg text-gray-600 mt-1">
                {poppedCorrect.size} correct • {poppedWrong.size} wrong
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
