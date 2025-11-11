'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SkipCounterProps {
  skipBy: number;
  numJumps: number;
  onAnswer: (correct: boolean) => void;
}

export default function SkipCounter({
  skipBy,
  numJumps,
  onAnswer
}: SkipCounterProps) {
  const [currentJumps, setCurrentJumps] = useState(0);
  const [jumpHistory, setJumpHistory] = useState<number[]>([0]);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const maxValue = skipBy * numJumps + 10;
  const currentValue = currentJumps * skipBy;
  const targetValue = numJumps * skipBy;
  const correct = currentJumps === numJumps;

  const handleJump = () => {
    if (currentJumps < numJumps + 2) {
      const nextValue = (currentJumps + 1) * skipBy;
      const newJumpCount = currentJumps + 1;
      setCurrentJumps(newJumpCount);
      setJumpHistory(prev => [...prev, nextValue]);
      setSubmitted(false);
      
      // Auto-submit when target is reached
      if (newJumpCount === numJumps) {
        setTimeout(() => {
          setSubmitted(true);
          setIsCorrect(true);
          onAnswer(true);
        }, 500); // Small delay to show the final jump
      }
    }
  };

  const handleReset = () => {
    setCurrentJumps(0);
    setJumpHistory([0]);
    setSubmitted(false);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setIsCorrect(correct);
    onAnswer(correct);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      {/* Info Display */}
      <div className="text-center">
        <div className="text-lg font-medium text-gray-600 mb-2">
          Skip count by {skipBy}s
        </div>
        <div className="text-3xl font-bold text-purple-600">
          {skipBy} × {currentJumps} = {currentValue}
        </div>
      </div>

      {/* Number Line */}
      <div className="relative w-full max-w-4xl h-32 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-4 border-blue-300 p-4 overflow-x-auto">
        <div className="relative h-full flex items-center">
          {/* Number markers */}
          {Array.from({ length: Math.floor(maxValue / skipBy) + 1 }).map((_, i) => {
            const value = i * skipBy;
            const position = (value / maxValue) * 100;
            const isVisited = jumpHistory.includes(value);
            const isCurrent = value === currentValue;

            return (
              <div
                key={i}
                className="absolute"
                style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
              >
                {/* Tick mark */}
                <div className={`w-1 h-8 mx-auto ${isVisited ? 'bg-green-500' : 'bg-gray-300'}`} />
                {/* Number label */}
                <div className={`text-center mt-1 text-sm font-bold ${
                  isVisited ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {value}
                </div>
                {/* Current position marker */}
                {isCurrent && (
                  <motion.div
                    initial={{ scale: 0, y: -20 }}
                    animate={{ scale: 1, y: -50 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="absolute -top-12 left-1/2 -translate-x-1/2"
                  >
                    <div className="text-4xl">🦘</div>
                  </motion.div>
                )}
              </div>
            );
          })}

          {/* Jump arcs */}
          <AnimatePresence>
            {jumpHistory.slice(0, -1).map((startVal, i) => {
              const endVal = jumpHistory[i + 1];
              const startPos = (startVal / maxValue) * 100;
              const endPos = (endVal / maxValue) * 100;
              const midPos = (startPos + endPos) / 2;
              const width = endPos - startPos;

              return (
                <motion.div
                  key={`arc-${i}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute"
                  style={{
                    left: `${startPos}%`,
                    width: `${width}%`,
                    top: '-30px'
                  }}
                >
                  <svg
                    width="100%"
                    height="40"
                    viewBox="0 0 100 40"
                    preserveAspectRatio="none"
                  >
                    <motion.path
                      d="M 0 40 Q 50 0 100 40"
                      stroke="#10b981"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: i * 0.3 }}
                    />
                    <motion.text
                      x="50"
                      y="15"
                      textAnchor="middle"
                      fill="#059669"
                      fontSize="12"
                      fontWeight="bold"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.3 + 0.3 }}
                    >
                      +{skipBy}
                    </motion.text>
                  </svg>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Jump History */}
      <div className="flex flex-wrap gap-2 justify-center max-w-2xl">
        {jumpHistory.map((value, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', delay: i * 0.1 }}
            className={`px-4 py-2 rounded-lg font-bold text-lg ${
              i === jumpHistory.length - 1
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-green-100 text-green-700'
            }`}
          >
            {value}
          </motion.div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleJump}
          disabled={currentJumps >= numJumps + 2}
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xl font-bold rounded-full shadow-lg disabled:from-gray-300 disabled:to-gray-400"
        >
          Jump! (+{skipBy})
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
                Perfect! {numJumps} jumps of {skipBy} = {targetValue}!
              </>
            ) : (
              <>
                Try again! Make exactly {numJumps} jumps of {skipBy}
              </>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
