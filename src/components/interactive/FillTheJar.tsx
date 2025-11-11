'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface Item {
  id: number;
  emoji: string;
  x: number;
  y: number;
  rotation: number;
}

interface FillTheJarProps {
  question: string;
  targetNumber: number;
  startingNumber?: number;
  itemEmoji?: string;
  mode: 'add' | 'remove' | 'count';
  onAnswer: (isCorrect: boolean) => void;
}

export default function FillTheJar({
  question,
  targetNumber,
  startingNumber = 0,
  itemEmoji = '🍎',
  mode,
  onAnswer,
}: FillTheJarProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Initialize with starting items
  useEffect(() => {
    if (startingNumber > 0) {
      const initialItems: Item[] = [];
      for (let i = 0; i < startingNumber; i++) {
        initialItems.push({
          id: i,
          emoji: itemEmoji,
          x: Math.random() * 60 + 20, // 20-80% of jar width
          y: 85 - (i * 8), // Stack from bottom
          rotation: Math.random() * 40 - 20,
        });
      }
      setItems(initialItems);
    }
  }, [startingNumber, itemEmoji]);

  const addItem = () => {
    if (hasSubmitted) return;
    
    const newItem: Item = {
      id: Date.now(),
      emoji: itemEmoji,
      x: Math.random() * 60 + 20,
      y: -10, // Start above jar
      rotation: Math.random() * 40 - 20,
    };
    
    const newItems = [...items, newItem];
    setItems(newItems);
    
    // Auto-submit when target is reached
    if (newItems.length === targetNumber) {
      setTimeout(() => {
        handleSubmit();
      }, 500);
    }
    
    // Play sound effect (if available)
    if (typeof window !== 'undefined') {
      const audio = new Audio('/sounds/pop.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    }
  };

  const removeItem = (id: number) => {
    if (hasSubmitted) return;
    
    setItems(prev => prev.filter(item => item.id !== id));
    
    // Play sound effect
    if (typeof window !== 'undefined') {
      const audio = new Audio('/sounds/whoosh.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    }
  };

  const handleSubmit = () => {
    if (hasSubmitted) return;
    
    setHasSubmitted(true);
    const isCorrect = items.length === targetNumber;
    
    if (isCorrect) {
      setShowCelebration(true);
      setTimeout(() => {
        onAnswer(true);
      }, 1500);
    } else {
      onAnswer(false);
    }
  };

  const canSubmit = mode === 'count' 
    ? items.length > 0 
    : mode === 'add' 
      ? items.length > startingNumber 
      : items.length < startingNumber;

  const fillPercentage = Math.min((items.length / 10) * 100, 100);

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      {/* Question */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{question}</h3>
        <p className="text-lg text-gray-600">
          {mode === 'count' && `Tap to add items!`}
          {mode === 'add' && `Tap below to add more!`}
          {mode === 'remove' && `Tap items to remove them!`}
        </p>
      </div>

      {/* The Jar */}
      <div className="relative">
        {/* Celebration Effect */}
        <AnimatePresence>
          {showCelebration && (
            <>
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 text-3xl"
                  initial={{ 
                    scale: 0, 
                    x: 0, 
                    y: 0,
                    opacity: 1 
                  }}
                  animate={{
                    scale: [0, 1.5, 1],
                    x: Math.cos((i / 12) * Math.PI * 2) * 150,
                    y: Math.sin((i / 12) * Math.PI * 2) * 150,
                    opacity: 0,
                  }}
                  transition={{ 
                    duration: 1.5,
                    ease: "easeOut"
                  }}
                >
                  {['⭐', '✨', '🎉', '🎊'][i % 4]}
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Jar Container */}
        <div className="relative w-64 h-80">
          {/* Jar Lid */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-48 h-8 bg-gradient-to-b from-amber-700 to-amber-800 rounded-t-lg border-4 border-amber-900 shadow-lg z-20" />
          
          {/* Jar Body */}
          <div className="relative w-full h-full bg-gradient-to-b from-blue-100/50 to-blue-50/30 rounded-3xl border-8 border-blue-300/60 shadow-2xl overflow-hidden backdrop-blur-sm">
            {/* Fill Level Indicator */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-200/40 to-transparent pointer-events-none"
              initial={{ height: 0 }}
              animate={{ height: `${fillPercentage}%` }}
              transition={{ duration: 0.5 }}
            />

            {/* Items inside jar */}
            <div className="relative w-full h-full">
              <AnimatePresence>
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className={`absolute text-5xl ${mode === 'remove' ? 'cursor-pointer hover:scale-110' : ''}`}
                    style={{
                      left: `${item.x}%`,
                    }}
                    initial={{ 
                      y: item.y,
                      scale: 0,
                      rotate: 0,
                    }}
                    animate={{
                      y: 85 - (index * 8), // Stack items
                      scale: 1,
                      rotate: item.rotation,
                    }}
                    exit={{
                      scale: 0,
                      x: Math.random() * 200 - 100,
                      y: -100,
                      rotate: 360,
                      transition: { duration: 0.6 }
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                      delay: 0,
                    }}
                    onClick={() => mode === 'remove' && removeItem(item.id)}
                    whileHover={mode === 'remove' ? { scale: 1.2 } : {}}
                  >
                    {item.emoji}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Glass shine effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none rounded-3xl" />
          </div>

          {/* Counter Badge */}
          <motion.div
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-2xl rounded-full shadow-lg border-4 border-white"
            animate={{ 
              scale: items.length === targetNumber && !hasSubmitted ? [1, 1.2, 1] : 1,
            }}
            transition={{ repeat: items.length === targetNumber ? Infinity : 0, duration: 1 }}
          >
            {items.length}
          </motion.div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 items-center justify-center">
        {(mode === 'count' || mode === 'add') && (
          <motion.button
            onClick={addItem}
            disabled={hasSubmitted}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-xl rounded-2xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl"
            whileHover={{ scale: hasSubmitted ? 1 : 1.05 }}
            whileTap={{ scale: hasSubmitted ? 1 : 0.95 }}
          >
            Add {itemEmoji}
          </motion.button>
        )}
      </div>

      {/* Hint */}
      {!hasSubmitted && (
        <motion.div
          className="text-center text-gray-600"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          Target: {targetNumber} {itemEmoji}
        </motion.div>
      )}
    </div>
  );
}
