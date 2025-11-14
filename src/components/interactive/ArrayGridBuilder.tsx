'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PartyPopper, HelpCircle } from 'lucide-react';

interface ArrayGridBuilderProps {
  targetRows: number;
  targetCols: number;
  emoji?: string;
  onAnswer: (correct: boolean) => void;
  onSubmitReady?: (submitFn: () => void) => void;
}

export default function ArrayGridBuilder({
  targetRows,
  targetCols,
  emoji = '⭐',
  onAnswer,
  onSubmitReady
}: ArrayGridBuilderProps) {
  const [rows, setRows] = useState(1);
  const [cols, setCols] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentTotal = rows * cols;
  const targetTotal = targetRows * targetCols;
  const correct = rows === targetRows && cols === targetCols;

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
  }, [onSubmitReady, submitted, rows, cols]);

  const handleRowChange = (delta: number) => {
    const newRows = Math.max(1, Math.min(10, rows + delta));
    setRows(newRows);
    setSubmitted(false);
  };

  const handleColChange = (delta: number) => {
    const newCols = Math.max(1, Math.min(10, cols + delta));
    setCols(newCols);
    setSubmitted(false);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      {/* Controls */}
      <div className="flex gap-8 items-center">
        {/* Rows Control */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-sm font-medium text-gray-600">Rows</div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleRowChange(-1)}
              disabled={rows <= 1}
              className="w-10 h-10 rounded-full bg-blue-500 text-white font-bold text-xl disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              -
            </motion.button>
            <div className="w-12 text-center text-2xl font-bold text-gray-800">
              {rows}
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleRowChange(1)}
              disabled={rows >= 10}
              className="w-10 h-10 rounded-full bg-blue-500 text-white font-bold text-xl disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              +
            </motion.button>
          </div>
        </div>

        {/* Multiplication Symbol */}
        <div className="text-4xl font-bold text-purple-600">×</div>

        {/* Columns Control */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-sm font-medium text-gray-600">Columns</div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleColChange(-1)}
              disabled={cols <= 1}
              className="w-10 h-10 rounded-full bg-green-500 text-white font-bold text-xl disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              -
            </motion.button>
            <div className="w-12 text-center text-2xl font-bold text-gray-800">
              {cols}
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleColChange(1)}
              disabled={cols >= 10}
              className="w-10 h-10 rounded-full bg-green-500 text-white font-bold text-xl disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              +
            </motion.button>
          </div>
        </div>
      </div>

      {/* Array Grid */}
      <motion.div
        className="relative bg-white rounded-2xl shadow-lg p-8 border-4 border-purple-200"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="flex flex-col gap-2">
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <div key={rowIdx} className="flex gap-2">
              {Array.from({ length: cols }).map((_, colIdx) => (
                <motion.div
                  key={`${rowIdx}-${colIdx}`}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 20,
                    delay: (rowIdx * cols + colIdx) * 0.02
                  }}
                  className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg border-2 border-purple-300"
                >
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Total Display */}
      <motion.div
        className="flex items-center gap-3 text-2xl font-bold"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 0.3 }}
        key={currentTotal}
      >
        <span className="text-blue-600">{rows}</span>
        <span className="text-purple-600">×</span>
        <span className="text-green-600">{cols}</span>
        <span className="text-gray-600">=</span>
        <span className="text-orange-600">{currentTotal}</span>
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
          <div className="flex items-center justify-center mb-2">
            {isCorrect ? <PartyPopper className="w-10 h-10 text-green-600" /> : <HelpCircle className="w-10 h-10 text-orange-600" />}
          </div>
          <div className="text-xl font-bold">
            {isCorrect ? (
              <>
                Perfect! {targetRows} × {targetCols} = {targetTotal}!
              </>
            ) : (
              <>
                Try again! Make {targetRows} rows and {targetCols} columns
              </>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

