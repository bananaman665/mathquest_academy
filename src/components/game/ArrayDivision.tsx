'use client'

import { useState, useEffect } from 'react'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'

interface ArrayDivisionProps {
  totalItems: number
  divisor: number
  onAnswer: (isCorrect: boolean) => void
  question: string
  onSubmitReady?: (submitFn: (() => void) | null) => void
}

export default function ArrayDivision({
  totalItems,
  divisor,
  onAnswer,
  question,
  onSubmitReady,
}: ArrayDivisionProps) {
  const [currentConfigIndex, setCurrentConfigIndex] = useState<number>(0)
  const [selectedRows, setSelectedRows] = useState<number>(0)
  const [selectedCols, setSelectedCols] = useState<number>(0)
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null)

  const quotient = totalItems / divisor

  // Find all valid array configurations for totalItems
  const getArrayConfigurations = () => {
    const configs: { rows: number; cols: number }[] = []
    for (let rows = 1; rows <= totalItems; rows++) {
      if (totalItems % rows === 0) {
        const cols = totalItems / rows
        configs.push({ rows, cols })
      }
    }
    return configs
  }

  const configurations = getArrayConfigurations()
  const currentConfig = configurations[currentConfigIndex]

  // Navigation handlers
  const handleNext = () => {
    if (currentConfigIndex < configurations.length - 1) {
      setSlideDirection('left')
      setCurrentConfigIndex(prev => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentConfigIndex > 0) {
      setSlideDirection('right')
      setCurrentConfigIndex(prev => prev - 1)
    }
  }

  // Reset slide direction after animation
  useEffect(() => {
    if (slideDirection) {
      const timer = setTimeout(() => setSlideDirection(null), 300)
      return () => clearTimeout(timer)
    }
  }, [slideDirection])

  // Register submit function with parent
  useEffect(() => {
    if (onSubmitReady) {
      onSubmitReady(() => handleSubmit)
    }
    return () => {
      if (onSubmitReady) {
        onSubmitReady(null)
      }
    }
  }, [onSubmitReady, selectedRows, selectedCols])

  const handleSubmit = () => {
    // Check if the selected configuration shows the division correctly
    // Either rows=divisor and cols=quotient OR rows=quotient and cols=divisor
    const correct =
      (selectedRows === divisor && selectedCols === quotient) ||
      (selectedRows === quotient && selectedCols === divisor)
    onAnswer(correct)
  }

  const handleConfigSelect = () => {
    setSelectedRows(currentConfig.rows)
    setSelectedCols(currentConfig.cols)
  }

  return (
    <div className="flex flex-col items-center gap-4 pt-3 px-3 pb-24">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(-100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}} />
        {/* Instruction */}
        <div className="text-center mb-2">
        <p className="text-xl sm:text-2xl font-bold text-gray-900">
          Arrange {totalItems} stars to show {totalItems} ÷ {divisor}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          Choose the array that shows {divisor} rows or {divisor} columns
        </p>
      </div>

      {/* Flashcard Navigation Counter */}
      <div className="text-sm font-semibold text-gray-500">
        Option {currentConfigIndex + 1} of {configurations.length}
      </div>

      {/* Single Array Configuration Card */}
      <div className="w-full max-w-md overflow-hidden">
        <div
          key={currentConfigIndex}
          style={{
            animation: slideDirection
              ? slideDirection === 'left'
                ? 'slideInLeft 300ms ease-out'
                : 'slideInRight 300ms ease-out'
              : 'none'
          }}
        >
          <button
            onClick={handleConfigSelect}
            className={`w-full p-6 rounded-xl border-2 ${
              selectedRows === currentConfig.rows && selectedCols === currentConfig.cols
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 bg-white hover:border-gray-400 hover:shadow'
            }`}
          >
          <div className="text-center mb-4">
            <span className="text-lg font-bold text-gray-700">
              {currentConfig.rows} × {currentConfig.cols}
            </span>
          </div>

          {/* Array Grid */}
          <div
            className="inline-grid gap-1.5 mx-auto"
            style={{
              gridTemplateColumns: `repeat(${currentConfig.cols}, minmax(0, 1fr))`
            }}
          >
            {Array.from({ length: totalItems }).map((_, starIdx) => (
              <Star
                key={starIdx}
                className={`w-7 h-7 sm:w-8 sm:h-8 ${
                  selectedRows === currentConfig.rows && selectedCols === currentConfig.cols
                    ? 'text-blue-500 fill-blue-500'
                    : 'text-yellow-500 fill-yellow-500'
                }`}
              />
            ))}
          </div>

          <div className="text-center mt-4 text-sm font-semibold text-gray-600">
            {currentConfig.rows} rows of {currentConfig.cols}
          </div>
          </button>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="flex items-center gap-6">
        <button
          onClick={handlePrev}
          disabled={currentConfigIndex === 0}
          className={`p-3 rounded-full transition-all ${
            currentConfigIndex === 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-purple-500 text-white hover:bg-purple-600 active:scale-95'
          }`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="text-gray-400 text-sm font-medium">
          Swipe to see more
        </div>

        <button
          onClick={handleNext}
          disabled={currentConfigIndex === configurations.length - 1}
          className={`p-3 rounded-full transition-all ${
            currentConfigIndex === configurations.length - 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-purple-500 text-white hover:bg-purple-600 active:scale-95'
          }`}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Division Explanation */}
      {selectedRows > 0 && selectedCols > 0 && (
        <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-4 max-w-md w-full">
          <div className="text-center space-y-2">
            <div className="text-lg font-bold text-gray-800">
              {totalItems} ÷ {selectedRows} = {selectedCols}
            </div>
            <div className="text-sm text-gray-600">
              {selectedRows} rows of {selectedCols} stars each
            </div>
            <div className="text-lg font-bold text-gray-800">
              {totalItems} ÷ {selectedCols} = {selectedRows}
            </div>
            <div className="text-sm text-gray-600">
              {selectedCols} columns of {selectedRows} stars each
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
