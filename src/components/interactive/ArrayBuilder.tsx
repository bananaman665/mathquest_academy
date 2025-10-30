'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface ArrayBuilderProps {
  question: string
  rows: number
  columns: number
  correctAnswer: number
  showMultiplication?: boolean // Show "3 × 4 = ?" format
  onAnswer: (isCorrect: boolean, userAnswer: number) => void
}

export default function ArrayBuilder({
  question,
  rows,
  columns,
  correctAnswer,
  showMultiplication = true,
  onAnswer
}: ArrayBuilderProps) {
  const [filledCells, setFilledCells] = useState<boolean[][]>(
    Array(rows).fill(null).map(() => Array(columns).fill(false))
  )
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const toggleCell = (rowIdx: number, colIdx: number) => {
    if (hasSubmitted) return

    setFilledCells(prev => {
      const newCells = prev.map(row => [...row])
      newCells[rowIdx][colIdx] = !newCells[rowIdx][colIdx]
      return newCells
    })
  }

  const fillAll = () => {
    if (hasSubmitted) return
    setFilledCells(Array(rows).fill(null).map(() => Array(columns).fill(true)))
  }

  const clearAll = () => {
    if (hasSubmitted) return
    setFilledCells(Array(rows).fill(null).map(() => Array(columns).fill(false)))
  }

  const countFilled = () => {
    return filledCells.reduce((total, row) => {
      return total + row.filter(cell => cell).length
    }, 0)
  }

  const handleSubmit = () => {
    if (hasSubmitted) return
    const total = countFilled()
    const isCorrect = total === correctAnswer
    setHasSubmitted(true)
    onAnswer(isCorrect, total)
  }

  const currentCount = countFilled()
  const cellSize = Math.min(60, Math.floor(600 / Math.max(rows, columns)))

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Question */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{question}</h3>
        {showMultiplication && (
          <p className="text-3xl font-bold text-blue-600">
            {rows} × {columns} = ?
          </p>
        )}
      </div>

      {/* Array Grid */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-xl p-8 mb-6">
        <div className="flex justify-center">
          <div className="inline-block">
            <div 
              className="grid gap-2"
              style={{
                gridTemplateColumns: `repeat(${columns}, ${cellSize}px)`,
                gridTemplateRows: `repeat(${rows}, ${cellSize}px)`
              }}
            >
              {filledCells.map((row, rowIdx) =>
                row.map((isFilled, colIdx) => (
                  <motion.button
                    key={`${rowIdx}-${colIdx}`}
                    onClick={() => toggleCell(rowIdx, colIdx)}
                    disabled={hasSubmitted}
                    whileHover={!hasSubmitted ? { scale: 1.1 } : {}}
                    whileTap={!hasSubmitted ? { scale: 0.95 } : {}}
                    className={`rounded-lg border-2 transition-all duration-200 ${
                      hasSubmitted
                        ? 'cursor-not-allowed'
                        : 'cursor-pointer'
                    } ${
                      isFilled
                        ? hasSubmitted
                          ? currentCount === correctAnswer
                            ? 'bg-green-500 border-green-600'
                            : 'bg-red-500 border-red-600'
                          : 'bg-blue-500 border-blue-600 hover:bg-blue-600'
                        : 'bg-white border-gray-300 hover:border-blue-400'
                    }`}
                    style={{ width: cellSize, height: cellSize }}
                  >
                    {isFilled && (
                      <motion.div
                        initial={{ scale: 0, rotate: 0 }}
                        animate={{ scale: 1, rotate: 360 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className="w-full h-full flex items-center justify-center"
                      >
                        <div className={`w-3/4 h-3/4 rounded-full ${
                          hasSubmitted
                            ? currentCount === correctAnswer
                              ? 'bg-green-300'
                              : 'bg-red-300'
                            : 'bg-blue-300'
                        }`}></div>
                      </motion.div>
                    )}
                  </motion.button>
                ))
              )}
            </div>

            {/* Row and Column Labels */}
            <div className="mt-4 flex justify-between text-sm font-semibold text-gray-600">
              <div>{columns} columns</div>
              <div>{rows} rows</div>
            </div>
          </div>
        </div>
      </div>

      {/* Count Display */}
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-2">Items in Array:</p>
          <p className={`text-5xl font-bold transition-colors duration-300 ${
            hasSubmitted
              ? currentCount === correctAnswer
                ? 'text-green-600'
                : 'text-red-600'
              : 'text-blue-600'
          }`}>
            {currentCount}
          </p>
          {showMultiplication && (
            <p className="text-xl text-gray-500 mt-2">
              {Math.floor(currentCount / columns)} complete rows, {currentCount % columns} extra
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center mb-6">
        <button
          onClick={clearAll}
          disabled={hasSubmitted || currentCount === 0}
          className={`px-6 py-3 rounded-full font-bold text-white transition-all ${
            hasSubmitted || currentCount === 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-red-500 hover:bg-red-600 active:scale-95'
          }`}
        >
          Clear All
        </button>

        <button
          onClick={fillAll}
          disabled={hasSubmitted || currentCount === rows * columns}
          className={`px-6 py-3 rounded-full font-bold text-white transition-all ${
            hasSubmitted || currentCount === rows * columns
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600 active:scale-95'
          }`}
        >
          Fill All
        </button>

        <button
          onClick={handleSubmit}
          disabled={hasSubmitted}
          className={`px-8 py-3 rounded-full font-bold text-white text-lg transition-all ${
            hasSubmitted
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 active:scale-95 shadow-lg'
          }`}
        >
          Submit Answer
        </button>
      </div>

      {/* Visual Multiplication Breakdown */}
      {showMultiplication && currentCount > 0 && (
        <div className="bg-yellow-50 rounded-2xl shadow-xl p-6 mb-6">
          <h4 className="text-lg font-bold text-gray-800 mb-3 text-center">
            📊 What You're Building:
          </h4>
          <div className="flex flex-wrap gap-2 justify-center">
            {Array.from({ length: Math.floor(currentCount / columns) }).map((_, rowIdx) => (
              <div key={rowIdx} className="flex gap-1">
                {Array.from({ length: columns }).map((_, colIdx) => (
                  <div
                    key={colIdx}
                    className="w-8 h-8 bg-blue-400 rounded border-2 border-blue-600"
                  ></div>
                ))}
              </div>
            ))}
            {currentCount % columns > 0 && (
              <div className="flex gap-1">
                {Array.from({ length: currentCount % columns }).map((_, colIdx) => (
                  <div
                    key={colIdx}
                    className="w-8 h-8 bg-blue-300 rounded border-2 border-blue-500"
                  ></div>
                ))}
              </div>
            )}
          </div>
          <p className="text-center text-gray-700 mt-3 font-semibold">
            {Math.floor(currentCount / columns)} × {columns} {currentCount % columns > 0 && `+ ${currentCount % columns}`} = {currentCount}
          </p>
        </div>
      )}

      {/* Result Message */}
      {hasSubmitted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-lg text-center font-bold text-lg ${
            currentCount === correctAnswer
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {currentCount === correctAnswer ? (
            <>
              🎉 Perfect! {rows} × {columns} = {correctAnswer}
              <br />
              <span className="text-sm">You filled the complete array!</span>
            </>
          ) : (
            <>
              ❌ Not quite. You have {currentCount} items, but {rows} × {columns} = {correctAnswer}.
              <br />
              <span className="text-sm">
                {currentCount > correctAnswer
                  ? `Remove ${currentCount - correctAnswer} item${currentCount - correctAnswer > 1 ? 's' : ''}.`
                  : `Add ${correctAnswer - currentCount} more item${correctAnswer - currentCount > 1 ? 's' : ''}.`}
              </span>
            </>
          )}
        </motion.div>
      )}
    </div>
  )
}
