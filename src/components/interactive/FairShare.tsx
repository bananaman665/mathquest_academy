'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Circle } from 'lucide-react';

interface FairShareProps {
  totalItems: number;
  numGroups: number;
  onAnswer: (correct: boolean) => void;
}

export default function FairShare({
  totalItems,
  numGroups,
  onAnswer
}: FairShareProps) {
  const [groupCounts, setGroupCounts] = useState<number[]>(Array(numGroups).fill(0));
  const [remainingItems, setRemainingItems] = useState(totalItems);
  const [submitted, setSubmitted] = useState(false);

  const itemsPerGroup = Math.floor(totalItems / numGroups);
  const remainder = totalItems % numGroups;

  // Reset state when question changes
  useEffect(() => {
    setGroupCounts(Array(numGroups).fill(0));
    setRemainingItems(totalItems);
    setSubmitted(false);
  }, [totalItems, numGroups]);

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

  return (
    <div className="flex flex-col items-center gap-3 p-3 pb-24">
      {/* Instructions */}
      <div className="text-center">
        <div className="text-lg font-bold text-black">
          Share {totalItems} dots equally among {numGroups} groups
        </div>
      </div>

      {/* Remaining Items */}
      <div className="bg-white rounded-xl p-3 border-2 border-black">
        <div className="flex flex-wrap gap-1 justify-center max-w-md">
          {Array.from({ length: remainingItems }).map((_, i) => (
            <Circle key={i} className="w-6 h-6 fill-blue-500 text-blue-500" />
          ))}
        </div>
        <div className="text-center mt-1 text-lg font-bold text-black">
          {remainingItems} left
        </div>
      </div>

      {/* Groups */}
      <div className="flex flex-wrap gap-2 justify-center max-w-4xl">
        {groupCounts.map((count, groupIdx) => (
          <button
            key={groupIdx}
            onClick={() => handleDistribute(groupIdx)}
            disabled={remainingItems === 0}
            className="bg-green-500 text-white rounded-xl p-3 border-2 border-green-500 min-w-[100px] cursor-pointer disabled:cursor-not-allowed"
          >
            <div className="text-xs font-bold text-white mb-1 text-center">
              Group {groupIdx + 1}
            </div>
            <div className="flex flex-wrap gap-0.5 justify-center mb-1 min-h-[40px]">
              {Array.from({ length: count }).map((_, itemIdx) => (
                <Circle key={itemIdx} className="w-5 h-5 fill-white text-white" />
              ))}
            </div>
            <div className="text-center text-sm font-bold text-white">
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
