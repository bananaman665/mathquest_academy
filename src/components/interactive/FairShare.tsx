'use client';

import { useState, useEffect } from 'react';

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
    <div className="flex flex-col items-center w-full max-w-lg mx-auto px-4 pb-24">
      {/* Available Items Section */}
      <div className="w-full mb-6">
        <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 text-center">
          Available
        </div>
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
          <div className="flex flex-wrap gap-2 justify-center min-h-[48px]">
            {remainingItems > 0 ? (
              Array.from({ length: remainingItems }).map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 bg-blue-500 rounded-full shadow-sm"
                />
              ))
            ) : (
              <div className="text-gray-400 text-sm py-2">All distributed</div>
            )}
          </div>
          <div className="text-center mt-3 text-2xl font-bold text-gray-900">
            {remainingItems}
          </div>
        </div>
      </div>

      {/* Groups Section */}
      <div className="w-full mb-6">
        <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 text-center">
          Tap a group to add
        </div>
        <div className={`grid gap-3 ${numGroups <= 2 ? 'grid-cols-2' : numGroups <= 4 ? 'grid-cols-2' : 'grid-cols-3'}`}>
          {groupCounts.map((count, groupIdx) => (
            <button
              key={groupIdx}
              onClick={() => handleDistribute(groupIdx)}
              disabled={remainingItems === 0}
              className={`
                rounded-2xl p-4 transition-all
                ${remainingItems === 0
                  ? 'bg-gray-100 border-2 border-gray-200 cursor-not-allowed'
                  : 'bg-white border-2 border-gray-200 hover:border-blue-400 hover:shadow-md active:scale-[0.98]'
                }
              `}
            >
              <div className="text-xs font-medium text-gray-400 mb-2">
                Group {groupIdx + 1}
              </div>
              <div className="flex flex-wrap gap-1.5 justify-center min-h-[40px] mb-2">
                {Array.from({ length: count }).map((_, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="w-6 h-6 bg-emerald-500 rounded-full"
                  />
                ))}
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {count}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Auto Share Button */}
      <button
        onClick={handleAutoDistribute}
        className="px-6 py-3 bg-gray-900 text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition-colors"
      >
        Auto Distribute
      </button>
    </div>
  );
}
