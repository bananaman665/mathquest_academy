'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

type ShapeType = 'square' | 'triangle' | 'circle' | 'rectangle'

interface ShapePiece {
  type: ShapeType
  color: string
  size: number // relative size 1-4
}

interface ShapeComposerProps {
  question: string
  targetShape: ShapeType
  availablePieces: ShapePiece[]
  correctCombination: ShapePiece[] // The pieces needed to form the target
  showGrid?: boolean
  onAnswer: (isCorrect: boolean, selectedPieces: ShapePiece[]) => void
}

export default function ShapeComposer({
  question,
  targetShape,
  availablePieces,
  correctCombination,
  showGrid = true,
  onAnswer
}: ShapeComposerProps) {
  const [selectedPieces, setSelectedPieces] = useState<ShapePiece[]>([])
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const togglePiece = (piece: ShapePiece) => {
    if (hasSubmitted) return

    const existingIndex = selectedPieces.findIndex(
      p => p.type === piece.type && p.color === piece.color && p.size === piece.size
    )

    if (existingIndex !== -1) {
      // Remove piece
      setSelectedPieces(prev => prev.filter((_, idx) => idx !== existingIndex))
    } else {
      // Add piece
      setSelectedPieces(prev => [...prev, piece])
    }
  }

  const handleSubmit = () => {
    if (hasSubmitted || selectedPieces.length === 0) return

    // Check if selected pieces match correct combination
    const isCorrect = 
      selectedPieces.length === correctCombination.length &&
      correctCombination.every(correctPiece =>
        selectedPieces.some(selectedPiece =>
          selectedPiece.type === correctPiece.type &&
          selectedPiece.color === correctPiece.color &&
          selectedPiece.size === correctPiece.size
        )
      )

    setHasSubmitted(true)
    onAnswer(isCorrect, selectedPieces)
  }

  const handleClear = () => {
    if (!hasSubmitted) {
      setSelectedPieces([])
    }
  }

  const renderShape = (piece: ShapePiece, index: number, isSelected: boolean = false) => {
    const baseSize = 40 * piece.size
    const commonClasses = `${piece.color} ${isSelected ? 'ring-4 ring-blue-500' : ''} transition-all cursor-pointer hover:scale-110`

    switch (piece.type) {
      case 'square':
        return (
          <motion.div
            key={index}
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ type: 'spring', delay: index * 0.05 }}
            className={`${commonClasses} rounded-lg shadow-lg`}
            style={{ width: baseSize, height: baseSize }}
          />
        )
      case 'circle':
        return (
          <motion.div
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: index * 0.05 }}
            className={`${commonClasses} rounded-full shadow-lg`}
            style={{ width: baseSize, height: baseSize }}
          />
        )
      case 'triangle':
        return (
          <motion.div
            key={index}
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ type: 'spring', delay: index * 0.05 }}
            className="relative"
            style={{ width: baseSize, height: baseSize }}
          >
            <div
              className={`${commonClasses} shadow-lg`}
              style={{
                width: 0,
                height: 0,
                borderLeft: `${baseSize / 2}px solid transparent`,
                borderRight: `${baseSize / 2}px solid transparent`,
                borderBottom: `${baseSize}px solid currentColor`
              }}
            />
          </motion.div>
        )
      case 'rectangle':
        return (
          <motion.div
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: index * 0.05 }}
            className={`${commonClasses} rounded-lg shadow-lg`}
            style={{ width: baseSize * 1.5, height: baseSize }}
          />
        )
      default:
        return null
    }
  }

  const getTargetShapeDisplay = () => {
    const size = 120
    switch (targetShape) {
      case 'square':
        return <div className="bg-gradient-to-br from-gray-300 to-gray-400 rounded-xl shadow-2xl" style={{ width: size, height: size }} />
      case 'circle':
        return <div className="bg-gradient-to-br from-gray-300 to-gray-400 rounded-full shadow-2xl" style={{ width: size, height: size }} />
      case 'triangle':
        return (
          <div style={{ width: size, height: size }} className="relative">
            <div
              className="border-l-transparent border-r-transparent"
              style={{
                width: 0,
                height: 0,
                borderLeft: `${size / 2}px solid transparent`,
                borderRight: `${size / 2}px solid transparent`,
                borderBottom: `${size}px solid rgb(209, 213, 219)`
              }}
            />
          </div>
        )
      case 'rectangle':
        return <div className="bg-gradient-to-br from-gray-300 to-gray-400 rounded-xl shadow-2xl" style={{ width: size * 1.5, height: size }} />
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Question */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">{question}</h3>
        <div className="flex justify-center mb-2">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <p className="text-lg text-gray-600 mb-4">Target Shape:</p>
            {getTargetShapeDisplay()}
          </div>
        </div>
      </div>

      {/* Available Pieces */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-xl p-6 mb-6">
        <h4 className="text-xl font-bold text-gray-800 mb-4 text-center">
          🎨 Available Pieces (Click to Select):
        </h4>
        <div className="flex flex-wrap gap-4 justify-center">
          {availablePieces.map((piece, index) => {
            const isSelected = selectedPieces.some(
              p => p.type === piece.type && p.color === piece.color && p.size === piece.size
            )
            return (
              <div
                key={index}
                onClick={() => togglePiece(piece)}
                className={`p-4 bg-white rounded-xl shadow-lg transition-all ${
                  hasSubmitted ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:shadow-2xl'
                } ${isSelected ? 'ring-4 ring-blue-500 scale-110' : ''}`}
              >
                {renderShape(piece, index, isSelected)}
                <p className="text-center text-sm font-semibold text-gray-600 mt-2 capitalize">
                  {piece.type}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Selected Pieces Display */}
      {selectedPieces.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h4 className="text-lg font-bold text-gray-800 mb-4 text-center">
            Your Selected Pieces:
          </h4>
          <div className="flex flex-wrap gap-4 justify-center">
            {selectedPieces.map((piece, index) => (
              <div key={index} className="p-2">
                {renderShape(piece, index)}
              </div>
            ))}
          </div>
          <p className="text-center text-gray-600 mt-4 font-semibold">
            {selectedPieces.length} piece{selectedPieces.length !== 1 ? 's' : ''} selected
          </p>
        </div>
      )}

      {/* Composition Area */}
      {showGrid && (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-xl p-8 mb-6">
          <h4 className="text-lg font-bold text-gray-800 mb-4 text-center">
            📐 Composition Area:
          </h4>
          <div className="bg-white rounded-xl p-8 min-h-64 border-4 border-dashed border-gray-300">
            <div className="flex flex-wrap gap-2 justify-center items-center min-h-48">
              {selectedPieces.length === 0 ? (
                <p className="text-gray-400 text-lg">Select pieces to compose your shape here</p>
              ) : (
                selectedPieces.map((piece, index) => (
                  <div key={index}>
                    {renderShape(piece, index)}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hint */}
      <div className="bg-yellow-50 rounded-xl p-4 mb-6 text-center">
        <p className="text-gray-700">
          💡 <strong>Hint:</strong> Think about how smaller shapes can combine to make a {targetShape}!
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center mb-6">
        <button
          onClick={handleClear}
          disabled={hasSubmitted || selectedPieces.length === 0}
          className={`px-6 py-3 rounded-full font-bold text-white transition-all ${
            hasSubmitted || selectedPieces.length === 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gray-500 hover:bg-gray-600 active:scale-95'
          }`}
        >
          Clear
        </button>

        <button
          onClick={handleSubmit}
          disabled={hasSubmitted || selectedPieces.length === 0}
          className={`px-8 py-3 rounded-full font-bold text-white text-lg transition-all ${
            hasSubmitted || selectedPieces.length === 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 active:scale-95 shadow-lg'
          }`}
        >
          Submit Answer
        </button>
      </div>

      {/* Result Message */}
      {hasSubmitted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-lg text-center font-bold text-lg ${
            selectedPieces.length === correctCombination.length &&
            correctCombination.every(correctPiece =>
              selectedPieces.some(selectedPiece =>
                selectedPiece.type === correctPiece.type &&
                selectedPiece.color === correctPiece.color &&
                selectedPiece.size === correctPiece.size
              )
            )
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {selectedPieces.length === correctCombination.length &&
          correctCombination.every(correctPiece =>
            selectedPieces.some(selectedPiece =>
              selectedPiece.type === correctPiece.type &&
              selectedPiece.color === correctPiece.color &&
              selectedPiece.size === correctPiece.size
            )
          ) ? (
            <>
              🎉 Perfect! You composed the {targetShape} correctly!
              <br />
              <span className="text-sm">Great understanding of shape composition!</span>
            </>
          ) : (
            <>
              ❌ Not quite right. Try a different combination.
              <br />
              <span className="text-sm">
                You need {correctCombination.length} piece{correctCombination.length !== 1 ? 's' : ''} to make a {targetShape}.
              </span>
            </>
          )}
        </motion.div>
      )}
    </div>
  )
}
