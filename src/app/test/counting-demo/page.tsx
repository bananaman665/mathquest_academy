'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import BubblePopMath from '@/components/game/BubblePopMath'

export default function CountingDemoPage() {
  const [currentDemo, setCurrentDemo] = useState<'drag-drop' | 'tap-count' | 'bubble-pop' | 'basket'>('drag-drop')
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          🎮 Interactive Counting Activities Demo
        </h1>
        
        {/* Activity Selector */}
        <div className="flex gap-4 mb-8 justify-center flex-wrap">
          <button
            onClick={() => setCurrentDemo('drag-drop')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              currentDemo === 'drag-drop'
                ? 'bg-blue-500 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            🎯 Drag & Drop Counter
          </button>
          <button
            onClick={() => setCurrentDemo('tap-count')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              currentDemo === 'tap-count'
                ? 'bg-green-500 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            👆 Tap to Count
          </button>
          <button
            onClick={() => setCurrentDemo('bubble-pop')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              currentDemo === 'bubble-pop'
                ? 'bg-purple-500 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            💥 Bubble Pop Counter
          </button>
          <button
            onClick={() => setCurrentDemo('basket')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              currentDemo === 'basket'
                ? 'bg-orange-500 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            🧺 Fill the Basket
          </button>
        </div>

        {/* Demo Container */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 min-h-[500px]">
          {currentDemo === 'drag-drop' && <DragDropCounter />}
          {currentDemo === 'tap-count' && <TapToCount />}
          {currentDemo === 'bubble-pop' && <BubblePopCounter />}
          {currentDemo === 'basket' && <FillTheBasket />}
        </div>
      </div>
    </div>
  )
}

// Activity 1: Drag & Drop Counter
function DragDropCounter() {
  const [items, setItems] = useState<Array<{ id: number; emoji: string; inBox: boolean }>>([
    { id: 1, emoji: '🍎', inBox: false },
    { id: 2, emoji: '🍎', inBox: false },
    { id: 3, emoji: '🍎', inBox: false },
    { id: 4, emoji: '🍎', inBox: false },
    { id: 5, emoji: '🍎', inBox: false }
  ])
  const [draggedId, setDraggedId] = useState<number | null>(null)
  const targetCount = 5
  const currentCount = items.filter(i => i.inBox).length

  const handleDragStart = (id: number) => {
    setDraggedId(id)
  }

  const handleDrop = (toBox: boolean) => {
    if (draggedId === null) return
    
    setItems(items.map(item => 
      item.id === draggedId ? { ...item, inBox: toBox } : item
    ))
    setDraggedId(null)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Drag items into the box</h2>
        <p className="text-lg text-gray-600">Put {targetCount} apples in the box</p>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => handleDrop(true)}
        className="border-4 border-dashed border-blue-400 rounded-2xl p-8 min-h-[200px] bg-blue-50 flex flex-wrap gap-4 items-center justify-center"
      >
        <div className="text-6xl font-bold text-blue-600">{currentCount}</div>
        {items.filter(i => i.inBox).map(item => (
          <motion.div
            key={item.id}
            draggable
            onDragStart={() => handleDragStart(item.id)}
            className="text-6xl cursor-move"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
          >
            {item.emoji}
          </motion.div>
        ))}
      </div>

      {/* Source Area */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => handleDrop(false)}
        className="flex gap-4 flex-wrap justify-center p-8 bg-gray-50 rounded-2xl"
      >
        {items.filter(i => !i.inBox).map(item => (
          <motion.div
            key={item.id}
            draggable
            onDragStart={() => handleDragStart(item.id)}
            className="text-6xl cursor-move"
            whileHover={{ scale: 1.1 }}
          >
            {item.emoji}
          </motion.div>
        ))}
      </div>

      {currentCount === targetCount && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center text-2xl font-bold text-green-600"
        >
          🎉 Perfect! You counted {targetCount} apples!
        </motion.div>
      )}
    </div>
  )
}

// Activity 2: Tap to Count
function TapToCount() {
  const [stars, setStars] = useState<Array<{ id: number; counted: boolean }>>([
    { id: 1, counted: false },
    { id: 2, counted: false },
    { id: 3, counted: false },
    { id: 4, counted: false },
    { id: 5, counted: false },
    { id: 6, counted: false },
    { id: 7, counted: false }
  ])

  const toggleStar = (id: number) => {
    setStars(stars.map(s => s.id === id ? { ...s, counted: !s.counted } : s))
  }

  const countedTotal = stars.filter(s => s.counted).length
  const allCounted = stars.every(s => s.counted)

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Tap each star to count it</h2>
        <p className="text-lg text-gray-600">Count: {countedTotal}</p>
      </div>

      <div className="grid grid-cols-4 gap-6 p-8">
        {stars.map((star) => (
          <motion.button
            key={star.id}
            onClick={() => toggleStar(star.id)}
            className={`text-8xl transition-all ${
              star.counted ? 'opacity-100' : 'opacity-30'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            {star.counted ? '⭐' : '✨'}
          </motion.button>
        ))}
      </div>

      {allCounted && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center text-2xl font-bold text-green-600"
        >
          🎉 Amazing! You counted all {stars.length} stars!
        </motion.div>
      )}
    </div>
  )
}

// Activity 3: Bubble Pop Counter (Using existing BubblePopMath component)
function BubblePopCounter() {
  const [answered, setAnswered] = useState(false)
  
  // For counting: show bubbles 1-7, and ask to pop numbers 1-5
  const allNumbers = [1, 2, 3, 4, 5, 6, 7]
  const correctNumbers = [1, 2, 3, 4, 5]
  
  const handleAnswer = (isCorrect: boolean) => {
    setAnswered(true)
  }

  if (answered) {
    return (
      <div className="text-center space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-9xl"
        >
          🎉
        </motion.div>
        <h2 className="text-3xl font-bold text-green-600">
          Great job! You counted 1-5!
        </h2>
        <button
          onClick={() => setAnswered(false)}
          className="px-8 py-4 bg-blue-500 text-white rounded-xl font-bold text-xl hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div>
      <BubblePopMath
        question="Pop the bubbles from 1 to 5"
        numbers={allNumbers}
        correctAnswers={correctNumbers}
        onAnswer={handleAnswer}
      />
    </div>
  )
}

// Activity 4: Fill the Basket
function FillTheBasket() {
  const [basketCount, setBasketCount] = useState(0)
  const targetCount = 8
  const maxCount = 10

  const addFruit = () => {
    if (basketCount < maxCount) {
      setBasketCount(basketCount + 1)
    }
  }

  const removeFruit = () => {
    if (basketCount > 0) {
      setBasketCount(basketCount - 1)
    }
  }

  const fruits = Array.from({ length: basketCount }, (_, i) => i)

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Put {targetCount} fruits in the basket</h2>
        <p className="text-lg text-gray-600">Current count: {basketCount}</p>
      </div>

      {/* Basket */}
      <div className="relative">
        <div className="text-9xl text-center mb-4">🧺</div>
        <div className="flex flex-wrap gap-3 justify-center min-h-[150px] bg-amber-50 rounded-2xl p-6 border-4 border-amber-300">
          {fruits.map((_, index) => (
            <motion.div
              key={index}
              className="text-5xl"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              🍎
            </motion.div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 justify-center">
        <motion.button
          onClick={removeFruit}
          disabled={basketCount === 0}
          className="px-8 py-4 bg-red-500 text-white rounded-xl font-bold text-xl disabled:opacity-30 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ➖ Remove
        </motion.button>
        <motion.button
          onClick={addFruit}
          disabled={basketCount >= maxCount}
          className="px-8 py-4 bg-green-500 text-white rounded-xl font-bold text-xl disabled:opacity-30 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ➕ Add
        </motion.button>
      </div>

      {basketCount === targetCount && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center text-2xl font-bold text-green-600"
        >
          🎉 Perfect! You have exactly {targetCount} fruits!
        </motion.div>
      )}
    </div>
  )
}
