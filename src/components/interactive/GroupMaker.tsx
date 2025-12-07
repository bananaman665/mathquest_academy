'use client';

import { useState, useEffect } from 'react';

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
  onAnswer,
  onSubmitReady
}: GroupMakerProps) {
  const [groups, setGroups] = useState(1);
  const [perGroup, setPerGroup] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const currentTotal = groups * perGroup;
  const targetTotal = targetGroups * itemsPerGroup;
  const correct = groups === targetGroups && perGroup === itemsPerGroup;

  const handleSubmit = () => {
    setSubmitted(true);
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

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto px-4 pb-24">
      {/* Controls */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {/* Number of Groups */}
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 text-center">
            Groups
          </div>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setGroups(Math.max(1, groups - 1));
                setSubmitted(false);
              }}
              disabled={groups <= 1}
              className="w-10 h-10 rounded-full bg-gray-900 text-white font-bold text-xl disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              -
            </button>
            <div className="w-14 text-center text-3xl font-bold text-gray-900">
              {groups}
            </div>
            <button
              onClick={() => {
                setGroups(Math.min(8, groups + 1));
                setSubmitted(false);
              }}
              disabled={groups >= 8}
              className="w-10 h-10 rounded-full bg-gray-900 text-white font-bold text-xl disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* Items Per Group */}
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 text-center">
            Per Group
          </div>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setPerGroup(Math.max(1, perGroup - 1));
                setSubmitted(false);
              }}
              disabled={perGroup <= 1}
              className="w-10 h-10 rounded-full bg-gray-900 text-white font-bold text-xl disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              -
            </button>
            <div className="w-14 text-center text-3xl font-bold text-gray-900">
              {perGroup}
            </div>
            <button
              onClick={() => {
                setPerGroup(Math.min(10, perGroup + 1));
                setSubmitted(false);
              }}
              disabled={perGroup >= 10}
              className="w-10 h-10 rounded-full bg-gray-900 text-white font-bold text-xl disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Visual Groups Display */}
      <div className="mb-6">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 text-center">
          Preview
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: groups }).map((_, groupIdx) => (
            <div
              key={groupIdx}
              className="bg-white rounded-xl p-3 border-2 border-gray-200"
            >
              <div className="text-xs font-medium text-gray-400 mb-2 text-center">
                Group {groupIdx + 1}
              </div>
              <div className="flex flex-wrap gap-1 justify-center min-h-[32px]">
                {Array.from({ length: perGroup }).map((_, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="w-5 h-5 bg-blue-500 rounded-full"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Equation Display */}
      <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 mb-6">
        <div className="flex items-center justify-center gap-3 text-2xl font-bold">
          <span className="text-gray-900">{groups}</span>
          <span className="text-gray-400">x</span>
          <span className="text-gray-900">{perGroup}</span>
          <span className="text-gray-400">=</span>
          <span className={`${currentTotal === targetTotal ? 'text-emerald-600' : 'text-gray-900'}`}>
            {currentTotal}
          </span>
        </div>
        <div className="text-center text-sm text-gray-500 mt-2">
          Target: {targetTotal}
        </div>
      </div>

      {/* Feedback */}
      {submitted && (
        <div
          className={`text-center p-4 rounded-2xl ${
            correct
              ? 'bg-emerald-50 border-2 border-emerald-200'
              : 'bg-red-50 border-2 border-red-200'
          }`}
        >
          <div className={`text-lg font-bold ${correct ? 'text-emerald-700' : 'text-red-700'}`}>
            {correct ? (
              `Correct! ${targetGroups} groups of ${itemsPerGroup} = ${targetTotal}`
            ) : (
              `Not quite. Make ${targetGroups} groups with ${itemsPerGroup} each.`
            )}
          </div>
        </div>
      )}
    </div>
  );
}
