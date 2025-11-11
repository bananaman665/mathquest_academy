'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface FairShareProps {
  totalItems: number;
  numGroups: number;
  emoji?: string;
  onAnswer: (correct: boolean) => void;
}

export default function FairShare({
  totalItems,
  numGroups,
  emoji = '🍪',
  onAnswer
}: FairShareProps) {
  const [groupCounts, setGroupCounts] = useState<number[]>(Array(numGroups).fill(0));
  const [remainingItems, setRemainingItems] = useState(totalItems);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const itemsPerGroup = Math.floor(totalItems / numGroups);
  const remainder = totalItems % numGroups;
  const distributedCount = groupCounts.reduce((a, b) => a + b, 0);

  const handleDistribute = (groupIndex: number) => {
    if (remainingItems > 0) {
      const newCounts = [...groupCounts];
      newCounts[groupIndex]++;
      setGroupCounts(newCounts);
      setRemainingItems(remainingItems - 1);
      setSubmitted(false);
    }
  };

  const handleAutoDistribute = () => {
    const perGroup = itemsPerGroup;
    const newCounts = Array(numGroups).fill(perGroup);
    setGroupCounts(newCounts);
    setRemainingItems(remainder);
    setSubmitted(false);
  };

  const handleReset = () => {
    setGroupCounts(Array(numGroups).fill(0));
    setRemainingItems(totalItems);
    setSubmitted(false);
  };

  const handleSubmit = () => {
    const allEqual = groupCounts.every(count => count === itemsPerGroup);
    const correct = allEqual && remainingItems === remainder;
    setSubmitted(true);
    setIsCorrect(correct);
    onAnswer(correct);
  };

  // Auto-submit when correct distribution is achieved
  useEffect(() => {
    if (!submitted) {
      const allEqual = groupCounts.every(count => count === itemsPerGroup);
      if (allEqual && remainingItems === remainder && groupCounts.some(c => c > 0)) {
        setTimeout(() => {
          handleSubmit();
        }, 500);
      }
    }
  }, [groupCounts, remainingItems, submitted, itemsPerGroup, remainder]);

  const colors = [
    'from-red-200 to-red-300 border-red-400',
    'from-blue-200 to-blue-300 border-blue-400',
    'from-green-200 to-green-300 border-green-400',
    'from-yellow-200 to-yellow-300 border-yellow-400',
    'from-purple-200 to-purple-300 border-purple-400',
    'from-pink-200 to-pink-300 border-pink-400',
  ];

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      {/* Instructions */}
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-800 mb-2">
          Share {totalItems} {emoji} equally among {numGroups} groups
        </div>
        <div className="text-lg text-gray-600">
          Tap groups to distribute items one by one, or use Auto Share
        </div>
      </div>

      {/* Remaining Items */}
      <motion.div
        className="bg-gradient-to-r from-orange-200 to-yellow-200 rounded-2xl p-6 border-4 border-orange-400 shadow-lg"
        animate={{ scale: remainingItems > 0 ? [1, 1.05, 1] : 1 }}
        transition={{ repeat: remainingItems > 0 ? Infinity : 0, duration: 1 }}
      >
        <div className="text-sm font-bold text-gray-700 mb-2 text-center">
          Items to Share
        </div>
        <div className="flex flex-wrap gap-2 justify-center max-w-md">
          {Array.from({ length: remainingItems }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', delay: i * 0.02 }}
              className="text-3xl"
            >
              {emoji}
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-2 text-2xl font-bold text-orange-700">
          {remainingItems} left
        </div>
      </motion.div>

      {/* Groups */}
      <div className="flex flex-wrap gap-4 justify-center max-w-4xl">
        {groupCounts.map((count, groupIdx) => (
          <motion.button
            key={groupIdx}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleDistribute(groupIdx)}
            disabled={remainingItems === 0}
            className={`bg-gradient-to-br ${colors[groupIdx % colors.length]} rounded-2xl p-6 border-4 shadow-lg min-w-[140px] min-h-[160px] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`}
          >
            <div className="text-sm font-bold text-gray-700 mb-3 text-center">
              Group {groupIdx + 1}
            </div>
            <div className="flex flex-wrap gap-1 justify-center mb-3">
              {Array.from({ length: count }).map((_, itemIdx) => (
                <motion.div
                  key={itemIdx}
                  initial={{ scale: 0, y: -50 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    delay: itemIdx * 0.05
                  }}
                  className="text-2xl"
                >
                  {emoji}
                </motion.div>
              ))}
            </div>
            <div className="text-center text-xl font-bold text-gray-800">
              {count} items
            </div>
          </motion.button>
        ))}
      </div>

      {/* Division Display */}
      <motion.div
        className="flex items-center gap-3 text-2xl font-bold"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 0.3 }}
        key={distributedCount}
      >
        <span className="text-orange-600">{distributedCount}</span>
        <span className="text-gray-600">÷</span>
        <span className="text-purple-600">{numGroups}</span>
        <span className="text-gray-600">=</span>
        <span className="text-green-600">
          {Math.floor(distributedCount / numGroups)}
          {distributedCount % numGroups > 0 && ` R${distributedCount % numGroups}`}
        </span>
      </motion.div>

      {/* Controls */}
      <div className="flex gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAutoDistribute}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-lg font-bold rounded-full shadow-lg"
        >
          Auto Share
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="px-6 py-3 bg-gray-200 text-gray-700 text-lg font-bold rounded-full shadow"
        >
          Reset
        </motion.button>
      </div>

      {/* Feedback */}
      {submitted && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`text-center p-6 rounded-2xl ${
            isCorrect
              ? 'bg-green-100 border-4 border-green-500'
              : 'bg-red-100 border-4 border-red-500'
          }`}
        >
          <div className="text-4xl mb-2">{isCorrect ? '🎉' : '🤔'}</div>
          <div className="text-xl font-bold">
            {isCorrect ? (
              <>
                Perfect! {totalItems} ÷ {numGroups} = {itemsPerGroup}
                {remainder > 0 && ` with ${remainder} left over`}!
              </>
            ) : (
              <>
                Try again! Each group should have {itemsPerGroup} items
                {remainder > 0 && ` (${remainder} will be left over)`}
              </>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
