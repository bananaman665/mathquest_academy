'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PartyPopper, HelpCircle, Cog } from 'lucide-react';

interface DivisionMachineProps {
  dividend: number;
  divisor: number;
  emoji?: string;
  onAnswer: (correct: boolean) => void;
}

export default function DivisionMachine({
  dividend,
  divisor,
  emoji = '⭐',
  onAnswer
}: DivisionMachineProps) {
  const [inputItems, setInputItems] = useState<number[]>([]);
  const [outputGroups, setOutputGroups] = useState<number[][]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const quotient = Math.floor(dividend / divisor);
  const remainder = dividend % divisor;

  const handleAddItem = () => {
    if (inputItems.length < dividend) {
      setInputItems([...inputItems, inputItems.length]);
    }
  };

  const handleProcess = async () => {
    if (inputItems.length !== dividend) return;
    
    setIsProcessing(true);
    setOutputGroups([]);
    
    // Animate items going through machine
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Create groups
    const groups: number[][] = [];
    for (let i = 0; i < quotient; i++) {
      const group: number[] = [];
      for (let j = 0; j < divisor; j++) {
        group.push(i * divisor + j);
      }
      groups.push(group);
      setOutputGroups([...groups]);
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    setIsProcessing(false);
  };

  const handleReset = () => {
    setInputItems([]);
    setOutputGroups([]);
    setUserAnswer('');
    setSubmitted(false);
  };

  const handleSubmit = () => {
    const correct = parseInt(userAnswer) === quotient;
    setSubmitted(true);
    setIsCorrect(correct);
    onAnswer(correct);
  };

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
      {/* Title */}
      <div className="text-center">
        <div className="text-3xl font-bold text-gray-800 mb-2">
          Division Machine ⚙️
        </div>
        <div className="text-lg text-gray-600">
          {dividend} items ÷ groups of {divisor}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl p-6 border-4 border-blue-400 shadow-lg min-w-[300px]">
        <div className="text-sm font-bold text-gray-700 mb-3 text-center">
          Input ({inputItems.length}/{dividend})
        </div>
        <div className="flex flex-wrap gap-2 justify-center min-h-[80px]">
          {inputItems.map((item, i) => (
            <div
              key={item}
              className="text-3xl"
            >
              {emoji}
            </div>
          ))}
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddItem}
          disabled={inputItems.length >= dividend}
          className="w-full mt-4 px-6 py-2 bg-blue-500 text-white font-bold rounded-lg disabled:bg-gray-300"
        >
          Add Item
        </motion.button>
      </div>

      {/* Machine */}
      <motion.div
        className="relative bg-gradient-to-br from-gray-700 to-gray-900 rounded-3xl p-8 border-8 border-gray-800 shadow-2xl"
        animate={{
          scale: isProcessing ? [1, 1.05, 1] : 1,
        }}
        transition={{
          repeat: isProcessing ? Infinity : 0,
          duration: 0.5
        }}
      >
        <div className="flex justify-center mb-4">
          <Cog className="w-16 h-16 text-gray-300" />
        </div>
        <div className="text-white text-center font-bold text-lg">
          Division Machine
        </div>
        <div className="text-yellow-400 text-center text-sm mt-2">
          Groups of {divisor}
        </div>
        
        {/* Processing indicator */}
        <AnimatePresence>
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="text-6xl"
              >
                ⚙️
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Process Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleProcess}
          disabled={inputItems.length !== dividend || isProcessing}
          className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg disabled:from-gray-500 disabled:to-gray-600"
        >
          {isProcessing ? 'Processing...' : 'Process!'}
        </motion.button>
      </motion.div>

      {/* Output Area */}
      <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-6 border-4 border-green-400 shadow-lg min-w-[300px]">
        <div className="text-sm font-bold text-gray-700 mb-3 text-center">
          Output ({outputGroups.length} groups)
        </div>
        <div className="flex flex-wrap gap-4 justify-center min-h-[100px]">
          {outputGroups.map((group, groupIdx) => (
            <div
              key={groupIdx}
              className={`bg-gradient-to-br ${colors[groupIdx % colors.length]} rounded-xl p-3 border-3 shadow-md`}
            >
              <div className="text-xs font-bold text-gray-700 mb-1 text-center">
                Group {groupIdx + 1}
              </div>
              <div className="flex flex-wrap gap-1">
                {group.map((item, itemIdx) => (
                  <div
                    key={item}
                    className="text-2xl"
                  >
                    {emoji}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Answer Input */}
      {outputGroups.length > 0 && !submitted && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="text-lg font-bold text-gray-700">
            How many groups of {divisor}?
          </div>
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="w-32 px-6 py-3 text-center text-2xl font-bold border-4 border-purple-400 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-300"
            placeholder="?"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={!userAnswer}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold rounded-full shadow-lg disabled:from-gray-300 disabled:to-gray-400"
          >
            Submit Answer
          </motion.button>
        </motion.div>
      )}

      {/* Reset Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleReset}
        className="px-6 py-2 bg-gray-200 text-gray-700 font-bold rounded-full shadow"
      >
        Reset Machine
      </motion.button>

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
                Perfect! {dividend} ÷ {divisor} = {quotient}
                {remainder > 0 && ` with ${remainder} left over`}!
              </>
            ) : (
              <>
                Not quite! Count the groups of {divisor}. The answer is {quotient}!
              </>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
