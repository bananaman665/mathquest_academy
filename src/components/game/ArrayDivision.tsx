'use client'

import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'

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
  const [selectedRows, setSelectedRows] = useState<number>(0)
  const [selectedCols, setSelectedCols] = useState<number>(0)

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

  const handleConfigSelect = (rows: number, cols: number) => {
    setSelectedRows(rows)
    setSelectedCols(cols)
  }

  return (
    <div className="flex flex-col items-center gap-4 pt-3 px-3 pb-24">
      {/* Instruction */}
      <div className="text-center mb-2">
        <p className="text-xl sm:text-2xl font-bold text-gray-900">
          Arrange {totalItems} stars to show {totalItems} ÷ {divisor}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          Choose the array that shows {divisor} rows or {divisor} columns
        </p>
      </div>

      {/* Array Configuration Options */}
      <div className="w-full max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {configurations.map((config, idx) => {
            const isSelected = selectedRows === config.rows && selectedCols === config.cols

            return (
              <button
                key={idx}
                onClick={() => handleConfigSelect(config.rows, config.cols)}
                className={`p-4 rounded-xl border-2 ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-300 bg-white hover:border-gray-400 hover:shadow'
                }`}
              >
                <div className="text-center mb-3">
                  <span className="text-sm font-bold text-gray-700">
                    {config.rows} × {config.cols}
                  </span>
                </div>

                {/* Array Grid */}
                <div
                  className="inline-grid gap-1 mx-auto"
                  style={{
                    gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))`
                  }}
                >
                  {Array.from({ length: totalItems }).map((_, starIdx) => (
                    <Star
                      key={starIdx}
                      className={`w-6 h-6 ${
                        isSelected
                          ? 'text-blue-500 fill-blue-500'
                          : 'text-yellow-500 fill-yellow-500'
                      }`}
                    />
                  ))}
                </div>

                <div className="text-center mt-3 text-xs font-semibold text-gray-600">
                  {config.rows} rows of {config.cols}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Division Explanation */}
      {selectedRows > 0 && selectedCols > 0 && (
        <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-4 max-w-md">
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
