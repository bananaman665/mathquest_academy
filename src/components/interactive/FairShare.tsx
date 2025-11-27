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
    <div className="flex flex-col items-center gap-3 p-3 pb-24">
      {/* Instructions */}
      <div className="text-center">
        <div className="text-lg font-bold text-gray-800">
          Share {totalItems} {emoji} equally among {numGroups} groups
        </div>
      </div>

      {/* Remaining Items */}
      <motion.div
        className="bg-gradient-to-r from-orange-200 to-yellow-200 rounded-xl p-3 border-2 border-orange-400"
        animate={{ scale: remainingItems > 0 ? [1, 1.05, 1] : 1 }}
        transition={{ repeat: remainingItems > 0 ? Infinity : 0, duration: 1 }}
      >
        <div className="flex flex-wrap gap-1 justify-center max-w-md">
          {Array.from({ length: remainingItems }).map((_, i) => (
            <div key={i} className="text-2xl">
              {emoji}
            </div>
          ))}
        </div>
        <div className="text-center mt-1 text-lg font-bold text-orange-700">
          {remainingItems} left
        </div>
      </motion.div>

      {/* Groups */}
      <div className="flex flex-wrap gap-2 justify-center max-w-4xl">
        {groupCounts.map((count, groupIdx) => (
          <button
            key={groupIdx}
            onClick={() => handleDistribute(groupIdx)}
            disabled={remainingItems === 0}
            className={`bg-gradient-to-br ${colors[groupIdx % colors.length]} rounded-xl p-3 border-2 min-w-[100px] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`}
          >
            <div className="text-xs font-bold text-gray-700 mb-1 text-center">
              Group {groupIdx + 1}
            </div>
            <div className="flex flex-wrap gap-0.5 justify-center mb-1 min-h-[40px]">
              {Array.from({ length: count }).map((_, itemIdx) => (
                <div key={itemIdx} className="text-xl">
                  {emoji}
                </div>
              ))}
            </div>
            <div className="text-center text-sm font-bold text-gray-800">
              {count}
            </div>
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <button
          onClick={handleAutoDistribute}
          className="px-4 py-2 bg-blue-500 text-white text-sm font-bold rounded-full"
        >
          Auto Share
        </button>
      </div>
    </div>
  );
}
