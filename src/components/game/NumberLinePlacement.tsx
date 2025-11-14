'use client'

import { useState, useRef, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { PartyPopper, X } from 'lucide-react'

interface NumberLinePlacementProps {
  question: string
  correctPosition: number
  numberLineMin: number
  numberLineMax: number
  onAnswer: (isCorrect: boolean) => void
}

export default function NumberLinePlacement({
  question,
  correctPosition,
  numberLineMin,
  numberLineMax,
  onAnswer,
}: NumberLinePlacementProps) {
  const [placedNumber, setPlacedNumber] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const lineRef = useRef<HTMLDivElement>(null)
  const [lineWidth, setLineWidth] = useState(0)
  const [draggedPosition, setDraggedPosition] = useState<number | null>(null)

  // Measure line width on mount
  useEffect(() => {
    if (lineRef.current) {
      setLineWidth(lineRef.current.offsetWidth)
    }
  }, [])

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result

    if (!destination || !lineRef.current) return

    // Calculate which number was dropped based on position
    const rect = lineRef.current.getBoundingClientRect()
    const dropX = destination.droppableId === 'number-line' ? parseInt(destination.droppableId.split('-')[2] || '0') : 0

    // More sophisticated calculation based on where they dropped
    if (source.droppableId === 'staging' && destination.droppableId.startsWith('number-line')) {
      // Extract position from drop coordinates
      const range = numberLineMax - numberLineMin
      const relativeX = parseInt(destination.droppableId.split('-')[2] || '0')
      const number = Math.round(numberLineMin + (relativeX / 100) * range)

      setDraggedPosition(number)
      setPlacedNumber(number)
    }
  }

  const handleLineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!lineRef.current) return

    const rect = lineRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percentage = clickX / rect.width

    const range = numberLineMax - numberLineMin
    const clickedNumber = Math.round(numberLineMin + percentage * range)
    const bounded = Math.max(numberLineMin, Math.min(numberLineMax, clickedNumber))

    setPlacedNumber(bounded)
    setDraggedPosition(bounded)
  }

  const handleSubmit = () => {
    if (placedNumber === null) return

    const correct = Math.abs(placedNumber - correctPosition) <= 0.5
    setIsCorrect(correct)
    setShowFeedback(true)
    onAnswer(correct)
  }

  const handleReset = () => {
    setPlacedNumber(null)
    setDraggedPosition(null)
    setShowFeedback(false)
  }

  const getPositionPercentage = (num: number) => {
    const range = numberLineMax - numberLineMin
    return ((num - numberLineMin) / range) * 100
  }

  const tickMarks = []
  const range = numberLineMax - numberLineMin
  for (let i = numberLineMin; i <= numberLineMax; i++) {
    tickMarks.push(i)
  }

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      {/* Question */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-4">{question}</h3>
        <p className="text-gray-300 text-lg">
          Tap or drag the <span className="font-bold text-blue-400">{correctPosition}</span> to its correct position on the number line
        </p>
      </div>

      {/* Staging Area */}
      <Droppable droppableId="staging">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex justify-center p-6 rounded-lg border-2 transition-colors ${
              snapshot.isDraggingOver
                ? 'border-green-400 bg-green-500/10'
                : 'border-slate-600 bg-slate-800/50'
            }`}
          >
            <Draggable draggableId={`number-${correctPosition}`} index={0}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className={`w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-lg border-2 border-blue-300 flex items-center justify-center cursor-grab transition-all ${
                    snapshot.isDragging ? 'opacity-50 shadow-2xl scale-110' : 'hover:shadow-xl'
                  }`}
                >
                  <span className="text-2xl font-bold text-white">{correctPosition}</span>
                </div>
              )}
            </Draggable>
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Number Line */}
      <div className="w-full max-w-2xl">
        <div
          ref={lineRef}
          onClick={handleLineClick}
          className="relative cursor-pointer"
        >
          {/* Main Line */}
          <div className="relative h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-8 my-12">
            {/* Tick marks and labels */}
            <div className="absolute top-full left-8 right-8 flex justify-between mt-4 px-2">
              {tickMarks.map((tick) => (
                <div key={tick} className="flex flex-col items-center">
                  <div className="w-0.5 h-2 bg-gray-400 mb-1" />
                  <span className="text-sm font-bold text-gray-300">{tick}</span>
                </div>
              ))}
            </div>

            {/* Placed indicator circle */}
            {placedNumber !== null && (
              <div
                className="absolute w-10 h-10 bg-yellow-400 rounded-full shadow-lg border-2 border-yellow-300 -top-4 -left-5 transition-all duration-300 flex items-center justify-center"
                style={{
                  left: `calc(2rem + (${getPositionPercentage(placedNumber)}% - 1.25rem))`,
                }}
              >
                <span className="text-xs font-bold text-gray-900">{placedNumber}</span>
              </div>
            )}

            {/* Correct position marker (hidden until feedback) */}
            {showFeedback && !isCorrect && (
              <div
                className="absolute w-8 h-8 bg-green-400 rounded-full shadow-lg border-2 border-green-300 -top-3 -left-4 opacity-60 flex items-center justify-center animate-pulse"
                style={{
                  left: `calc(2rem + (${getPositionPercentage(correctPosition)}% - 1rem))`,
                }}
              >
                <span className="text-xs font-bold text-gray-900">✓</span>
              </div>
            )}
          </div>
        </div>

        {/* Labels */}
        <div className="flex justify-between mt-20 text-gray-400 font-semibold px-8">
          <span>Min: {numberLineMin}</span>
          <span>Max: {numberLineMax}</span>
        </div>
      </div>

      {/* Current Position Display */}
      {placedNumber !== null && (
        <div className="text-center">
          <p className="text-gray-300 text-lg">
            You placed: <span className="font-bold text-yellow-400">{placedNumber}</span>
          </p>
        </div>
      )}

      {/* Submit Button */}
      {!showFeedback && placedNumber !== null && (
        <button
          onClick={handleSubmit}
          className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-8 rounded-lg transition-colors text-lg"
        >
          Check Answer
        </button>
      )}

      {/* Feedback */}
      {showFeedback && (
        <div className="w-full max-w-md">
          <div
            className={`p-6 rounded-lg text-center font-bold text-lg ${
              isCorrect
                ? 'bg-green-500/20 text-green-300 border-2 border-green-500'
                : 'bg-red-500/20 text-red-300 border-2 border-red-500'
            }`}
          >
            {isCorrect ? (
              <div>
                <div className="text-2xl mb-2 flex items-center justify-center gap-2">
                  <PartyPopper className="w-6 h-6" />
                  Perfect Placement!
                </div>
                <div>{correctPosition} is in the right spot!</div>
              </div>
            ) : (
              <div>
                <div className="text-2xl mb-2 flex items-center justify-center gap-2">
                  <X className="w-6 h-6" />
                  Not quite right
                </div>
                <div>
                  You placed {placedNumber}, but {correctPosition} goes at a different spot
                </div>
              </div>
            )}
          </div>

          {!isCorrect && (
            <button
              onClick={handleReset}
              className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      )}
    </div>
  )
}
