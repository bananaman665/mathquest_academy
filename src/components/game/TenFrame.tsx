'use client'

import { useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { PartyPopper, X } from 'lucide-react'

interface TenFrameProps {
  question: string
  correctPosition: number
  onAnswer: (isCorrect: boolean) => void
}

export default function TenFrame({
  question,
  correctPosition,
  onAnswer,
}: TenFrameProps) {
  const [placedDots, setPlacedDots] = useState<boolean[]>(Array(10).fill(false))
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [dotsCount, setDotsCount] = useState(correctPosition)

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result

    if (!destination) return

    // If dragging from staging to frame
    if (source.droppableId === 'staging' && destination.droppableId === 'frame') {
      const framePosition = destination.index

      // Mark that position as filled
      const newPlaced = [...placedDots]
      newPlaced[framePosition] = true
      setPlacedDots(newPlaced)

      // Decrease available dots
      setDotsCount(dotsCount - 1)
    }
    // If dragging from frame back to staging
    else if (source.droppableId === 'frame' && destination.droppableId === 'staging') {
      const framePosition = source.index

      // Unmark that position
      const newPlaced = [...placedDots]
      newPlaced[framePosition] = false
      setPlacedDots(newPlaced)

      // Add back to available
      setDotsCount(dotsCount + 1)
    }
  }

  const handleFrameClick = (index: number) => {
    const currentDotsPlaced = placedDots.filter(d => d).length
    if (currentDotsPlaced < correctPosition) {
      const newPlaced = [...placedDots]
      newPlaced[index] = !newPlaced[index]
      setPlacedDots(newPlaced)
    }
  }

  const handleSubmit = () => {
    const dotsPlaced = placedDots.filter(d => d).length
    const correct = dotsPlaced === correctPosition
    setIsCorrect(correct)
    setShowFeedback(true)
    onAnswer(correct)
  }

  const handleReset = () => {
    setPlacedDots(Array(10).fill(false))
    setDotsCount(correctPosition)
    setShowFeedback(false)
  }

  const dotsPlaced = placedDots.filter(d => d).length

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col items-center gap-8 py-8">
        {/* Question */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">{question}</h3>
          <p className="text-gray-700 text-lg">
            Tap the boxes or drag dots to show <span className="font-bold text-blue-600">{correctPosition}</span>
          </p>
        </div>

        {/* Ten Frame */}
        <Droppable droppableId="frame" direction="horizontal">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`bg-white rounded-2xl p-8 border-2 transition-colors shadow-lg ${
                snapshot.isDraggingOver
                  ? 'border-blue-400 shadow-blue-500/50'
                  : 'border-gray-300'
              }`}
            >
              <div className="grid grid-cols-5 gap-3">
                {Array.from({ length: 10 }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleFrameClick(index)}
                    className={`w-16 h-16 rounded-lg border-4 transition-all transform hover:scale-105 ${
                      placedDots[index]
                        ? 'bg-gradient-to-br from-blue-400 to-blue-600 border-blue-300 shadow-lg shadow-blue-500/50'
                        : 'bg-gray-100 border-gray-300 hover:border-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    {placedDots[index] && (
                      <div className="text-3xl text-white">●</div>
                    )}
                  </button>
                ))}
              </div>
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {/* Staging Area - Available Dots */}
        <Droppable droppableId="staging">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex gap-3 p-6 rounded-lg border-2 transition-colors flex-wrap justify-center ${
              snapshot.isDraggingOver
                ? 'border-green-400 bg-green-50'
                : 'border-gray-300 bg-gray-50'
            }`}
          >
            {dotsCount > 0 ? (
              Array.from({ length: dotsCount }).map((_, idx) => (
                <Draggable key={`dot-${idx}`} draggableId={`dot-${idx}`} index={idx}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-lg border-2 border-blue-300 flex items-center justify-center cursor-grab transition-all ${
                        snapshot.isDragging ? 'opacity-50 shadow-2xl scale-110' : 'hover:shadow-xl'
                      }`}
                    >
                      <span className="text-xl text-white">●</span>
                    </div>
                  )}
                </Draggable>
              ))
            ) : (
              <div className="text-gray-500 text-lg font-semibold">All dots placed!</div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Submit Button */}
      {!showFeedback && (
        <button
          onClick={handleSubmit}
          disabled={dotsPlaced !== correctPosition}
          className={`px-8 py-3 rounded-lg font-bold text-lg transition-colors ${
            dotsPlaced === correctPosition
              ? 'bg-purple-500 hover:bg-purple-600 text-white'
              : 'bg-gray-400 cursor-not-allowed text-gray-600'
          }`}
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
                  Perfect!
                </div>
                <div>You showed {correctPosition} in the ten frame!</div>
              </div>
            ) : (
              <div>
                <div className="text-2xl mb-2 flex items-center justify-center gap-2">
                  <X className="w-6 h-6" />
                  Not quite
                </div>
                <div>You placed {dotsPlaced}, but the answer is {correctPosition}</div>
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
    </DragDropContext>
  )
}
