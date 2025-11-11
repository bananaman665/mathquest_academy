'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface GroupMakerProps {
  targetGroups: number;
  itemsPerGroup: number;
  emoji?: string;
  onAnswer: (correct: boolean) => void;
  onSubmitReady?: (submitFn: () => void) => void;
}

export default function GroupMaker({
  targetGroups,
  itemsPerGroup,
  emoji = '⭐',
  onAnswer,
  onSubmitReady
}: GroupMakerProps) {
  const [groups, setGroups] = useState(1);
  const [perGroup, setPerGroup] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentTotal = groups * perGroup;
  const targetTotal = targetGroups * itemsPerGroup;
  const correct = groups === targetGroups && perGroup === itemsPerGroup;

  const handleSubmit = () => {
    setSubmitted(true);
    setIsCorrect(correct);
    onAnswer(correct);
  };

  // Expose submit function to parent
  useEffect(() => {
    if (onSubmitReady && !submitted) {
      onSubmitReady(handleSubmit);
    }
    return () => {
      if (onSubmitReady) {
        onSubmitReady(() => {});
      }
    };
  }, [onSubmitReady, submitted, groups, perGroup]);

  const colors = [
    'from-red-200 to-red-300 border-red-400',
    'from-blue-200 to-blue-300 border-blue-400',
    'from-green-200 to-green-300 border-green-400',
    'from-yellow-200 to-yellow-300 border-yellow-400',
    'from-purple-200 to-purple-300 border-purple-400',
    'from-pink-200 to-pink-300 border-pink-400',
    'from-indigo-200 to-indigo-300 border-indigo-400',
    'from-orange-200 to-orange-300 border-orange-400',
  ];

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      {/* Controls */}
      <div className="flex gap-8 items-center">
        {/* Number of Groups */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-sm font-medium text-gray-600">Number of Groups</div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setGroups(Math.max(1, groups - 1));
                setSubmitted(false);
              }}
              disabled={groups <= 1}
              className="w-10 h-10 rounded-full bg-purple-500 text-white font-bold text-xl disabled:bg-gray-300"
            >
              -
            </motion.button>
            <div className="w-12 text-center text-2xl font-bold text-gray-800">
              {groups}
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setGroups(Math.min(8, groups + 1));
                setSubmitted(false);
              }}
              disabled={groups >= 8}
              className="w-10 h-10 rounded-full bg-purple-500 text-white font-bold text-xl disabled:bg-gray-300"
            >
              +
            </motion.button>
          </div>
        </div>

        {/* Items Per Group */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-sm font-medium text-gray-600">Items Per Group</div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setPerGroup(Math.max(1, perGroup - 1));
                setSubmitted(false);
              }}
              disabled={perGroup <= 1}
              className="w-10 h-10 rounded-full bg-orange-500 text-white font-bold text-xl disabled:bg-gray-300"
            >
              -
            </motion.button>
            <div className="w-12 text-center text-2xl font-bold text-gray-800">
              {perGroup}
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setPerGroup(Math.min(10, perGroup + 1));
                setSubmitted(false);
              }}
              disabled={perGroup >= 10}
              className="w-10 h-10 rounded-full bg-orange-500 text-white font-bold text-xl disabled:bg-gray-300"
            >
              +
            </motion.button>
          </div>
        </div>
      </div>

      {/* Groups Display */}
      <div className="flex flex-wrap gap-4 justify-center max-w-4xl">
        {Array.from({ length: groups }).map((_, groupIdx) => (
          <motion.div
            key={groupIdx}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 15,
              delay: groupIdx * 0.1
            }}
            className={`bg-gradient-to-br ${colors[groupIdx % colors.length]} rounded-2xl p-4 border-4 shadow-lg min-w-[120px]`}
          >
            <div className="text-xs font-bold text-gray-700 mb-2 text-center">
              Group {groupIdx + 1}
            </div>
            <div className="text-3xl font-bold text-center text-gray-800 py-4">
              {perGroup}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Total Display */}
      <motion.div
        className="flex items-center gap-3 text-2xl font-bold"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 0.3 }}
        key={currentTotal}
      >
        <span className="text-purple-600">{groups}</span>
        <span className="text-gray-600">groups of</span>
        <span className="text-orange-600">{perGroup}</span>
        <span className="text-gray-600">=</span>
        <span className="text-green-600">{currentTotal}</span>
      </motion.div>

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
                Perfect! {targetGroups} groups of {itemsPerGroup} = {targetTotal}!
              </>
            ) : (
              <>
                Try again! Make {targetGroups} groups with {itemsPerGroup} items each
              </>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
